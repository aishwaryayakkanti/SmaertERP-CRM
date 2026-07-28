import express from "express";
import { dashboard } from "../controllers/dashboardController";
import { authenticate } from "../middleware/authMiddleware";

const router = express.Router();

router.get("/", authenticate, dashboard);

export default router;