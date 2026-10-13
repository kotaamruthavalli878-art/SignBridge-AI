import express from 'express';
import rateLimit from 'express-rate-limit';
import { aiService } from '../services/aiService.js';
import { validateRequest, aiSimplifySchema, aiTranslateSchema, aiComposeSchema } from '../middleware/validation.js';

const router = express.Router();

// Rate limiter for AI endpoints: max 30 requests per 5 minutes per IP
const aiLimiter = rateLimit({
  windowMs: 5 * 60 * 1000,
  max: 30,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    error: 'Too many AI requests from this IP address. Please wait a few minutes before trying again.',
  },
});

router.use(aiLimiter);

// GET /api/ai/status
router.get('/status', (req, res) => {
  return res.json({
    success: true,
    ...aiService.getStatus(),
  });
});

// POST /api/ai/simplify
router.post('/simplify', validateRequest(aiSimplifySchema), async (req, res) => {
  try {
    const { text } = req.validatedBody;
    const result = await aiService.simplifyText(text);

    return res.json({
      success: true,
      ...result,
    });
  } catch (error) {
    console.error('AI Simplify Error:', error);
    return res.status(500).json({
      success: false,
      error: error.message || 'Failed to simplify text.',
    });
  }
});

// POST /api/ai/translate
router.post('/translate', validateRequest(aiTranslateSchema), async (req, res) => {
  try {
    const { text, targetLang } = req.validatedBody;
    const result = await aiService.translateText(text, targetLang);

    return res.json({
      success: true,
      ...result,
    });
  } catch (error) {
    console.error('AI Translate Error:', error);
    return res.status(500).json({
      success: false,
      error: error.message || 'Failed to translate text.',
    });
  }
});

// POST /api/ai/compose
router.post('/compose', validateRequest(aiComposeSchema), async (req, res) => {
  try {
    const { intent, context } = req.validatedBody;
    const result = await aiService.composeMessage(intent, context);

    return res.json({
      success: true,
      ...result,
    });
  } catch (error) {
    console.error('AI Compose Error:', error);
    return res.status(500).json({
      success: false,
      error: error.message || 'Failed to draft message.',
    });
  }
});

export default router;
