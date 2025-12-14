const express = require('express');
const router = express.Router();
require('dotenv').config();

// Model mapping for Gemini API — prefer a safe supported default
const MODEL_MAP = {
    'gemini-1.5-flash': 'gemini-1.5-flash-latest',
    'gemini-1.5-flash-latest': 'gemini-1.5-flash-latest',
    // map older/ambiguous names to a known supported model
    'gemini-1.5-pro': 'gemini-1.5-flash-latest',
    'gemini-1.5-pro-latest': 'gemini-1.5-flash-latest',
    'gemini-pro': 'gemini-1.5-flash-latest',
    'gemni-pro': 'gemini-1.5-flash-latest',
    'gemini-1.0-pro': 'gemini-1.0-pro'
};

const normalizeModel = (model) => {
    const defaultModel = MODEL_MAP['gemini-1.5-flash'];
    if (!model) return defaultModel;
    const lower = String(model).toLowerCase().trim();
    if (MODEL_MAP[lower]) return MODEL_MAP[lower];
    // try stripping spaces/extra chars
    const cleaned = lower.replace(/[^a-z0-9.-]/g, '');
    if (MODEL_MAP[cleaned]) return MODEL_MAP[cleaned];
    console.warn(`⚠️ Requested Gemini model "${model}" is not recognized. Falling back to ${defaultModel}`);
    return defaultModel;
};

// POST /gemini/chat - Proxy Gemini API calls
router.post('/chat', async (req, res) => {
    try {
        const GEMINI_API_KEY = process.env.GEMINI_API_KEY || process.env.VITE_GEMINI_API_KEY;

        if (!GEMINI_API_KEY) {
            console.error('⚠️ Gemini API key not found in backend environment');
            return res.status(500).json({
                success: false,
                error: 'Gemini API key not configured on server. Please set GEMINI_API_KEY in backend .env file'
            });
        }

        const { message, conversationHistory = [], model } = req.body;

        if (!message) {
            return res.status(400).json({
                success: false,
                error: 'Message is required'
            });
        }

        // Normalize model name
        const GEMINI_MODEL_RAW = model || process.env.GEMINI_MODEL || 'gemini-1.5-flash';
        const GEMINI_MODEL = normalizeModel(GEMINI_MODEL_RAW);
        const GEMINI_API_URL = `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent?key=${GEMINI_API_KEY}`;

        // Prepare the conversation context
        const contents = [
            {
                role: 'user',
                parts: [{ 
                    text: 'You are a helpful assistant for the ALLvoter Indian voting system. Help users with questions about voting, candidates, elections, and the platform. Be concise and informative.' 
                }]
            },
            ...conversationHistory.map(msg => ({
                role: msg.role === 'user' ? 'user' : 'model',
                parts: [{ text: msg.text }]
            })),
            {
                role: 'user',
                parts: [{ text: message }]
            }
        ];

        console.log('📤 Sending message to Gemini API:', {
            model: GEMINI_MODEL,
            messageLength: message.length,
            conversationHistoryLength: conversationHistory.length
        });

        // Make request to Gemini API
        const response = await fetch(GEMINI_API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                contents: contents
            })
        });

        if (!response.ok) {
            const errorData = await response.json();
            console.error('❌ Gemini API Error:', errorData);
            
            const apiMessage = errorData.error?.message || '';
            let errorMessage = apiMessage || 'Failed to get response from Gemini';

            // Provide clearer error messages
            if (apiMessage.toLowerCase().includes('not found') || apiMessage.toLowerCase().includes('not supported')) {
                errorMessage = `Model "${GEMINI_MODEL}" is unavailable. Please use: "gemini-1.5-flash-latest", "gemini-1.5-pro-latest", or "gemini-pro". Original: ${apiMessage}`;
            } else if (apiMessage.toLowerCase().includes('api key') || apiMessage.toLowerCase().includes('authentication')) {
                errorMessage = 'Invalid Gemini API key. Please check your GEMINI_API_KEY in backend .env file.';
            } else if (apiMessage.toLowerCase().includes('quota') || apiMessage.toLowerCase().includes('limit')) {
                errorMessage = 'Gemini API quota exceeded. Please check your API usage limits.';
            }

            return res.status(response.status).json({
                success: false,
                error: errorMessage
            });
        }

        const data = await response.json();
        const reply = data.candidates?.[0]?.content?.parts?.[0]?.text || 'Sorry, I could not generate a response.';

        console.log('✅ Gemini Response received:', {
            messageLength: message.length,
            replyLength: reply.length,
            usage: data.usageMetadata
        });

        res.status(200).json({
            success: true,
            reply,
            usage: data.usageMetadata
        });

    } catch (error) {
        console.error('❌ Error calling Gemini API:', error);
        res.status(500).json({
            success: false,
            error: error.message || 'Failed to communicate with AI assistant'
        });
    }
});

// GET /gemini/status - Check if Gemini is configured
router.get('/status', (req, res) => {
    const GEMINI_API_KEY = process.env.GEMINI_API_KEY || process.env.VITE_GEMINI_API_KEY;
    
    res.status(200).json({
        configured: !!GEMINI_API_KEY,
        message: GEMINI_API_KEY 
            ? 'Gemini API is configured' 
            : 'Gemini API key not found. Set GEMINI_API_KEY in backend .env file'
    });
});

module.exports = router;

