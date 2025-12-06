import path from "node:path";

const uploadRoot = path.join(process.cwd(), "tmp", "uploads");

export const pdfPaths = {
  uploadRoot,
  sessionFolder: (sessionId: string) => path.join(uploadRoot, sessionId),
  sessionFile: (sessionId: string, index: number) => path.join(uploadRoot, sessionId, `file-${index}.pdf`),
  jobFolder: (jobId: string) => path.join(uploadRoot, jobId),
  jobOutputFile: (jobId: string, index: number, suffix = "compressed") =>
    path.join(uploadRoot, jobId, `file-${index}-${suffix}.pdf`)
};
