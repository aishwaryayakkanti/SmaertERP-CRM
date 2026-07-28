# SmartERP-CRM

SmartERP-CRM is a secure, responsive, enterprise-grade resource management panel designed to manage company employees, payroll, attendance checks, and leave requests. 

This repository houses both the backend API server and the frontend client SPA.

---

## 🚀 System Architecture

The application is built on a **three-tier client-server architecture**:

```mermaid
graph TD
    A[React 19 Frontend SPA] -- HTTP Requests + JWT -- > B[Node/Express + TypeScript Backend]
    B -- Raw SQL Queries -- > C[PostgreSQL Database]
```

* **Frontend**: React 19 Single Page Application compiled with Vite 8 and typed with TypeScript.
* **Backend**: Express REST API running on Node.js using TypeScript.
* **Database**: PostgreSQL relational storage.

---

## 📦 Tech Stack

* **Frontend UI**: React 19, TypeScript, Vite 8, React Router Dom v7, Axios, Vanilla CSS.
* **Backend REST API**: Node.js, Express, TypeScript, Pg (Connection Pooling Driver).
* **Security & Auth**: JWT (jsonwebtoken), Bcrypt (Password Hashing), Role-Based Access Control (RBAC).

---

## 📂 Repository Structure

```text
SmartERP-CRM/
├── backend/                  # REST API backend server files
│   ├── src/
│   │   ├── config/
│   │   │   └── db.ts         # Database connection pooling
│   │   ├── controllers/      # Route controllers (Auth, Employee, Leave, Attendance, Dashboard)
│   │   ├── middleware/       # JWT Auth verification & RBAC check filters
│   │   ├── models/           # PostgreSQL client queries
│   │   └── routes/           # Express endpoint routers
│   ├── .env                  # Environment configs (Port, Database, JWT)
│   ├── tsconfig.json         # TypeScript configuration
│   └── package.json          # Node modules manifest
├── frontend/                 # Client UI application files
│   ├── src/
│   │   ├── components/       # Layout wrapper, Navbar, Sidebar navigation, ProtectedRoute
│   │   ├── pages/            # View pages (Login, Dashboard, Employees, Attendance, Leave, Payroll, Profile)
│   │   ├── services/
│   │   │   └── api.ts        # Axios client instance & header request interceptors
│   │   ├── App.css           # Styling rules for layout components
│   │   ├── App.tsx           # Router declarations
│   │   ├── index.css         # Design system styling parameters
│   │   └── main.tsx          # DOM node mount injection
│   ├── tsconfig.json         # TypeScript compiler configurations
│   └── package.json          # Vite packaging manifest
├── .gitignore                # Global ignore lists
└── README.md                 # Main repository entry file
```

---

## ⚙️ Setup and Execution Guide

### 1. Database Setup
1. Ensure **PostgreSQL** service is active.
2. Initialize a database named `smart_erp`.
3. Construct the necessary tables (`users`, `employees`, `attendance`, `leave_requests`) by executing the query definitions.

### 2. Backend Installation & Start
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
   DB_PASSWORD=your_database_password
   DB_NAME=smart_erp
   JWT_SECRET=your_jwt_secret_key
   ```
4. Start the backend server:
   ```bash
   npm run dev
   ```
   *The server starts listening on `http://localhost:5000` once database connection is confirmed.*

### 3. Frontend Installation & Start
1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```
2. Install package dependencies:
   ```bash
   npm install
   ```
3. Start the Vite local development server:
   ```bash
   npm run dev
   ```
   *The client dashboard will be available at `http://localhost:5173/` (or `http://localhost:5174/` if 5173 is occupied).*
4. Compile static assets for production deployment:
   ```bash
   npm run build
   ```

---

## 🔒 Access Credentials
To sign in to the administrative console:
* **Lookup Credentials**: Access accounts directly in the PostgreSQL `users` table. 
* **Custom Accounts**: You can insert custom administrator or employee profiles inside the database (with passwords securely encrypted using `bcrypt`).

---
*SmartERP-CRM development team.*
