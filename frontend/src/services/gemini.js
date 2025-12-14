// Google Gemini API Service
// This service now uses the backend API route for better security and CORS handling

import api from './api'

const GEMINI_MODEL = import.meta.env.VITE_GEMINI_MODEL || 'gemini-pro'

export const sendMessageToGemini = async (message, conversationHistory = []) => {
  if (!message || !message.trim()) {
    return {
      success: false,
      error: 'Message is required'
    }
  }

  try {
    console.log('📤 Sending message to backend Gemini API:', {
      message: message.substring(0, 50) + '...',
      model: GEMINI_MODEL,
      historyLength: conversationHistory.length
    })

    // Call backend Gemini route instead of calling Gemini API directly
    const response = await api.post('/gemini/chat', {
      message: message.trim(),
      conversationHistory: conversationHistory,
      model: GEMINI_MODEL
    })

    if (response.data.success) {
      console.log('✅ Gemini Response received:', {
        messageLength: message.length,
        replyLength: response.data.reply?.length || 0,
        usage: response.data.usage
      })

      return {
        success: true,
        reply: response.data.reply
      }
    } else {
      console.error('❌ Gemini API Error:', response.data.error)
      return {
        success: false,
        error: response.data.error || 'Failed to get response from AI assistant'
      }
    }
  } catch (error) {
    console.error('❌ Error calling backend Gemini API:', error)
    
    // Handle different error types
    let errorMessage = 'Failed to communicate with AI assistant'
    
    if (error.response) {
      // Server responded with error
      errorMessage = error.response.data?.error || error.response.statusText || 'Server error'
    } else if (error.request) {
      // Request was made but no response
      errorMessage = 'Cannot connect to server. Please make sure the backend server is running on http://localhost:3000'
    } else {
      // Something else happened
      errorMessage = error.message || 'An unexpected error occurred'
    }

    return {
      success: false,
      error: errorMessage
    }
  }
}

