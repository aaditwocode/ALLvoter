import api from './api'

export const sendMessageToGemini = async (message, conversationHistory = []) => {
  if (!message || !message.trim()) {
    return { success: false, error: 'Message is required' }
  }

  try {
    // UPDATED URL: matches the route in server.js (/gemini) + routes/geminiRoutes.js (/chat)
    const response = await api.post('/gemini/chat', {
      message: message // matches backend req.body.message
    })

    if (response.data && response.data.result) {
      return {
        success: true,
        reply: response.data.result
      }
    } else {
      return { success: false, error: 'No response from AI' }
    }
  } catch (error) {
    console.error('❌ Error calling backend:', error)
    return {
      success: false,
      error: error.response?.data?.error || 'Connection failed'
    }
  }
}