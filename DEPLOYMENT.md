# SignBridge AI — Production Deployment Guide

This guide provides step-by-step instructions for deploying **SignBridge AI** to production cloud platforms.

---

## Architecture Overview

- **Frontend**: React (Vite) Single Page Application deployed to **Vercel** or **Netlify**
- **Backend**: Node.js / Express.js REST API deployed to **Render** or **Railway**
- **Database**: **MongoDB Atlas** (Cloud Mongoose connection with resilient fallback)
- **AI Engine**: **Google Gemini API** (`gemini-1.5-flash`) via secure backend proxy

---

## Step 1: Database Setup (MongoDB Atlas)

1. Log in to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas).
2. Create a free shared cluster (M0 Sandbox).
3. Under **Security > Database Access**, create a database user (e.g. `signbridge_admin`) with password.
4. Under **Security > Network Access**, add IP Address `0.0.0.0/0` (Allow Access from Anywhere) to permit cloud backend connections from Render/Railway.
5. In **Database > Clusters**, click **Connect > Drivers (Node.js)**.
6. Copy the connection string format:
   ```
   mongodb+srv://<username>:<password>@cluster0.mongodb.net/signbridge?retryWrites=true&w=majority
   ```
7. Replace `<username>` and `<password>` with your Atlas credentials.

---

## Step 2: Backend Deployment (Render.com)

1. Sign in to [Render](https://render.com/).
2. Click **New + > Web Service** and link your GitHub repository.
3. Configure the Web Service settings:
   - **Name**: `signbridge-api`
   - **Region**: Oregon (US West) or Singapore
   - **Branch**: `main`
   - **Root Directory**: `server`
   - **Runtime**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `node src/server.js`
4. Under **Environment Variables**, add:
   | Key | Example Value | Description |
   |---|---|---|
   | `NODE_ENV` | `production` | Enables production mode |
   | `PORT` | `10000` | Render assigns port dynamically |
   | `MONGODB_URI` | `mongodb+srv://user:pass@cluster0...` | MongoDB Atlas Connection String |
   | `JWT_SECRET` | `generate_a_random_32_char_hex_secret` | Secret for signing JWT auth tokens |
   | `GEMINI_API_KEY` | `AIzaSy...` | Your Google Gemini API Key |
   | `CLIENT_URL` | `https://signbridge-ai.vercel.app` | URL of your deployed frontend |
5. Click **Create Web Service**.
6. Verify deployment by visiting:
   ```
   https://<your-render-service-name>.onrender.com/api/health
   ```
   You should receive a `{"status": "ok", ...}` JSON response.

---

## Step 3: Frontend Deployment (Vercel)

1. Sign in to [Vercel](https://vercel.com/).
2. Click **Add New... > Project** and import your GitHub repository.
3. Configure project settings:
   - **Framework Preset**: `Vite`
   - **Root Directory**: `client`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
   - **Install Command**: `npm install`
4. Under **Environment Variables**, configure:
   | Key | Value |
   |---|---|
   | `VITE_API_URL` | `https://<your-render-service-name>.onrender.com/api` |
5. Click **Deploy**.
6. After deployment finishes, copy your live frontend URL (e.g. `https://signbridge-ai.vercel.app`).
7. Update `CLIENT_URL` in your Render backend environment variables to match this Vercel domain to ensure CORS requests succeed.

---

## Step 4: Alternative Frontend Deployment (Netlify)

If deploying frontend to Netlify instead:
1. Connect repository in Netlify.
2. Set **Base directory**: `client`
3. Set **Build command**: `npm run build`
4. Set **Publish directory**: `dist`
5. Create a `client/public/_redirects` file with the content:
   ```
   /*    /index.html   200
   ```
   (Ensures React Router client-side routing works on page refreshes).
6. Set environment variable: `VITE_API_URL` to your backend URL.

---

## Pre-Deployment Verification Checklist

- [x] Backend integration tests pass (`npm run test --prefix server`)
- [x] Frontend builds with zero bundle errors (`npm run build --prefix client`)
- [x] Health check endpoint active at `/api/health`
- [x] CORS middleware permits production frontend domain
- [x] Environment variable placeholders documented in `.env.example`
- [x] No hardcoded passwords, tokens, or private secrets in source code
- [x] Browser Speech API & Canvas Vision work without external backend blockers

---

## Troubleshooting Guide

| Issue | Root Cause | Solution |
|---|---|---|
| **CORS error in browser console** | `CLIENT_URL` on backend does not match deployed frontend URL | Set `CLIENT_URL=https://<your-app>.vercel.app` in Render backend settings and restart service. |
| **Database fails to connect on Render** | MongoDB Atlas IP whitelist blocking Render | In MongoDB Atlas Network Access, ensure `0.0.0.0/0` is added to the IP Access List. |
| **Vite page 404 on refresh** | Single Page App routing not handled by host | Add `vercel.json` rewrites or Netlify `_redirects` rule to redirect all routes to `index.html`. |
| **Gemini AI shows fallback notice** | `GEMINI_API_KEY` is missing or invalid in Render | Verify API key format from Google AI Studio and re-save in backend environment. The app remains fully functional in offline heuristic mode. |
