// Google Gemini API Service
// Make sure to add your Google Gemini API key in the .env file

const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY || ''

// Normalize common model names to canonical API model IDs
const MODEL_MAP = {
  'gemini-1.5-flash': 'gemini-1.5-flash-latest',
  'gemini-1.5-flash-latest': 'gemini-1.5-flash-latest',
  'gemini-1.5-pro': 'gemini-1.5-pro-latest',
  'gemini-1.5-pro-latest': 'gemini-1.5-pro-latest',
  'gemini-pro': 'gemini-pro',
  'gemini-1.0-pro': 'gemini-1.0-pro',
}

const normalizeModel = (model) => {
  if (!model) return MODEL_MAP['gemini-1.5-flash'] // default
  const lower = model.toLowerCase().trim()
  return MODEL_MAP[lower] || model // fall back to user value if unknown
}

const GEMINI_MODEL_RAW = import.meta.env.VITE_GEMINI_MODEL || 'gemini-1.5-flash'
const GEMINI_MODEL = normalizeModel(GEMINI_MODEL_RAW)
const GEMINI_API_URL = `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent?key=${GEMINI_API_KEY}`

export const sendMessageToGemini = async (message, conversationHistory = []) => {
  if (!GEMINI_API_KEY) {
    console.error('⚠️ Gemini API key not found. Please set VITE_GEMINI_API_KEY in .env file')
    return {
      success: false,
      error: 'Gemini API key not configured'
    }
  }

  try {
    // Prepare the conversation context
    const contents = [
      {
        role: 'user',
        parts: [{ text: 'You are a helpful assistant for the ALLvoter Indian voting system. Help users with questions about voting, candidates, and the platform.' }]
      },
      ...conversationHistory.map(msg => ({
        role: msg.role === 'user' ? 'user' : 'model',
        parts: [{ text: msg.text }]
      })),
      {
        role: 'user',
        parts: [{ text: message }]
      }
    ]

    const response = await fetch(GEMINI_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: contents
      })
    })

    if (!response.ok) {
      const errorData = await response.json()
      console.error('❌ Gemini API Error:', errorData)
      // Provide a clearer message when model is not found/unsupported
      const apiMessage = errorData.error?.message || ''
      if (apiMessage.toLowerCase().includes('not found') || apiMessage.toLowerCase().includes('not supported')) {
        throw new Error(`Model "${GEMINI_MODEL}" is unavailable for generateContent. Set VITE_GEMINI_MODEL to one of: "gemini-1.5-flash-latest", "gemini-1.5-pro-latest", or "gemini-pro". Original: ${apiMessage}`)
      }
      throw new Error(apiMessage || 'Failed to get response from Gemini')
    }

    const data = await response.json()
    const reply = data.candidates?.[0]?.content?.parts?.[0]?.text || 'Sorry, I could not generate a response.'

    console.log('✅ Gemini Response:', {
      message,
      reply,
      usage: data.usageMetadata
    })

    return {
      success: true,
      reply
    }
  } catch (error) {
    console.error('❌ Error calling Gemini API:', error)
    return {
      success: false,
      error: error.message || 'Failed to communicate with AI assistant'
    }
  }
}

