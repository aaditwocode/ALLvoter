import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import Chatbot from '../components/Chatbot'
import './Auth.css'

function Signup() {
  const [formData, setFormData] = useState({
    name: '',
    age: '',
    email: '',
    mobile: '',
    address: '',
    aadharCardNumber: '',
    password: '',
    role: 'voter'
  })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const { signup } = useAuth()
  const navigate = useNavigate()

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    // Validation
    if (!formData.name || !formData.age || !formData.address || !formData.aadharCardNumber || !formData.password) {
      setError('Please fill in all required fields')
      setLoading(false)
      return
    }

    if (!/^\d{12}$/.test(formData.aadharCardNumber)) {
      setError('Aadhar Card Number must be exactly 12 digits')
      setLoading(false)
      return
    }

    if (formData.age < 18) {
      setError('You must be at least 18 years old to vote')
      setLoading(false)
      return
    }

    const result = await signup({
      ...formData,
      age: parseInt(formData.age),
      aadharCardNumber: formData.aadharCardNumber
    })
    
    if (result.success) {
      navigate('/dashboard')
    } else {
      setError(result.error)
    }
    setLoading(false)
  }

  return (
    <div className="auth-container">
      <div className="auth-card signup-card">
        <div className="auth-header">
          <div className="auth-logo">🗳️</div>
          <h1>Create Account</h1>
          <p>Join the Indian Voting System</p>
        </div>

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="name">Full Name *</label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Enter your full name"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="age">Age *</label>
              <input
                type="number"
                id="age"
                name="age"
                value={formData.age}
                onChange={handleChange}
                placeholder="Age"
                min="18"
                required
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="email">Email</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="your.email@example.com"
              />
            </div>

            <div className="form-group">
              <label htmlFor="mobile">Mobile Number</label>
              <input
                type="tel"
                id="mobile"
                name="mobile"
                value={formData.mobile}
                onChange={handleChange}
                placeholder="10-digit mobile number"
                maxLength="10"
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="address">Address *</label>
            <input
              type="text"
              id="address"
              name="address"
              value={formData.address}
              onChange={handleChange}
              placeholder="Enter your address"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="aadharCardNumber">Aadhar Card Number *</label>
            <input
              type="text"
              id="aadharCardNumber"
              name="aadharCardNumber"
              value={formData.aadharCardNumber}
              onChange={handleChange}
              placeholder="Enter 12-digit Aadhar number"
              maxLength="12"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Password *</label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Create a strong password"
              required
            />
          </div>

          {error && <div className="error-message">{error}</div>}

          <button type="submit" className="auth-button" disabled={loading}>
            {loading ? 'Creating Account...' : 'Sign Up'}
          </button>
        </form>

        <div className="auth-footer">
          <p>
            Already have an account?{' '}
            <Link to="/login" className="auth-link">Login</Link>
          </p>
        </div>
      </div>
      <Chatbot />
    </div>
  )
}

export default Signup

