import type { PdfBatchValidationResult, ValidatedPdfFile } from "./validateBatch.ts";

interface SessionRecord {
  files: ValidatedPdfFile[];
  totalSize: number;
  folderPath: string;
}

const sessions = new Map<string, SessionRecord>();

export function rememberSession(result: PdfBatchValidationResult): void {
  sessions.set(result.sessionId, {
    files: result.files,
    totalSize: result.totalSize,
    folderPath: result.folderPath
  });
}

export function getSession(sessionId: string): SessionRecord | undefined {
  return sessions.get(sessionId);
}
