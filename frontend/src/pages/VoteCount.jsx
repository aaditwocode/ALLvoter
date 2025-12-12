import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../services/api'
import Chatbot from '../components/Chatbot'
import './VoteCount.css'

function VoteCount() {
  const navigate = useNavigate()
  const [voteCount, setVoteCount] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchVoteCount()
    const interval = setInterval(fetchVoteCount, 5000) // Refresh every 5 seconds
    return () => clearInterval(interval)
  }, [])

  const fetchVoteCount = async () => {
    try {
      const response = await api.get('/candidate/vote/count')
      setVoteCount(response.data.sort((a, b) => b.count - a.count))
    } catch (error) {
      console.error('Failed to fetch vote count:', error)
    } finally {
      setLoading(false)
    }
  }

  const totalVotes = voteCount.reduce((sum, item) => sum + item.count, 0)

  if (loading) {
    return <div className="vote-count-loading">Loading vote count...</div>
  }

  return (
    <div className="vote-count-container">
      <nav className="vote-count-nav">
        <button onClick={() => navigate('/dashboard')} className="back-btn">
          ← Back to Dashboard
        </button>
        <h1>Live Vote Count</h1>
        <button onClick={() => navigate('/candidates')} className="candidates-btn">
          View Candidates
        </button>
      </nav>

      <div className="vote-count-content">
        <div className="vote-count-header">
          <h2>Election Results</h2>
          <p className="total-votes">Total Votes: {totalVotes}</p>
        </div>

        {voteCount.length === 0 ? (
          <div className="no-votes">
            <p>No votes have been cast yet.</p>
          </div>
        ) : (
          <div className="vote-count-list">
            {voteCount.map((item, index) => {
              const percentage = totalVotes > 0 ? ((item.count / totalVotes) * 100).toFixed(1) : 0
              return (
                <div key={item.party} className="vote-count-item">
                  <div className="vote-count-rank">
                    <span className="rank-number">#{index + 1}</span>
                  </div>
                  <div className="vote-count-details">
                    <div className="party-name">{item.party}</div>
                    <div className="vote-bar-container">
                      <div 
                        className="vote-bar"
                        style={{ width: `${percentage}%` }}
                      >
                        <span className="vote-count-number">{item.count} votes</span>
                      </div>
                    </div>
                    <div className="vote-percentage">{percentage}%</div>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>

      <Chatbot />
    </div>
  )
}

export default VoteCount

