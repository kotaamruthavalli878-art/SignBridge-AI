# SignBridge AI — Production Deployment Guide

This guide explains how to deploy SignBridge AI using Vercel, Render, and MongoDB Atlas.

## Architecture

- **Frontend:** React + Vite, hosted on Vercel
- **Backend:** Node.js + Express, hosted on Render
- **Database:** MongoDB Atlas, if persistent database storage is required
- **AI:** Google Gemini API, when configured

## Step 1: MongoDB Atlas (Optional Until Required)

1. Open [MongoDB Atlas](https://www.mongodb.com/atlas).
2. Create a free cluster if available for your account.
3. Create a database user under **Security → Database Access**.
4. Under **Network Access**, configure access for your backend. `0.0.0.0/0` permits connections from any IP, so use it only if necessary and protect the database with a strong password.
5. Select **Connect → Drivers** and copy the connection string.
6. Replace the username, password, and database name with your own values.
7. Add the finished connection string to Render as `MONGODB_URI`.

Never paste your real database password into GitHub or a public README.

## Step 2: Deploy the Backend on Render

1. Open [Render](https://render.com/).
2. Create a **New Web Service** and connect your GitHub repository.
3. Configure the service according to the repository:
   - **Root Directory:** `server`
   - **Runtime:** Node
   - **Build Command:** `npm install`
   - **Start Command:** `node src/server.js`
4. Add the environment variables required by your backend:

| Variable | Value |
|---|---|
| `NODE_ENV` | `production` |
| `JWT_SECRET` | A strong, randomly generated secret |
| `CLIENT_URL` | Your actual deployed Vercel frontend URL |
| `GEMINI_API_KEY` | Your private Gemini API key, if AI features use it |
| `MONGODB_URI` | Your private Atlas connection string, if using Atlas |

Render provides the port for the service. The backend should listen on `process.env.PORT`. Do not hardcode a port unless the application specifically requires it.

5. Deploy the service.
6. Open this URL, replacing the hostname with your actual Render service URL:

`https://YOUR-RENDER-SERVICE.onrender.com/api/health`

Confirm that the response reports a healthy backend. Check the database status separately.

## Step 3: Deploy the Frontend on Vercel

1. Open [Vercel](https://vercel.com/).
2. Import the SignBridge AI GitHub repository.
3. Configure the frontend project:
   - **Framework Preset:** Vite
   - **Root Directory:** `client`
   - **Build Command:** `npm run build`
   - **Output Directory:** `dist`
   - **Install Command:** `npm install`
4. Add this environment variable:

`VITE_API_URL=https://YOUR-RENDER-SERVICE.onrender.com/api`

Replace the example hostname with your actual Render backend URL.

5. Deploy the project.
6. Open the live frontend and test its pages.
7. Make sure the backend's `CLIENT_URL` matches your actual Vercel origin. Redeploy or restart the backend if required.

For the existing deployment, verify the current Vercel and Render settings rather than creating duplicate services.

## Step 4: Verification Checklist

- [ ] Frontend opens using its public URL.
- [ ] Backend `/api/health` responds successfully.
- [ ] Frontend requests reach the correct backend.
- [ ] Registration and login work.
- [ ] Sign library data loads.
- [ ] AI features work when configured.
- [ ] Camera and microphone permissions work in the browser.
- [ ] Sign-to-Text produces meaningful recognition results for supported signs.
- [ ] Learn Sign Language displays actual learning content.
- [ ] Database persistence works if MongoDB Atlas is enabled.
- [ ] Automated tests pass.
- [ ] Frontend production build succeeds.
- [ ] No secrets are committed to GitHub.

A successful deployment or build does not prove that every feature works. Test each feature separately before submission.

## Troubleshooting

| Problem | What to check |
|---|---|
| Frontend cannot reach backend | Verify `VITE_API_URL` and the Render service status. |
| CORS error | Ensure backend CORS settings allow the exact Vercel frontend origin. |
| Database disconnected | Check `MONGODB_URI`, Atlas credentials, network access, and Render logs. |
| Gemini fallback message | Check the backend API key, model availability, and server logs. |
| Page fails after refresh | Verify Vercel SPA rewrite configuration. |
| Camera does not recognize signs | Check whether an actual recognition model or classifier is implemented; camera access alone is not sign recognition. |
| Learning page is empty | Check the frontend page, backend sign endpoints, and available sign data. |

## Security and Privacy

- Keep API keys, JWT secrets, and database credentials private.
- Use HTTPS for deployed services.
- Request camera and microphone access only when needed.
- Clearly explain what data is processed and whether it is transmitted or stored.
- Do not claim that video remains entirely in the browser until the implementation has been verified.

## Important

This guide documents the intended deployment process. Confirm each configuration and feature against the actual source code and deployed services before presenting the project as production-ready.
