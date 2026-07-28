import express from "express";
import { authenticate } from "../middleware/authMiddleware";
import {
    addLeave,
    getLeaves,
    getLeaveByEmployeeId,
    editLeaveStatus,
    removeLeave
} from "../controllers/leaveController";

const router = express.Router();

router.post("/", authenticate, addLeave);
router.get(
    "/",
    authenticate,
    getLeaves
);
router.get(
    "/:employeeId",
    authenticate,
    getLeaveByEmployeeId
);
router.put(
    "/:id",
    authenticate,
    editLeaveStatus
);
router.delete(
    "/:id",
    authenticate,
    removeLeave
);

export default router;