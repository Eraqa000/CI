// backend/routes/task1MlRoutes.js
import express from "express";
import { predictForward } from "../controllers/task1MlController.js";

const router = express.Router();

// POST /api/task1/predict-forward
router.post("/predict-forward", predictForward);

export default router;
