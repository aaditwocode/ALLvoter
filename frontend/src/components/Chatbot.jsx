import { useState, useRef, useEffect } from 'react'
import { sendMessageToGemini } from '../services/gemini'
import './Chatbot.css'

function Chatbot() {
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      text: 'Namaste! 👋 I\'m your AI assistant for ALLvoter. How can I help you today?'
    }
  ])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const messagesEndRef = useRef(null)
  const inputRef = useRef(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleSend = async () => {
    if (!input.trim() || loading) return

    const userMessage = input.trim()
    setInput('')
    
    // Add user message
    const newUserMessage = { role: 'user', text: userMessage }
    setMessages(prev => [...prev, newUserMessage])
    setLoading(true)

    // Prepare conversation history (last 10 messages for context)
    const conversationHistory = [...messages, newUserMessage].slice(-10)

    console.log('📤 Sending message to Gemini:', {
      message: userMessage,
      historyLength: conversationHistory.length
    })

    try {
      const result = await sendMessageToGemini(userMessage, conversationHistory)
      
      if (result.success) {
        setMessages(prev => [...prev, { role: 'assistant', text: result.reply }])
        console.log('✅ Message received from Gemini')
      } else {
        setMessages(prev => [...prev, { 
          role: 'assistant', 
          text: `Sorry, I encountered an error: ${result.error}. Please try again.` 
        }])
        console.error('❌ Error:', result.error)
      }
    } catch (error) {
      console.error('❌ Unexpected error:', error)
      setMessages(prev => [...prev, { 
        role: 'assistant', 
        text: 'Sorry, something went wrong. Please try again later.' 
      }])
    } finally {
      setLoading(false)
      inputRef.current?.focus()
    }
  }

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  return (
    <div className="chatbot-container">
      {isOpen && (
        <div className="chatbot-window">
          <div className="chatbot-header">
            <div className="chatbot-title">
              <span className="chatbot-icon">🤖</span>
              <span>AI Assistant</span>
            </div>
            <button 
              className="chatbot-close" 
              onClick={() => setIsOpen(false)}
              aria-label="Close chatbot"
            >
              ✕
            </button>
          </div>
          
          <div className="chatbot-messages">
            {messages.map((msg, idx) => (
              <div key={idx} className={`message ${msg.role}`}>
                <div className="message-content">
                  {msg.text}
                </div>
              </div>
            ))}
            {loading && (
              <div className="message assistant">
                <div className="message-content loading">
                  <span>●</span>
                  <span>●</span>
                  <span>●</span>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          <div className="chatbot-input-container">
            <input
              ref={inputRef}
              type="text"
              className="chatbot-input"
              placeholder="Type your message..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={handleKeyPress}
              disabled={loading}
            />
            <button 
              className="chatbot-send"
              onClick={handleSend}
              disabled={loading || !input.trim()}
            >
              ➤
            </button>
          </div>
        </div>
      )}

      <button 
        className="chatbot-toggle"
        onClick={() => {
          setIsOpen(!isOpen)
          if (!isOpen) {
            setTimeout(() => inputRef.current?.focus(), 100)
          }
        }}
        aria-label="Toggle chatbot"
      >
        {isOpen ? '✕' : '💬'}
      </button>
    </div>
  )
}

export default Chatbot

