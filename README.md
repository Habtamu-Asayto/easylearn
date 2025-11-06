# EasyLearn - MERN E-Learning Platform

EasyLearn is a full-featured e-learning platform built with **MERN stack (MySQL, Express, React, Node.js)**. It allows instructors to create courses, lessons, quizzes, and students to enroll, track progress, and livechat with app users.  

---
## **Table of Contents**
1. [Features](#features)
2. [Tech Stack](#tech-stack)
3. [Setup & Installation](#setup--installation)
4. [API Documentation](#api-documentation)
    - [Auth Routes](#auth-routes)
    - [User Routes](#user-routes)
    - [Course Category Routes](#course-category-routes)
    - [Course Routes](#course-routes)
    - [Lesson Routes](#lesson-routes)
    - [Chat Routes](#chat-routes)
    - [News Routes](#news-routes)
    - [Install Routes](#install-routes)
5. [Usage](#usage)
6. [Future Improvements](#future-improvements)

## **Features**
- User authentication and email verification
- secure the wesbite based on role: Instructor and student roles
- Course creation, categories, and lessons
- Quizzes and progress tracking
- Chat system for messaging between users
- Admin dashboard to manage users, courses, and news
- File uploads for profile images
- Easy installation of database tables via API

## **Tech Stack**
- **Frontend:** ReactJS
- **Backend:** Node.js + Express
- **Database:** MySQL 
- **Authentication:** JWT
- **File Uploads:** Multer 

## **Setup & Installation**
1. Clone the repository:
```bash
git clone https://github.com/Habtamu-Asayto/easylearn.git
```

2. Install backend dependencies:
```bash
cd backend
npm install
```

3. Install client/Frontend dependencies
```bash
cd ../client
npm install
```

4. Configure environment variables (.env):
```bash
PORT=8080
DB_HOST=your_database_host
DB_USER=your_database_user
DB_PASSWORD=your_database_password
DB_NAME=your_database_name

## ** Frontend URL **
FRONTEND_URL=http://localhost:5173

** Secret key for JWT **
JWT_SECRET=your_jwt_secret
NODE_ENV=production
API_URL=http://localhost:8080

** Mail (SMTP provider) **
SMTP_HOST=your_smtp_host
SMTP_PORT=587
SMTP_USER=your_email@example.com
SMTP_PASS=your_email_password
EMAIL_FROM="My App your_email@example.com"

** Token config **
VERIFICATION_TOKEN_EXPIRES_HOURS=24
