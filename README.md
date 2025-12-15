

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

csv-strapi-project-backend/
├── src/
│   ├── api/
│   │   └── todo/
│   │       ├── content-types/todo/
│   │       │   ├── schema.json
│   │       │   └── lifecycles.js
│   │       ├── controllers/
│   │       │   └── todo.js
│   │       ├── services/
│   │       │   └── todo.js
│   │       └── routes/
│   │           └── todo.js
│   ├── admin/
│   └── extensions/
├── config/
│   ├── database.js
│   ├── server.js
│   ├── middlewares.js
│   └── plugins.js
├── public/uploads/
├── .tmp/
└── types/generated/

```

```

---

## 🔄 Workflow & Data Flow

### CSV Upload Flow
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

### Session Management
- Unique session per browser tab
- IP-based isolation
- Auto cleanup after 1 hour

### Batch Processing
- Processed in configurable batches
- Schema validation per row
- Errors logged per failed row
- Valid rows saved immediately

---

## 🌐 API Endpoints

### CSV Upload & Tracking
```http
POST   /api/todos/bulk-upload
GET    /api/todos/upload-status/:jobId
GET    /api/todos/active-session
POST   /api/todos/clear-session
````

### Todo CRUD

```http
GET    /api/todos
GET    /api/todos/:id
POST   /api/todos
PUT    /api/todos/:id
DELETE /api/todos/:id
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

#### Clone Repository

```bash
git clone <repository-url>
cd csv-strapi-project-backend
```

#### Install Dependencies

```bash
npm install
```

#### Environment Setup

```bash
cp .env.example .env
```

#### Database Setup

* SQLite (default): No setup required
* MySQL / PostgreSQL: Update `config/database.js`

#### Start Development Server

```bash
npm run develop
```

#### Admin Panel

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

```js
const batchSize = 10;
```

### Database Client

```js
client: 'postgres' // or 'mysql'
```

---

## 🖥️ Frontend Integration

Frontend Repository:
**https://github.com/harikrishnan2193/csv_upload_frontend**

---

## 📄 License

MIT License

```
