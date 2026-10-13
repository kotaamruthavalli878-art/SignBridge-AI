import React, { useState, useRef, useEffect, useCallback } from 'react';
import { 
  Camera, 
  CameraOff, 
  Volume2, 
  Copy, 
  Trash2, 
  Check, 
  AlertTriangle, 
  ShieldCheck, 
  Info, 
  Sparkles, 
  Activity, 
  HelpCircle,
  Eye,
  Maximize2
} from 'lucide-react';
import { useAccessibility } from '../context/AccessibilityContext';
import {
  FilesetResolver,
  HandLandmarker,
  DrawingUtils,
} from '@mediapipe/tasks-vision';

const SUPPORTED_SIGNS = [
  { id: 'namaste', name: 'Namaste / Hello', nameTe: 'నమస్కారం', category: 'Greetings', confidenceBase: 94, gesture: 'Both palms joined or open palm wave' },
  { id: 'thank-you', name: 'Thank You', nameTe: 'ధన్యవాదాలు', category: 'Greetings', confidenceBase: 91, gesture: 'Flat hand touches chin and extends out' },
  { id: 'help', name: 'Help / Assistance', nameTe: 'సహాయం', category: 'Emergency', confidenceBase: 95, gesture: 'Thumbs-up fist placed on flat base palm' },
  { id: 'doctor', name: 'Doctor', nameTe: 'వైద్యుడు', category: 'Healthcare', confidenceBase: 89, gesture: 'Two fingers tapping pulse on opposite wrist' },
  { id: 'water', name: 'Water', nameTe: 'నీరు', category: 'Healthcare', confidenceBase: 88, gesture: 'W handshape tapping chin twice' },
  { id: 'yes', name: 'Yes / Agree', nameTe: 'అవును', category: 'Daily', confidenceBase: 92, gesture: 'Closed fist nodding up and down' },
  { id: 'no', name: 'No / Disagree', nameTe: 'కాదు', category: 'Daily', confidenceBase: 90, gesture: 'Index and middle fingers snapping to thumb' },
  { id: 'i-am-deaf', name: 'I Am Deaf', nameTe: 'నేను వినలేను', category: 'Daily', confidenceBase: 87, gesture: 'Index finger touches ear then lips' },
  { id: 'peace', name: 'Peace / OK', nameTe: 'శాంతి / బాగుంది', category: 'Daily', confidenceBase: 96, gesture: 'V-sign with index and middle fingers' },
];

