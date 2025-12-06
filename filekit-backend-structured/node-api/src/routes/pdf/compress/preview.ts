/**
 * TODO: Implement POST /pdf/compress/preview-batch route.
 *
 * Purpose:
 * - Accept 1-10 PDFs and return estimated compressed sizes for three presets:
 *   - "balanced"
 *   - "strong"
 *   - "max"
 * - NO real compression here, only preview/estimation.
 *
 * Request:
 * - multipart/form-data
 *   - field "files[]": 1-10 PDF files
 *
 * Steps:
 * 1. Use multer to parse "files[]" uploads.
 * 2. Call validatePdfBatch(files, {
 *      maxCount: 10,
 *      maxPerFileBytes: 100 * MB,
 *      maxTotalBytes: 300 * MB,
 *    }) to:
 *      - validate count/type/size
 *      - move files into tmp/uploads/<sessionId>/file-<index>.pdf
 * 3. Build payload for Python worker:
 *    {
 *      session_id: <sessionId>,
 *      files: [
 *        { input_path: "tmp/uploads/<sessionId>/file-0.pdf" },
 *        ...
 *      ],
 *      presets: ["balanced", "strong", "max"]
 *    }
 * 4. POST this payload to Python worker /compress-batch-preview.
 * 5. Worker returns for each file:
 *    - original_size
 *    - is_corrupted
 *    - presets: { balanced, strong, max } with estimated_size.
 * 6. If any file is_corrupted, return a 400 error describing which file failed.
 * 7. Otherwise:
 *    - Compute per-file savingPercent = 100 * (1 - estimated_size / original_size).
 *    - Compute totals:
 *      - totalOriginalSize
 *      - for each preset: totalEstimatedSize and savingPercent.
 *    - Generate fileTokens:
 *      - "sessionId:file-<index>.pdf"
 *    - Respond with JSON:
 *      {
 *        ok: true,
 *        files: [
 *          {
 *            index,
 *            name: originalName,
 *            originalSize,
 *            presets: {
 *              balanced: { estimatedSize, savingPercent },
 *              strong:   { estimatedSize, savingPercent },
 *              max:      { estimatedSize, savingPercent }
 *            }
 *          },
 *          ...
 *        ],
 *        totals: {
 *          originalSize,
 *          balanced: { estimatedSize, savingPercent },
 *          strong:   { estimatedSize, savingPercent },
 *          max:      { estimatedSize, savingPercent }
 *        },
 *        fileTokens: string[] // e.g. ["sessionId:file-0.pdf", ...]
 *      }
 */

import fs from "node:fs/promises";
import fsSync from "node:fs";
import path from "node:path";
import multer from "multer";
import { Router } from "express";
import { COMPRESS_BATCH_LIMITS } from "../../../lib/pdf/limits.ts";
import type { PdfValidationError } from "../../../lib/pdf/errors.ts";
import { pdfPaths } from "../../../lib/pdf/paths.ts";
import { rememberSession } from "../../../lib/pdf/sessions.ts";
import { buildFileToken } from "../../../lib/pdf/tokens.ts";
import { validatePdfBatch } from "../../../lib/pdf/validateBatch.ts";

interface WorkerPreviewFile {
  input_path: string;
  original_size: number;
  is_corrupted: boolean;
  presets: Record<string, { estimated_size: number }>;
}

interface WorkerPreviewResponse {
  ok: boolean;
  files: WorkerPreviewFile[];
}

const incomingDir = path.join(pdfPaths.uploadRoot, "incoming");
const workerBaseUrl = process.env.PDF_WORKER_URL || "http://localhost:8001";

if (!fsSync.existsSync(incomingDir)) {
  fsSync.mkdirSync(incomingDir, { recursive: true });
}

function savingPercent(original: number, estimated: number): number {
  if (original <= 0) return 0;
  const fraction = 1 - estimated / original;
  return Math.max(0, Math.round(fraction * 1000) / 10);
}

