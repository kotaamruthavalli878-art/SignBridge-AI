# SignBridge AI — AI for Accessibility & Sign Language Inclusion

SignBridge AI is an accessibility-focused web application designed to help Deaf and hard-of-hearing people communicate with others. It provides sign-language learning resources, text-to-speech, speech-to-text, emergency communication cards, and AI-assisted text simplification and translation.

## Features

- **Sign-to-Text:** Webcam-based sign recognition, if supported by the implemented classifier.
- **Text-to-Speech:** Convert typed messages into spoken audio.
- **Speech-to-Text:** Convert speech into text using supported browser or backend capabilities.
- **Sign Learning Library:** Browse available sign-language learning resources.
- **Quick Communication:** Display emergency messages in an easy-to-read format.
- **English and Telugu:** Language assistance and interface translations where implemented.
- **AI Text Assistance:** Simplify text and assist with translations using Google Gemini when configured.
- **Accessibility Settings:** Text scaling, contrast, and reduced-motion options where implemented.

> Note: Sign recognition accuracy and supported signs depend on the actual implementation. This application should not be treated as a certified sign-language interpreter.

## Technology Stack

- Frontend: React and Vite
- Backend: Node.js and Express
- Database: MongoDB with an optional in-memory fallback, if configured in the backend
- AI: Google Gemini API, when configured

## Project Structure

```text
SignBridge-AI/
├── client/          # React frontend
├── server/          # Express backend
├── package.json     # Root scripts
├── DEPLOYMENT.md    # Deployment instructions
├── SUBMISSION.md    # Submission details
└── README.md        # Project documentation
```

## Local Setup

### 1. Install dependencies

Run this command from the project root:

```bash
npm run install:all
```

If that script is unavailable, install dependencies separately in the `client` and `server` folders.

### 2. Configure the backend

Create `server/.env` using `server/.env.example` as a reference.

Configure the required environment variables:

```env
PORT=5001
NODE_ENV=development
CLIENT_URL=http://localhost:5173
JWT_SECRET=replace_with_a_strong_random_secret
```

Add `MONGODB_URI` and `GEMINI_API_KEY` only if the corresponding features are configured to use them. Keep real secrets private and never commit `.env` files to GitHub.

### 3. Start the backend

From the project root:

```bash
npm run dev:server
```

Check the health endpoint:

```text
http://localhost:5001/api/health
```

### 4. Start the frontend

Open a second terminal in the project root:

```bash
npm run dev:client
```

Open the local URL printed by Vite, usually:

```text
http://localhost:5173
```

## Tests and Build

Run the available automated tests:

```bash
npm test
```

Build the frontend:

```bash
npm run build:client
```

A successful build confirms that the frontend compiles; it does not guarantee that every feature works correctly.

## Deployment

Deploy the frontend and backend using the instructions in `DEPLOYMENT.md`.

For Vercel, configure `VITE_API_URL` to point to the deployed backend API base URL. For Render, configure the environment variables required by the backend.

After deployment, test registration, login, the sign library, AI assistance, and all camera and microphone features separately.

## Privacy and Responsible Use

- Request camera or microphone permission only when needed.
- Explain clearly which features process camera or microphone data.
- Do not claim that video is processed only in the browser unless the implementation has been verified.
- Sign recognition is limited to the signs and gestures actually supported by the implemented model or classifier.
- Do not use this application as a replacement for a qualified interpreter in critical medical, legal, or emergency situations.

## License

Add the license details that match the license included in this repository.
