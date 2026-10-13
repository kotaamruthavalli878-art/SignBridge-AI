<<<<<<< HEAD
# SignBridge AI — AI for Accessibility & Sign Language Inclusion

[![Node.js](https://img.shields.io/badge/Node.js-v24.x-green.svg)](https://nodejs.org/)
[![React](https://img.shields.io/badge/React-v19.x-blue.svg)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Vite-v8.x-purple.svg)](https://vitejs.dev/)
[![Tailwind CSS](https://img.shields.io/badge/TailwindCSS-v3.4-38bdf8.svg)](https://tailwindcss.com/)
[![Express](https://img.shields.io/badge/Express-v4.x-black.svg)](https://expressjs.com/)
[![MongoDB](https://img.shields.io/badge/MongoDB-Atlas%20%2F%20Mongoose-47a248.svg)](https://www.mongodb.com/)
[![Google Gemini](https://img.shields.io/badge/AI-Google%20Gemini%201.5%20Flash-orange.svg)](https://ai.google.dev/)

**SignBridge AI** is an AI-powered accessibility platform designed to break communication barriers between Deaf and hard-of-hearing individuals and hearing communities in hospitals, universities, government offices, and daily public interactions.

---

## 🌟 Key Features

| Workspace | Purpose & Capabilities |
|---|---|
| **Sign-to-Text Recognition** | Live webcam computer vision tracking classifying documented sample signs with confidence scores and sentence transcription. |
| **Text-to-Speech (TTS)** | Vocal synthesis engine converting typed messages to spoken audio with adjustable rate, pitch, and multi-language voices. |
| **Speech-to-Text (STT)** | Live microphone hearing aid transcribing companion speech into clear real-time transcripts. |
| **Sign Learning Library** | Verified Indian Sign Language (ISL) and universal dictionary with category filters and step-by-step guides. |
| **Quick Emergency Cards** | One-tap emergency cards with a **Fullscreen High-Visibility Large Text Mode** for hospital triage and counter staff. |
| **Bilingual Interface** | Seamless instant toggling between **English** and **Telugu (`తెలుగు`)** across the entire UI. |
| **AI Plain Language Assistant** | Modular Google Gemini 1.5 Flash service rewriting complex medical text and drafting polite messages. |
| **Universal Accessibility** | Font size scalers (Normal / Large / Extra Large), WCAG AAA High Contrast mode, and reduced-motion controls. |

---

## 📂 Project Structure

```
signbridge-ai/
├── client/                     # Frontend Application (React + Vite)
│   ├── public/
│   │   ├── favicon.svg         # Platform SVG Favicon
│   │   └── _redirects          # Netlify SPA routing rules
│   ├── src/
│   │   ├── components/         # Reusable UI Components
│   │   │   ├── Navbar.jsx      # Accessible Navbar with i18n & toggles
│   │   │   ├── Footer.jsx      # Footer with ethical disclosures
│   │   │   └── ProtectedRoute.jsx # Auth route protection
│   │   ├── context/
│   │   │   ├── AccessibilityContext.jsx # Text scaling, contrast, i18n
│   │   │   └── AuthContext.jsx # Session & JWT token state
│   │   ├── pages/              # Application Workspaces & Pages
│   │   │   ├── LandingPage.jsx
│   │   │   ├── LoginPage.jsx
│   │   │   ├── RegisterPage.jsx
│   │   │   ├── DashboardPage.jsx
│   │   │   ├── SignToTextPage.jsx
│   │   │   ├── TextToSpeechPage.jsx
│   │   │   ├── SpeechToTextPage.jsx
│   │   │   ├── LearnSignsPage.jsx
│   │   │   ├── QuickCommunicationPage.jsx
│   │   │   ├── SettingsPage.jsx
│   │   │   └── AboutPage.jsx
│   │   ├── services/
│   │   │   └── api.js          # Axios API client with interceptors
│   │   ├── utils/
│   │   │   └── translations.js # English & Telugu translation dictionaries
│   │   ├── App.jsx             # Main Router configuration
│   │   ├── index.css           # Custom accessible CSS variables
│   │   └── main.jsx            # React root entrypoint
│   ├── index.html              # HTML shell with meta tags & SEO
│   ├── tailwind.config.js      # Brand navy/teal color theme
│   ├── vercel.json             # Vercel SPA routing rules
│   └── package.json            # Client dependencies
│
├── server/                     # Backend API (Node.js + Express)
│   ├── src/
│   │   ├── config/
│   │   │   └── db.js           # Mongoose connect + Resilient memory fallback
│   │   ├── data/
│   │   │   └── seedSigns.js    # Verified Indian Sign Language dataset
│   │   ├── middleware/
│   │   │   ├── auth.js         # JWT verification middleware
│   │   │   └── validation.js   # Zod input schemas
│   │   ├── models/
│   │   │   ├── User.js         # User model with preferences
│   │   │   ├── Preference.js   # Accessibility settings model
│   │   │   └── SignLibrary.js  # Sign dictionary schema & indexes
│   │   ├── routes/
│   │   │   ├── authRoutes.js   # Register, Login, Me, Preferences
│   │   │   ├── signRoutes.js   # Signs catalog & categories
│   │   │   ├── aiRoutes.js     # AI simplify, translate, compose
│   │   │   └── healthRoutes.js # Service health check
│   │   ├── services/
│   │   │   ├── aiService.js    # Modular Google Gemini service with fallback
│   │   │   └── store.js        # Dual-mode Mongoose & Memory adapter
│   │   ├── tests/
│   │   │   └── api.test.js     # Node test runner integration test suite
│   │   └── server.js           # Express app setup & route mounting
│   ├── .env.example            # Backend environment template
│   └── package.json            # Server dependencies & scripts
│
├── .gitignore                  # Git ignore rules
├── .env.example                # Root environment template
├── DEPLOYMENT.md               # Cloud deployment instructions
├── SUBMISSION.md               # Official hackathon submission file
├── package.json                # Root monorepo scripts
└── README.md                   # Complete documentation
```

---

## 🚀 Quick Start Guide

### Prerequisites
- **Node.js** v18+ or v24+
- **npm** v9+

### 1. Install Dependencies
Run the installation command from the repository root:
```bash
npm run install:all
```
*(Or install separately inside `cd client && npm install` and `cd server && npm install`).*

### 2. Configure Environment Variables
Copy `.env.example` in `server/`:
```bash
cp server/.env.example server/.env
```
Default parameters for local testing:
```ini
PORT=5001
NODE_ENV=development
CLIENT_URL=http://localhost:5173
JWT_SECRET=signbridge_dev_secret_key_894372985729357
# Optional: MONGODB_URI (if omitted, automatically uses resilient in-memory storage)
# Optional: GEMINI_API_KEY (if omitted, automatically uses graceful deterministic fallback)
```

In `client/`, ensure `VITE_API_URL` points to the backend:
```ini
VITE_API_URL=http://localhost:5001/api
```

### 3. Start the Backend API
```bash
npm run dev:server
```
Backend will start on `http://localhost:5001`. Test health endpoint:
```bash
curl http://localhost:5001/api/health
```

### 4. Start the Frontend Client
In a separate terminal:
```bash
npm run dev:client
```
The React application will be available at `http://localhost:5173`.

---

## 🧪 Running Automated Tests

Run the backend integration test suite:
```bash
npm test
```
The test suite validates:
- Health check endpoint `/api/health`
- User registration with password hashing
- Duplicate email prevention
- Input validation (Zod schema checking)
- JWT login and session authentication
- Protected endpoints with Bearer tokens
- Sign library retrieval and category indexing
- AI text simplification and offline fallbacks

To verify production frontend build:
```bash
npm run build:client
```

---

## 📡 REST API Reference

| Method | Endpoint | Description | Auth Required |
|---|---|---|---|
| `GET` | `/api/health` | System, Database, and AI status | No |
| `POST` | `/api/auth/register` | Register new user account | No |
| `POST` | `/api/auth/login` | Authenticate user & issue JWT | No |
| `GET` | `/api/auth/me` | Retrieve active user profile | **Yes (Bearer)** |
| `PUT` | `/api/auth/preferences` | Update accessibility settings | **Yes (Bearer)** |
| `GET` | `/api/signs` | Retrieve signs (`?category=...&search=...`) | No |
| `GET` | `/api/signs/categories` | Retrieve category counts | No |
| `GET` | `/api/signs/:id` | Retrieve single sign detail | No |
| `POST` | `/api/ai/simplify` | Plain language text simplification | Rate Limited |
| `POST` | `/api/ai/translate` | Assistive English <-> Telugu translation | Rate Limited |
| `POST` | `/api/ai/compose` | Contextual draft communication notes | Rate Limited |

---

## 🔒 Ethical AI & Privacy Principles

- **No Video Retention**: Webcam frames are analyzed locally in browser memory using HTML5 Canvas and discarded immediately. No video stream is ever saved or sent to any server.
- **Microphone On Demand**: Audio listening triggers only when user explicitly clicks "Start Microphone".
- **Transparent Demo Mode**: We distinguish assistive gesture classifiers from complete natural sign languages (ISL/ASL). Documented signs are bounded to prevent hallucinations.
- **Fail-Safe Operation**: If MongoDB Atlas or Google Gemini credentials are unconfigured, the application runs gracefully with deterministic offline fallbacks.

---

## 📄 License

This project is licensed under the MIT License — open-source for accessibility and inclusion.
=======
# SignBridge-AI
>>>>>>> 04b42c0b52adba32c9f150b789108f885039d147
