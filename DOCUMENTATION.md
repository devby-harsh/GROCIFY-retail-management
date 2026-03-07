n# DOCUMENTATION.md - GROCIFY: Grocery Management System

## 1. Project Background
GROCIFY is a comprehensive Grocery Management System built for a DBMS semester project. It aims to solve the problem of managing inventory, suppliers, sales, and reporting for a physical grocery store. This system is designed as a lightweight, clean, and professional admin dashboard for store owners.

## 2. Database Design & Normalization

### 2.1 Schema Breakdown
The database `grocify` is designed using proper normalization (up to 3NF) to ensure data integrity and minimize redundancy.

- **users:** Stores admin and staff information for system access.
- **categories:** Organizes products into groups like "Fresh Produce", "Dairy", etc.
- **suppliers:** Manages supplier contact and address information.
- **products:** Central table storing inventory details, stock levels, prices, and links to categories and suppliers.
- **sales:** Tracks individual sale transactions, including totals and payment methods.
- **sale_items:** A many-to-many junction table between sales and products, capturing the quantity and unit price at the time of sale.

### 2.2 Normalization Analysis
- **1NF:** Each table has a primary key, and all attributes are atomic.
- **2NF:** All non-key attributes are fully functionally dependent on the primary key.
- **3NF:** There are no transitive dependencies; every non-key attribute depends only on the primary key.

### 2.3 Database Constraints
- **Primary Keys:** Unique identifiers for every record.
- **Foreign Keys:** Enforces referential integrity between tables (e.g., `product.category_id` references `categories.category_id`).
- **Check Constraints:** Ensures prices and quantities are always non-negative.
- **Unique Constraints:** Prevents duplicate entries for SKUs, phone numbers, and emails.
- **On Delete Set Null/Cascade:** Automates data cleanup while maintaining historical integrity.

### 2.4 Triggers & Stored Procedures
- **Trigger `after_sale_item_insert`:** Automatically reduces the `stock_quantity` in the `products` table whenever an item is added to a sale.
- **Trigger `before_sale_item_insert`:** Validates stock levels before a sale item is inserted. If stock is insufficient, it signals an error (`SQLSTATE '45000'`) to prevent the transaction.
- **Stored Procedure `CreateSale`:** Wraps the logic for creating a new sale record and returning the generated `sale_id`.
- **Views:**
    - `view_sales_summary`: Provides a human-readable list of sales with staff names.
    - `view_low_stock`: Lists products that have reached or fallen below their `min_stock_level`.

## 3. Backend Architecture

### 3.1 Technology Stack
- **Node.js:** JavaScript runtime environment.
- **Express.js:** Lightweight web framework for building the REST API.
- **mysql2/promise:** Asynchronous MySQL driver for better performance and clean code with async/await.
- **dotenv:** Managing environment-specific configurations (credentials, ports).

### 3.2 API Endpoints
- `GET /api/products`: Retrieve all products with category and supplier names.
- `POST /api/products`: Add a new product to the inventory.
- `PUT /api/products/:id`: Update existing product details.
- `DELETE /api/products/:id`: Remove a product from the system.
- `GET /api/categories`: List all available categories.
- `GET /api/suppliers`: List all verified suppliers.
- `POST /api/sales`: Process a new sale transaction (inserts into `sales` and `sale_items`).
- `GET /api/reports/low-stock`: Get items requiring restocking.
- `GET /api/reports/sales-summary`: Get historical sales data.

## 4. Frontend Design

### 4.1 UI/UX Principles
- **Clean Sidebar Layout:** Clear navigation hierarchy.
- **Deep Green & Gold Luxury Theme:** Provides a professional, premium "Admin" feel.
- **Glassmorphism & Soft Shadows:** Adds modern depth without overcomplicating the UI.
- **Responsive Design:** Works on desktops and laptops with a flexible sidebar for smaller screens.

### 4.2 Tech Implementation
- **Pure CSS Grid & Flexbox:** Robust layout control without external frameworks.
- **Vanilla JavaScript:** All API interactions use the native `fetch` API.
- **Modal Forms:** Clean, non-intrusive ways to manage data.

## 5. Security & Error Handling
- **SQL Injection Prevention:** Uses prepared statements with the `mysql2` driver.
- **Error Handling Middleware:** Centralized backend logic to catch and report errors gracefully.
- **Form Validation:** Both frontend and backend checks for required fields and data types.

---
© 2026 GROCIFY - Grocery Management System
DBMS Academic Project
