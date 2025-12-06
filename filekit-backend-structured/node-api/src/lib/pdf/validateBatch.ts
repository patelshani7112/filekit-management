import crypto from "node:crypto";
import fs from "node:fs/promises";
import path from "node:path";
import { createPdfValidationError, type PdfValidationError } from "./errors.ts";
import { pdfPaths } from "./paths.ts";

export interface PdfValidationLimits {
  minCount?: number;
  maxCount?: number;
  perFile?: {
    maxBytes?: number;
    minBytes?: number;
    allowedMimeTypes?: string[];
    allowedExtensions?: string[];
  };
  total?: {
    maxBytes?: number;
    minBytes?: number;
  };
  mode?: "single" | "multi";
}

export interface ValidatedPdfFile {
  index: number;
  originalName: string;
  baseName: string;
  extension: string;
  size: number;
  inputPath: string;
}

export interface PdfBatchValidationResult {
  sessionId: string;
  folderPath: string;
  files: ValidatedPdfFile[];
  totalSize: number;
}

function normalizeLimits(limits: PdfValidationLimits): Required<PdfValidationLimits> {
  const mode = limits.mode ?? "single";
  const minCount = limits.minCount ?? 1;
  const maxCount = limits.maxCount ?? (mode === "single" ? 1 : 1);

  return {
    mode,
    minCount,
    maxCount,
    perFile: {
      maxBytes: limits.perFile?.maxBytes,
      minBytes: limits.perFile?.minBytes ?? 0,
      allowedMimeTypes: limits.perFile?.allowedMimeTypes ?? ["application/pdf"],
      allowedExtensions: (limits.perFile?.allowedExtensions ?? [".pdf"]).map((ext) => ext.toLowerCase())
    },
    total: {
      maxBytes: limits.total?.maxBytes,
      minBytes: limits.total?.minBytes ?? 0
    }
  };
}

export async function validatePdfBatch(files: Express.Multer.File[], limits: PdfValidationLimits): Promise<PdfBatchValidationResult> {
  const normalizedLimits = normalizeLimits(limits);
  const incomingFiles = Array.isArray(files) ? files : [];

  if (incomingFiles.length === 0) {
    throw createPdfValidationError("NO_FILES", "At least one PDF file is required");
  }

  if (incomingFiles.length < normalizedLimits.minCount) {
    throw createPdfValidationError("TOO_FEW_FILES", `Minimum ${normalizedLimits.minCount} file(s) required`, {
      actualBytes: incomingFiles.length
    });
  }

  if (incomingFiles.length > normalizedLimits.maxCount) {
    throw createPdfValidationError("TOO_MANY_FILES", `Maximum ${normalizedLimits.maxCount} file(s) allowed`, {
      actualBytes: incomingFiles.length
    });
  }

  let totalSize = 0;
  const normalizedFiles: ValidatedPdfFile[] = [];

  for (const [index, file] of incomingFiles.entries()) {
    const ext = path.extname(file.originalname || "").toLowerCase();
    const baseName = path.basename(file.originalname || `file-${index}.pdf`, ext);
    const mimeOk = normalizedLimits.perFile.allowedMimeTypes.includes(file.mimetype);
    const extOk = normalizedLimits.perFile.allowedExtensions.includes(ext);

    if (!mimeOk) {
      throw createPdfValidationError("INVALID_MIMETYPE", `Invalid mimetype for ${file.originalname}`, { fileIndex: index });
    }
    if (!extOk) {
      throw createPdfValidationError("INVALID_EXTENSION", `Invalid extension for ${file.originalname}`, { fileIndex: index });
    }
    if (normalizedLimits.perFile.maxBytes && file.size > normalizedLimits.perFile.maxBytes) {
      throw createPdfValidationError("FILE_TOO_LARGE", `File too large: ${file.originalname}`, {
        fileIndex: index,
        limitBytes: normalizedLimits.perFile.maxBytes,
        actualBytes: file.size
      });
    }
    if (normalizedLimits.perFile.minBytes && file.size < normalizedLimits.perFile.minBytes) {
      throw createPdfValidationError("FILE_TOO_SMALL", `File too small: ${file.originalname}`, {
        fileIndex: index,
        limitBytes: normalizedLimits.perFile.minBytes,
        actualBytes: file.size
      });
    }

    totalSize += file.size;

    normalizedFiles.push({
      index,
      originalName: file.originalname,
      baseName,
      extension: ext,
      size: file.size,
      inputPath: ""
    });
  }

  if (normalizedLimits.total.maxBytes && totalSize > normalizedLimits.total.maxBytes) {
    throw createPdfValidationError("TOTAL_TOO_LARGE", "Total size too large", {
      limitBytes: normalizedLimits.total.maxBytes,
      actualBytes: totalSize
    });
  }
  if (normalizedLimits.total.minBytes && totalSize < normalizedLimits.total.minBytes) {
    throw createPdfValidationError("TOTAL_TOO_SMALL", "Total size too small", {
      limitBytes: normalizedLimits.total.minBytes,
      actualBytes: totalSize
    });
  }

  const sessionId = crypto.randomUUID();
  const folderPath = pdfPaths.sessionFolder(sessionId);
  await fs.mkdir(folderPath, { recursive: true });

  for (const file of normalizedFiles) {
    const destPath = path.join(folderPath, `file-${file.index}.pdf`);
    const sourcePath = (incomingFiles[file.index] as Express.Multer.File & { path?: string }).path;
    const hasBuffer = "buffer" in incomingFiles[file.index] && Buffer.isBuffer((incomingFiles[file.index] as any).buffer);

    if (sourcePath) {
      try {
        await fs.rename(sourcePath, destPath);
      } catch {
        const buffer = await fs.readFile(sourcePath);
        await fs.writeFile(destPath, buffer);
        await fs.unlink(sourcePath);
      }
    } else if (hasBuffer) {
      await fs.writeFile(destPath, (incomingFiles[file.index] as any).buffer);
    } else {
      throw createPdfValidationError("INVALID_MIMETYPE", `Cannot read uploaded data for ${file.originalName}`, {
        fileIndex: file.index
      });
    }

    file.inputPath = destPath.replace(/\\/g, "/");
  }

  return {
    sessionId,
    folderPath: folderPath.replace(/\\/g, "/"),
    files: normalizedFiles,
    totalSize
  };
}
