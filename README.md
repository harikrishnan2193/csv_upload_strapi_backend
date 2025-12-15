# 📦 **csv-strapi-project-backend**

A backend system built with **Strapi** that enables **CSV bulk upload**,
processes incoming data, and allows users to **track upload status** in
real time.

## 🚀 **Overview**

`csv-strapi-project-backend` provides a simple and powerful backend
solution for handling bulk data import operations using CSV files.\
This project is ideal for applications that require importing large
amount of structured data, validating it, and storing it efficiently in
the database --- all while being able to **monitor the upload
progress**.

## ✨ **Features**

### 🔹 **CSV Bulk Upload**

-   Upload CSV files through the API.
-   Automatically validate the file structure.
-   Process each row and store data in Strapi collections.
-   Handles large datasets without freezing the server.

### 🔹 **Upload Status Tracking**

-   Track the status of each CSV upload (Pending, Processing, Completed,
    Failed).
-   Get real-time processing updates via API.
-   Error handling for malformed data or missing fields.

### 🔹 **Strapi Integration**

-   Uses Strapi v4 as the backend framework.
-   Supports authentication, permissions, custom controllers, and
    services.
-   Easy to extend and customize.

## 🛠️ **Tech Stack**

-   **Node.js**
-   **Strapi v4**
-   **CSV Parser / Fast-CSV / Papaparse (depending on config)**
-   **MongoDB / PostgreSQL (configurable)**

## 📁 **Project Structure**

    csv-strapi-project-backend/
     ├── src/
     │   ├── api/
     │   │   ├── upload-status/   # Tracks upload progress
     │   │   └── csv-upload/      # Controllers & services for CSV processing
     │   ├── extensions/
     │   └── config/
     ├── public/
     ├── package.json
     ├── README.md

## 🧩 **How It Works**

### 1️⃣ **Upload CSV File**

Send a POST request to:

    POST /api/csv-upload

With form-data:

    file: <your-csv-file.csv>

### 2️⃣ **System Starts Processing**

-   File is validated
-   Data is inserted row-by-row
-   Each row is checked for errors

### 3️⃣ **Track Upload Status**

Retrieve upload progress via:

    GET /api/upload-status/:id

## 🧪 **Sample Status Response**

``` json
{
  "id": 12,
  "filename": "users.csv",
  "status": "processing",
  "totalRows": 200,
  "processedRows": 80,
  "successCount": 78,
  "failedCount": 2,
  "errors": [
    {
      "row": 15,
      "error": "Email field missing"
    }
  ]
}
```

## 🚦 **Installation & Setup**

### 📥 Clone the Repository

``` bash
git clone https://github.com/your-repo/csv-strapi-project-backend.git
cd csv-strapi-project-backend
```

### 🧰 Install Dependencies

``` bash
npm install
```

### 🔧 Run the Project

``` bash
npm run develop
```

Strapi admin panel:

    http://localhost:1337/admin

## 📌 Future Enhancements

-   Email notifications on upload completion\
-   Retry mechanism for failed rows\
-   Parallel processing for faster imports\
-   Dashboard UI for status tracking

## 🤝 Contributing

Contributions are welcome!\
Feel free to submit issues or pull requests.

## 📄 License

This project is licensed under the **MIT License**.
