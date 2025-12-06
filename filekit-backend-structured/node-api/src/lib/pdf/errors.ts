export type PdfValidationErrorCode =
  | "NO_FILES"
  | "TOO_FEW_FILES"
  | "TOO_MANY_FILES"
  | "INVALID_MIMETYPE"
  | "INVALID_EXTENSION"
  | "FILE_TOO_LARGE"
  | "FILE_TOO_SMALL"
  | "TOTAL_TOO_LARGE"
  | "TOTAL_TOO_SMALL";

export interface PdfValidationError extends Error {
  code: PdfValidationErrorCode;
  status?: number;
  fileIndex?: number;
  limitBytes?: number;
  actualBytes?: number;
}

export function createPdfValidationError(
  code: PdfValidationErrorCode,
  message: string,
  extras: Partial<PdfValidationError> = {}
): PdfValidationError {
  const err = new Error(message) as PdfValidationError;
  err.code = code;
  err.status = 400;
  Object.assign(err, extras);
  return err;
}
