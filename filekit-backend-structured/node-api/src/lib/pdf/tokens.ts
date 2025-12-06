export interface ParsedFileToken {
  sessionId: string;
  index: number;
  fileName: string;
}

export function buildFileToken(sessionId: string, index: number): string {
  return `${sessionId}:file-${index}.pdf`;
}

export function parseFileToken(token: string): ParsedFileToken | null {
  const match = /^([^:]+):(file-(\d+)\.pdf)$/.exec(token);
  if (!match) return null;
  return {
    sessionId: match[1],
    fileName: match[2],
    index: Number.parseInt(match[3], 10)
  };
}
