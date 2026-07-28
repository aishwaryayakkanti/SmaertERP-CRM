import pool from "../config/db";

export const markAttendance = async (
    employee_id: number,
    attendance_date: string,
    check_in: string,
    check_out: string,
    status: string
) => {

    const result = await pool.query(
        `INSERT INTO attendance
        (employee_id, attendance_date, check_in, check_out, status)
        VALUES($1, $2, $3, $4, $5)
        RETURNING *`,
        [
            employee_id,
            attendance_date,
            check_in,
            check_out,
            status
        ]
    );

    return result.rows[0];
};
export const getAllAttendance = async () => {

    const result = await pool.query(
        `SELECT
            attendance.id,
            employees.name,
            employees.email,
            attendance.attendance_date,
            attendance.check_in,
            attendance.check_out,
            attendance.status,
            attendance.created_at
        FROM attendance
        INNER JOIN employees
        ON attendance.employee_id = employees.id
        ORDER BY attendance.id ASC`
    );

    return result.rows;
};
export const getAttendanceByEmployee = async (
    employeeId: number
) => {

    const result = await pool.query(
        `SELECT *
         FROM attendance
         WHERE employee_id = $1
         ORDER BY attendance_date DESC`,
        [employeeId]
    );

    return result.rows;
};
export const updateAttendance = async (
    id: number,
    attendance_date: string,
    check_in: string,
    check_out: string,
    status: string
) => {

    const result = await pool.query(
        `UPDATE attendance
         SET attendance_date = $1,
             check_in = $2,
             check_out = $3,
             status = $4
         WHERE id = $5
         RETURNING *`,
        [
            attendance_date,
            check_in,
            check_out,
            status,
            id
        ]
    );

    return result.rows[0];
};
export const deleteAttendance = async (
    id: number
) => {

    const result = await pool.query(
        `DELETE FROM attendance
         WHERE id = $1
         RETURNING *`,
        [id]
    );

    return result.rows[0];
};