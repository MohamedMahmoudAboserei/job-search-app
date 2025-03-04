# Job Search App

🚀 **Job Search App** is a job management application that allows users to search for jobs, apply for them, and manage their accounts easily.

## 📌 Key Features

- **User Management** (Registration, Login, Profile Update, Password Change, Image Upload, Soft Delete)
- **Company Management** (Add, Update, Search, Upload Images, Soft Delete)
- **Job Management** (Add, Update, Delete, Search, Filter)
- **Application Management** (Submit Applications, Review, Accept or Reject Applications)
- **Real-time Notifications** via **Socket.io** when applications are submitted
- **Email Notifications** when application status changes
- **Export Applications Data to an Excel File**

---

## 🛠️ Requirements

- **Node.js** v18+
- **MongoDB**
- **Redis** (for caching management)

## 🚀 How to Run

### 1️⃣ **Clone and Start the Project**

```sh
# Clone the repository
git clone https://github.com/MohamedMahmoudAboserei/job-search-app.git
cd job-search-app

# Install dependencies
npm install

# Start the server
npm start
```

### 2️⃣ **Setup Environment Variables**

Create a `.env` file in the root directory and add the following values:

```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
REDIS_URL=your_redis_url
EMAIL_HOST=your_smtp_host
EMAIL_USER=your_smtp_user
EMAIL_PASS=your_smtp_password
```

---

## 📂 Project Structure

```
job-search-app/
│── src/
│   ├── config/           # Database and Redis configurations
│   ├── middleware/       # Authentication and authorization middleware
│   ├── modules/
│   │   ├── auth/         # Authentication management
│   │   ├── users/        # User management
│   │   ├── companies/    # Company management
│   │   ├── jobs/         # Job management
│   │   ├── applications/ # Application management
│   ├── utils/            # Utility functions
│── .env                  # Environment variables
│── package.json          # Project dependencies
│── README.md             # Project documentation
```

---

## 📌 API Endpoints

| **Description**              | **Endpoint**                     | **Method** |
| ---------------------------- | -------------------------------- | ---------- |
| Register a new user          | `/api/auth/register`             | `POST`     |
| User login                   | `/api/auth/login`                | `POST`     |
| Update user profile          | `/api/users/update`              | `PATCH`    |
| Add a new company            | `/api/companies/add`             | `POST`     |
| Update company details       | `/api/companies/update/:id`      | `PATCH`    |
| Add a job                    | `/api/jobs/add`                  | `POST`     |
| Apply for a job              | `/api/applications/apply`        | `POST`     |
| Export applications to Excel | `/api/applications/export-excel` | `GET`      |

---

## 🔗 **Project Link**

[🔗 GitHub Repository](https://github.com/MohamedMahmoudAboserei/job-search-app)

---

## 📧 **Developer**

**Mohamed Mahmoud Aboserei**\
✉️ [LinkedIn](https://www.linkedin.com/in/mohamed-mahmoud-aboserei)

