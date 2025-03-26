# Natours Application

Welcome to the **Natours Application**, a comprehensive backend API project built with **Node.js**, **Express**, and **MongoDB**. This application features robust authentication and authorization mechanisms, supporting Defferent user roles.

---

## Key Features

- Built using modern technologies: **Node.js**, **Express**, **MongoDB**, **Mongoose**, and more. 😁
- Supports both **local databases** and **MongoDB Atlas** for seamless integration.

---

## Getting Started

### Run the Server

To start the server, navigate to the project directory and use one of the following commands:

```bash
# Start the server
cd 4-natours && node server.js

# Start the server with nodemon for auto-restarts
cd 4-natours && nodemon server.js
```

---

## Environment Configuration

Create a file named `config.env` in the root directory and add the following environment variables:

```config.env
NODE_ENV=development
PORT=3000

DATABASE=mongodb+srv://<YOUR_MONGO_ATLAS_USERNAME>:<PASSWORD>@cluster0.9rfizmongodb.net/natures
DATABASE_LOCAL=mongodb://localhost:27017/natures-test
DATABASE_PASSWORD=YOUR_DATABASE_PASSWORD

JWT_SECRET=YOUR_SECRET_JWT_CODE
JWT_EXPIRES_IN=90d
JWT_COOKIE_EXPIRES_IN=90
```

Replace placeholders like `<YOUR_MONGO_ATLAS_USERNAME>`, `<PASSWORD>`, and `YOUR_DATABASE_PASSWORD` with your actual credentials.

---

Enjoy building and exploring the **Natours Application**! 🚀
