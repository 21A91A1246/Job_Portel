# Job Portal Application

A **full-stack MERN (MongoDB, Express, React, Node.js)** job portal with **AI-powered resume generation**, **Adzuna Jobs API integration**, and **role-based authentication** for job seekers and employers.

---

## 🚀 Features

### **Job Seeker**
- 🔍 Search jobs by role, location, or keywords.
- 🗂 View job details from both **internal database** and **Adzuna API**.
- 📄 Apply for jobs with an uploaded resume.
- 🤖 AI-powered resume generation using **Google Gemini API**.
- 🎯 AI-suggested skills extraction based on job role & description.
- 📌 Save and view applied jobs.

### **Employer**
- ➕ Post new job listings.
- 📋 View and manage posted jobs.
- 🗑 Delete job postings.
- 🔐 Role-based access for employers.

### **General**
- 🌍 Fetch live jobs from **Adzuna API**.
- 🛠 Store internal jobs in **MongoDB** with unique IDs.
- 📊 Centralized skill mapping using `ROLE_SKILLS_MAP` and `KNOWN_SKILLS`.
- 🔐 JWT-based authentication.
- 🎨 Fully responsive UI.

---

## 🛠 Tech Stack

**Frontend**
- React.js (Vite)
- React Router
- Axios
- Custom CSS

**Backend**
- Node.js
- Express.js
- MongoDB + Mongoose
- JWT Authentication
- Adzuna Jobs API
- Google Gemini API

**Other Tools**
- dotenv
- CORS
- Multer (for file uploads)

---

## 📂 Project Structure

job-portal/
│
├── backend/
│ ├── server.js
│ ├── config/
│ ├── models/
│ ├── routes/
│ ├── controllers/
│ ├── middleware/
│ └── uploads/
│
├── frontend/
│ ├── src/
│ │ ├── components/
│ │ ├── pages/
│ │ ├── styles/
│ │ └── App.jsx
│ ├── public/
│ └── vite.config.js
│
└── README.md

## ⚙️ Installation & Setup (Local)

### 1️⃣ Clone the Repository
        bash
git clone https://github.com/your-username/job-portal.git
cd job-portal
2️⃣ Install Dependencies
Backend

bash
Copy
Edit
cd backend
npm install
Frontend

bash
Copy
Edit
cd frontend
npm install

3️⃣ Create Environment Variables
Backend .env
PORT=5000
MONGO_URI=your_mongo_connection_string
JWT_SECRET=your_jwt_secret
ADZUNA_APP_ID=your_adzuna_app_id
ADZUNA_APP_KEY=your_adzuna_api_key
GEMINI_API_KEY=your_gemini_api_key

Frontend .env
VITE_API_BASE_URL=http://localhost:5000

4️⃣ Run the Application
Backend
cd backend
npm run dev

Frontend
cd frontend
npm start

📌 API Routes
Jobs
GET /api/jobs – Get all internal jobs.

POST /api/jobs – Create a job (Employer only).

GET /api/adzuna – Fetch jobs from Adzuna API.

GET /api/jobs/:id – Get job details by ID.

Users
POST /api/auth/register – Register user.

POST /api/auth/login – Login user.

GET /api/user-applied – Get applied jobs.

Applications
POST /api/apply/:jobId – Apply for a job.

🤖 AI Resume Generator
Powered by Google Gemini API.

Auto-fills resume content based on job details.

Supports downloadable resumes.

