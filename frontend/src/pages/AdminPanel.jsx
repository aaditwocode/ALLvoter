import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import api from '../services/api'
import Chatbot from '../components/Chatbot'
import './AdminPanel.css'

function AdminPanel() {
  const { user, isAdmin } = useAuth()
  const navigate = useNavigate()
  const [candidates, setCandidates] = useState([])
  const [showAddForm, setShowAddForm] = useState(false)
  const [editingCandidate, setEditingCandidate] = useState(null)
  const [formData, setFormData] = useState({
    name: '',
    party: '',
    age: ''
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!isAdmin) {
      navigate('/dashboard')
      return
    }
    fetchCandidates()
  }, [isAdmin, navigate])

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

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handleAdd = async (e) => {
    e.preventDefault()
    try {
      await api.post('/candidate', {
        ...formData,
        age: parseInt(formData.age)
      })
      alert('Candidate added successfully!')
      setFormData({ name: '', party: '', age: '' })
      setShowAddForm(false)
      fetchCandidates()
    } catch (error) {
      alert(error.response?.data?.error || 'Failed to add candidate')
    }
  }

  const handleEdit = (candidate) => {
    setEditingCandidate(candidate)
    setFormData({
      name: candidate.name,
      party: candidate.party,
      age: candidate.age.toString()
    })
    setShowAddForm(true)
  }

  const handleUpdate = async (e) => {
    e.preventDefault()
    try {
      await api.put(`/candidate/${editingCandidate._id}`, {
        ...formData,
        age: parseInt(formData.age)
      })
      alert('Candidate updated successfully!')
      setFormData({ name: '', party: '', age: '' })
      setEditingCandidate(null)
      setShowAddForm(false)
      fetchCandidates()
    } catch (error) {
      alert(error.response?.data?.error || 'Failed to update candidate')
    }
  }

  const handleDelete = async (candidateId) => {
    if (!window.confirm('Are you sure you want to delete this candidate?')) {
      return
    }

    try {
      await api.delete(`/candidate/${candidateId}`)
      alert('Candidate deleted successfully!')
      fetchCandidates()
    } catch (error) {
      alert(error.response?.data?.error || 'Failed to delete candidate')
    }
  }

  if (!isAdmin) {
    return null
  }

  if (loading) {
    return <div className="admin-loading">Loading...</div>
  }

  return (
    <div className="admin-container">
      <nav className="admin-nav">
        <button onClick={() => navigate('/dashboard')} className="back-btn">
          ← Back to Dashboard
        </button>
        <h1>Admin Panel</h1>
        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className="add-btn"
        >
          {showAddForm ? 'Cancel' : '+ Add Candidate'}
        </button>
      </nav>

      <div className="admin-content">
        {showAddForm && (
          <div className="admin-form-card">
            <h2>{editingCandidate ? 'Edit Candidate' : 'Add New Candidate'}</h2>
            <form onSubmit={editingCandidate ? handleUpdate : handleAdd}>
              <div className="form-group">
                <label>Name *</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="form-group">
                <label>Party *</label>
                <input
                  type="text"
                  name="party"
                  value={formData.party}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="form-group">
                <label>Age *</label>
                <input
                  type="number"
                  name="age"
                  value={formData.age}
                  onChange={handleInputChange}
                  min="18"
                  required
                />
              </div>
              <button type="submit" className="submit-btn">
                {editingCandidate ? 'Update' : 'Add'} Candidate
              </button>
            </form>
          </div>
        )}

        <div className="candidates-list">
          <h2>All Candidates ({candidates.length})</h2>
          {candidates.length === 0 ? (
            <div className="no-candidates">
              <p>No candidates found. Add your first candidate!</p>
            </div>
          ) : (
            <div className="candidates-table">
              <div className="table-header">
                <div>Name</div>
                <div>Party</div>
                <div>Age</div>
                <div>Votes</div>
                <div>Actions</div>
              </div>
              {candidates.map((candidate) => (
                <div key={candidate._id} className="table-row">
                  <div>{candidate.name}</div>
                  <div>{candidate.party}</div>
                  <div>{candidate.age}</div>
                  <div>{candidate.voteCount || 0}</div>
                  <div className="action-buttons">
                    <button
                      onClick={() => handleEdit(candidate)}
                      className="edit-btn"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(candidate._id)}
                      className="delete-btn"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <Chatbot />
    </div>
  )
}

export default AdminPanel

