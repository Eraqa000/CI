import { Router } from "express";
import { authMiddleware } from "../index.js";
import {
  createJob,
  saveJobInput,
  saveJobResult,
  listJobResults,
  deleteJobResult
} from "../controllers/jobController.js";


const router = Router();

router.post("/create", authMiddleware, createJob);
router.post("/input", authMiddleware, saveJobInput);
router.post("/result", authMiddleware, saveJobResult);
router.get("/results", authMiddleware, listJobResults);
router.delete("/result/:id", authMiddleware, deleteJobResult);


export default router;
