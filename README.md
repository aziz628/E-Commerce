# E-Commerce Express Server

This is a learning project where I built an e-commerce platform from scratch using Node.js and Express. It demonstrates my journey from a raw Node.js HTTP server to a modern Express application with MySQL database integration, authentication, and real-time notifications.

## 📝 Project Overview

This project started as a basic Node.js e-commerce backend and evolved into a modern Express + MySQL powered application with:

- REST APIs for user management, products, and admin tools
- JWT authentication with refresh tokens
- Role-based access (user vs. admin)
- Real-time notifications system using WebSocket
- SharedWorker architecture for multi-tab WebSocket connection reuse
- Bootstrap-styled admin dashboard
- EJS templates for server-side rendering

## 🔑 Demo Credentials

To access the admin dashboard, use these credentials:

- **username**: admin
- **Password**: 000000

## 🚀 Features

- User authentication and authorization
- Product browsing and management
- Shopping cart functionality (localStorage)
- Admin dashboard for product management
- Real-time notifications
- Responsive design with Bootstrap

## 🛠️ Tech Stack

- **Backend**: Node.js, Express
- **Database**: MySQL
- **Authentication**: JWT with refresh tokens
- **Real-time**: WebSockets, SharedWorker
- **Frontend**: HTML, CSS, JavaScript, Bootstrap
- **Templating**: EJS

## 🏁 Getting Started

### Prerequisites

- Node.js (v14 or higher)
- MySQL server
- npm or yarn

### Installation

1. Clone the repository

```bash
git clone https://github.com/yourusername/e-commerce-express-server.git
cd e-commerce-express-server
```

2. Install dependencies

```bash
npm install
```

3. Create a `.env` file and added it in the config folder  with the following variables:

```
DB_HOST=localhost
DB_USER=your_mysql_user
DB_PASSWORD=your_mysql_password
DB_NAME=ecommerce
JWT_SECRET=your_jwt_secret
REFRESH_SECRET=your_refresh_token_secret
PORT=3000
```

4. Initialize the database

```bash
node backend/DB/init_db_mysql.js
```

5. Start the server

```bash
node backend/express_server.js
```

6. Open your browser and navigate to `http://localhost:3000`

## 📝 Note

This project was created as a learning exercise and is not intended for production use. It demonstrates various web development concepts and techniques I learned along the way.

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.
