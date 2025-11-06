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

## **Technology**
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
cd client
npm install
```

4. Configure environment variables (.env):
```bash
PORT=8080
DB_HOST=your_database_host
DB_USER=your_database_user
DB_PASSWORD=your_database_password
DB_NAME=your_database_name

** Frontend URL **
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
```

5. Install database tables
```bash

CREATE DATABASE easylean;

GET /install
```

6. Start backend server
```bash

npm run dev
```

7. Start frontend server
```bash

npm start
```

## **API Documentation**
### Auth Routes
**Method**   | **Endpoint**                      | **Description**
------------ | --------------------------------- | -----------------------
`GET`        | `/api/auth/verify-email`          | Verify user email
`POST`       | `/api/auth/resend-verification`   | Resend verification email

### User Routes
**Method**   |  **Endpoint**                     | **Description**
------------ | --------------------------------- | -----------------------
`POST`       | 	`/user`                          | Register new user
`POST`       |  `/verify-email`                  | Verify email
`POST`       |  `/forgot-password`	             | Request password reset
`POST`       |  `/reset-password/:token`	     | Reset password     
`GET`        |	`/users/profile`	             | Get user profile
`PUT`        |	`/users/profile`	             | Update profile 
`GET`        |	`/students`	                     | Get all students (admin only)
`POST`       |	`/students`	                     | Add a student (admin only)

### Course Category Routes
| Method | Endpoint          | Description                  |
|--------|-----------------|------------------------------|
| `POST`   | `/category`       | Create a new category (admin only) |
| `GET`    | `/category`       | Retrieve all categories (admin only) |
| `PUT`    | `/category/:id`   | Update a specific category by ID (admin only) |
| `DELETE` | `/category/:id`   | Delete a specific category by ID (admin only) |

### Course Routes
| Method  | Endpoint                          | Description                        |
|---------|----------------------------------|------------------------------------|
| `POST`  | `/add-course`                     | Add a new course (admin only)      |
| `POST`  | `/add-overview`                   | Add course overview (admin only)   |
| `POST`  | `/add-chapter`                    | Add a chapter to a course (admin only) |
| `PUT`   | `/add-course/:id`                 | Update course by ID (admin only)   |
| `GET`   | `/courses`                        | Retrieve all courses                |
| `GET`   | `/chapter/:courseId`              | Get all chapters for a specific course |
| `POST`  | `/add-lesson`                     | Add lesson to a chapter (admin only) |
| `GET`   | `/lessons/:courseId/:chapterId`   | Get lessons for a specific chapter |
| `POST`  | `/add-quiz`                       | Add a quiz (admin only)             |
| `GET`   | `/quize/:chapterId`               | Get quizzes by chapter              |
| `POST`  | `/quiz_answer`                    | Save quiz answer                    |
| `POST`  | `/enroll`                         | Enroll in a course                  |
| `GET`   | `/enrollment-status/:course_id`   | Check enrollment status for a course |

### Chat Routes
| Method | Endpoint               | Description                   |
|--------|------------------------|-------------------------------|
| `GET`  | `/contacts`            | Retrieve all contacts         |
| `GET`  | `/messages/:contactId` | Get messages with a specific contact |
| `GET`  | `/unread-count/:userId`| Get unread message count for a user |
| `PUT`  | `/mark-read/:senderId` | Mark messages as read          |
| `POST` | `/messages`            | Send a message                 |

### News Routes
| Method | Endpoint    | Description               |
|--------|------------|---------------------------|
| `POST` | `/news`     | Create news (admin only)  |
| `GET`  | `/news-list`| Retrieve news list        |

### Install Routes
| Method | Endpoint   | Description             |
|--------|-----------|-------------------------|
| `GET`  | `/install` | Install database tables |

## Usage
- Register as a user and verify email.
- Login and explore courses.
- Enroll in courses, complete lessons, and take quizzes.
- Use chat to communicate with other users(receive notification, send ).
- Admins can create courses, lessons, categories, and news.

## Coming soon
- Implement advanced ai based analytics for instructors
- Enhance UI/UX with animations and additional dashboards features
- add billing for instructor and students
- Add multi-language support


**Author:** Habtamu Asayto
