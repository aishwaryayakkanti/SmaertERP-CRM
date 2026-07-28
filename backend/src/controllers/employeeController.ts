import { Request, Response } from "express";
import {
    createEmployee,
    getAllEmployees,
    getEmployeeById,
    updateEmployee,
    deleteEmployee
} from "../models/employeeModel";

export const addEmployee = async (
    req: Request,
    res: Response
) => {

    try {

        const {
            name,
            email,
            department,
            position,
            salary
        } = req.body;

        const employee = await createEmployee(
            name,
            email,
            department,
            position,
            salary
        );

        res.status(201).json({
            message: "Employee added successfully",
            employee
        });

    } catch (error) {

        console.log("ADD EMPLOYEE ERROR:", error);

        res.status(500).json({
            message: "Internal Server Error"
        });

    }
};
export const getEmployees = async (
    req: Request,
    res: Response
) => {

    try {

        const employees = await getAllEmployees();

        res.status(200).json({
            employees
        });

    } catch (error) {

        console.log("GET EMPLOYEES ERROR:", error);

        res.status(500).json({
            message: "Internal Server Error"
        });

    }

};
export const getEmployee = async (
    req: Request,
    res: Response
) => {

    try {

        const id = Number(req.params.id);

        const employee = await getEmployeeById(id);

        if (!employee) {
            return res.status(404).json({
                message: "Employee not found"
            });
        }

        res.status(200).json({
            employee
        });

    } catch (error) {

        console.log("GET EMPLOYEE ERROR:", error);

        res.status(500).json({
            message: "Internal Server Error"
        });

    }

};
export const editEmployee = async (
    req: Request,
    res: Response
) => {

    try {

        const id = Number(req.params.id);

        const {
            name,
            email,
            department,
            position,
            salary
        } = req.body;

        const employee = await updateEmployee(
            id,
            name,
            email,
            department,
            position,
            salary
        );

        if (!employee) {
            return res.status(404).json({
                message: "Employee not found"
            });
        }

        res.status(200).json({
            message: "Employee updated successfully",
            employee
        });

    } catch (error) {

        console.log("UPDATE EMPLOYEE ERROR:", error);

        res.status(500).json({
            message: "Internal Server Error"
        });

    }

};
export const removeEmployee = async (
    req: Request,
    res: Response
) => {

    try {

        const id = Number(req.params.id);

        const employee = await deleteEmployee(id);

        if (!employee) {
            return res.status(404).json({
                message: "Employee not found"
            });
        }

        res.status(200).json({
            message: "Employee deleted successfully"
        });

    } catch (error) {

        console.log("DELETE EMPLOYEE ERROR:", error);

        res.status(500).json({
            message: "Internal Server Error"
        });

    }

};