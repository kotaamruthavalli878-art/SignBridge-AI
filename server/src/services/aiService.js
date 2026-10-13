/**
 * SignBridge AI — Modular AI Service
 * Supports Google Gemini API as primary provider with timeout, sanitization,
 * and graceful fallback when credentials are not supplied.
 */

const GEMINI_MODEL = 'gemini-1.5-flash';
const REQUEST_TIMEOUT_MS = 15000;

export const aiService = {
  isConfigured() {
    const key = process.env.GEMINI_API_KEY;
    return Boolean(key && key.trim() !== '' && key !== 'your_gemini_api_key_here');
  },

  getStatus() {
    return {
      provider: 'Google Gemini',
      model: GEMINI_MODEL,
      configured: this.isConfigured(),
      features: ['simplify_text', 'translate_text', 'compose_message']
    };
  },

  async callGemini(promptText, systemInstruction = '') {
    if (!this.isConfigured()) {
      return {
        success: false,
        fallback: true,
        message: 'Google Gemini API key is not configured in backend environment (.env). Provide GEMINI_API_KEY to enable live generative AI.',
      };
    }

    const apiKey = process.env.GEMINI_API_KEY;
    const url = `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent?key=${apiKey}`;

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);

    try {
      const contents = [];
      if (systemInstruction) {
        contents.push({
          role: 'user',
          parts: [{ text: `[System Instruction: ${systemInstruction}]\n\n${promptText}` }]
        });
      } else {
        contents.push({
          role: 'user',
          parts: [{ text: promptText }]
        });
      }

      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents,
          generationConfig: {
            temperature: 0.3,
            maxOutputTokens: 600,
          }
        }),
        signal: controller.signal,
      });

      clearTimeout(timeout);

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        const errMsg = errorData.error?.message || `HTTP ${response.status} from Gemini API`;
        console.warn('Gemini API request failed:', errMsg);
        return {
          success: false,
          fallback: true,
          error: errMsg,
          message: `Gemini API returned an error (${response.status}). Operating in graceful fallback mode.`,
        };
      }

      const data = await response.json();
      const candidateText = data.candidates?.[0]?.content?.parts?.[0]?.text;

      if (!candidateText) {
        return {
          success: false,
          fallback: true,
          message: 'Received empty response from Gemini API.',
        };
      }

      return {
        success: true,
        fallback: false,
        data: candidateText.trim(),
        provider: 'Google Gemini',
      };
    } catch (err) {
      clearTimeout(timeout);
      const isTimeout = err.name === 'AbortError';
      const msg = isTimeout ? 'Gemini API call timed out after 15s' : err.message;
      console.warn('AI Service Exception:', msg);
      return {
        success: false,
        fallback: true,
        error: msg,
        message: isTimeout ? 'Request timed out.' : 'AI network communication failed.',
      };
    }
  },

  /**
   * Simplifies complex or bureaucratic sentences into accessible, plain language
   */
  async simplifyText(inputText) {
    if (!inputText || typeof inputText !== 'string' || inputText.trim().length === 0) {
      throw new Error('Input text is required');
    }

    const cleanInput = inputText.trim().slice(0, 1500);

    const systemPrompt = `You are an accessibility assistant for Deaf and hard-of-hearing individuals. 
Your job is to rewrite complex medical, academic, or bureaucratic text into clear, plain, short sentences with easy vocabulary. 
Do not lose essential facts. Present the simplified text clearly with bullet points if helpful.`;

    const result = await this.callGemini(`Rewrite the following text in simple, accessible language:\n\n"${cleanInput}"`, systemPrompt);

    if (result.success) {
      return {
        text: result.data,
        isAiGenerated: true,
        provider: 'Google Gemini',
      };
    }

    // Graceful offline heuristic fallback
    const offlineSimplified = cleanInput
      .split(/[.?!]\s+/)
      .map(s => s.trim())
      .filter(Boolean)
      .map(s => `• ${s}`)
      .join('\n');

    return {
      text: offlineSimplified || cleanInput,
      isAiGenerated: false,
      fallbackNotice: result.message || 'Running in offline plain-text mode.',
    };
  },

  /**
   * Multilingual translation between English and Telugu
   */
  async translateText(inputText, targetLang = 'te') {
    if (!inputText || typeof inputText !== 'string' || inputText.trim().length === 0) {
      throw new Error('Input text is required');
    }

    const cleanInput = inputText.trim().slice(0, 1000);
    const targetName = targetLang === 'te' ? 'Telugu (తెలుగు)' : 'English';

    const systemPrompt = `You are a professional accessibility translator. Translate the text accurately into ${targetName}. Provide ONLY the translation without preamble or conversational remarks.`;

    const result = await this.callGemini(`Translate this text into ${targetName}:\n\n"${cleanInput}"`, systemPrompt);

    if (result.success) {
      return {
        translatedText: result.data,
        targetLang,
        isAiGenerated: true,
        provider: 'Google Gemini',
      };
    }

    // Heuristic basic dictionary fallback for common phrases
    const fallbackDictionary = {
      'hello': 'నమస్కారం (Namaskaram)',
      'help': 'నాకు సహాయం కావాలి (Please help me)',
      'doctor': 'దయచేసి వైద్యుడిని పిలవండి (Please call a doctor)',
      'thank you': 'ధన్యవాదాలు (Thank you)',
      'where is': 'ఎక్కడ ఉంది? (Where is it?)',
      'i cannot hear': 'నేను వినలేను (I cannot hear)',
    };

    const key = cleanInput.toLowerCase().trim();
    const fallbackMatch = fallbackDictionary[key];

    return {
      translatedText: fallbackMatch || `[Translation unavailable offline]: ${cleanInput}`,
      targetLang,
      isAiGenerated: false,
      fallbackNotice: result.message || 'Offline translation mode. Set GEMINI_API_KEY for dynamic translations.',
    };
  },

  /**
   * Message drafting helper for quick communication in healthcare, college, public office
   */
  async composeMessage(intent, context = 'general') {
    if (!intent || typeof intent !== 'string' || intent.trim().length === 0) {
      throw new Error('Intent description is required');
    }

    const cleanIntent = intent.trim().slice(0, 500);

    const systemPrompt = `You assist Deaf and hard-of-hearing individuals communicate quickly with hearing people in public settings (${context}).
Generate 3 clear, courteous, concise message choices the user can tap or display on a screen.
Format as 3 numbered points.`;

    const result = await this.callGemini(`Generate 3 quick communication messages for: "${cleanIntent}" in setting: ${context}`, systemPrompt);

    if (result.success) {
      return {
        suggestions: result.data,
        isAiGenerated: true,
        provider: 'Google Gemini',
      };
    }

    // Deterministic fallback templates
    const templates = [
      `1. Hello, I am Deaf. Regarding "${cleanIntent}", could you please assist me?`,
      `2. Please help me with: "${cleanIntent}". I can read your written reply.`,
      `3. Urgent inquiry: "${cleanIntent}". Thank you for your patience.`
    ].join('\n');

    return {
      suggestions: templates,
      isAiGenerated: false,
      fallbackNotice: result.message || 'Template mode active.',
    };
  }
};
