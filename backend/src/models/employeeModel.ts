import pool from "../config/db";

export const createEmployee = async (
    name: string,
    email: string,
    department: string,
    position: string,
    salary: number
) => {

    const result = await pool.query(
        `INSERT INTO employees
        (name, email, department, position, salary)
        VALUES($1, $2, $3, $4, $5)
        RETURNING *`,
        [
            name,
            email,
            department,
            position,
            salary
        ]
    );

    return result.rows[0];
};

export const getAllEmployees = async () => {

    const result = await pool.query(
        `SELECT * FROM employees ORDER BY id ASC`
    );

    return result.rows;
};
export const getEmployeeById = async (id: number) => {

    const result = await pool.query(
        `SELECT * FROM employees WHERE id = $1`,
        [id]
    );

    return result.rows[0];
};
export const updateEmployee = async (
    id: number,
    name: string,
    email: string,
    department: string,
    position: string,
    salary: number
) => {

    const result = await pool.query(
        `UPDATE employees
        SET
            name = $1,
            email = $2,
            department = $3,
            position = $4,
            salary = $5
        WHERE id = $6
        RETURNING *`,
        [
            name,
            email,
            department,
            position,
            salary,
            id
        ]
    );

    return result.rows[0];
};
export const deleteEmployee = async (id: number) => {

    const result = await pool.query(
        `DELETE FROM employees
        WHERE id = $1
        RETURNING *`,
        [id]
    );

    return result.rows[0];
};