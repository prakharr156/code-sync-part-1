const express = require('express');
const router = express.Router();
const axios = require('axios');

// POST /api/v1/ai/suggest
router.post('/suggest', async (req, res) => {
  const { prompt } = req.body;

  try {
    // Call external AI suggestion API (example: Gemini, OpenAI, etc.)
    const apiKey = process.env.AI_API_KEY; // Make sure you set this in .env
    const response = await axios.post(
      'https://api.example.com/generate', // <-- replace with your actual AI API
      {
        prompt: prompt,
      },
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${apiKey}`
        }
      }
    );

    const suggestion = response.data.suggestion || response.data.choices?.[0]?.text;

    res.json({
      success: true,
      suggestion,
    });
  } catch (err) {
    console.error('AI Suggestion Error:', err.response?.data || err.message);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch AI suggestion',
    });
  }
});

module.exports = router;
