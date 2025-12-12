import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import api from '../services/api'
import Chatbot from '../components/Chatbot'
import './Dashboard.css'

function Dashboard() {
  const { user, logout, isAdmin } = useAuth()
  const navigate = useNavigate()
  const [candidates, setCandidates] = useState([])
  const [voteCount, setVoteCount] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchCandidates()
    fetchVoteCount()
  }, [])

  const fetchCandidates = async () => {
    try {
      const response = await api.get('/candidate')
      setCandidates(response.data)
    } catch (error) {
      console.error('Failed to fetch candidates:', error)
    } finally {
      setLoading(false)
    }
  }

  const fetchVoteCount = async () => {
    try {
      const response = await api.get('/candidate/vote/count')
      setVoteCount(response.data)
    } catch (error) {
      console.error('Failed to fetch vote count:', error)
    }
  }

  const handleVote = async (candidateId) => {
    try {
      const response = await api.get(`/candidate/vote/${candidateId}`)
      alert(response.data.message || 'Vote recorded successfully!')
      fetchCandidates()
      fetchVoteCount()
    } catch (error) {
      alert(error.response?.data?.message || 'Failed to vote')
    }
  }

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  if (loading) {
    return <div className="dashboard-loading">Loading...</div>
  }

  return (
    <div className="dashboard-container">
      <nav className="dashboard-nav">
        <div className="nav-brand">
          <span className="nav-logo">🗳️</span>
          <span>ALLvoter</span>
        </div>
        <div className="nav-links">
          <button onClick={() => navigate('/candidates')} className="nav-link">
            Candidates
          </button>
          <button onClick={() => navigate('/vote-count')} className="nav-link">
            Vote Count
          </button>
          {isAdmin && (
            <button onClick={() => navigate('/admin')} className="nav-link">
              Admin Panel
            </button>
          )}
          <button onClick={() => navigate('/profile')} className="nav-link">
            Profile
          </button>
          <button onClick={handleLogout} className="nav-link logout">
            Logout
          </button>
        </div>
      </nav>

      <div className="dashboard-content">
        <div className="dashboard-header">
          <h1>Namaste, {user?.name}! 👋</h1>
          <p>Welcome to the Indian Voting System</p>
        </div>

        <div className="dashboard-grid">
          <div className="dashboard-card">
            <h2>Quick Actions</h2>
            <div className="action-buttons">
              <button 
                onClick={() => navigate('/candidates')}
                className="action-btn primary"
              >
                View Candidates
              </button>
              <button 
                onClick={() => navigate('/vote-count')}
                className="action-btn secondary"
              >
                View Vote Count
              </button>
              {isAdmin && (
                <button 
                  onClick={() => navigate('/admin')}
                  className="action-btn admin"
                >
                  Manage Candidates
                </button>
              )}
            </div>
          </div>

          <div className="dashboard-card">
            <h2>Your Status</h2>
            <div className="status-info">
              <div className="status-item">
                <span className="status-label">Role:</span>
                <span className={`status-value ${user?.role}`}>
                  {user?.role === 'admin' ? '👑 Admin' : '👤 Voter'}
                </span>
              </div>
              <div className="status-item">
                <span className="status-label">Voting Status:</span>
                <span className={`status-value ${user?.isVoted ? 'voted' : 'not-voted'}`}>
                  {user?.isVoted ? '✅ Voted' : '⏳ Not Voted'}
                </span>
              </div>
              <div className="status-item">
                <span className="status-label">Aadhar:</span>
                <span className="status-value">{user?.aadharCardNumber}</span>
              </div>
            </div>
          </div>

          {candidates.length > 0 && (
            <div className="dashboard-card">
              <h2>Available Candidates ({candidates.length})</h2>
              <div className="candidates-preview">
                {candidates.slice(0, 3).map((candidate, idx) => (
                  <div key={idx} className="candidate-preview-item">
                    <span className="candidate-name">{candidate.name}</span>
                    <span className="candidate-party">{candidate.party}</span>
                  </div>
                ))}
                {candidates.length > 3 && (
                  <p className="view-more" onClick={() => navigate('/candidates')}>
                    +{candidates.length - 3} more candidates
                  </p>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      <Chatbot />
    </div>
  )
}

export default Dashboard

