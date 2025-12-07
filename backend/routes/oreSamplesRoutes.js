import { Router } from "express";
import {
  listOreSamples,
  createOreSample,
  deleteOreSample,
} from "../controllers/oreSamplesController.js";

const router = Router();

router.get("/", listOreSamples);
router.post("/", createOreSample);
router.delete("/:id", deleteOreSample);

export default router;
