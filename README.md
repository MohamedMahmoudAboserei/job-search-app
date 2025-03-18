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

- **Node.js** v22+
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
# Port localhost
PORT=3000

# Data Base URL
DB_URL="mongodb+srv://mmasere1999:123456mmasere3@cluster0.riih8.mongodb.net/job_search_app?retryWrites=true&w=majority"

# Token & Password & Phone
EXPIRE_IN=3600
USER_ACCESS_TOKEN=tokenLol
USER_REFRESH_TOKEN==tokenRefreshLol
SYSTEM_ACCESS_TOKEN=tokenAdminLol
SYSTEM_REFRESH_TOKEN=tokenRefreshAdminLol
companyOwner_ACCESS_TOKEN=tokenCompanyOwnerLol
companyOwner_REFRESH_TOKEN=tokenRefreshCompanyOwnerLol
companyHR_ACCESS_TOKEN=tokenCompanyHRLol
companyHR_REFRESH_TOKEN=tokenRefreshCompanyHRLol
ENCRYPTION_SIGNATURE=hamada
SALT_ROUND=8
TOKEN_EMAIL=@!FEWRTRWE%$
# Send Email
EMAIL="mmabserei3@gmail.com"
EMAIL_PASSWORD="ijobyqbgedrgujrh"
# Mood Project
MOOD="DEV"
# Login with google
CLIENT_ID="169458650258-1ltaruqioe8imdl4ddmcifcm1q2u463o.apps.googleusercontent.com"
GOOGLE_CLIENT_SECRET=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

# Cloudinary
cloud_name='duotwucty'
api_key='557751552579975'
api_secret='8FoledSI1CaC5_38l8bJSnwue3Q'
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
✉️ [LinkedIn](https://www.linkedin.com/in/mohamed-mahmoud-fornt-end-developer/)

