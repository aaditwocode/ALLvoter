import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import api from '../services/api'
import Chatbot from '../components/Chatbot'
import './Candidates.css'

function Candidates() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const [candidates, setCandidates] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchCandidates()
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

  const handleVote = async (candidateId) => {
    if (!window.confirm('Are you sure you want to vote for this candidate?')) {
      return
    }

    try {
      const response = await api.get(`/candidate/vote/${candidateId}`)
      alert(response.data.message || 'Vote recorded successfully!')
      fetchCandidates()
      navigate('/vote-count')
    } catch (error) {
      alert(error.response?.data?.message || 'Failed to vote')
    }
  }

  if (loading) {
    return <div className="candidates-loading">Loading candidates...</div>
  }

  return (
    <div className="candidates-container">
      <nav className="candidates-nav">
        <button onClick={() => navigate('/dashboard')} className="back-btn">
          ← Back to Dashboard
        </button>
        <h1>Available Candidates</h1>
        <button onClick={() => navigate('/vote-count')} className="vote-count-btn">
          View Vote Count
        </button>
      </nav>

      <div className="candidates-content">
        {candidates.length === 0 ? (
          <div className="no-candidates">
            <p>No candidates available at the moment.</p>
          </div>
        ) : (
          <div className="candidates-grid">
            {candidates.map((candidate) => (
              <div key={candidate._id || candidate.name} className="candidate-card">
                <div className="candidate-info">
                  <h3>{candidate.name}</h3>
                  <p className="candidate-party">{candidate.party}</p>
                </div>
                {user && !user.isVoted && user.role !== 'admin' && (
                  <button
                    onClick={() => handleVote(candidate._id)}
                    className="vote-btn"
                  >
                    Vote
                  </button>
                )}
                {user?.isVoted && (
                  <div className="voted-badge">You have already voted</div>
                )}
                {user?.role === 'admin' && (
                  <div className="admin-badge">Admin cannot vote</div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      <Chatbot />
    </div>
  )
}

export default Candidates

