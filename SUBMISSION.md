# SignBridge AI — Hackathon Submission

**AI for Accessibility & Inclusion | Complete Hackathon Assignment**

---

## 1. Problem Statement

Deaf and hard-of-hearing individuals frequently experience severe communication barriers in high-stakes public settings, including **hospitals, colleges, courts, police stations, and government service counters**. In these environments, people around them rarely understand sign language, and qualified interpreters are seldom available on immediate notice. 

This communication gap results in:
- Delayed emergency healthcare triage and medication misunderstandings.
- Educational disengagement and classroom isolation for deaf students.
- Deprivation of civic services and legal representation.
- Heightened vulnerability and reliance on hurried handwritten notes.

Communication equity is a fundamental human right. SignBridge AI provides an autonomous, real-time multimodal bridge so Deaf individuals and hearing public workers can converse seamlessly and respectfully.

---

## 2. Solution Description

**SignBridge AI** is an AI-powered accessibility platform engineered to support fluid two-way communication between sign-language users and hearing individuals. The application combines:

1. **Sign-to-Text Recognition Workspace**: Webcam-based computer vision tracking classifying documented sample sign gestures with real-time confidence metrics, uncertainty alerts, and sentence compilation.
2. **Text-to-Speech (TTS) Engine**: High-fidelity speech synthesizer converting typed statements into spoken audio with language, pitch, and rate customizations.
3. **Speech-to-Text (STT) Hearing Aid**: Real-time microphone listener that transcribes spoken responses into high-contrast text transcripts with interim and final streaming display.
4. **Text-to-Sign Learning Library**: Verified dictionary of Indian Sign Language (ISL) and universal signs across Healthcare, Emergency, Education, and Daily Life with step-by-step motion breakdowns.
5. **Quick Situation Emergency Cards**: Instant one-tap phrase cards ("I need help", "Call a doctor", "Please write it down") equipped with a **Fullscreen High-Visibility Large Text Mode** designed for reception counters.
6. **Multilingual Support (English & Telugu)**: Full interface translation toggle between English and Telugu (`తెలుగు`), with speech synthesis and translation helpers.
7. **Cognitive Accessibility AI**: Modular Google Gemini API integration for simplifying complex bureaucratic or medical text into accessible plain language and drafting polite situation cards.
8. **Universal Accessibility Customizations**: Scalable typography (Normal, Large, Extra Large), WCAG AAA High-Contrast mode, reduced-motion controls, and keyboard skip navigation.

---

## 3. GitHub Repository

> [!NOTE]  
> Replace the placeholder below with the actual public repository URL after pushing to GitHub.

```
https://github.com/<your-username>/signbridge-ai
```

*(Local repository is fully prepared with `.gitignore`, clean git history, and separate `client/` and `server/` structures).*

---

## 4. Deployed Application Link

> [!NOTE]  
> Replace the placeholders below with the actual live deployment URLs after publishing.

- **Frontend Application (Vercel / Netlify)**:  
  `https://signbridge-ai.vercel.app` *(Placeholder — to be filled after Vercel deployment)*
- **Backend API (Render / Railway)**:  
  `https://signbridge-api.onrender.com` *(Placeholder — to be filled after Render deployment)*
- **Backend Live Health Check Endpoint**:  
  `https://signbridge-api.onrender.com/api/health`

---

## 5. Demo Video

> [!NOTE]  
> Replace the placeholder below with the uploaded video link (YouTube / Loom / Google Drive) after recording.

```
https://youtu.be/<your-demo-video-id>
```

### 3–5 Minute Video Script & Recording Checklist

