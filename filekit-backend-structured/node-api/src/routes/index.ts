import type express from "express";
import { router as jobsRouter } from "./jobs.ts";
import { router as pdfRouter } from "./pdf/index.ts";

export function registerRoutes(app: express.Express) {
  app.use("/jobs", jobsRouter);
  app.use("/pdf", pdfRouter);
}
