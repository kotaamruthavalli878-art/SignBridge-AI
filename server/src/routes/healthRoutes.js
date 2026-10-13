import express from 'express';
import { getDbStatus } from '../config/db.js';
import { aiService } from '../services/aiService.js';

const router = express.Router();

router.get('/', (req, res) => {
  const dbStatus = getDbStatus();
  const aiStatus = aiService.getStatus();

  return res.json({
    status: 'ok',
    service: 'SignBridge AI Accessibility Platform Backend',
    version: '1.0.0',
    uptime: Math.floor(process.uptime()),
    timestamp: new Date().toISOString(),
    database: {
      connected: dbStatus.connected,
      mode: dbStatus.mode,
      readyState: dbStatus.readyState,
    },
    ai: {
      provider: aiStatus.provider,
      configured: aiStatus.configured,
      model: aiStatus.model,
    },
    features: [
      'Authentication (JWT & bcrypt)',
      'Indian Sign Language & ASL Library',
      'AI Plain Language Simplification',
      'English / Telugu Translation Assistance',
      'Accessibility Customizations'
    ]
  });
});

export default router;
