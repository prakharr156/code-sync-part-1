// backend/routes/ai.js
const express = require('express');
const router = express.Router();
require('dotenv').config();

const { GoogleGenAI } = require('@google/genai');

const ai = new GoogleGenAI({ apiKey: process.env.AI_API_KEY });

router.post('/suggest', async (req, res) => {
  const { prompt } = req.body;

  if (!prompt) {
    return res.status(400).json({ success: false, message: 'Prompt missing' });
  }

  try {
    const model = ai.getGenerativeModel({ model: "gemini-1.5-flash" });

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    return res.json({ success: true, suggestion: text });
  } catch (err) {
    console.error('Gemini error:', err);
    return res.status(500).json({ success: false, message: 'Gemini error occurred' });
  }
});

module.exports = router;
