import { Router } from "express";
import { nanoid } from "nanoid";
import type { JobStore, JobRecord } from "../../jobs/jobStore.ts";

export const router = Router();

// Example: POST /pdf/edit/flatten
router.post("/flatten", (req, res) => {
  const jobStore = req.app.locals.jobStore as JobStore | undefined;
  if (!jobStore) {
    return res.status(500).json({ error: "Job store not available" });
  }

  const id = nanoid();
  const now = new Date().toISOString();

  const job: JobRecord = {
    id,
    tool: "pdf.edit.flatten",
    status: "queued",
    createdAt: now,
    updatedAt: now,
    inputInfo: { options: req.body },
    outputInfo: null
  };

  jobStore.set(job);

  res.status(202).json({
    ok: true,
    message: "Flatten job created",
    jobId: id
  });
});