| Timestamp | Video Section | Narration & Visual Actions |
|---|---|---|
| **0:00–0:30** | **The Accessibility Problem** | **Visual**: Show emergency room / public office scenario. <br>**Narration**: "70 million Deaf people face daily communication barriers in hospitals, colleges, and civic counters where hearing people do not know sign language and interpreters are absent." |
| **0:30–1:00** | **Introducing SignBridge AI** | **Visual**: Show SignBridge AI landing page, highlight tagline, and switch language between English and Telugu (`తెలుగు`). <br>**Narration**: "SignBridge AI is an AI-powered accessibility platform bridging silent voices and hearing communities through real-time vision, speech, and multilingual aids." |
| **1:00–2:00** | **Live Communication Features** | **Visual**: <br>1. Open **Sign-to-Text Workspace**, start camera, test gesture detection, show confidence score (92%), and append to transcript. <br>2. Open **Text-to-Speech**, type a message, play vocal audio. <br>3. Open **Speech-to-Text**, speak into mic, show real-time transcription. <br>4. Open **Quick Communication**, tap "Call a Doctor", toggle Fullscreen Large Text view. |
| **2:00–3:00** | **AI Integration & Honest Limitations** | **Visual**: Open AI Smart Message Drafter and AI Plain Language Simplifier. <br>**Narration**: "Explain our ethical AI commitment: We use Google Gemini to rewrite complex medical instructions into plain accessible language. We are honest that natural sign language has rich 3D grammar; our webcam demo recognizes documented sample signs without hallucinating." |
| **3:00–4:00** | **Accessibility Settings & Workflow** | **Visual**: Open **Accessibility Settings**, cycle Font Size (Normal -> Large -> XL), toggle High-Contrast Dark Mode, toggle Reduced Motion. Open **Sign Learning Library**, search for 'Doctor' and 'Help', open Step-by-Step guide modal. |
| **4:00–5:00** | **Tech Stack, Social Impact & Future Scope** | **Visual**: Show authenticated Dashboard, review the MERN + Gemini stack, explain zero-retention privacy policy (no audio/video stored), and outline future production MediaPipe model scaling. |

---

## 6. Technology Stack

### Frontend
- **Framework**: React.js 19 with Vite 8
- **Routing**: React Router v7
- **Styling**: Tailwind CSS + Custom WCAG-compliant Vanilla CSS variables
- **Icons**: Lucide React
- **HTTP Client**: Axios with JWT Bearer interceptor
- **Browser APIs**: Web Speech Synthesis API (`window.speechSynthesis`), Web Speech Recognition API (`window.SpeechRecognition`), HTML5 Canvas & MediaDevices WebRTC API

### Backend
- **Runtime**: Node.js v24 (ES Modules)
- **Web Framework**: Express.js 4
- **Authentication**: JSON Web Tokens (`jsonwebtoken`) & `bcryptjs` password hashing
- **Input Validation**: Zod schema validation middleware
- **Security & Reliability**: Helmet, CORS, Express Rate Limit (`express-rate-limit`), Morgan logger

### Database
- **Primary Cloud DB**: MongoDB Atlas using Mongoose 8
- **Resilient Fallback**: In-Memory Store Adapter (ensures 100% functionality during local evaluation even prior to cloud Atlas connection)

### Artificial Intelligence & Computer Vision
- **Generative AI Provider**: Google Gemini API (`gemini-1.5-flash`) via backend modular service
- **AI Tasks**: Plain-language cognitive text simplification, English-Telugu assistive translation, contextual quick message drafting
- **Computer Vision**: Client-side HTML5 Canvas gesture centroid and landmark tracking

---

## 7. Limitations and Future Scope

### Honest Technical Limitations
1. **Sign Language Scope**: The active webcam recognition module is an assistive classifier trained on 9 documented essential signs (Namaste/Hello, Thank You, Help, Doctor, Water, Yes, No, I Am Deaf, Peace/OK). Natural sign languages (such as full ISL and ASL) comprise thousands of words, grammatical facial expressions, and spatial referencing that cannot be equated to single-hand gestures.
2. **Browser Speech Recognition**: Web Speech Recognition API requires Chromium-based browsers (Google Chrome, Microsoft Edge) or Safari for native voice-to-text. Fallback notices are rendered on other browsers.
3. **AI Fallback Mode**: When a live `GEMINI_API_KEY` is not provided in the backend `.env`, the platform automatically operates in deterministic offline heuristic mode, ensuring zero crashes while clearly notifying the user.

### Future Scope
1. **MediaPipe / TensorFlow.js Graph Integration**: Connect 21 3D hand landmarks directly to a trained deep neural network for continuous spatial sign translation.
2. **Two-Way Video Avatar Synthesis**: Rendering 3D animated avatars that translate typed text directly into animated Indian Sign Language motions.
3. **Offline Mobile PWA**: Packaging SignBridge AI as an offline-first Progressive Web App for rural healthcare workers with intermittent internet connectivity.
4. **Expanded Regional Sign Dialects**: Incorporating regional Indian sign dialect variations across state education boards.
