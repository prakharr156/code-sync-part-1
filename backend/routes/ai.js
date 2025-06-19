const express = require('express');
const router = express.Router();
const axios = require('axios');

require('dotenv').config();

router.post('/suggest', async (req, res) => {
  const { prompt } = req.body;

  try {
    const response = await axios.post(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${process.env.AI_API_KEY}`,
      {
        contents: [
          {
            parts: [{ text: `Suggest improvements or next lines for this code:\n${prompt}` }]
          }
        ]
      },
      {
        headers: { 'Content-Type': 'application/json' }
      }
    );

    const suggestion = response.data?.candidates?.[0]?.content?.parts?.[0]?.text || 'No suggestion';

    return res.json({
      success: true,
      suggestion
    });
  } catch (err) {
    console.error('Gemini error:', err?.response?.data || err.message);
    return res.status(500).json({
      success: false,
      message: 'Gemini API call failed',
    });
  }
});

module.exports = router;
