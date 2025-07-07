# 🌟 Hirify – AI-Powered Job Tracker

**Hirify** helps job seekers stay on top of their career journey by tracking job applications, analyzing job descriptions, and improving resumes – all powered by AI.

Built with the **MERN stack** + **OpenAI GPT**, Hirify makes your job search smarter, more organized, and stress-free.

---

## 🚀 Features

✨ **AI Assistance**
- Analyze job descriptions
- Suggest resume improvements
- Match resume against job listings

📋 **Job Tracker**
- Add/edit/delete job applications
- Track statuses, deadlines, and notes
- Organized and filtered by company or role

🧠 **Resume Upload & Parsing**
- Upload your resume (PDF/.docx)
- Automatically extract readable resume text
- Store and preview inside your profile

🔔 **Email Reminders**
- Get notified when deadlines are near
- Automated emails via SendGrid + cron jobs

🔐 **Authentication**
- JWT-based user login/registration
- Secure, role-protected routes

⚙️ **Modern Tech Stack**
- React + Tailwind CSS for clean UI
- Express + Node.js for API backend
- MongoDB + Mongoose for flexible storage
- AI integration with OpenAI GPT APIs

---

## 🖥️ Live Demo  
🔗 [https://hirify.app](https://hirify.app) *(if deployed)*  
📽️ Coming soon: video walkthrough

---

## 📸 Screenshots

| Dashboard | Resume Assistant |
|----------|------------------|
| ![Dashboard](./assets/dashboard.png) | ![AI Assistant](./assets/ai-assistant.png) |

---

## 🧱 Tech Stack

**Frontend:**
- React.js
- Tailwind CSS
- React Router

**Backend:**
- Node.js & Express.js
- MongoDB Atlas (Mongoose)
- JWT-based Authentication

**AI:**
- OpenAI GPT-4 API
- (optional) LangChain for advanced logic

**Email Service:**
- SendGrid
- node-cron for scheduled tasks

---

## 🔍 Folder Structure
Hirify/
├── client/
│   ├── public/
│   │   └── index.html
│   ├── src/
│   │   ├── components/
│   │   │   ├── common/
│   │   │   │   ├── Navbar.jsx
│   │   │   │   ├── Toast.jsx
│   │   │   │   └── Modal.jsx
│   │   │   ├── auth/
│   │   │   │   ├── LoginForm.jsx
│   │   │   │   └── RegisterForm.jsx
│   │   │   ├── jobs/
│   │   │   │   ├── JobCard.jsx
│   │   │   │   ├── JobForm.jsx
│   │   │   │   └── JobFilters.jsx
│   │   │   └── resume/
│   │   │       ├── ResumeUpload.jsx
│   │   │       └── ResumeAnalysis.jsx
│   │   ├── pages/
│   │   │   ├── Dashboard.jsx
│   │   │   ├── Login.jsx
│   │   │   ├── Register.jsx
│   │   │   ├── JobTracker.jsx
│   │   │   ├── ResumeAssistant.jsx
│   │   │   └── Profile.jsx
│   │   ├── utils/
│   │   │   ├── api.js
│   │   │   └── auth.js
│   │   ├── context/
│   │   │   └── AuthContext.jsx
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── package.json
│   └── tailwind.config.js
├── server/
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── jobController.js
│   │   ├── resumeController.js
│   │   └── aiController.js
│   ├── models/
│   │   ├── User.js
│   │   ├── Job.js
│   │   └── Resume.js
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── jobRoutes.js
│   │   ├── resumeRoutes.js
│   │   └── aiRoutes.js
│   ├── middleware/
│   │   ├── auth.js
│   │   └── upload.js
│   ├── utils/
│   │   ├── emailService.js
│   │   ├── openaiService.js
│   │   └── resumeParser.js
│   ├── config/
│   │   └── db.js
│   ├── server.js
│   ├── package.json
│   └── .env
└── README.md
MIT License © Shubh
