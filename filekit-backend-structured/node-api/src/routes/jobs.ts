import { Router } from "express";
import type { JobStore } from "../jobs/jobStore.ts";

export const router = Router();

router.get("/:jobId", (req, res) => {
  const jobStore = req.app.locals.jobStore as JobStore | undefined;
  const jobId = req.params.jobId;

  if (!jobStore) {
    return res.status(500).json({ error: "Job store not available" });
  }

  const job = jobStore.get(jobId);
  if (!job) {
    return res.status(404).json({ error: "Job not found", jobId });
  }

  res.json(job);
});
