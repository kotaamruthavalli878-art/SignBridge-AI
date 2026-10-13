import { z } from 'zod';

export const registerSchema = z.object({
  name: z.string().trim().min(2, 'Name must be at least 2 characters').max(100, 'Name must be under 100 characters'),
  email: z.string().trim().email('Invalid email address format'),
  password: z.string().min(6, 'Password must be at least 6 characters long'),
  preferredLanguage: z.enum(['en', 'te']).optional().default('en'),
  accessibilityPreferences: z.object({
    fontSize: z.enum(['normal', 'large', 'xlarge']).optional(),
    highContrast: z.boolean().optional(),
    reducedMotion: z.boolean().optional(),
    preferredVoice: z.string().optional(),
    speechRate: z.number().min(0.5).max(2.0).optional(),
    autoSpeak: z.boolean().optional(),
  }).optional(),
});

export const loginSchema = z.object({
  email: z.string().trim().email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
});

export const preferencesSchema = z.object({
  fontSize: z.enum(['normal', 'large', 'xlarge']).optional(),
  highContrast: z.boolean().optional(),
  reducedMotion: z.boolean().optional(),
  preferredVoice: z.string().optional(),
  speechRate: z.number().min(0.5).max(2.0).optional(),
  autoSpeak: z.boolean().optional(),
  preferredLanguage: z.enum(['en', 'te']).optional(),
});

export const aiSimplifySchema = z.object({
  text: z.string().trim().min(1, 'Text to simplify cannot be empty').max(3000, 'Text exceeds 3000 characters limit'),
});

export const aiTranslateSchema = z.object({
  text: z.string().trim().min(1, 'Text to translate cannot be empty').max(2000, 'Text exceeds 2000 characters limit'),
  targetLang: z.enum(['en', 'te']).default('te'),
});

export const aiComposeSchema = z.object({
  intent: z.string().trim().min(1, 'Intent description cannot be empty').max(500, 'Intent exceeds 500 characters'),
  context: z.string().trim().max(100).optional().default('general'),
});

export const validateRequest = (schema) => (req, res, next) => {
  try {
    const parsed = schema.parse(req.body);
    req.validatedBody = parsed;
    next();
  } catch (error) {
    if (error instanceof z.ZodError) {
      const issueMessages = error.issues.map((i) => `${i.path.join('.')}: ${i.message}`).join(', ');
      return res.status(400).json({
        success: false,
        error: 'Validation failed',
        details: issueMessages,
        issues: error.issues,
      });
    }
    return res.status(400).json({
      success: false,
      error: 'Invalid request data',
    });
  }
};
