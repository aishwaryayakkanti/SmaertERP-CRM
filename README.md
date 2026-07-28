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
│   │   ├── config/db.ts      # Database connection pooling
│   │   ├── controllers/      # Route logic handlers
│   │   ├── middleware/       # Auth guards & role check filters
│   │   ├── models/           # SQL query models
│   │   └── routes/           # REST endpoints
│   ├── .env                  # Port, DB, JWT variables
│   └── package.json          # Node modules manifest
├── frontend/                 # Client UI application files
│   ├── src/
│   │   ├── components/       # Layouts, Sidebar, Navbar, ProtectedRoute
│   │   ├── pages/            # View pages (Login, Dashboard, Employees...)
│   │   ├── services/api.ts   # Axios instance & JWT header interceptors
│   │   └── index.css         # Typography & dark/light theme properties
│   └── package.json          # Vite packaging manifest
├── .gitignore                # Global ignore lists
├── PROJECT_EXPLANATION.md    # Master full-project documentation
├── BACKEND_DOCUMENTATION.md  # Detailed backend database/API document
├── FRONTEND_DOCUMENTATION.md # Detailed frontend layout/page document
└── README.md                 # Main repository entry file (this file)
```

---

## ⚙️ Setup and Execution Guide

### 1. Database Setup
Ensure **PostgreSQL** is running. Construct a database named `smart_erp` and initialize the tables using the SQL schemas documented in [BACKEND_DOCUMENTATION.md](./BACKEND_DOCUMENTATION.md).

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
   DB_PASSWORD=yourpassword
   DB_NAME=smart_erp
   JWT_SECRET=yourjwtsecretkey
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

## 🔒 Test Credentials
To run a test dashboard session, use the default seeded account:
* **Login Email**: `aish@gmail.com`
* **Password**: `aish123`

---
*SmartERP-CRM development team.*
