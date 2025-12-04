import { Router } from "express";
import { nanoid } from "nanoid";
import type { JobStore, JobRecord } from "../../jobs/jobStore.ts";

export const router = Router();

// Example: POST /pdf/organize/merge
router.post("/merge", (req, res) => {
  const jobStore = req.app.locals.jobStore as JobStore | undefined;
  if (!jobStore) {
    return res.status(500).json({ error: "Job store not available" });
  }

  const id = nanoid();
  const now = new Date().toISOString();

  const job: JobRecord = {
    id,
    tool: "pdf.organize.merge",
    status: "queued",
    createdAt: now,
    updatedAt: now,
    inputInfo: {
      options: req.body
      // later: add file IDs / storage paths
    },
    outputInfo: null
  };

  jobStore.set(job);

  // TODO later:
  // - validate options
  // - upload files to storage
  // - push a job message for pdf-worker

  res.status(202).json({
    ok: true,
    message: "Merge job created",
    jobId: id
  });
});

// Example: POST /pdf/organize/split
router.post("/split", (req, res) => {
  const jobStore = req.app.locals.jobStore as JobStore | undefined;
  if (!jobStore) {
    return res.status(500).json({ error: "Job store not available" });
  }

  const id = nanoid();
  const now = new Date().toISOString();

  const job: JobRecord = {
    id,
    tool: "pdf.organize.split",
    status: "queued",
    createdAt: now,
    updatedAt: now,
    inputInfo: {
      options: req.body
    },
    outputInfo: null
  };

  jobStore.set(job);

  res.status(202).json({
    ok: true,
    message: "Split job created",
    jobId: id
  });
});
