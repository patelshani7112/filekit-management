import { Router } from "express";
import { router as organizeRouter } from "./organize.ts";
import { router as editRouter } from "./edit.ts";
import { router as convertRouter } from "./convert.ts";
import { compressPreviewRouter, compressBatchRouter } from "./compress/index.ts";

export const router = Router();

router.use("/organize", organizeRouter);
router.use("/edit", editRouter);
router.use("/convert", convertRouter);
router.use("/compress", compressPreviewRouter);
router.use("/compress", compressBatchRouter);

// later you can add:
// router.use("/security", securityRouter);
