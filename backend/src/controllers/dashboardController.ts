import { Request, Response } from "express";
import { getDashboardStats } from "../models/dashboardModel";


export const dashboard = async (
    req: Request,
    res: Response
) => {

    try {

        const stats = await getDashboardStats();

        res.status(200).json({
            message: "Dashboard statistics fetched successfully",
            stats
        });


    } catch (error) {

        console.log("DASHBOARD ERROR:", error);

        res.status(500).json({
            message: "Internal Server Error"
        });

    }

};