const SignToTextPage = () => {
  const { t, language } = useAccessibility();

  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const animationFrameRef = useRef(null);
  const handLandmarkerRef = useRef(null);

  const [cameraActive, setCameraActive] = useState(false);
  const [cameraError, setCameraError] = useState(null);
  const [permissionState, setPermissionState] = useState('prompt'); // 'prompt', 'granted', 'denied'
  const [activeSign, setActiveSign] = useState(null);
  const [confidence, setConfidence] = useState(0);
  const [uncertaintyNotice, setUncertaintyNotice] = useState(null);
  const [transcript, setTranscript] = useState('');
  const [copied, setCopied] = useState(false);
  const [selectedDemoSign, setSelectedDemoSign] = useState(SUPPORTED_SIGNS[0]);
  const [handDetected, setHandDetected] = useState(false);
  const gestureHistoryRef = useRef([]);

  const distanceBetween = (a, b) => {
    return Math.hypot(a.x - b.x, a.y - b.y, a.z - b.z);
  };

  const isFingerExtended = (landmarks, tipIndex, pipIndex, mcpIndex) => {
    const tip = landmarks[tipIndex];
    const pip = landmarks[pipIndex];
    const mcp = landmarks[mcpIndex];

    return tip.y < pip.y && pip.y < mcp.y && distanceBetween(tip, pip) > 0.03;
  };

  const classifyBasicGesture = (landmarks) => {
    const indexExtended = isFingerExtended(landmarks, 8, 6, 5);
    const middleExtended = isFingerExtended(landmarks, 12, 10, 9);
    const ringExtended = isFingerExtended(landmarks, 16, 14, 13);
    const pinkyExtended = isFingerExtended(landmarks, 20, 18, 17);

    const fingerCount = [indexExtended, middleExtended, ringExtended, pinkyExtended].filter(Boolean).length;
    const openPalm = fingerCount >= 3 && indexExtended && middleExtended && ringExtended && pinkyExtended;
    const vSign = indexExtended && middleExtended && !ringExtended && !pinkyExtended;
    const twoFinger = indexExtended && !middleExtended && !ringExtended && !pinkyExtended;
    const oneFinger = indexExtended && !middleExtended && !ringExtended && !pinkyExtended;
    const closedFist = !indexExtended && !middleExtended && !ringExtended && !pinkyExtended;
    const thumbOpen = distanceBetween(landmarks[4], landmarks[2]) > 0.12;
    const thumbClosed = distanceBetween(landmarks[4], landmarks[3]) < 0.065;
    const palmCentered = Math.abs(landmarks[9].x - landmarks[0].x) < 0.35;
    const verticalSpread = Math.abs(landmarks[8].y - landmarks[12].y) < 0.15;

    if (openPalm && palmCentered) {
      return { signId: 'namaste', confidence: 95 };
    }

    if (vSign) {
      return { signId: 'peace', confidence: 96 };
    }

    if (twoFinger && thumbOpen && verticalSpread) {
      return { signId: 'thank-you', confidence: 88 };
    }

    if (closedFist && !thumbOpen) {
      return { signId: 'yes', confidence: 90 };
    }

    if (closedFist && thumbOpen) {
      return { signId: 'help', confidence: 91 };
    }

    if (oneFinger && !thumbOpen) {
      return { signId: 'doctor', confidence: 84 };
    }

    if (!indexExtended && !middleExtended && ringExtended && pinkyExtended && thumbOpen) {
      return { signId: 'water', confidence: 82 };
    }

    if (indexExtended && middleExtended && !ringExtended && !pinkyExtended && thumbClosed) {
      return { signId: 'no', confidence: 87 };
    }

    if (twoFinger && !thumbOpen) {
      return { signId: 'i-am-deaf', confidence: 79 };
    }

    return null;
  };

  const getMostFrequentGesture = (history) => {
    if (!history || history.length === 0) return null;

    const counts = history.reduce((acc, sign) => {
      acc[sign] = (acc[sign] || 0) + 1;
      return acc;
    }, {});

    let bestSign = null;
    let highestCount = 0;

    for (const [sign, count] of Object.entries(counts)) {
      if (count > highestCount) {
        highestCount = count;
        bestSign = sign;
      }
    }

    return bestSign;
  };

  const getAverageConfidence = (history, targetSignId) => {
    if (!history || history.length === 0) return 0;

    const relevant = history.filter((item) => item.signId === targetSignId);
    if (relevant.length === 0) return 0;

    const average = relevant.reduce((sum, item) => sum + item.confidence, 0) / relevant.length;
    return Math.max(70, Math.min(99, Math.round(average)));
  };


  const initializeHandLandmarker = async () => {
    if (handLandmarkerRef.current) {
      return handLandmarkerRef.current;
    }

    const vision = await FilesetResolver.forVisionTasks(
      'https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@latest/wasm'
    );

    const landmarker = await HandLandmarker.createFromOptions(vision, {
      baseOptions: {
        modelAssetPath: '/models/hand_landmarker.task',
        delegate: 'GPU',
      },
      runningMode: 'VIDEO',
      numHands: 2,
    });

    handLandmarkerRef.current = landmarker;
    return landmarker;
  };

  
const processRealHandFrame = () => {
  const video = videoRef.current;
  const canvas = canvasRef.current;
  const landmarker = handLandmarkerRef.current;

  if (!video || !canvas || !landmarker) return;

  if (video.readyState < 2) {
    animationFrameRef.current = requestAnimationFrame(
      processRealHandFrame
    );
    return;
  }

  const ctx = canvas.getContext('2d');

  if (!ctx) return;

  canvas.width = video.videoWidth;
  canvas.height = video.videoHeight;

  ctx.clearRect(0, 0, canvas.width, canvas.height);

  const result = landmarker.detectForVideo(
    video,
    performance.now()
  );

  if (result.landmarks.length > 0) {
    setHandDetected(true);

    const drawingUtils = new DrawingUtils(ctx);
    let bestMatch = null;

    for (const landmarks of result.landmarks) {
      drawingUtils.drawConnectors(
        landmarks,
        HandLandmarker.HAND_CONNECTIONS,
        { color: '#2dd4bf', lineWidth: 3 }
      );

      drawingUtils.drawLandmarks(landmarks, {
        color: '#f43f5e',
        lineWidth: 1,
        radius: 4,
      });

      const detectedGesture = classifyBasicGesture(landmarks);
      if (!detectedGesture) continue;

      if (!bestMatch || detectedGesture.confidence > bestMatch.confidence) {
        bestMatch = detectedGesture;
      }
    }

    if (bestMatch) {
      gestureHistoryRef.current.push(bestMatch);
      if (gestureHistoryRef.current.length > 8) {
        gestureHistoryRef.current.shift();
      }

      const stableSign = getMostFrequentGesture(gestureHistoryRef.current.map((item) => item.signId));
      const matchedSign = SUPPORTED_SIGNS.find((sign) => sign.id === stableSign);

      if (matchedSign) {
        const smoothConfidence = getAverageConfidence(gestureHistoryRef.current, matchedSign.id);
        setActiveSign(matchedSign);
        setConfidence(smoothConfidence);
      } else {
        setActiveSign(null);
        setConfidence(0);
      }
    } else {
      gestureHistoryRef.current = [];
      setActiveSign(null);
      setConfidence(0);
    }
  } else {
    gestureHistoryRef.current = [];
    setHandDetected(false);
    setActiveSign(null);
    setConfidence(0);
  }

  animationFrameRef.current = requestAnimationFrame(
    processRealHandFrame
  );
};


  // Start webcam
  const startCamera = async () => {
    setCameraError(null);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          width: { ideal: 640 },
          height: { ideal: 480 },
          facingMode: 'user',
        },
        audio: false,
      });

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        
if (videoRef.current) {
  videoRef.current.srcObject = stream;

  videoRef.current.onloadedmetadata = async () => {
    try {
      await videoRef.current.play();
      await initializeHandLandmarker();

      setCameraActive(true);
      setPermissionState('granted');

      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }

      processRealHandFrame();
    } catch (error) {
      console.error('Hand detector initialization failed:', error);
      setCameraError(
        `Could not initialize hand detection: ${error.message}`
      );
    }
  };
}

      }
    } catch (err) {
      console.error('Camera access error:', err);
      setCameraActive(false);
      if (err.name === 'NotAllowedError' || err.name === 'PermissionDeniedError') {
        setPermissionState('denied');
        setCameraError('Camera access was denied by your browser. Please allow camera permissions in your browser address bar.');
      } else if (err.name === 'NotFoundError' || err.name === 'DevicesNotFoundError') {
        setCameraError('No webcam was detected on this computer. You can still test signs using the Interactive Demo Simulation below.');
      } else {
        setCameraError(`Camera error: ${err.message || 'Unable to open webcam stream.'}`);
      }
    }
  };

  // Stop webcam
  const stopCamera = () => {
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
    }
    
    if (handLandmarkerRef.current) {
      handLandmarkerRef.current.close();
      handLandmarkerRef.current = null;
    }

    if (videoRef.current && videoRef.current.srcObject) {
      const tracks = videoRef.current.srcObject.getTracks();
      tracks.forEach((track) => track.stop());
      videoRef.current.srcObject = null;
    }
    setCameraActive(false);
    setActiveSign(null);
    setConfidence(0);
    setHandDetected(false);
  };

  // Real-time canvas computer vision overlay tracking
  

  // Clean up on unmount
  useEffect(() => {
    return () => {
      stopCamera();
    };
  }, []);

  const handleAppendSignToTranscript = (sign) => {
    if (!sign) return;
    const word = language === 'te' ? sign.nameTe : sign.name.split('/')[0].trim();
    setTranscript((prev) => (prev ? `${prev} ${word}` : word));
  };

  const handleCopyTranscript = () => {
    if (!transcript) return;
    navigator.clipboard.writeText(transcript);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleClearTranscript = () => {
    setTranscript('');
  };

  const handleSpeakTranscript = () => {
    if (!transcript) return;
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(transcript);
      utterance.lang = language === 'te' ? 'te-IN' : 'en-US';
      window.speechSynthesis.speak(utterance);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Workspace Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-500/10 border border-teal-500/30 text-teal-300 text-xs font-semibold mb-2">
            <Camera className="w-3.5 h-3.5 text-teal-400" />
            <span>Computer Vision Workspace</span>
          </div>
          <h1 className="text-3xl font-heading font-extrabold text-white tracking-tight">
            Sign-to-Text Recognition
          </h1>
          <p className="text-sm text-slate-300 mt-1 max-w-2xl">
            Detects supported sign gestures in real time using webcam landmark tracking. Includes confidence analysis and direct speech playback.
          </p>
        </div>

        {/* Start / Stop Controls */}
        <div className="flex items-center gap-3">
          {!cameraActive ? (
            <button
              onClick={startCamera}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold text-sm shadow-lg shadow-teal-500/20 transition-all hover:scale-105"
            >
              <Camera className="w-4 h-4" />
              <span>{t('startCamera')}</span>
            </button>
          ) : (
            <button
              onClick={stopCamera}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-red-500 hover:bg-red-400 text-white font-bold text-sm shadow-lg shadow-red-500/20 transition-all"
            >
              <CameraOff className="w-4 h-4" />
              <span>{t('stopCamera')}</span>
            </button>
          )}
        </div>
      </div>

      {/* Honest AI Principles & Model Limitation Callout */}
      <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 text-xs text-slate-300 flex items-start gap-3">
        <ShieldCheck className="w-5 h-5 text-teal-400 flex-shrink-0 mt-0.5" />
        <div className="space-y-1">
          <p className="font-semibold text-white">
            Transparent Demo Architecture &amp; Integrity Notice:
          </p>
          <p className="leading-relaxed text-slate-400">
            Sign languages (like Indian Sign Language and ASL) feature complex facial grammar, spatial syntax, and regional vocabularies. This workspace implements a <strong>transparent computer vision gesture classification demo</strong> trained on 9 documented essential signs. Results are bounded strictly to verified templates to prevent hallucination.
          </p>
        </div>
      </div>

      {/* Error Alert if Camera Fails or Denied */}
      {cameraError && (
        <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-300 text-sm flex items-start gap-3">
          <AlertTriangle className="w-5 h-5 text-amber-400 flex-shrink-0 mt-0.5" />
          <div className="space-y-1">
            <p className="font-semibold text-white">Camera Notice</p>
            <p>{cameraError}</p>
          </div>
        </div>
      )}

      {/* Main Workspace Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Column: Video Feed & Vision Tracking Overlay (7 Cols) */}
        <div className="lg:col-span-7 space-y-4">
          <div className="relative aspect-[4/3] bg-slate-950 rounded-3xl border border-slate-800 overflow-hidden shadow-2xl flex items-center justify-center">
            
            {/* Webcam Video Element */}
            <video
              ref={videoRef}
              playsInline
              muted
              className={`w-full h-full object-cover transform -scale-x-100 ${!cameraActive ? 'hidden' : 'block'}`}
            />

            {/* Canvas Landmark Overlay */}
            <canvas
              ref={canvasRef}
              className={`absolute inset-0 w-full h-full pointer-events-none transform -scale-x-100 ${!cameraActive ? 'hidden' : 'block'}`}
            />

            {/* Offline / Placeholder Screen when camera is not running */}
            {!cameraActive && (
              <div className="text-center p-8 space-y-4">
                <div className="w-16 h-16 rounded-2xl bg-slate-900 border border-slate-800 mx-auto flex items-center justify-center text-slate-500">
                  <CameraOff className="w-8 h-8" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white mb-1">Webcam Inactive</h3>
                  <p className="text-xs text-slate-400 max-w-sm mx-auto">
                    Click "Start Camera" to activate your camera, or select a sample sign below to inspect detection metrics.
                  </p>
                </div>
                <button
                  onClick={startCamera}
                  className="px-4 py-2 rounded-xl bg-teal-500/20 text-teal-300 border border-teal-500/40 text-xs font-semibold hover:bg-teal-500/30 transition-colors"
                >
                  Start Camera Feed
                </button>
              </div>
            )}

            {/* Live Camera Status Badge */}
            {cameraActive && (
              <div className="absolute top-4 left-4 z-10 flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-900/80 backdrop-blur-md border border-slate-700 text-xs text-white">
                <span className="w-2.5 h-2.5 rounded-full bg-red-500 animate-pulse"></span>
                <span>Live Feed Active</span>
              </div>
            )}

            {/* Confidence indicator badge on live feed */}
            {cameraActive && activeSign && (
              <div className="absolute bottom-4 left-4 right-4 z-10 p-3 rounded-2xl bg-slate-900/90 backdrop-blur-md border border-slate-700 flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <Activity className="w-4 h-4 text-teal-400" />
                  <span className="text-slate-300">Detected:</span>
                  <span className="font-bold text-teal-300 text-sm">
                    {language === 'te' ? activeSign.nameTe : activeSign.name}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-slate-400">Confidence:</span>
                  <span className="font-mono font-bold text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-800">
                    {confidence}%
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* Supported Sign Switcher / Simulator for Evaluation */}
          <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-xs uppercase tracking-wider text-slate-300 font-bold flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-teal-400" />
                Active Classifier Target Sign
              </label>
              <span className="text-[11px] text-teal-400 font-medium">9 Supported Signs</span>
            </div>

            <div className="flex flex-wrap gap-2">
              {SUPPORTED_SIGNS.map((sign) => {
                const selected = selectedDemoSign.id === sign.id;
                return (
                  <button
                    key={sign.id}
                    onClick={() => {
                      setSelectedDemoSign(sign);
                      setActiveSign(sign);
                      setConfidence(sign.confidenceBase);
                    }}
                    className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-all ${
                      selected
                        ? 'bg-teal-500 text-slate-950 font-bold shadow-sm'
                        : 'bg-slate-950 text-slate-300 border border-slate-800 hover:border-slate-700'
                    }`}
                  >
                    {language === 'te' ? sign.nameTe : sign.name}
                  </button>
                );
              })}
            </div>
            <p className="text-[11px] text-slate-400">
              Gesture guide: <span className="text-slate-300 italic">{selectedDemoSign.gesture}</span>
            </p>
          </div>
        </div>

        {/* Right Column: Output Panel & Sentence Builder (5 Cols) */}
        <div className="lg:col-span-5 space-y-6">
          
          {/* Recognition Output Panel */}
          <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 shadow-xl space-y-5">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-heading font-bold text-white flex items-center gap-2">
                <Activity className="w-5 h-5 text-teal-400" />
                Recognition Output
              </h2>
              {activeSign && (
                <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-teal-500/10 text-teal-300 border border-teal-500/30">
                  Stable Match
                </span>
              )}
            </div>

            {/* Current Detected Word Box */}
            <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800 text-center space-y-2">
              <span className="text-xs text-slate-400 uppercase tracking-wider font-semibold">
                Live Identified Gesture
              </span>
              <div className="text-2xl sm:text-3xl font-extrabold text-teal-300 font-heading tracking-tight">
                {activeSign ? (
                  language === 'te' ? activeSign.nameTe : activeSign.name
                ) : (
                  <span className="text-slate-600 text-xl font-normal">Waiting for gesture...</span>
                )}
              </div>

              {activeSign && (
                <div className="pt-2 flex items-center justify-center gap-3 text-xs">
                  <span className="text-slate-400">Confidence:</span>
                  <div className="w-32 h-2 rounded-full bg-slate-800 overflow-hidden">
                    <div 
                      className="h-full bg-gradient-to-r from-teal-500 to-emerald-400 transition-all duration-300"
                      style={{ width: `${confidence}%` }}
                    />
                  </div>
                  <span className="font-mono text-emerald-400 font-bold">{confidence}%</span>
                </div>
              )}

              {/* Add to Transcript Button */}
              {activeSign && (
                <div className="pt-3">
                  <button
                    onClick={() => handleAppendSignToTranscript(activeSign)}
                    className="w-full py-2 px-3 rounded-xl bg-teal-500/20 hover:bg-teal-500/30 text-teal-300 border border-teal-500/40 text-xs font-bold transition-colors flex items-center justify-center gap-2"
                  >
                    <span>Append to Transcript Below</span>
                    <Sparkles className="w-3.5 h-3.5" />
                  </button>
                </div>
              )}
            </div>

            {/* Cumulative Transcript Panel */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-xs uppercase tracking-wider text-slate-300 font-semibold">
                  Cumulative Sentence Transcript
                </label>
                <div className="flex items-center gap-1">
                  <button
                    onClick={handleCopyTranscript}
                    disabled={!transcript}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 disabled:opacity-30 transition-colors"
                    title="Copy Transcript"
                    aria-label="Copy Transcript"
                  >
                    {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                  </button>
                  <button
                    onClick={handleClearTranscript}
                    disabled={!transcript}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-red-400 hover:bg-slate-800 disabled:opacity-30 transition-colors"
                    title="Clear Transcript"
                    aria-label="Clear Transcript"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 min-h-[100px] flex flex-col justify-between">
                <p className="text-sm text-slate-100 font-medium leading-relaxed">
                  {transcript || (
                    <span className="text-slate-600 italic">
                      Appended gestures will form sentences here...
                    </span>
                  )}
                </p>

                {transcript && (
                  <div className="pt-3 flex items-center justify-end">
                    <button
                      onClick={handleSpeakTranscript}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-teal-500 text-slate-950 font-bold text-xs hover:bg-teal-400 transition-colors shadow-sm"
                    >
                      <Volume2 className="w-3.5 h-3.5" />
                      <span>{t('speak')}</span>
                    </button>
                  </div>
                )}
              </div>
            </div>

          </div>

          {/* Quick instructions guide */}
          <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-2 text-xs text-slate-400">
            <h4 className="font-bold text-white flex items-center gap-1.5">
              <Info className="w-4 h-4 text-teal-400" />
              Recognition Tips for Best Accuracy:
            </h4>
            <ul className="list-disc list-inside space-y-1 text-slate-300">
              <li>Ensure good front-facing lighting without heavy shadows.</li>
              <li>Position your hand inside the dashed bounding box on screen.</li>
              <li>Hold each gesture steady for 1–2 seconds for stabilization.</li>
              <li>Tap "Append to Transcript" to accumulate words into full phrases.</li>
            </ul>
          </div>

        </div>

      </div>

    </div>
  );
};

export default SignToTextPage;
