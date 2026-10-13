# SignBridge AI — Hackathon Submission

**Theme:** AI for Accessibility & Inclusion  
**Project Type:** AI-Powered Accessibility Web Application

---

## 1. Problem Statement

Deaf and hard-of-hearing individuals can face communication barriers in hospitals, colleges, courts, police stations, and government service counters. In these situations, hearing individuals may not understand sign language, and qualified interpreters may not be immediately available.

These barriers can lead to:
- Delays in communicating healthcare needs.
- Difficulties participating in educational activities.
- Challenges accessing public and civic services.
- Dependence on handwritten notes or other communication methods.

SignBridge AI aims to make everyday communication more accessible by providing a web-based platform that combines hand detection, text-to-speech, speech-to-text, and visual communication aids.

## 2. Solution Description

**SignBridge AI** is an accessibility-focused web application designed to support communication between sign-language users and hearing individuals.

The project includes the following features, subject to the capabilities available in the deployed version:

1. **Sign-to-Text Workspace:** Uses webcam input and MediaPipe hand landmarks to detect hand positions and classify a limited set of basic gesture patterns.
2. **Text-to-Speech:** Uses browser speech synthesis to read typed messages aloud where supported.
3. **Speech-to-Text:** Provides speech transcription through supported browser speech-recognition APIs.
4. **Sign Learning Library:** Provides a place to explore sign-language learning content available in the application.
5. **Quick Communication Cards:** Offers common phrases that users can display to communicate basic needs.
6. **English and Telugu Support:** Provides language-related accessibility features where implemented.
7. **AI-Assisted Text Support:** May provide text simplification or message drafting when the required AI service and API configuration are available.
8. **Accessibility Options:** Provides interface accessibility settings where available, such as text-size adjustments and contrast controls.

The project is intended as an assistive communication prototype. It does not replace professional interpreters, medical advice, or emergency services.

## 3. GitHub Repository

**Public Repository:**  
https://github.com/kotaamruthavalli878-art/SignBridge-AI

The repository contains the frontend and backend source code, project documentation, and configuration files.

## 4. Deployed Application

**Frontend Application (Vercel):**  
https://sign-bridge-ai-swart.vercel.app

**Backend Service (Render):**  
https://signbridge-ai-c9o3.onrender.com

**Deployment Status:** The frontend deployment was reported as Ready in Vercel. The backend and application features should be tested independently before final evaluation.

## 5. Demo Video

**Demo Video URL:** To be added after recording and uploading the project demonstration.

If the submission rules require a demo video, upload it to an accepted platform such as YouTube, Loom, or Google Drive and replace this line with the accessible link.

### Suggested Demo Plan (3–5 Minutes)

| Time | Section | Demonstration |
|---|---|---|
| 0:00–0:30 | Introduction | Explain the communication-accessibility problem and the project's goal. |
| 0:30–1:00 | Application overview | Open the deployed application and show the available interface. |
| 1:00–2:00 | Communication features | Demonstrate working hand detection, text-to-speech, speech-to-text, and quick communication cards. Skip any feature that does not work reliably. |
| 2:00–3:00 | AI and learning features | Demonstrate available learning or AI features only when they are configured and functioning. |
| 3:00–4:00 | Accessibility | Show the accessibility options that work in the deployed version. |
| 4:00–5:00 | Technology and limitations | Explain the technology stack, current prototype limitations, and future development plans. |

## 6. Technology Stack

### Frontend
- React
- Vite
- JavaScript
- CSS and the styling libraries used by the project
- React Router, where used
- Lucide React icons, where used
- Browser APIs for camera access, speech synthesis, and speech recognition where supported

### Backend
- Node.js
- Express.js
- JavaScript ES modules
- Authentication, validation, security middleware, and logging as configured in the source code

### Data Storage
- The project's configured data-storage implementation
- In-memory storage fallback where supported by the backend

### Computer Vision and AI
- MediaPipe Tasks Vision for client-side hand landmark detection
- Basic gesture classification logic in the frontend prototype
- Google Gemini integration only when correctly configured and available

## 7. Current Limitations

1. **Limited Gesture Classification:** Basic hand-shape classification is not equivalent to full Indian Sign Language (ISL) recognition.
2. **No Claim of Full ISL Translation:** Accurate sign-language translation requires validated data and models that account for movement, hand orientation, facial expressions, and context.
3. **Browser Compatibility:** Camera access and speech features depend on browser support and user permissions.
4. **AI Service Availability:** AI features that depend on external services require valid configuration and network access.
5. **Recognition Accuracy:** No accuracy percentage is claimed without systematic testing against a suitable evaluation dataset.
6. **Assistive Use:** The prototype should not be relied on as the sole communication method for critical medical, legal, or emergency decisions.

## 8. Future Scope

1. Train and evaluate a dedicated model for a clearly defined set of Indian Sign Language signs.
2. Expand recognition to dynamic gestures and sequences using validated datasets.
3. Improve multilingual accessibility and translation support.
4. Develop an offline-capable Progressive Web App for low-connectivity environments.
5. Add more sign-language learning resources reviewed by qualified contributors.
6. Conduct usability and accessibility testing with Deaf and hard-of-hearing users.

## 9. Privacy and Responsible Use

Camera and microphone features should be used only with the user's permission. Before claiming that the application never stores audio or video, verify the behavior of the frontend, backend, logs, and any third-party services.

The application is an assistive prototype and should be evaluated for accuracy, privacy, security, and accessibility before use in high-stakes environments.

## 10. Setup Instructions

For local development:

1. Clone the repository:
   ```bash
   git clone https://github.com/kotaamruthavalli878-art/SignBridge-AI.git
   cd SignBridge-AI
   ```
2. Install the frontend dependencies:
   ```bash
   cd client
   npm install
   ```
3. Start the frontend using the available project script:
   ```bash
   npm run dev
   ```
4. Configure and start the backend separately using the instructions in the backend documentation and the required environment variables.
5. Never commit API keys, passwords, or other secrets to the public repository.

Check the README and deployment documentation for the project's current configuration details.

## 11. Conclusion

SignBridge AI explores how web technologies, computer vision, speech tools, and accessible interface design can support communication inclusion.

The current project is a prototype, and its capabilities should be evaluated based on the features that work reliably in the deployed application. Future development will focus on validated sign recognition, usability, privacy, and broader accessibility.

---