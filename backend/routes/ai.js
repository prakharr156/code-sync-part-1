// backend/routes/ai.js
const express = require("express");
const router = express.Router();
const fetch = require('node-fetch');

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

router.post('/suggest', async (req, res) => {
    const { prompt } = req.body;

    if (!prompt) {
        return res.status(400).json({ success: false, message: "No prompt provided" });
    }

    try {
        const result = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${GEMINI_API_KEY}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                contents: [{ parts: [{ text: prompt }] }],
            }),
        });

        const data = await result.json();

        const suggestion = data?.candidates?.[0]?.content?.parts?.[0]?.text || '';
        res.json({ success: true, suggestion });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: "AI API failed" });
    }
});

module.exports = router;
