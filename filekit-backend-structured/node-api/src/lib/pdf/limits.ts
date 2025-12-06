import type { PdfValidationLimits } from "./validateBatch.ts";

export const MB = 1024 * 1024;

export const COMPRESS_BATCH_LIMITS: PdfValidationLimits = {
  mode: "multi",
  minCount: 1,
  maxCount: 10,
  perFile: {
    maxBytes: 100 * MB,
    allowedMimeTypes: ["application/pdf"],
    allowedExtensions: [".pdf"]
  },
  total: {
    maxBytes: 300 * MB
  }
};

export const COMPRESS_SINGLE_LIMITS: PdfValidationLimits = {
  mode: "single",
  minCount: 1,
  maxCount: 1,
  perFile: {
    maxBytes: 100 * MB,
    allowedMimeTypes: ["application/pdf"],
    allowedExtensions: [".pdf"]
  },
  total: {
    maxBytes: 100 * MB
  }
};

export const MERGE_LIMITS: PdfValidationLimits = {
  mode: "multi",
  minCount: 2,
  maxCount: 50,
  perFile: {
    maxBytes: 100 * MB,
    allowedMimeTypes: ["application/pdf"],
    allowedExtensions: [".pdf"]
  },
  total: {
    maxBytes: 1024 * MB // 1 GB
  }
};
