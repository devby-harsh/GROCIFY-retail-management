# GROCIFY – Grocery Management System (DBMS Project)

GROCIFY is a modern, lightweight, and professional inventory, supplier, sales, and reporting management system designed for a grocery store. This project is built as an academic DBMS semester project, prioritizing database normalization, relationships, triggers, and stored procedures.

## 🚀 Project Overview

- **Frontend:** Pure HTML, CSS (Flexbox/Grid), and Vanilla JavaScript (No frameworks).
- **Backend:** Node.js, Express.js.
- **Database:** Local MySQL (Workbench/Command Line).
- **Architecture:** REST API with Model-View-Controller (MVC) logic.
- **Theme:** Elegant Deep Green & Gold Luxury Theme.

## 🛠️ Key Features

- **Dashboard:** Real-time statistics, low stock alerts, and recent sales overview.
- **Product Management:** Full CRUD operations for inventory items.
- **Category Management:** Organizable products by department.
- **Supplier Management:** Track and manage supplier contact information.
- **Sales & Billing:** POS-style interface for creating sales transactions.
- **Reports:** Automated low-stock reports and sales summaries.

## 📁 Project Structure

```text
GROCIFY/
 ├── backend/
 │   ├── config/         # DB connection pool
 │   ├── routes/         # API endpoints
 │   ├── server.js       # Entry point
 │   └── .env            # Environment variables
 ├── frontend/
 │   ├── css/            # Style sheets (Deep Green & Gold)
 │   ├── js/             # Frontend logic (Vanilla JS)
 │   └── *.html          # Management pages
 ├── database/
 │   ├── schema.sql      # Database structure
 │   ├── seed.sql        # Sample data
 │   └── procedures_triggers.sql # DB logic
 ├── README.md           # Getting started guide
 └── DOCUMENTATION.md    # Detailed project report
```

## 🛠️ Local Setup Instructions

### 1. Database Setup (MySQL)

1. Open your MySQL Command Line or MySQL Workbench.
2. Log in with your credentials.
3. Import the database files in order:
   - Run `database/schema.sql` to create the database and tables.
   - Run `database/procedures_triggers.sql` to add logic.
   - Run `database/seed.sql` to populate sample data.

### 2. Backend Configuration

1. Navigate to the `backend/` folder.
2. Copy `.env.template` to a new file named `.env`.
3. Update the `.env` file with your MySQL credentials:
   ```env
   DB_HOST=localhost
   DB_USER=root
   DB_PASSWORD=your_password_here
   DB_NAME=grocify
   ```

### 3. Installation & Run

1. Open your terminal in the root directory.
2. Navigate to backend: `cd backend`
3. Install dependencies: `npm install`
4. Start the server: `npm start`
5. Open your browser and go to: `http://localhost:5000`

## 👨‍💻 Author
DBMS Semester Project - 2026
Clean. Optimized. Academic-Ready.
