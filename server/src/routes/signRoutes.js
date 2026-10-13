import express from 'express';
import { store } from '../services/store.js';

const router = express.Router();

// GET /api/signs - List all signs with optional category and search filters
router.get('/', async (req, res) => {
  try {
    const { category, search } = req.query;
    const signs = await store.getSigns(category, search);

    return res.json({
      success: true,
      count: signs.length,
      category: category || 'all',
      signs,
    });
  } catch (error) {
    console.error('Sign fetch error:', error);
    return res.status(500).json({
      success: false,
      error: 'Failed to retrieve signs.',
    });
  }
});

// GET /api/signs/categories - Category summaries
router.get('/categories', async (req, res) => {
  try {
    const allSigns = await store.getSigns();
    const categoriesMap = {
      greetings: { name: 'Greetings & Courtesies', nameTe: 'నమస్కారాలు & మర్యాదలు', count: 0, icon: 'HandMetal' },
      healthcare: { name: 'Healthcare & Medical', nameTe: 'వైద్యం & ఆరోగ్యం', count: 0, icon: 'Stethoscope' },
      emergency: { name: 'Emergency & Urgent Assistance', nameTe: 'అత్యవసర సహాయం', count: 0, icon: 'AlertTriangle' },
      education: { name: 'Education & Classroom', nameTe: 'విద్య & తరగతి గది', count: 0, icon: 'GraduationCap' },
      daily: { name: 'Daily Life & Navigation', nameTe: 'నిత్యజీవితం & సంభాషణ', count: 0, icon: 'MessageCircle' },
    };

    allSigns.forEach((sign) => {
      if (categoriesMap[sign.category]) {
        categoriesMap[sign.category].count += 1;
      }
    });

    const categoryList = Object.entries(categoriesMap).map(([key, data]) => ({
      id: key,
      ...data,
    }));

    return res.json({
      success: true,
      categories: categoryList,
    });
  } catch (error) {
    console.error('Categories error:', error);
    return res.status(500).json({
      success: false,
      error: 'Failed to retrieve categories.',
    });
  }
});

// GET /api/signs/:id - Retrieve single sign details
router.get('/:id', async (req, res) => {
  try {
    const sign = await store.getSignById(req.params.id);
    if (!sign) {
      return res.status(404).json({
        success: false,
        error: `Sign with ID '${req.params.id}' not found.`,
      });
    }

    return res.json({
      success: true,
      sign,
    });
  } catch (error) {
    console.error('Sign detail error:', error);
    return res.status(500).json({
      success: false,
      error: 'Failed to retrieve sign detail.',
    });
  }
});

export default router;
