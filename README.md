<div align="center">

# 🛡️ AUTOSURE

### AI-Powered Vehicle Insurance Claim Assessment Platform

[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178C6?logo=typescript)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-18.x-61DAFB?logo=react)](https://react.dev/)
[![Node.js](https://img.shields.io/badge/Node.js-20.x-339933?logo=node.js)](https://nodejs.org/)
[![Firebase](https://img.shields.io/badge/Firebase-10.x-FFCA28?logo=firebase)](https://firebase.google.com/)
[![License](https://img.shields.io/badge/License-MIT-green)](LICENSE)

</div>

---

## 📖 Overview

**AUTOSURE** is a production-ready, security-first web application that allows customers to submit vehicle accident claims, leverages **Google Gemini Vision AI** to analyze damage and estimate repair costs, flags potential fraud, and enables insurance officers to review and approve claims via a dedicated dashboard.

Built for a **cybersecurity-focused hackathon** with a threat-aware architecture.

---

## 🏗️ Architecture

```
autosure/
├── client/                # React + Vite + TypeScript + Tailwind (→ Vercel)
│   └── src/
│       ├── assets/        # Static assets
│       ├── components/    # Reusable UI components
│       ├── contexts/      # React Context (Auth, Theme)
│       ├── hooks/         # Custom React hooks
│       ├── layouts/       # Page layout wrappers
│       ├── pages/         # Route-level page components
│       ├── services/      # API + Firebase client calls
│       ├── types/         # TypeScript type definitions
│       └── utils/         # Helpers, constants, validators
│
├── server/                # Node.js + Express + TypeScript (→ Render)
│   └── src/
│       ├── config/        # App configuration (env, Firebase, CORS, logger)
│       ├── controllers/   # Route handlers (thin layer)
│       ├── middleware/    # Security + cross-cutting concerns
│       ├── routes/        # Express router definitions
│       ├── services/      # Business logic + external integrations
│       ├── types/         # Shared server TypeScript types
│       ├── utils/         # AppError, asyncHandler, response helpers
│       └── validators/    # Request validation schemas
│
├── .env.example           # Environment variable template
└── README.md
```

---

## 👥 User Roles

| Role       | Capabilities |
|------------|--------------|
| `customer` | Submit claims, upload photos, view own claim status |
| `officer`  | Review claims, approve/reject, view AI analysis |
| `admin`    | Full platform access, manage users and system settings |

---

## 🔐 Security Architecture

| Layer | Technology | Purpose |
|-------|-----------|---------|
| **Authentication** | Firebase Auth + JWT | Identity verification on every request |
| **Authorization** | RBAC Middleware | Role-based route protection |
| **HTTP Security** | Helmet.js | CSP, HSTS, X-Frame-Options, etc. |
| **Rate Limiting** | express-rate-limit | Brute-force and DoS protection |
| **Input Validation** | express-validator | Schema-based request validation |
| **Sanitization** | express-mongo-sanitize + xss-clean | NoSQL injection + XSS prevention |
| **CORS** | cors (allowlist) | Strict origin policy |
| **Logging** | Winston + Morgan | Audit trail and incident response |
| **Error Handling** | Central handler | No stack trace leakage in production |
| **Secrets** | dotenv + Zod | Validated at startup, never hardcoded |

---

## 🚀 Quick Start

### Prerequisites

- Node.js ≥ 20.x
- npm ≥ 10.x
- Firebase project (with Firestore, Auth, Storage enabled)
- Google Cloud project with Gemini API enabled

### 1. Clone and Configure

```bash
git clone https://github.com/your-org/autosure.git
cd autosure

# Set up environment variables
cp .env.example .env
# Edit .env with your Firebase and Gemini credentials
```

### 2. Install Dependencies

```bash
# Client
cd client && npm install

# Server
cd ../server && npm install
```

### 3. Run Development Servers

```bash
# Terminal 1 — Backend (http://localhost:5000)
cd server && npm run dev

# Terminal 2 — Frontend (http://localhost:5173)
cd client && npm run dev
```

---

## 🌐 Deployment

### Frontend → Vercel

1. Connect your GitHub repository to Vercel
2. Set **Root Directory** to `client`
3. Add all `VITE_*` environment variables in the Vercel dashboard
4. Deploy — Vercel auto-detects Vite

### Backend → Render

The `server/render.yaml` file configures automatic deployment:

```bash
# The render.yaml is already configured. Simply:
# 1. Connect your repo to Render.com
# 2. Select "Use render.yaml"
# 3. Set environment variables in Render dashboard
```

### Database → Firebase

1. Create a Firebase project at [console.firebase.google.com](https://console.firebase.google.com)
2. Enable **Authentication** (Email/Password + Google)
3. Create a **Firestore** database (production mode)
4. Enable **Storage**
5. Generate a **service account** key for the server Admin SDK

---

## 📦 Tech Stack

### Frontend

| Package | Version | Purpose |
|---------|---------|---------|
| react | ^18 | UI library |
| vite | ^5 | Build tool |
| typescript | ^5 | Type safety |
| tailwindcss | ^3 | Utility-first CSS |
| react-router-dom | ^6 | Client-side routing |
| axios | ^1 | HTTP client |
| firebase | ^10 | Auth, Firestore, Storage SDK |

### Backend

| Package | Version | Purpose |
|---------|---------|---------|
| express | ^4 | Web framework |
| typescript | ^5 | Type safety |
| firebase-admin | ^12 | Server-side Firebase operations |
| helmet | ^7 | HTTP security headers |
| cors | ^2 | Cross-Origin Resource Sharing |
| express-rate-limit | ^7 | Rate limiting |
| express-validator | ^7 | Request validation |
| express-mongo-sanitize | ^2 | NoSQL injection protection |
| xss-clean | ^0.1 | XSS sanitization |
| winston | ^3 | Logging |
| morgan | ^1 | HTTP request logging |
| zod | ^3 | Runtime type/env validation |

---

## 📁 API Reference

All endpoints are prefixed with `/api/v1`.

### Authentication
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/auth/register` | Public | Create new customer account |
| POST | `/auth/login` | Public | Sign in |
| POST | `/auth/logout` | Protected | Sign out |
| GET  | `/auth/me` | Protected | Current user profile |

### Claims
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/claims` | Customer | Submit new claim |
| GET  | `/claims` | Protected | List claims (filtered by role) |
| GET  | `/claims/:id` | Protected | Get claim details |
| PATCH | `/claims/:id` | Officer/Admin | Update claim status |

### Users
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET  | `/users/profile` | Protected | Get own profile |
| PATCH | `/users/profile` | Protected | Update own profile |

### Admin
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET  | `/admin/users` | Admin | List all users |
| GET  | `/admin/stats` | Admin | Platform statistics |

---

## 🧪 Development Commands

```bash
# Client
npm run dev      # Start development server
npm run build    # Production build
npm run preview  # Preview production build
npm run lint     # ESLint

# Server
npm run dev      # Start with hot reload (ts-node-dev)
npm run build    # Compile TypeScript
npm run start    # Run compiled output
npm run lint     # ESLint
```

---

## 🛡️ Security Disclosure

This project was built for a cybersecurity hackathon. If you discover a vulnerability:

1. Do **not** open a public GitHub issue
2. Email: security@autosure.app
3. Include steps to reproduce and potential impact

---

## 📄 License

MIT © 2025 AUTOSURE Team
