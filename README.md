🍬 Sweet Shop Management System

A full-stack Sweet Shop Management System built with React (Vite) on the frontend and Node.js + Express + Prisma + PostgreSQL on the backend.
The application supports authentication, role-based access (Admin/User), sweet management, order handling, and image generation via the Gemini API.

📌 Project Overview

The Sweet Shop Management System is designed to digitize the operations of a traditional sweet shop. It allows users to browse sweets, place orders, and view order history, while administrators can manage sweets, view orders, and perform administrative actions through a secure admin panel.

✨ Key Features

User authentication with JWT

Role-based access (Admin / User)

Sweet inventory management (CRUD)

Order management

Email notifications (optional)

AI-based image generation using Gemini API

Secure backend with Prisma ORM and PostgreSQL

Modern frontend using React + Vite

🛠 Tech Stack
Frontend

React

Vite

TypeScript

Axios

Backend

Node.js

Express

TypeScript

Prisma ORM

PostgreSQL

JWT Authentication

Nodemailer

📂 Repository Structure
Sweet-Shop-Management-System/
│
├── backend/        # Express + Prisma backend
│
├── frontend/       # React + Vite frontend
│
├── README.md
└── package.json

🚀 Local Setup Instructions
1️⃣ Prerequisites

Make sure you have the following installed:

Node.js (v18+ recommended)

npm

PostgreSQL (or a hosted DB like Supabase/Neon)

🔧 Backend Setup (Local)
cd backend
npm install

Create .env file in backend/
DATABASE_URL=postgresql://user:password@localhost:5432/sweet_shop
JWT_SECRET=your-very-strong-secret
NODE_ENV=development
GEMINI_API_KEY=your_gemini_key
FRONTEND_URL=http://localhost:3000

Run migrations and seed
npx prisma migrate dev
npx prisma db seed

Start backend server
npm run dev


Backend will run at:

http://localhost:4000

🎨 Frontend Setup (Local)
cd frontend
npm install

Create .env file in frontend/
VITE_API_URL=http://localhost:4000/api

Start frontend
npm run dev


Frontend will run at:

http://localhost:3000

🔐 Default Admin Credentials
Username: admin
Password: admin123

🧪 Test Report
How to Run Tests
cd backend
npm test

Test Coverage

Authentication tests

Authorization checks

Sweet CRUD operations

Order flow validation

📄 Test Results

✅ All tests passed successfully with no failures.

Screenshot placeholder:
📸 Paste test output screenshot here

![Test Results](./screenshots/test-results.png)

📸 Application Screenshots

Create a folder named screenshots/ in the root directory
Paste images there and reference them like below.

🔑 Login Page
![Login Page]
<img width="1882" height="911" alt="image" src="https://github.com/user-attachments/assets/cd29be56-1f02-412b-a692-291d7b7d7387" /

🧾 Orders Page
![Orders Page]
<img width="865" height="932" alt="image" src="https://github.com/user-attachments/assets/53ca2d30-29c7-4c32-8177-c8f9da89705b" />



🤖 My AI Usage (Mandatory)

I used AI tools (including ChatGPT) as a development assistant to:

Debug TypeScript and Prisma-related issues

Improve error handling and validation logic

Help structure deployment configurations

Assist in documentation writing and formatting

All application logic, architecture decisions, and integrations were implemented and verified by me.
No code was copied directly from other repositories or developers.

⚠️ Academic Integrity Statement

This project is my original work.
AI tools were used responsibly for guidance and productivity, not for plagiarism.
Any similarities with other projects are coincidental and limited to common design patterns.

📬 Contact

Author: Abhishek
GitHub: https://github.com/2237324itcec-cpu