const upload = multer({ dest: incomingDir });

export const router = Router();

router.post("/preview-batch", upload.array("files[]", 10), async (req, res) => {
  try {
    const files = (req.files as Express.Multer.File[]) || [];
    const validation = await validatePdfBatch(files, COMPRESS_BATCH_LIMITS);

    rememberSession(validation);

    const workerPayload = {
      session_id: validation.sessionId,
      files: validation.files.map((file) => ({ input_path: file.inputPath })),
      presets: ["balanced", "strong", "max"]
    };

    const workerResponse = await fetch(`${workerBaseUrl}/compress-batch-preview`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(workerPayload)
    });

    if (!workerResponse.ok) {
      const errorText = await workerResponse.text();
      return res.status(502).json({ error: "Preview worker failed", details: errorText });
    }

    const workerData = (await workerResponse.json()) as WorkerPreviewResponse;

    const corrupted = workerData.files.filter((file) => file.is_corrupted);
    if (corrupted.length > 0) {
      const names = corrupted
        .map((f) => {
          const match = validation.files.find((v) => v.inputPath === f.input_path);
          return match?.originalName || f.input_path;
        })
        .join(", ");
      return res.status(400).json({
        error: "One or more PDFs are corrupted",
        files: corrupted.map((f) => f.input_path),
        displayNames: names
      });
    }

    const totals: Record<string, { estimatedSize: number; savingPercent: number }> = {
      balanced: { estimatedSize: 0, savingPercent: 0 },
      strong: { estimatedSize: 0, savingPercent: 0 },
      max: { estimatedSize: 0, savingPercent: 0 }
    };
    const totalOriginalSize = validation.files.reduce((acc, f) => acc + f.size, 0);

    const filesResponse = validation.files.map((file) => {
      const preview = workerData.files.find((f) => f.input_path === file.inputPath);
      if (!preview) {
        throw new Error(`Missing preview data for ${file.inputPath}`);
      }

      const balancedSize = preview.presets["balanced"]?.estimated_size ?? file.size;
      const strongSize = preview.presets["strong"]?.estimated_size ?? file.size;
      const maxSize = preview.presets["max"]?.estimated_size ?? file.size;

      totals.balanced.estimatedSize += balancedSize;
      totals.strong.estimatedSize += strongSize;
      totals.max.estimatedSize += maxSize;

      return {
        index: file.index,
        name: file.originalName,
        originalSize: file.size,
        presets: {
          balanced: {
            estimatedSize: balancedSize,
            savingPercent: savingPercent(file.size, balancedSize)
          },
          strong: {
            estimatedSize: strongSize,
            savingPercent: savingPercent(file.size, strongSize)
          },
          max: {
            estimatedSize: maxSize,
            savingPercent: savingPercent(file.size, maxSize)
          }
        }
      };
    });

    const totalsResponse = {
      originalSize: totalOriginalSize,
      balanced: {
        estimatedSize: totals.balanced.estimatedSize,
        savingPercent: savingPercent(totalOriginalSize, totals.balanced.estimatedSize)
      },
      strong: {
        estimatedSize: totals.strong.estimatedSize,
        savingPercent: savingPercent(totalOriginalSize, totals.strong.estimatedSize)
      },
      max: {
        estimatedSize: totals.max.estimatedSize,
        savingPercent: savingPercent(totalOriginalSize, totals.max.estimatedSize)
      }
    };

    const fileTokens = validation.files.map((file) => buildFileToken(validation.sessionId, file.index));

    res.json({
      ok: true,
      files: filesResponse,
      totals: totalsResponse,
      fileTokens
    });
  } catch (err) {
    const error = err as PdfValidationError;
    if (error.code) {
      return res.status(error.status || 400).json({ error: error.code, message: error.message, details: error.details });
    }

    console.error("compress preview error", err);
    res.status(500).json({ error: "Failed to preview compression" });
  }
});
