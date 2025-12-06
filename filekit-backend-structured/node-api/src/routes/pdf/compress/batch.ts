/**
 * TODO: Implement POST /pdf/compress/batch route for REAL compression.
 *
 * Purpose:
 * - Take a chosen preset ("balanced" | "strong" | "max") + fileTokens from preview,
 *   create a Job, call Python worker to run real compression, and respond with jobId.
 *
 * Request:
 * - Content-Type: application/json
 *   {
 *     "preset": "balanced" | "strong" | "max",
 *     "fileTokens": ["sessionId:file-0.pdf", "sessionId:file-1.pdf", ...]
 *   }
 *
 * Steps:
 * 1. Validate JSON body:
 *    - preset is one of "balanced" | "strong" | "max".
 *    - fileTokens is non-empty array.
 * 2. Parse each token "sessionId:file-<index>.pdf" into:
 *    - sessionId
 *    - fileName
 * 3. Reconstruct per-file inputPath:
 *    - "tmp/uploads/<sessionId>/file-<index>.pdf"
 *    - You may need to re-lookup originalName + size if you stored them earlier
 *      (or you can inspect file size here again).
 * 4. Create a Job via app.locals.jobStore:
 *    - tool: "pdf.compress.batch"
 *    - status: "running"
 *    - inputInfo: {
 *        sessionId,
 *        preset,
 *        files: [
 *          { index, originalName, inputPath, originalSize },
 *          ...
 *        ]
 *      }
 * 5. Call Python worker /compress-batch with:
 *    {
 *      "job_id": <jobId>,
 *      "preset": "balanced" | "strong" | "max",
 *      "files": [
 *        { "input_path": "tmp/uploads/<sessionId>/file-0.pdf" },
 *        ...
 *      ]
 *    }
 * 6. Worker returns for each file:
 *    {
 *      input_path,
 *      output_path,
 *      original_size,
 *      compressed_size
 *    }
 * 7. Update the Job in JobStore:
 *    - status: "done"
 *    - outputInfo: {
 *        files: [
 *          {
 *            index,
 *            originalName,
 *            originalSize,
 *            compressedSize,
 *            outputPath
 *          },
 *          ...
 *        ],
 *        totals: {
 *          originalSize,
 *          compressedSize
 *        },
 *        zipPath?: "tmp/uploads/<jobId>/compressed.zip"
 *      }
 * 8. Respond with:
 *    { ok: true, jobId }
 *
 * Notes:
 * - Separate routes will handle downloading:
 *   - GET /pdf/compress/download/:jobId/:fileIndex
 *   - GET /pdf/compress/download-zip/:jobId
 */

import fs from "node:fs/promises";
import { Router } from "express";
import { nanoid } from "nanoid";
import type { JobRecord, JobStore } from "../../../jobs/jobStore.ts";
import { pdfPaths } from "../../../lib/pdf/paths.ts";
import { getSession } from "../../../lib/pdf/sessions.ts";
import { parseFileToken } from "../../../lib/pdf/tokens.ts";

const workerBaseUrl = process.env.PDF_WORKER_URL || "http://localhost:8001";
const VALID_PRESETS = new Set(["balanced", "strong", "max"]);

interface WorkerCompressFile {
  input_path: string;
  output_path: string;
  original_size: number;
  compressed_size: number;
}

interface WorkerCompressResponse {
  ok: boolean;
  files: WorkerCompressFile[];
  zip_path?: string;
}

export const router = Router();

router.post("/batch", async (req, res) => {
  const { preset, fileTokens } = req.body || {};

  if (!VALID_PRESETS.has(preset)) {
    return res.status(400).json({ error: "INVALID_PRESET", message: "Preset must be balanced | strong | max" });
  }
  if (!Array.isArray(fileTokens) || fileTokens.length === 0) {
    return res.status(400).json({ error: "NO_FILE_TOKENS", message: "fileTokens must be a non-empty array" });
  }

  let sessionId: string | null = null;

  try {
    const parsedFiles = [];
    for (const token of fileTokens) {
      const parsed = parseFileToken(token);
      if (!parsed) {
        return res.status(400).json({ error: "INVALID_TOKEN", message: `Invalid token format: ${token}` });
      }
      if (!sessionId) {
        sessionId = parsed.sessionId;
      } else if (sessionId !== parsed.sessionId) {
        return res.status(400).json({ error: "MIXED_SESSIONS", message: "All tokens must belong to the same session" });
      }

      const inputPath = pdfPaths.sessionFile(parsed.sessionId, parsed.index);
      let stat;
      try {
        stat = await fs.stat(inputPath);
      } catch {
        return res.status(400).json({ error: "MISSING_FILE", message: `File not found for token ${token}` });
      }

      const sessionMeta = getSession(parsed.sessionId);
      const metaFile = sessionMeta?.files.find((f) => f.index === parsed.index);

      parsedFiles.push({
        index: parsed.index,
        originalName: metaFile?.originalName ?? `file-${parsed.index}.pdf`,
        inputPath: inputPath.replace(/\\/g, "/"),
        originalSize: metaFile?.size ?? stat.size
      });
    }

    const jobStore = req.app.locals.jobStore as JobStore | undefined;
    if (!jobStore) {
      return res.status(500).json({ error: "Job store not available" });
    }

    const jobId = nanoid();
    const now = new Date().toISOString();
    const job: JobRecord = {
      id: jobId,
      tool: "pdf.compress.batch",
      status: "processing",
      createdAt: now,
      updatedAt: now,
      inputInfo: {
        sessionId,
        preset,
        files: parsedFiles
      },
      outputInfo: null
    };

    jobStore.set(job);

    const workerPayload = {
      job_id: jobId,
      preset,
      files: parsedFiles.map((file) => ({ input_path: file.inputPath }))
    };

    const workerResponse = await fetch(`${workerBaseUrl}/compress-batch`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(workerPayload)
    });

    if (!workerResponse.ok) {
      const text = await workerResponse.text();
      jobStore.update(jobId, { status: "error", error: text });
      return res.status(502).json({ error: "Compression worker failed", details: text });
    }

    const workerData = (await workerResponse.json()) as WorkerCompressResponse;

    const outputFiles = parsedFiles.map((file) => {
      const workerFile = workerData.files.find((wf) => wf.input_path === file.inputPath);
      if (!workerFile) {
        return {
          index: file.index,
          originalName: file.originalName,
          originalSize: file.originalSize,
          compressedSize: file.originalSize,
          outputPath: ""
        };
      }

      return {
        index: file.index,
        originalName: file.originalName,
        originalSize: workerFile.original_size ?? file.originalSize,
        compressedSize: workerFile.compressed_size,
        outputPath: workerFile.output_path
      };
    });

    const totals = outputFiles.reduce(
      (acc, file) => {
        acc.originalSize += file.originalSize;
        acc.compressedSize += file.compressedSize;
        return acc;
      },
      { originalSize: 0, compressedSize: 0 }
    );

    jobStore.update(jobId, {
      status: "done",
      outputInfo: {
        files: outputFiles,
        totals,
        zipPath: workerData.zip_path
      }
    });

    res.json({ ok: true, jobId });
  } catch (err) {
    console.error("compress batch error", err);
    res.status(500).json({ error: "Failed to create compression job" });
  }
});
