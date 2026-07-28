import pool from "../config/db";

export const applyLeave = async (
    employee_id: number,
    leave_type: string,
    start_date: string,
    end_date: string,
    reason: string
) => {

    const result = await pool.query(
        `INSERT INTO leave_requests
        (employee_id, leave_type, start_date, end_date, reason)
        VALUES($1, $2, $3, $4, $5)
        RETURNING *`,
        [
            employee_id,
            leave_type,
            start_date,
            end_date,
            reason
        ]
    );

    return result.rows[0];
};
export const getAllLeaves = async () => {

    const result = await pool.query(
        `SELECT
            leave_requests.id,
            employees.name,
            employees.email,
            leave_requests.leave_type,
            leave_requests.start_date,
            leave_requests.end_date,
            leave_requests.reason,
            leave_requests.status,
            leave_requests.created_at
        FROM leave_requests
        INNER JOIN employees
        ON leave_requests.employee_id = employees.id
        ORDER BY leave_requests.id ASC`
    );

    return result.rows;
};
export const getLeaveByEmployee = async (
    employeeId: number
) => {

    const result = await pool.query(
        `SELECT *
         FROM leave_requests
         WHERE employee_id = $1
         ORDER BY start_date DESC`,
        [employeeId]
    );

    return result.rows;
};
export const updateLeaveStatus = async (
    id: number,
    status: string
) => {

    const result = await pool.query(
        `UPDATE leave_requests
         SET status = $1
         WHERE id = $2
         RETURNING *`,
        [
            status,
            id
        ]
    );

    return result.rows[0];
};
export const deleteLeave = async (
    id: number
) => {

    const result = await pool.query(
        `DELETE FROM leave_requests
         WHERE id = $1
         RETURNING *`,
        [id]
    );

    return result.rows[0];
};