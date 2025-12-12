import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import Chatbot from '../components/Chatbot'
import './Auth.css'

function Login() {
  const [aadharCardNumber, setAadharCardNumber] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const { login } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    if (!aadharCardNumber || !password) {
      setError('Please fill in all fields')
      setLoading(false)
      return
    }

    if (!/^\d{12}$/.test(aadharCardNumber)) {
      setError('Aadhar Card Number must be exactly 12 digits')
      setLoading(false)
      return
    }

    const result = await login(aadharCardNumber, password)
    
    if (result.success) {
      navigate('/dashboard')
    } else {
      setError(result.error)
    }
    setLoading(false)
  }

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-header">
          <div className="auth-logo">🗳️</div>
          <h1>ALLvoter</h1>
          <p>Indian Voting System</p>
        </div>

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group">
            <label htmlFor="aadhar">Aadhar Card Number</label>
            <input
              type="text"
              id="aadhar"
              value={aadharCardNumber}
              onChange={(e) => setAadharCardNumber(e.target.value)}
              placeholder="Enter 12-digit Aadhar number"
              maxLength="12"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              required
            />
          </div>

          {error && <div className="error-message">{error}</div>}

          <button type="submit" className="auth-button" disabled={loading}>
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>

        <div className="auth-footer">
          <p>
            Don't have an account?{' '}
            <Link to="/signup" className="auth-link">Sign Up</Link>
          </p>
        </div>
      </div>
      <Chatbot />
    </div>
  )
}

export default Login

