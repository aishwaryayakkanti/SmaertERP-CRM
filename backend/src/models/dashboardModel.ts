import pool from "../config/db";


export const getDashboardStats = async () => {

    const totalEmployees = await pool.query(
        `
        SELECT COUNT(*) 
        FROM employees
        `
    );


    const presentToday = await pool.query(
        `
        SELECT COUNT(*)
        FROM attendance
        WHERE attendance_date = CURRENT_DATE
        AND status = 'Present'
        `
    );


    const absentToday = await pool.query(
        `
        SELECT COUNT(*)
        FROM attendance
        WHERE attendance_date = CURRENT_DATE
        AND status = 'Absent'
        `
    );


    const totalLeaves = await pool.query(
        `
        SELECT COUNT(*)
        FROM leave_requests
        `
    );


    const pendingLeaves = await pool.query(
        `
        SELECT COUNT(*)
        FROM leave_requests
        WHERE status = 'Pending'
        `
    );


    const approvedLeaves = await pool.query(
        `
        SELECT COUNT(*)
        FROM leave_requests
        WHERE status = 'Approved'
        `
    );


    const rejectedLeaves = await pool.query(
        `
        SELECT COUNT(*)
        FROM leave_requests
        WHERE status = 'Rejected'
        `
    );


    return {

        totalEmployees: Number(totalEmployees.rows[0].count),

        presentToday: Number(presentToday.rows[0].count),

        absentToday: Number(absentToday.rows[0].count),

        totalLeaves: Number(totalLeaves.rows[0].count),

        pendingLeaves: Number(pendingLeaves.rows[0].count),

        approvedLeaves: Number(approvedLeaves.rows[0].count),

        rejectedLeaves: Number(rejectedLeaves.rows[0].count)

    };

};