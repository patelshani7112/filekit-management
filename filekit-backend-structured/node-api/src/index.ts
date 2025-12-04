import express from "express";
import cors from "cors";
import morgan from "morgan";
import dotenv from "dotenv";

import { createJobStore } from "./jobs/jobStore.ts";
import { registerRoutes } from "./routes/index.ts";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 4000;

// basic middlewares
app.use(cors());
app.use(express.json());
app.use(morgan("dev"));

// simple in-memory job store (dev only)
const jobStore = createJobStore();
app.locals.jobStore = jobStore;

// health route
app.get("/health", (_req, res) => {
  res.json({
    ok: true,
    service: "node-api",
    env: process.env.NODE_ENV || "development"
  });
});

// register main routes
registerRoutes(app);

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: "Not found", path: req.path });
});

// error handler
// eslint-disable-next-line @typescript-eslint/no-unused-vars
app.use((err: any, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
  console.error("Unhandled error:", err);
  res.status(500).json({ error: "Internal server error" });
});

app.listen(PORT, () => {
  console.log("Node API listening on http://localhost:" + PORT);
});
