
---

```md
# 🚀 CSV Strapi Project Backend

A powerful **Strapi v4** backend system that enables **bulk CSV upload** with real-time progress tracking, batch processing, and comprehensive error handling for todo/task management applications.

---

## 📋 Project Overview

This backend provides a robust solution for importing large datasets via CSV files into a Strapi-powered database. Built specifically for **todo/task management**, it features advanced session management, real-time upload tracking, and efficient batch processing to handle large files without server performance degradation.

---

## ✨ Key Features

### 🔄 Advanced CSV Processing
- Bulk CSV upload with thousands of records
- Configurable batch processing (default: 10 records per batch)
- Real-time upload progress tracking
- Detailed error handling for invalid rows
- Multi-tab session management with unique session IDs

### 📊 Todo / Task Management
- Full CRUD operations
- Rich data model supporting:
  - Title & description
  - Status (boolean)
  - Due dates & amount
  - Email association
  - Media file attachments
  - Custom JSON fields

### 🔒 Robust Architecture
- In-memory job tracking with auto cleanup
- IP-based session isolation
- Supports SQLite, MySQL, PostgreSQL
- RESTful API structure

---

## 🛠️ Tech Stack

- **Framework**: Strapi v4.25.8  
- **Runtime**: Node.js (18.x – 20.x)  
- **Database**: SQLite (default), MySQL, PostgreSQL  
- **CSV Parsing**: csv-parser v3.2.0  
- **File Upload**: Multer v2.0.2  
- **Authentication**: Strapi Users & Permissions  

---

## 📁 Project Structure

```

csv-strapi-project-backend/
├── src/
│   ├── api/
│   │   └── todo/
│   │       ├── content-types/todo/
│   │       │   ├── schema.json        # Todo data model
│   │       │   └── lifecycles.js      # Entity lifecycle hooks
│   │       ├── controllers/
│   │       │   └── todo.js            # API request handling
│   │       ├── services/
│   │       │   └── todo.js            # Business logic & CSV processing
│   │       └── routes/
│   │           └── todo.js            # API routes
│   ├── admin/                         # Admin customizations
│   └── extensions/                    # Plugin extensions
├── config/
│   ├── database.js                    # Database configuration
│   ├── server.js                      # Server settings
│   ├── middlewares.js                 # Middleware configuration
│   └── plugins.js                     # Plugin settings
├── public/uploads/                    # Uploaded files
├── .tmp/                              # Temp files & SQLite DB
└── types/generated/                   # TypeScript definitions

```

---

## 🔄 Workflow & Data Flow

### 1️⃣ CSV Upload Flow
```

Client Upload
↓
Session Creation
↓
CSV Validation
↓
Batch Processing
↓
Progress Tracking
↓
Completion

````

### 2️⃣ Session Management
- Each browser tab generates a unique session ID
- IP-based isolation prevents cross-user conflicts
- Automatic cleanup after 1 hour

### 3️⃣ Batch Processing
- CSV rows processed in batches
- Schema-level validation
- Invalid rows logged with error messages
- Valid records saved immediately

---

## 🌐 API Endpoints

### CSV Upload & Tracking
```http
POST   /api/todos/bulk-upload           # Upload CSV file
GET    /api/todos/upload-status/:jobId  # Upload progress
GET    /api/todos/active-session        # Current session info
POST   /api/todos/clear-session         # Clear completed session
````

### Todo CRUD

```http
GET    /api/todos                       # List todos
GET    /api/todos/:id                   # Get todo
POST   /api/todos                       # Create todo
PUT    /api/todos/:id                   # Update todo
DELETE /api/todos/:id                   # Delete todo
```

---

## 🧩 Todo Data Model

```json
{
  "title": "string (required)",
  "description": "text",
  "status": "boolean (default: true)",
  "amount": "integer",
  "email": "email",
  "due_date": "date",
  "password": "string (required, min: 3)",
  "content": "blocks",
  "extra_data": "json",
  "media_file": "media"
}
```

---

## 📄 CSV Format Requirements

**Required columns (case-insensitive):**

```
title,description,status,amount,email,due_date,password
```

### Sample CSV

```csv
title,description,status,amount,email,due_date,password
Task 1,Complete project,true,100,user@email.com,2024-12-31,password123
Task 2,Review code,false,50,dev@email.com,2024-12-25,secure456
```

---

## ⚙️ Installation & Setup

### Prerequisites

* Node.js (18.x – 20.x)
* npm (6+)

### Steps

#### 1. Clone Repository

```bash
git clone <repository-url>
cd csv-strapi-project-backend
```

#### 2. Install Dependencies

```bash
npm install
```

#### 3. Environment Setup

```bash
cp .env.example .env
```

Configure required environment variables.

#### 4. Database Setup

* SQLite (default): No setup required
* MySQL / PostgreSQL: Update `config/database.js`

#### 5. Start Development Server

```bash
npm run develop
```

#### 6. Access Admin Panel

```
http://localhost:1337/admin
```

---

## 📈 Upload Progress Response Example

```json
{
  "jobId": "upload_1703123456789_abc123",
  "status": "processing",
  "progress": 75,
  "total": 1000,
  "processed": 750,
  "created": 745,
  "errors": 5,
  "errorDetails": [
    "Row 15: Title is required",
    "Row 23: Invalid email format"
  ],
  "duration": 45000
}
```

---

## 🔧 Configuration Options

### Batch Size

Modify in:

```
src/api/todo/services/todo.js
```

```js
const batchSize = 10;
```

### Database

Update `config/database.js`

```js
// PostgreSQL
client: 'postgres'

// MySQL
client: 'mysql'
```

---

## 🖥️ Frontend Integration

Frontend Repository:
👉 **https://github.com/harikrishnan2193/csv_upload_frontend**

---

## 📄 License

This project is licensed under the **MIT License**.
See the `LICENSE` file for details.

---

## 🆘 Support

* Create an issue in the repository
* Refer to Strapi docs: [https://strapi.io/documentation](https://strapi.io/documentation)

---

### ❤️ Built with Strapi v4

```
