import { Request, Response } from "express";
import {
    markAttendance,
    getAllAttendance,
    getAttendanceByEmployee,
    updateAttendance,
    deleteAttendance
} from "../models/attendanceModel";

export const addAttendance = async (
    req: Request,
    res: Response
) => {

    try {

        const {
            employee_id,
            attendance_date,
            check_in,
            check_out,
            status
        } = req.body;

        const attendance = await markAttendance(
            employee_id,
            attendance_date,
            check_in,
            check_out,
            status
        );

        res.status(201).json({
            message: "Attendance marked successfully",
            attendance
        });

    } catch (error) {

        console.log("ADD ATTENDANCE ERROR:", error);

        res.status(500).json({
            message: "Internal Server Error"
        });

    }

};
export const getAttendance = async (
    req: Request,
    res: Response
) => {

    try {

        const attendance = await getAllAttendance();

        res.status(200).json({
            message: "Attendance fetched successfully",
            attendance
        });

    } catch (error) {

        console.log("GET ATTENDANCE ERROR:", error);

        res.status(500).json({
            message: "Internal Server Error"
        });

    }

};
export const getAttendanceByEmployeeId = async (
    req: Request,
    res: Response
) => {

    try {

        const employeeId = Number(req.params.employeeId);

        const attendance = await getAttendanceByEmployee(employeeId);

        res.status(200).json({
            message: "Attendance fetched successfully",
            attendance
        });

    } catch (error) {

        console.log("GET EMPLOYEE ATTENDANCE ERROR:", error);

        res.status(500).json({
            message: "Internal Server Error"
        });

    }

};
export const editAttendance = async (
    req: Request,
    res: Response
) => {

    try {

        const id = Number(req.params.id);

        const {
            attendance_date,
            check_in,
            check_out,
            status
        } = req.body;

        const attendance = await updateAttendance(
            id,
            attendance_date,
            check_in,
            check_out,
            status
        );

        res.status(200).json({
            message: "Attendance updated successfully",
            attendance
        });

    } catch (error) {

        console.log("UPDATE ATTENDANCE ERROR:", error);

        res.status(500).json({
            message: "Internal Server Error"
        });

    }

};
export const removeAttendance = async (
    req: Request,
    res: Response
) => {

    try {

        const id = Number(req.params.id);

        const attendance = await deleteAttendance(id);

        if (!attendance) {
            return res.status(404).json({
                message: "Attendance not found"
            });
        }

        res.status(200).json({
            message: "Attendance deleted successfully",
            attendance
        });

    } catch (error) {

        console.log("DELETE ATTENDANCE ERROR:", error);

        res.status(500).json({
            message: "Internal Server Error"
        });

    }

};