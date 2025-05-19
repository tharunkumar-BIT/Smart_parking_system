
# 🚗 Smart Parking System

**A real-time smart parking solution that helps users find and manage parking spots efficiently using modern web technologies.**

![React](https://img.shields.io/badge/Frontend-React-blue?logo=react)
![Node.js](https://img.shields.io/badge/Backend-Node.js-green?logo=node.js)
![Express](https://img.shields.io/badge/API-Express-black?logo=express)
![MongoDB](https://img.shields.io/badge/Database-MongoDB-green?logo=mongodb)
![Socket.io](https://img.shields.io/badge/Realtime-Socket.io-ff69b4?logo=socketdotio)
![JavaScript](https://img.shields.io/badge/Language-JavaScript-yellow?logo=javascript)

---

## 🚀 Overview

This project is a **Smart Parking System** that enables users to monitor, reserve, and manage parking slots in real-time. The system uses WebSockets to update parking slot statuses without the need to refresh the page.

It’s ideal for smart cities and connected parking infrastructures where real-time feedback and efficient space usage are key.

---

## 🛠️ Tech Stack

- **Frontend**: React, CSS
- **Backend**: Node.js, Express.js
- **Database**: MongoDB (NoSQL)
- **Real-time Updates**: Socket.IO
- **Tools**: JavaScript (ES6+), RESTful APIs

---

## 📁 Project Structure

```
Smart_parking_system/
├── client/             # React frontend
│   ├── public/
│   └── src/
│       ├── components/
│       └── App.jsx
├── server/             # Node + Express backend
│   ├── models/
│   ├── routes/
│   └── index.js
├── .gitignore
├── package.json
└── README.md
```

---

## 🧪 Getting Started

### Prerequisites

- Node.js & npm
- MongoDB installed locally or using MongoDB Atlas

### Installation

1. **Clone the repo:**

   ```bash
   git clone https://github.com/tharunkumar-BIT/Smart_parking_system.git
   cd Smart_parking_system
   ```

2. **Install backend dependencies:**

   ```bash
   cd server
   npm install
   ```

3. **Install frontend dependencies:**

   ```bash
   cd ../client
   npm install
   ```

4. **Run the application:**

   - Start MongoDB (locally or connect to your cloud instance)
   - Start backend:

     ```bash
     cd server
     npm start
     ```

   - Start frontend:

     ```bash
     cd ../client
     npm start
     ```

   The app will run on `http://localhost:3000/` (or specified port).

---

## 🤝 Contributing

Contributions, issues, and feature requests are welcome!  
Feel free to fork the project and submit a pull request with improvements or bug fixes.
