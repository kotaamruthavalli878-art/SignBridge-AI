import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Camera, 
  Volume2, 
  Mic, 
  BookOpen, 
  MessageSquare, 
  ShieldCheck, 
  Sparkles, 
  CheckCircle2, 
  ArrowRight, 
  Globe2, 
  Eye, 
  HeartHandshake,
  Activity,
  Layers
} from 'lucide-react';
import { useAccessibility } from '../context/AccessibilityContext';

const LandingPage = () => {
  const { t, language } = useAccessibility();

  const features = [
    {
      to: '/sign-to-text',
      icon: Camera,
      title: language === 'te' ? 'సంకేతం నుండి వచనం (Sign-to-Text)' : 'Sign-to-Text Recognition',
      desc: language === 'te' 
        ? 'వెబ్‌క్యామ్ ద్వారా చేతి సంకేతాలను గుర్తించి తెరపై వచనంగా ప్రదర్శిస్తుంది. నమ్మకమైన డెమో మోడ్ మరియు కాన్ఫిడెన్స్ స్కోర్లు.'
        : 'Webcam-based real-time gesture tracking and recognition for documented signs with confidence scores and transparent demo classification.',
      badge: 'Vision AI',
      color: 'from-teal-500 to-cyan-500',
    },
    {
      to: '/text-to-speech',
      icon: Volume2,
      title: language === 'te' ? 'వచనం నుండి మాట (Text-to-Speech)' : 'Text-to-Speech Synthesis',
      desc: language === 'te'
        ? 'వ్రాసిన సందేశాలను సహజమైన ఆడియో మాటగా మార్చండి. వేగం, పిచ్ మరియు ప్రాంతీయ స్వరాల ఎంపిక.'
        : 'Convert typed messages into natural audible speech with multi-language voices, adjustable pitch, and playback rate.',
      badge: 'Audio Output',
      color: 'from-blue-500 to-indigo-500',
    },
    {
      to: '/speech-to-text',
      icon: Mic,
      title: language === 'te' ? 'మాట నుండి వచనం (Speech-to-Text)' : 'Speech-to-Text Transcripts',
      desc: language === 'te'
        ? 'ఎదుటి వ్యక్తి మాట్లాడే మాటలను తక్షణమే తెరపై చదవదగిన వచనంగా మార్చి చూపుతుంది. పెద్ద అక్షరాల వ్యూ అందుబాటులో ఉంది.'
        : 'Microphone-driven live transcription so Deaf individuals can read spoken words in real time with high-contrast large display.',
      badge: 'Live Hearing Aid',
      color: 'from-emerald-500 to-teal-500',
    },
    {
      to: '/quick-communication',
      icon: MessageSquare,
      title: language === 'te' ? 'త్వరిత అత్యవసర సందేశాలు' : 'Quick Communication Cards',
      desc: language === 'te'
        ? 'ఆసుపత్రులు, కౌంటర్లు మరియు అత్యవసర సమయాల్లో ఒక్క క్లిక్‌తో చూపించడానికి సిద్ధంగా ఉన్న పెద్ద సందేశాలు.'
        : 'Pre-formatted emergency and service situation cards with full-screen large text display and instant voice readout.',
      badge: 'Emergency Ready',
      color: 'from-amber-500 to-orange-500',
    },
    {
      to: '/learn-signs',
      icon: BookOpen,
      title: language === 'te' ? 'సంకేత భాష నేర్చుకోండి' : 'Text-to-Sign Learning Library',
      desc: language === 'te'
        ? 'ఆరోగ్యం, అత్యవసరం, విద్య మరియు దైనందిన జీవితానికి సంబంధించిన ప్రామాణిక భారతీయ సంకేత భాష (ISL) సంకేతాలు.'
        : 'Curated library of verified Indian Sign Language (ISL) and ASL gestures with step-by-step hand posture guides.',
      badge: 'Education',
      color: 'from-purple-500 to-pink-500',
    },
    {
      to: '/settings',
      icon: Eye,
      title: language === 'te' ? 'సమగ్ర సౌలభ్య అమరికలు' : 'Accessibility Customization',
      desc: language === 'te'
        ? 'టెక్స్ట్ సైజు మార్పు, హై-కాంట్రాస్ట్ డార్క్ మోడ్, మోషన్ రిడక్షన్ మరియు పూర్తి తెలుగు/ఇంగ్లీష్ ఇంటర్‌ఫేస్.'
        : 'Customizable font sizing, true high-contrast modes, reduced motion switches, and screen-reader compliant accessibility.',
      badge: 'Inclusive UX',
      color: 'from-cyan-500 to-blue-500',
    },
  ];

  const stats = [
    { value: '70M+', label: 'Deaf People Globally', labelTe: 'ప్రపంచవ్యాప్తంగా బధిరులు' },
    { value: '80%+', label: 'Lack Interpreter Access in Public', labelTe: 'వ్యాఖ్యాత సౌకర్యం లేని పరిస్థితులు' },
    { value: '2 Languages', label: 'English & Telugu Interface', labelTe: 'ఇంగ్లీష్ & తెలుగు వేదిక' },
    { value: '100%', label: 'Privacy Protected (No Audio Saved)', labelTe: 'గోప్యతా భరోసా (డేటా నిల్వ ఉండదు)' },
  ];

  return (
    <div className="space-y-16 py-8">
      
      {/* Hero Section */}
      <section className="relative px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto text-center pt-8 pb-12">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-teal-500/10 border border-teal-500/30 text-teal-300 text-xs sm:text-sm font-semibold mb-6">
          <Sparkles className="w-4 h-4 text-teal-400" />
          <span>AI for Accessibility &amp; Inclusion • Complete Platform</span>
        </div>

        <h1 className="text-4xl sm:text-6xl font-heading font-extrabold text-white tracking-tight leading-[1.15] max-w-4xl mx-auto mb-6">
          {t('heroTitle')}
        </h1>

        <p className="text-lg sm:text-xl text-slate-300 max-w-2xl mx-auto leading-relaxed mb-10">
          {t('heroSubtitle')}
        </p>

        <div className="flex flex-wrap items-center justify-center gap-4">
          <Link
            to="/sign-to-text"
            className="flex items-center gap-2 px-6 py-3.5 rounded-xl bg-teal-500 text-slate-950 font-bold hover:bg-teal-400 transition-all shadow-lg shadow-teal-500/25 hover:scale-[1.02]"
          >
            <Camera className="w-5 h-5" />
            <span>{t('exploreWorkspaces')}</span>
            <ArrowRight className="w-4 h-4" />
          </Link>

          <Link
            to="/learn-signs"
            className="flex items-center gap-2 px-6 py-3.5 rounded-xl bg-slate-800 text-slate-100 font-semibold border border-slate-700 hover:bg-slate-700 hover:border-slate-600 transition-all hover:scale-[1.02]"
          >
            <BookOpen className="w-5 h-5 text-teal-400" />
            <span>{t('learnSigns')}</span>
          </Link>
        </div>

        {/* Ethical Transparency Banner */}
        <div className="mt-12 max-w-3xl mx-auto p-4 rounded-xl bg-slate-900/80 border border-slate-800 text-slate-300 text-xs sm:text-sm flex items-start sm:items-center gap-3 text-left">
          <ShieldCheck className="w-6 h-6 text-teal-400 flex-shrink-0 mt-0.5 sm:mt-0" />
          <p className="leading-relaxed">
            <strong className="text-white font-semibold">Honest AI Principle:</strong> {t('honestAiNotice')}
          </p>
        </div>
      </section>

      {/* Impact Stats */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
          {stats.map((stat, i) => (
            <div 
              key={i} 
              className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 text-center relative overflow-hidden group hover:border-teal-500/40 transition-colors"
            >
              <div className="text-3xl sm:text-4xl font-heading font-extrabold text-teal-400 mb-2">
                {stat.value}
              </div>
              <div className="text-xs sm:text-sm text-slate-300 font-medium">
                {language === 'te' ? stat.labelTe : stat.label}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Core Workspaces Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <h2 className="text-3xl font-heading font-bold text-white mb-4">
            Integrated Assistive Workspaces
          </h2>
          <p className="text-slate-300 text-sm sm:text-base">
            Every tool is designed to work standalone or cohesively during fast-paced hospital, university, or administrative interactions.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feat, index) => {
            const Icon = feat.icon;
            return (
              <Link
                key={index}
                to={feat.to}
                className="group p-6 rounded-2xl bg-slate-900/70 border border-slate-800 hover:border-teal-500/50 hover:bg-slate-900 transition-all flex flex-col justify-between hover:-translate-y-1 shadow-md hover:shadow-xl hover:shadow-teal-500/10"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-slate-800 to-slate-700 flex items-center justify-center text-teal-400 group-hover:scale-110 transition-transform">
                      <Icon className="w-6 h-6" />
                    </div>
                    <span className="px-2.5 py-1 rounded-full text-[11px] font-semibold bg-slate-800 text-slate-300 border border-slate-700">
                      {feat.badge}
                    </span>
                  </div>

                  <h3 className="text-xl font-heading font-bold text-white mb-2 group-hover:text-teal-300 transition-colors">
                    {feat.title}
                  </h3>

                  <p className="text-sm text-slate-300 leading-relaxed mb-6">
                    {feat.desc}
                  </p>
                </div>

                <div className="flex items-center gap-2 text-xs font-semibold text-teal-400 group-hover:text-teal-300">
                  <span>Open Workspace</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      {/* Target Environments & Personas */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="p-8 sm:p-12 rounded-3xl bg-gradient-to-br from-slate-900 via-slate-900/90 to-slate-950 border border-slate-800">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            <div>
              <span className="text-xs uppercase tracking-wider font-bold text-teal-400 mb-2 block">
                Real-World Public Impact
              </span>
              <h2 className="text-3xl font-heading font-bold text-white mb-4">
                Designed for High-Stakes Communication
              </h2>
              <p className="text-slate-300 leading-relaxed mb-6 text-sm sm:text-base">
                Deaf individuals face acute vulnerability in environments where misunderstandings cause delayed medical treatment, academic disorientation, or legal and bureaucratic frustration.
              </p>

              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-teal-400 flex-shrink-0 mt-0.5" />
                  <p className="text-sm text-slate-300">
                    <strong className="text-white">Hospitals &amp; Clinics:</strong> Immediate symptom reporting and medication direction comprehension without waiting hours for certified interpreters.
                  </p>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-teal-400 flex-shrink-0 mt-0.5" />
                  <p className="text-sm text-slate-300">
                    <strong className="text-white">Colleges &amp; Classrooms:</strong> Real-time lecture transcription, faculty question drafting, and classroom sign literacy.
                  </p>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-teal-400 flex-shrink-0 mt-0.5" />
                  <p className="text-sm text-slate-300">
                    <strong className="text-white">Government &amp; Civic Counters:</strong> High-contrast large-text requests for identity, certificates, transit, and police aid.
                  </p>
                </div>
              </div>
            </div>

            <div className="p-6 rounded-2xl bg-slate-950/70 border border-slate-800 space-y-4">
              <h4 className="text-base font-bold text-white flex items-center gap-2">
                <Layers className="w-5 h-5 text-teal-400" />
                SignBridge AI Modular Architecture
              </h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                Frontend client runs entirely client-side for ultra-low latency webcam tracking and audio synthesis. When connected to the Express backend, Google Gemini API provides intelligent plain-language text simplification and English-Telugu translation assistance.
              </p>
              
              <div className="grid grid-cols-2 gap-3 pt-2 text-xs">
                <div className="p-3 rounded-xl bg-slate-900 border border-slate-800">
                  <div className="font-semibold text-teal-300">Privacy Engine</div>
                  <div className="text-slate-400 text-[11px] mt-0.5">Zero video/audio storage</div>
                </div>
                <div className="p-3 rounded-xl bg-slate-900 border border-slate-800">
                  <div className="font-semibold text-teal-300">Resilient DB</div>
                  <div className="text-slate-400 text-[11px] mt-0.5">MongoDB Atlas + Memory</div>
                </div>
                <div className="p-3 rounded-xl bg-slate-900 border border-slate-800">
                  <div className="font-semibold text-teal-300">Bilingual Support</div>
                  <div className="text-slate-400 text-[11px] mt-0.5">English &amp; Telugu UI</div>
                </div>
                <div className="p-3 rounded-xl bg-slate-900 border border-slate-800">
                  <div className="font-semibold text-teal-300">Gemini 1.5 Flash</div>
                  <div className="text-slate-400 text-[11px] mt-0.5">Cognitive simplification</div>
                </div>
              </div>

              <div className="pt-2">
                <Link
                  to="/about"
                  className="text-xs text-teal-400 hover:text-teal-300 font-semibold flex items-center gap-1"
                >
                  Read complete architecture and limitations report &rarr;
                </Link>
              </div>
            </div>

          </div>
        </div>
      </section>

    </div>
  );
};

export default LandingPage;
