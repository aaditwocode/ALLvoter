const express = require('express');
const router = express.Router();
const { GoogleGenerativeAI } = require("@google/generative-ai");
require('dotenv').config();

// Initialize Gemini
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || process.env.VITE_GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

// POST /gemini/chat
router.post('/chat', async (req, res) => {
    try {
        const { message } = req.body; // matches frontend "message"

        if (!message) {
            return res.status(400).json({ error: "Message is required" });
        }

        // Generate content
        const result = await model.generateContent(message);
        const response = await result.response;
        const text = response.text();

        // Send back result
        res.json({ result: text });

    } catch (error) {
        console.error("Gemini Error:", error);
        res.status(500).json({ error: "Failed to generate response" });
    }
});

module.exports = router;