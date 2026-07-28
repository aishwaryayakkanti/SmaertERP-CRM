# 💼 SmartERP-CRM: Enterprise Resource & Customer Relations Manager

SmartERP-CRM is a secure, responsive, enterprise-grade resource management dashboard designed to manage employee directories, daily shifts, attendance checks, and leave requests. 

This repository houses the entire codebase, including the **RESTful Express API backend** and the **React 19 client SPA**.

---

## 📖 Table of Contents
1. [Key Features](#-key-features)
2. [System Architecture](#-system-architecture)
3. [Technology Stack](#-technology-stack)
4. [Repository Directory Structure](#-repository-directory-structure)
5. [Database SQL Schema Setup](#-database-sql-schema-setup)
6. [Quick Start & Setup Guide](#-quick-start--setup-guide)
7. [Authentication & Credentials](#-authentication--credentials)

---

## 🌟 Key Features

### 🔑 Authentication & Authorization
* **Secure Sessions**: Token-based authentication using **JSON Web Tokens (JWT)**.
* **Role-Based Access Control (RBAC)**: Distinct permissions for `admin` and `employee` roles enforced across frontend views and backend REST controllers.

### 👥 Employee Management (Admin Only)
* **Full CRUD Operations**: Register, modify, list, and terminate employee records.
* **Roster Control**: Store employee details including name, contact email, primary department, role, and salary metrics.

### 📅 Attendance Tracker
* **Real-time Logging**: Record daily attendance check-ins and check-outs.
* **Status Flags**: Automatically tag shift records as *Present*, *Absent*, *Late*, or *Half Day*.

### 📝 Leave Request Processing
* **Application Filing**: Employees can submit time-off requests with specified dates and descriptions.
* **Approval Pipeline**: Administrators can review, approve, or reject pending requests.

### 💰 Payroll & Payslip Advisor
* **Calculations**: Automatically computes standard withholding tax deductions (15%) and welfare benefits against basic base pay.
* **Payslip Generator**: Displays and prints a detailed, itemized monthly pay advice.

---

## 🚀 System Architecture

The application is built on a robust **three-tier client-server architecture**:

```mermaid
graph LR
    A["React 19 Frontend SPA"] -->| "HTTP Requests + JWT" | B["Express REST API"]
    B -->| "Raw SQL Queries" | C[("PostgreSQL Database")]
    
    style A fill:#a93bff,stroke:#fff,stroke-width:2px,color:#fff
    style B fill:#16171d,stroke:#fff,stroke-width:2px,color:#fff
    style C fill:#2e303a,stroke:#fff,stroke-width:2px,color:#fff
```

* **Presentation Tier**: Single Page Application (SPA) utilizing concurrent rendering for smooth UI transitions.
* **Application Tier**: RESTful backend managing routing, database queries, and middleware pipelines.
* **Data Tier**: Relational PostgreSQL database ensuring strict data validation and relational constraints.

---

## 📦 Technology Stack

### Frontend Client
* **UI Framework**: React 19.2.7
* **Build Pipeline**: Vite 8.1.1 (ES Modules build engine)
* **Routing Engine**: React Router Dom v7.18.1
* **API Client**: Axios v1.18.1 (with request interceptor)
* **Styling**: Vanilla CSS (CSS variables, variables-based dark/light theme switching)

### Backend REST API
* **Runtime**: Node.js & Express v5.2.1
* **Type System**: TypeScript v5.9.2
* **Hashing**: Bcrypt v6.0.0
* **Tokens**: jsonwebtoken v9.0.3
* **SQL Driver**: pg (node-postgres v8.22.0)

---

## 📂 Repository Directory Structure

```text
SmartERP-CRM/
├── backend/                  # REST API backend server folder
│   ├── src/
│   │   ├── config/
│   │   │   └── db.ts         # PostgreSQL database pooler configuration
│   │   ├── controllers/      # Route controllers (Auth, Employee, Leave, Attendance, Dashboard)
│   │   ├── middleware/       # JWT Auth verification & RBAC check filters
│   │   ├── models/           # Parameterized SQL database queries
│   │   └── routes/           # Express endpoint routers
│   ├── .env                  # Environment configs (Port, Database, JWT)
│   ├── tsconfig.json         # TypeScript compiler configurations
│   └── package.json          # Backend dependencies manifest
├── frontend/                 # Client UI application folder
│   ├── src/
│   │   ├── components/       # Layout wrapper, Navbar, Sidebar navigation, ProtectedRoute
│   │   ├── pages/            # View pages (Login, Dashboard, Employees, Attendance, Leave, Payroll, Profile)
│   │   ├── services/
│   │   │   └── api.ts        # Axios client instance & header request interceptors
│   │   ├── App.css           # Layout components styling rules
│   │   ├── App.tsx           # Router declarations
│   │   ├── index.css         # Styling system & dark mode preference config
│   │   └── main.tsx          # DOM root mount injection
│   ├── tsconfig.json         # TypeScript configurations
│   └── package.json          # Frontend packages manifest
├── .gitignore                # Global ignore list
└── README.md                 # Master project documentation
```

---

## 🗄️ Database SQL Schema Setup

Create a database named `smart_erp` in PostgreSQL, and execute the following DDL statements to set up the tables:

```sql
-- Users Table (Authentication profiles)
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(150) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    role VARCHAR(50) DEFAULT 'employee' CHECK (role IN ('admin', 'employee'))
);

-- Employees Table (HR Records)
CREATE TABLE employees (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(150) UNIQUE NOT NULL,
    department VARCHAR(100) NOT NULL,
    position VARCHAR(100) NOT NULL,
    salary DECIMAL(12, 2) NOT NULL
);

-- Attendance Table (Daily logs)
CREATE TABLE attendance (
    id SERIAL PRIMARY KEY,
    employee_id INT NOT NULL REFERENCES employees(id) ON DELETE CASCADE,
    attendance_date DATE NOT NULL,
    check_in TIME NOT NULL,
    check_out TIME,
    status VARCHAR(50) DEFAULT 'Present' CHECK (status IN ('Present', 'Absent', 'Late', 'Half Day')),
    UNIQUE (employee_id, attendance_date)
);

-- Leave Requests Table (Time-Off Tracking)
CREATE TABLE leave_requests (
    id SERIAL PRIMARY KEY,
    employee_id INT NOT NULL REFERENCES employees(id) ON DELETE CASCADE,
    leave_type VARCHAR(100) NOT NULL CHECK (leave_type IN ('Annual', 'Sick', 'Maternity/Paternity', 'Unpaid')),
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    reason TEXT NOT NULL,
    status VARCHAR(50) DEFAULT 'Pending' CHECK (status IN ('Pending', 'Approved', 'Rejected')),
    CHECK (start_date <= end_date)
);
```

---

## ⚙️ Quick Start & Setup Guide

### 1. Backend Server Setup
1. Navigate to the backend directory:
   ```bash
   cd backend
   ```
2. Install package dependencies:
   ```bash
   npm install
   ```
3. Configure your local variables inside a `.env` file:
   ```env
   PORT=5000
   DB_HOST=localhost
   DB_PORT=5432
   DB_USER=postgres
   DB_PASSWORD=your_postgres_password
   DB_NAME=smart_erp
   JWT_SECRET=your_secret_key
   ```
4. Start the server:
   ```bash
   npm run dev
   ```

### 2. Frontend Client Setup
1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Launch the development server:
   ```bash
   npm run dev
   ```
   *The console will open the client panel at `http://localhost:5173/`.*

---

## 🔒 Authentication & Credentials

To ensure system security, plaintext credentials are not committed to the repository:
* **Account Access**: Please inspect the `users` table inside your local PostgreSQL database to retrieve active user credentials.
* **Creating Profiles**: You can register custom admin or employee profiles using the signup routes or insert statements. Ensure all passwords are securely hashed using `bcrypt` (10 salt rounds) before insertion.

---
*SmartERP-CRM development team.*
