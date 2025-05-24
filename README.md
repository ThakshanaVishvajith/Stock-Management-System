# 📦 Inventory Management System

An efficient and scalable web-based Inventory Management System designed for businesses to manage products, stock levels, orders, and users. Built using the MERN stack (MongoDB, Express.js, React.js, Node.js), this system supports role-based access control and provides detailed reports and insights.

---

## 🔐 Functional Requirements

### 1. User Authentication & Role-Based Access
- Secure login for all users (Admin, Stock Manager, Sales Representative).
- Role-based dashboards ensuring access control and personalized interfaces.

### 2. Product & Stock Management
- Admin/Stock Manager can add, update, and delete products with fields like name, category, material, and price.
- Track stock transactions (additions, removals, and adjustments).
- Enable physical stock counts and modifications by Stock Managers.
- Trigger reorders when stock falls below predefined levels.

### 3. Order Management
- **Purchase Orders**: Created and managed by Stock Managers.
- **Sales Orders**: Handled by Sales Representatives.
- Track order statuses (Pending, Completed, Cancelled).

### 4. Reports & Insights
- Generate comprehensive reports for:
  - Sales
  - Purchases
  - Stock
  - Reorders
- Filter reports by date, product, supplier, and customer.
- Export reports as PDF documents.

### 5. User Management
- Admin can create, update, and delete user accounts for Stock Managers and Sales Representatives.

---

## ⚙️ Non-Functional Requirements

- **Performance**: Fast response times for stock updates and report generation.
- **Scalability**: Easily accommodates growth in users, products, and transactions.
- **Security**: Role-based access control, secure authentication using JWT, and protected APIs.
- **Reliability**: Robust architecture to ensure consistent uptime and data integrity.
- **Usability**: Clean, intuitive user interface optimized for ease of use.

---

## 🛠️ Tech Stack

### 👨‍💻 Frontend
- **React.js** – For building dynamic UI.
- **React Router** – Handles client-side routing/navigation.

### 🔧 Backend
- **Node.js** – Server-side JavaScript runtime.
- **Express.js** – Web framework for API development.

### 🗃️ Database
- **MongoDB** – NoSQL document-based database.
- **Mongoose** – ODM library to manage data schemas and queries.

### 🔒 Authentication & Security
- **JWT (JSON Web Token)** – Secure user authentication and role-based authorization.

### 🧰 Development Tools
- **Visual Studio Code** – Primary code editor.
- **Git** – Version control system.
- **GitHub** – Code repository and collaboration platform.
- **Postman** – API testing and debugging tool.

---


