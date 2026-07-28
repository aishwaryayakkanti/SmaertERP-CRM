import express from "express";
import { authenticate } from "../middleware/authMiddleware";
import {
    addAttendance,
    getAttendance,
    getAttendanceByEmployeeId,
    editAttendance,
    removeAttendance
} from "../controllers/attendanceController";

const router = express.Router();

router.post("/", authenticate, addAttendance);
router.get(
    "/",
    authenticate,
    getAttendance
);
router.get(
    "/:employeeId",
    authenticate,
    getAttendanceByEmployeeId
);
router.put(
    "/:id",
    authenticate,
    editAttendance
);
router.delete(
    "/:id",
    authenticate,
    removeAttendance
);

export default router;