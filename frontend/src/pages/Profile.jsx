import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import api from '../services/api'
import Chatbot from '../components/Chatbot'
import './Profile.css'

function Profile() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const [showPasswordForm, setShowPasswordForm] = useState(false)
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: ''
  })
  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(false)

  const handlePasswordChange = async (e) => {
    e.preventDefault()
    setMessage('')
    setLoading(true)

    try {
      const response = await api.put('/user/profile/password', passwordData)
      setMessage('Password updated successfully!')
      setPasswordData({ currentPassword: '', newPassword: '' })
      setShowPasswordForm(false)
    } catch (error) {
      setMessage(error.response?.data?.error || 'Failed to update password')
    } finally {
      setLoading(false)
    }
  }

  if (!user) {
    return <div className="profile-loading">Loading profile...</div>
  }

  return (
    <div className="profile-container">
      <nav className="profile-nav">
        <button onClick={() => navigate('/dashboard')} className="back-btn">
          ← Back to Dashboard
        </button>
        <h1>Your Profile</h1>
        <button onClick={() => { logout(); navigate('/login') }} className="logout-btn">
          Logout
        </button>
      </nav>

      <div className="profile-content">
        <div className="profile-card">
          <div className="profile-header">
            <div className="profile-avatar">
              {user.role === 'admin' ? '👑' : '👤'}
            </div>
            <h2>{user.name}</h2>
            <span className={`role-badge ${user.role}`}>
              {user.role === 'admin' ? 'Admin' : 'Voter'}
            </span>
          </div>

          <div className="profile-details">
            <div className="detail-item">
              <span className="detail-label">Age:</span>
              <span className="detail-value">{user.age} years</span>
            </div>
            {user.email && (
              <div className="detail-item">
                <span className="detail-label">Email:</span>
                <span className="detail-value">{user.email}</span>
              </div>
            )}
            {user.mobile && (
              <div className="detail-item">
                <span className="detail-label">Mobile:</span>
                <span className="detail-value">{user.mobile}</span>
              </div>
            )}
            <div className="detail-item">
              <span className="detail-label">Address:</span>
              <span className="detail-value">{user.address}</span>
            </div>
            <div className="detail-item">
              <span className="detail-label">Aadhar Card Number:</span>
              <span className="detail-value">{user.aadharCardNumber}</span>
            </div>
            <div className="detail-item">
              <span className="detail-label">Voting Status:</span>
              <span className={`detail-value ${user.isVoted ? 'voted' : 'not-voted'}`}>
                {user.isVoted ? '✅ Already Voted' : '⏳ Not Voted Yet'}
              </span>
            </div>
          </div>

          <div className="profile-actions">
            <button
              onClick={() => setShowPasswordForm(!showPasswordForm)}
              className="action-btn"
            >
              {showPasswordForm ? 'Cancel' : 'Change Password'}
            </button>
          </div>

          {showPasswordForm && (
            <form onSubmit={handlePasswordChange} className="password-form">
              <div className="form-group">
                <label>Current Password</label>
                <input
                  type="password"
                  value={passwordData.currentPassword}
                  onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                  required
                />
              </div>
              <div className="form-group">
                <label>New Password</label>
                <input
                  type="password"
                  value={passwordData.newPassword}
                  onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                  required
                />
              </div>
              {message && (
                <div className={`message ${message.includes('success') ? 'success' : 'error'}`}>
                  {message}
                </div>
              )}
              <button type="submit" className="submit-btn" disabled={loading}>
                {loading ? 'Updating...' : 'Update Password'}
              </button>
            </form>
          )}
        </div>
      </div>

      <Chatbot />
    </div>
  )
}

export default Profile

