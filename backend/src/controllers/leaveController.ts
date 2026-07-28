import { Request, Response } from "express";
import {
    applyLeave,
    getAllLeaves,
    getLeaveByEmployee,
    updateLeaveStatus,
    deleteLeave
} from "../models/leaveModel";

export const addLeave = async (
    req: Request,
    res: Response
) => {

    try {

        const {
            employee_id,
            leave_type,
            start_date,
            end_date,
            reason
        } = req.body;

        const leave = await applyLeave(
            employee_id,
            leave_type,
            start_date,
            end_date,
            reason
        );

        res.status(201).json({
            message: "Leave request submitted successfully",
            leave
        });

    } catch (error) {

        console.log("APPLY LEAVE ERROR:", error);

        res.status(500).json({
            message: "Internal Server Error"
        });

    }

};
export const getLeaves = async (
    req: Request,
    res: Response
) => {

    try {

        const leaves = await getAllLeaves();

        res.status(200).json({
            message: "Leave requests fetched successfully",
            leaves
        });

    } catch (error) {

        console.log("GET LEAVES ERROR:", error);

        res.status(500).json({
            message: "Internal Server Error"
        });

    }

};
export const getLeaveByEmployeeId = async (
    req: Request,
    res: Response
) => {

    try {

        const employeeId = Number(req.params.employeeId);

        const leaves = await getLeaveByEmployee(employeeId);

        res.status(200).json({
            message: "Employee leave records fetched successfully",
            leaves
        });

    } catch (error) {

        console.log("GET EMPLOYEE LEAVE ERROR:", error);

        res.status(500).json({
            message: "Internal Server Error"
        });

    }

};
export const editLeaveStatus = async (
    req: Request,
    res: Response
) => {

    try {

        const id = Number(req.params.id);

        const { status } = req.body;

        const leave = await updateLeaveStatus(
            id,
            status
        );

        if (!leave) {
            return res.status(404).json({
                message: "Leave request not found"
            });
        }

        res.status(200).json({
            message: "Leave status updated successfully",
            leave
        });

    } catch (error) {

        console.log("UPDATE LEAVE ERROR:", error);

        res.status(500).json({
            message: "Internal Server Error"
        });

    }

};
export const removeLeave = async (
    req: Request,
    res: Response
) => {

    try {

        const id = Number(req.params.id);

        const leave = await deleteLeave(id);

        if (!leave) {
            return res.status(404).json({
                message: "Leave request not found"
            });
        }

        res.status(200).json({
            message: "Leave request deleted successfully",
            leave
        });

    } catch (error) {

        console.log("DELETE LEAVE ERROR:", error);

        res.status(500).json({
            message: "Internal Server Error"
        });

    }

};