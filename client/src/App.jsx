import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AccessibilityProvider } from './context/AccessibilityContext';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ProtectedRoute from './components/ProtectedRoute';

// Pages
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import DashboardPage from './pages/DashboardPage';
import SignToTextPage from './pages/SignToTextPage';
import TextToSpeechPage from './pages/TextToSpeechPage';
import SpeechToTextPage from './pages/SpeechToTextPage';
import LearnSignsPage from './pages/LearnSignsPage';
import QuickCommunicationPage from './pages/QuickCommunicationPage';
import SettingsPage from './pages/SettingsPage';
import AboutPage from './pages/AboutPage';

function App() {
  return (
    <AccessibilityProvider>
      <AuthProvider>
        <Router>
          <div className="flex flex-col min-h-screen bg-slate-950 text-slate-100 selection:bg-teal-500 selection:text-white">
            <Navbar />
            <main id="main-content" className="flex-1">
              <Routes>
                <Route path="/" element={<LandingPage />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />} />
                <Route 
                  path="/dashboard" 
                  element={
                    <ProtectedRoute>
                      <DashboardPage />
                    </ProtectedRoute>
                  } 
                />
                <Route path="/sign-to-text" element={<SignToTextPage />} />
                <Route path="/text-to-speech" element={<TextToSpeechPage />} />
                <Route path="/speech-to-text" element={<SpeechToTextPage />} />
                <Route path="/learn-signs" element={<LearnSignsPage />} />
                <Route path="/quick-communication" element={<QuickCommunicationPage />} />
                <Route path="/settings" element={<SettingsPage />} />
                <Route path="/about" element={<AboutPage />} />
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </main>
            <Footer />
          </div>
        </Router>
      </AuthProvider>
    </AccessibilityProvider>
  );
}

export default App;
