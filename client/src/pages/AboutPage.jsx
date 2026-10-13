import React from 'react';
import { Link } from 'react-router-dom';
import { 
  ShieldCheck, 
  AlertTriangle, 
  Sparkles, 
  CheckCircle2, 
  Layers, 
  Lock, 
  HeartHandshake, 
  ExternalLink,
  Cpu,
  BookOpen,
  ArrowRight
} from 'lucide-react';
import { useAccessibility } from '../context/AccessibilityContext';

const AboutPage = () => {
  const { t } = useAccessibility();

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-12">
      
      {/* Header */}
      <div>
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-500/10 border border-teal-500/30 text-teal-300 text-xs font-semibold mb-2">
          <ShieldCheck className="w-3.5 h-3.5 text-teal-400" />
          <span>Transparency &amp; Ethics Disclosure</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-heading font-extrabold text-white tracking-tight">
          About SignBridge AI &amp; Ethical AI Principles
        </h1>
        <p className="text-sm text-slate-300 mt-2 max-w-2xl leading-relaxed">
          The problem statement, platform architecture, privacy protections, and honest limitations of our accessibility technology.
        </p>
      </div>

      {/* 1. Problem Statement */}
      <section className="p-8 rounded-3xl bg-slate-900 border border-slate-800 space-y-4 shadow-xl">
        <h2 className="text-xl font-heading font-bold text-white flex items-center gap-2">
          <HeartHandshake className="w-5 h-5 text-teal-400" />
          The Accessibility Problem Statement
        </h2>
        <div className="text-sm text-slate-300 space-y-3 leading-relaxed">
          <p>
            Over <strong>70 million Deaf and hard-of-hearing individuals</strong> worldwide experience acute communication barriers every day. In critical public environments—such as <strong>emergency triage hospitals, university classrooms, police stations, courtrooms, and government welfare counters</strong>—the vast majority of hearing staff do not understand sign language.
          </p>
          <p>
            Certified sign language interpreters are scarce and rarely available on immediate demand. This delay causes severe consequences: medical misdiagnoses, academic falling-behind, missed civic rights, and emotional distress. SignBridge AI was engineered to bridge this gap with instant, autonomous communication tools.
          </p>
        </div>
      </section>

      {/* 2. Honest AI Disclosure & Limitations */}
      <section className="p-8 rounded-3xl bg-slate-900 border border-slate-800 space-y-4 shadow-xl">
        <div className="flex items-center gap-2 text-amber-400 font-bold text-base">
          <AlertTriangle className="w-5 h-5" />
          <span>Honest AI Capabilities &amp; Technical Boundaries</span>
        </div>

        <div className="text-sm text-slate-300 space-y-3 leading-relaxed">
          <p>
            Many AI demos claim to be "universal sign language translators" using generic image description models. In accessibility engineering, <strong>this is ethically unacceptable and factually false</strong>.
          </p>
          
          <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-200 text-xs space-y-2">
            <p className="font-bold text-white">Why Sign Recognition Requires Transparent Engineering:</p>
            <ul className="list-disc list-inside space-y-1">
              <li>Natural sign languages (such as Indian Sign Language - ISL, or ASL) are fully formed independent natural languages with their own grammar, non-manual facial grammatical markers, and 3D spatial referencing.</li>
              <li>A system recognizing isolated hand shapes is an <strong>assistive gesture classifier</strong>, not a full grammatical translator.</li>
              <li>SignBridge AI avoids deceptive claims: our webcam workspace features a transparent, tested computer vision demo with 9 documented essential signs and confidence metrics.</li>
            </ul>
          </div>

          <p>
            When generative AI is used (via Google Gemini API), it is strictly applied to appropriate tasks: <strong>simplifying complex medical jargon into plain language, drafting courteous messages, and assisting with text translation</strong>.
          </p>
        </div>
      </section>

      {/* 3. Privacy & Zero-Retention Architecture */}
      <section className="p-8 rounded-3xl bg-slate-900 border border-slate-800 space-y-4 shadow-xl">
        <h2 className="text-xl font-heading font-bold text-white flex items-center gap-2">
          <Lock className="w-5 h-5 text-teal-400" />
          Strict Privacy &amp; Data Ethics Guarantee
        </h2>
        <div className="text-sm text-slate-300 space-y-3 leading-relaxed">
          <p>
            Assistive tools handle sensitive communication in hospitals and legal settings. Our architecture enforces a strict zero-retention guarantee:
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 text-xs">
            <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800">
              <span className="font-bold text-teal-300 block mb-1">100% Client-Side Vision</span>
              <span className="text-slate-400">Webcam frames never leave your browser memory and are discarded frame-by-frame.</span>
            </div>
            <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800">
              <span className="font-bold text-teal-300 block mb-1">Local Speech Synthesis</span>
              <span className="text-slate-400">Speech-to-text and text-to-speech execute via native browser APIs without server transmission.</span>
            </div>
            <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800">
              <span className="font-bold text-teal-300 block mb-1">Secure Password Hashes</span>
              <span className="text-slate-400">Passwords are salted and hashed using bcrypt; credentials are never logged or exported.</span>
            </div>
            <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800">
              <span className="font-bold text-teal-300 block mb-1">Encrypted Environment Secrets</span>
              <span className="text-slate-400">All database keys and Gemini tokens reside strictly in the Express backend environment.</span>
            </div>
          </div>
        </div>
      </section>

      {/* 4. Complete Technology Stack */}
      <section className="p-8 rounded-3xl bg-slate-900 border border-slate-800 space-y-4 shadow-xl">
        <h2 className="text-xl font-heading font-bold text-white flex items-center gap-2">
          <Cpu className="w-5 h-5 text-teal-400" />
          Engineering Technology Stack
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2 text-xs">
          <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
            <span className="font-bold text-teal-300 text-sm block">Frontend</span>
            <ul className="space-y-1 text-slate-300">
              <li>• React.js (Vite)</li>
              <li>• React Router v7</li>
              <li>• Tailwind CSS &amp; Accessible CSS</li>
              <li>• Lucide React Icons</li>
              <li>• Web Speech APIs</li>
            </ul>
          </div>

          <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
            <span className="font-bold text-blue-300 text-sm block">Backend &amp; Security</span>
            <ul className="space-y-1 text-slate-300">
              <li>• Node.js &amp; Express.js (ESM)</li>
              <li>• JWT Token Authentication</li>
              <li>• bcrypt Password Hashing</li>
              <li>• Zod Input Validation</li>
              <li>• Express Rate Limiting &amp; Helmet</li>
            </ul>
          </div>

          <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
            <span className="font-bold text-purple-300 text-sm block">Database &amp; AI</span>
            <ul className="space-y-1 text-slate-300">
              <li>• MongoDB Atlas with Mongoose</li>
              <li>• Resilient Memory Fallback Store</li>
              <li>• Google Gemini 1.5 Flash API</li>
              <li>• Verified ISL Seed Database</li>
              <li>• Client-side Computer Vision</li>
            </ul>
          </div>
        </div>
      </section>

      {/* 5. Production Model Integration Path */}
      <section className="p-8 rounded-3xl bg-slate-900 border border-slate-800 space-y-4 shadow-xl">
        <h2 className="text-xl font-heading font-bold text-white flex items-center gap-2">
          <Layers className="w-5 h-5 text-teal-400" />
          How to Connect a Production MediaPipe / TensorFlow Model
        </h2>
        <div className="text-sm text-slate-300 space-y-3 leading-relaxed">
          <p>
            SignBridge AI was built with a clean modular separation of vision tracking and inference. To attach a trained multi-class sign language deep neural network:
          </p>
          <ol className="list-decimal list-inside space-y-1.5 text-xs text-slate-300 pl-1">
            <li>Install `@mediapipe/hands` and `@tensorflow/tfjs` in `client/package.json`.</li>
            <li>In `client/src/pages/SignToTextPage.jsx`, connect the 21 3D coordinate hand landmarks directly into the model's `.predict()` tensor pipeline.</li>
            <li>Map model softmax class outputs to the `SUPPORTED_SIGNS` dictionary.</li>
            <li>All transcript builders, TTS audio feedback, and translation features are already wired to consume the outputs seamlessly!</li>
          </ol>
        </div>
      </section>

      {/* Bottom Navigation */}
      <div className="pt-4 flex items-center justify-between">
        <Link
          to="/"
          className="text-xs text-slate-400 hover:text-white transition-colors"
        >
          &larr; Back to Home
        </Link>
        <Link
          to="/sign-to-text"
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-teal-500 text-slate-950 font-bold text-xs hover:bg-teal-400 transition-colors shadow-md shadow-teal-500/20"
        >
          <span>Open Sign-to-Text Workspace</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>

    </div>
  );
};

export default AboutPage;
