import { Router } from "express";
import { router as organizeRouter } from "./organize.ts";
import { router as editRouter } from "./edit.ts";
import { router as convertRouter } from "./convert.ts";

export const router = Router();

router.use("/organize", organizeRouter);
router.use("/edit", editRouter);
router.use("/convert", convertRouter);

// later you can add:
// router.use("/security", securityRouter);
