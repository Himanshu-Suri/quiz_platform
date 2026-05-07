# Quiz Platform

A full-stack quiz platform built using React, Node.js, MongoDB, and Java JSP Reports.

---

# Tech Stack

## Frontend
- React
- Axios
- React Router DOM

## Backend
- Node.js
- Express.js
- MongoDB
- Mongoose
- JWT Authentication

## Reports Module
- Java
- Maven
- Embedded Tomcat
- JSP

---

# Project Structure

quiz-platform/
│
├── frontend/     # React frontend
├── backend/      # Node.js + Express API
├── reports/      # Java JSP report service
└── README.md

---

# Backend (Node.js + Express)

## Setup

cd quiz-platform/backend
npm init -y
npm install express mongoose bcryptjs jsonwebtoken cors dotenv

## Libraries

| Library | Purpose |
|---|---|
| express | Web server and REST API routing |
| mongoose | MongoDB object modeling |
| bcryptjs | Password hashing |
| jsonwebtoken | JWT authentication tokens |
| cors | Allow React frontend to access API |
| dotenv | Load environment variables |

## Run Backend

node server.js

---

# Frontend (React)

## Setup

cd quiz-platform/frontend
npx create-react-app .
npm install axios react-router-dom

## Libraries

| Library | Purpose |
|---|---|
| react | UI framework |
| react-router-dom | Routing and navigation |
| axios | HTTP requests to backend |

## Run Frontend

npm start

Frontend runs at:
http://localhost:3000

---

# Reports Module (Java + Tomcat JSP)

## Requirements

| Tool | Version |
|---|---|
| Java JDK | 17+ |
| Maven | 3.8+ |

## Downloads

Java JDK: https://adoptium.net  
Maven: https://maven.apache.org

## pom.xml Dependencies

| Library | Purpose |
|---|---|
| tomcat-embed-core | Embedded Tomcat server |
| tomcat-embed-jasper | JSP rendering engine |
| jakarta.servlet.jsp.jstl | JSP tag libraries |
| mongodb-driver-sync | MongoDB connectivity |
| gson | JSON parsing |

## Build Reports Module

cd quiz-platform/reports
mvn package -DskipTests

## Run Reports Module

java -jar target/quiz-report-1.0-SNAPSHOT.jar

---

# MongoDB

## Start MongoDB

& "C:\Program Files\MongoDB\Server\8.2\bin\mongod.exe" --dbpath "C:\data\db"

## Seed Mock Data

cd quiz-platform/backend
node seed.js

---

# Start Everything (Order Matters)

## Terminal 1 — MongoDB

& "C:\Program Files\MongoDB\Server\8.2\bin\mongod.exe" --dbpath "C:\data\db"

## Terminal 2 — Backend

cd quiz-platform/backend
node server.js

## Terminal 3 — JSP Reports

cd quiz-platform/reports
java -jar target/quiz-report-1.0-SNAPSHOT.jar

## Terminal 4 — React Frontend

cd quiz-platform/frontend
npm start

---

# Features

- User authentication with JWT
- Quiz creation and participation
- MongoDB integration
- REST API backend
- React frontend
- JSP-based reporting system

---

# Future Improvements

- Admin dashboard
- Docker deployment

---
This project is for educational purposes.
