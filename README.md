# Endpoint - API Behavior Observatory

A monitoring dashboard that tracks how external APIs behave over time. Built with MERN stack + Gemini AI.

## Tech Stack

- **Frontend:** React 19 + Vite + Tailwind CSS v4
- **Backend:** Node.js + Express
- **Database:** MongoDB Atlas
- **AI:** Google Gemini API

## Quick Start

### Prerequisites

- Node.js 20.x or higher
- MongoDB Atlas account
- Gemini API key

### 1. Clone & Install

```bash
# Install frontend dependencies
cd client
npm install

# Install backend dependencies
cd ../server
npm install
```

### 2. Configure Environment Variables

**Backend (`server/.env`):**

```env
PORT=5000
MONGO_URI=your-mongodb-uri
JWT_SECRET=your-secret-key
JWT_EXPIRE=7d
GEMINI_API_KEY=your-gemini-api-key
EMAIL_USER=your-gmail@gmail.com
EMAIL_PASS=your-gmail-app-password
CLIENT_URL=http://localhost:5173
```

**Frontend (`client/.env.local`):**

```env
VITE_API_URL=http://localhost:5000/api
```

### 3. Run Development Servers

```bash
# Start backend (from server folder)
npm run dev

# Start frontend (from client folder)
npm run dev
```

- Frontend: http://localhost:5173
- Backend: http://localhost:5000

## Deployment

- **Frontend:** Vercel
- **Backend:** Render

See `DEVELOPMENT_PLAN.md` for detailed deployment instructions.

## Features

- ✅ User Authentication (JWT + Password Reset)
- ✅ API Registration & Management
- ✅ Automated Monitoring (node-cron)
- ✅ Schema Drift Detection
- ✅ Anomaly Detection
- ✅ AI-Powered Insights (Gemini)
- ✅ Visual Dashboard with Charts
- ✅ Email Notifications

## Project Structure

```
endpoint/
├── client/          # React + Vite frontend
├── server/          # Node.js + Express backend
├── .env.example     # Environment variables template
└── README.md
```

## License

MIT
