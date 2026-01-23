<div align="center">

# 🔍 Endpoint

### API Behavior Observatory & Monitoring Platform

[![MIT License](https://img.shields.io/badge/License-MIT-green.svg)](https://choosealicense.com/licenses/mit/)
[![Node.js](https://img.shields.io/badge/Node.js-20.x-339933?logo=node.js&logoColor=white)](https://nodejs.org/)
[![React](https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=white)](https://react.dev/)
[![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-47A248?logo=mongodb&logoColor=white)](https://www.mongodb.com/atlas)
[![Gemini AI](https://img.shields.io/badge/Gemini-AI-4285F4?logo=google&logoColor=white)](https://ai.google.dev/)

A comprehensive monitoring dashboard that tracks how external APIs behave over time with AI-powered insights, anomaly detection, and predictive analytics.

[Features](#-features) • [Tech Stack](#-tech-stack) • [Installation](#-installation) • [Configuration](#-configuration) • [Usage](#-usage) • [API Reference](#-api-reference)

</div>

---

## 📋 Table of Contents

- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Architecture](#-architecture)
- [Installation](#-installation)
- [Configuration](#-configuration)
- [Usage](#-usage)
- [API Reference](#-api-reference)
- [Project Structure](#-project-structure)
- [Contributing](#-contributing)
- [License](#-license)

---

## ✨ Features

### Core Monitoring

- **API Registration & Management** - Register and manage multiple API endpoints
- **Automated Health Checks** - Scheduled monitoring with configurable intervals
- **Response Time Tracking** - Latency monitoring and performance metrics
- **Schema Drift Detection** - Automatic detection of API response changes

### AI-Powered Intelligence

- **Anomaly Detection** - ML-based detection of unusual API behavior
- **Root Cause Analysis** - AI-powered diagnosis of API issues
- **Predictive Alerts** - Forecast potential failures before they occur
- **Natural Language Queries** - Ask questions about your APIs in plain English

### Advanced Analytics

- **SLA Monitoring** - Track uptime, latency, and error rate targets
- **Cost Tracking** - Monitor API usage costs with budget alerts
- **Regression Detection** - Identify performance degradations
- **Dependency Mapping** - Visualize API relationships and cascading failures

### Notifications & Integrations

- **Email Alerts** - Configurable notifications for critical events
- **Webhook Support** - Custom webhook endpoints for integrations
- **Contract Violations** - Schema compliance monitoring

### User Experience

- **Interactive Dashboard** - Real-time charts and visualizations
- **Dark/Light Mode** - Fully themed UI
- **Responsive Design** - Works on desktop and mobile

---

## 🛠 Tech Stack

### Frontend

| Technology      | Purpose            |
| --------------- | ------------------ |
| React 19        | UI Framework       |
| Vite            | Build Tool         |
| Tailwind CSS v4 | Styling            |
| React Router v7 | Navigation         |
| Recharts        | Data Visualization |
| Axios           | HTTP Client        |
| React Hot Toast | Notifications      |
| Lucide React    | Icons              |
| Framer Motion   | Animations         |

### Backend

| Technology    | Purpose        |
| ------------- | -------------- |
| Node.js       | Runtime        |
| Express.js    | Web Framework  |
| MongoDB Atlas | Database       |
| Mongoose      | ODM            |
| JWT           | Authentication |
| node-cron     | Scheduled Jobs |
| Nodemailer    | Email Service  |
| Google Gemini | AI/ML          |

---

## 🏗 Architecture

```
┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐
│                 │     │                 │     │                 │
│   React Client  │────▶│  Express API    │────▶│  MongoDB Atlas  │
│   (Vite)        │     │  Server         │     │                 │
│                 │     │                 │     │                 │
└─────────────────┘     └────────┬────────┘     └─────────────────┘
                                 │
                                 ▼
                        ┌─────────────────┐
                        │                 │
                        │   Gemini AI     │
                        │   (Insights)    │
                        │                 │
                        └─────────────────┘
```

---

## 🚀 Installation

### Prerequisites

- **Node.js** 20.x or higher
- **npm** or **yarn**
- **MongoDB Atlas** account
- **Google Gemini API** key
- **Gmail account** (for email notifications)

### Clone Repository

```bash
git clone https://github.com/yourusername/endpoint.git
cd endpoint
```

### Install Dependencies

```bash
# Install frontend dependencies
cd client
npm install

# Install backend dependencies
cd ../server
npm install
```

---

## ⚙ Configuration

### Backend Environment Variables

Create `server/.env` file:

```env
# Server
PORT=5001
NODE_ENV=development

# Database
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/endpoint

# Authentication
JWT_SECRET=your-super-secret-jwt-key
JWT_EXPIRE=7d

# AI Service
GEMINI_API_KEY=your-gemini-api-key

# Email Service
EMAIL_USER=your-gmail@gmail.com
EMAIL_PASS=your-gmail-app-password

# Client URL (for CORS)
CLIENT_URL=http://localhost:5173
```

### Frontend Environment Variables

Create `client/.env.local` file:

```env
VITE_API_URL=http://localhost:5001/api
```

---

## 💻 Usage

### Development Mode

```bash
# Terminal 1: Start backend server
cd server
npm run dev

# Terminal 2: Start frontend
cd client
npm run dev
```

| Service     | URL                   |
| ----------- | --------------------- |
| Frontend    | http://localhost:5173 |
| Backend API | http://localhost:5001 |

### Production Build

```bash
# Build frontend
cd client
npm run build

# Start production server
cd ../server
npm start
```

---

## 📡 API Reference

### Authentication

| Method | Endpoint                          | Description            |
| ------ | --------------------------------- | ---------------------- |
| POST   | `/api/auth/register`              | Register new user      |
| POST   | `/api/auth/login`                 | User login             |
| POST   | `/api/auth/forgot-password`       | Request password reset |
| PUT    | `/api/auth/reset-password/:token` | Reset password         |

### API Management

| Method | Endpoint        | Description       |
| ------ | --------------- | ----------------- |
| GET    | `/api/apis`     | Get all user APIs |
| POST   | `/api/apis`     | Register new API  |
| GET    | `/api/apis/:id` | Get API details   |
| PUT    | `/api/apis/:id` | Update API        |
| DELETE | `/api/apis/:id` | Delete API        |

### Analytics

| Method | Endpoint                               | Description       |
| ------ | -------------------------------------- | ----------------- |
| GET    | `/api/analytics/dashboard`             | Dashboard metrics |
| GET    | `/api/analytics/costs/dashboard`       | Cost analytics    |
| GET    | `/api/analytics/sla/dashboard`         | SLA metrics       |
| GET    | `/api/analytics/regressions/dashboard` | Regression data   |

### AI Insights

| Method | Endpoint                                    | Description            |
| ------ | ------------------------------------------- | ---------------------- |
| GET    | `/api/analytics/insights/root-cause/:apiId` | Root cause analysis    |
| GET    | `/api/analytics/insights/predictive`        | Predictive alerts      |
| POST   | `/api/analytics/query`                      | Natural language query |

For complete API documentation, see [FRONTEND_API_REFERENCE.md](./FRONTEND_API_REFERENCE.md)

---

## 📁 Project Structure

```
endpoint/
├── client/                    # Frontend (React + Vite)
│   ├── public/               # Static assets
│   └── src/
│       ├── components/       # Reusable UI components
│       │   ├── charts/       # Chart components
│       │   ├── common/       # Shared components
│       │   ├── cost/         # Cost tracking
│       │   ├── contract/     # Contract violations
│       │   ├── dashboard/    # Dashboard widgets
│       │   ├── dependency/   # Dependency graph
│       │   ├── insights/     # AI insights
│       │   ├── nlquery/      # Natural language query
│       │   ├── regression/   # Regression detection
│       │   ├── sla/          # SLA monitoring
│       │   └── webhook/      # Webhook management
│       ├── context/          # React context providers
│       ├── hooks/            # Custom React hooks
│       ├── pages/            # Page components
│       ├── services/         # API service functions
│       └── utils/            # Utility functions
│
├── server/                    # Backend (Node.js + Express)
│   ├── config/               # Configuration files
│   ├── controllers/          # Route controllers
│   ├── middleware/           # Express middleware
│   ├── models/               # Mongoose models
│   ├── routes/               # API routes
│   ├── services/             # Business logic
│   └── utils/                # Helper functions
│
├── .gitignore
├── DEVELOPMENT_PLAN.md
├── FRONTEND_API_REFERENCE.md
├── PROJECT_STRUCTURE.md
└── README.md
```

---

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. **Fork** the repository
2. **Create** a feature branch
   ```bash
   git checkout -b feature/amazing-feature
   ```
3. **Commit** your changes
   ```bash
   git commit -m "Add amazing feature"
   ```
4. **Push** to the branch
   ```bash
   git push origin feature/amazing-feature
   ```
5. **Open** a Pull Request

### Code Style

- Use ESLint configuration provided
- Follow existing code patterns
- Write meaningful commit messages

---

## 📄 License

This project is licensed under the **MIT License** - see the [LICENSE](LICENSE) file for details.

---

## 👤 Author

**Ghushit Kumar Chutia**

- GitHub: [@ghushitkumarchutia](https://github.com/ghushitkumarchutia)

---

<div align="center">

### ⭐ Star this repo if you find it helpful!

Made with ❤️ using MERN Stack + Gemini AI

</div>
