// Google Gemini API Service
// Make sure to add your Google Gemini API key in the .env file

const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY || ''
const GEMINI_API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${GEMINI_API_KEY}`

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
      throw new Error(errorData.error?.message || 'Failed to get response from Gemini')
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

