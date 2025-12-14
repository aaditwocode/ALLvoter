const express = require('express');
const router = express.Router();
const Election = require('../models/election');
const Candidate = require('../models/candidate');
const User = require('../models/user');
const { jwtAuthMiddleware } = require('../jwt');

// Helper function to check admin role
const checkAdminRole = async (userID) => {
    try {
        const user = await User.findById(userID);
        return user && user.role === 'admin';
    } catch (err) {
        return false;
    }
};

// GET /election - Get all elections (public, but shows different info based on role)
router.get('/', async (req, res) => {
    try {
        const elections = await Election.find()
            .populate('candidates', 'name party age voteCount')
            .populate('createdBy', 'name')
            .sort({ createdAt: -1 });

        res.status(200).json(elections);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// GET /election/:id - Get a specific election by ID
router.get('/:id', async (req, res) => {
    try {
        const election = await Election.findById(req.params.id)
            .populate('candidates', 'name party age voteCount')
            .populate('createdBy', 'name');

        if (!election) {
            return res.status(404).json({ error: 'Election not found' });
        }

        res.status(200).json(election);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// GET /election/status/active - Get active elections
router.get('/status/active', async (req, res) => {
    try {
        const now = new Date();
        const activeElections = await Election.find({
            status: 'active',
            startDate: { $lte: now },
            endDate: { $gte: now }
        })
            .populate('candidates', 'name party age voteCount')
            .sort({ startDate: 1 });

        res.status(200).json(activeElections);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// POST /election - Create a new election (Admin only)
router.post('/', jwtAuthMiddleware, async (req, res) => {
    try {
        if (!(await checkAdminRole(req.user.id))) {
            return res.status(403).json({ message: 'User does not have admin role' });
        }

        const { title, description, startDate, endDate, candidates } = req.body;

        // Validate required fields
        if (!title || !startDate || !endDate) {
            return res.status(400).json({ error: 'Title, start date, and end date are required' });
        }

        // Validate date logic
        const start = new Date(startDate);
        const end = new Date(endDate);
        if (end <= start) {
            return res.status(400).json({ error: 'End date must be after start date' });
        }

        // Validate candidates if provided
        if (candidates && candidates.length > 0) {
            const validCandidates = await Candidate.find({ _id: { $in: candidates } });
            if (validCandidates.length !== candidates.length) {
                return res.status(400).json({ error: 'One or more candidate IDs are invalid' });
            }
        }

        const electionData = {
            title,
            description,
            startDate,
            endDate,
            candidates: candidates || [],
            createdBy: req.user.id
        };

        const newElection = new Election(electionData);
        const response = await newElection.save();

        const populatedElection = await Election.findById(response._id)
            .populate('candidates', 'name party age')
            .populate('createdBy', 'name');

        console.log('Election created:', response._id);
        res.status(201).json(populatedElection);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// PUT /election/:id - Update an election (Admin only)
router.put('/:id', jwtAuthMiddleware, async (req, res) => {
    try {
        if (!(await checkAdminRole(req.user.id))) {
            return res.status(403).json({ message: 'User does not have admin role' });
        }

        const electionId = req.params.id;
        const { title, description, startDate, endDate, candidates, status } = req.body;

        const election = await Election.findById(electionId);
        if (!election) {
            return res.status(404).json({ error: 'Election not found' });
        }

        // Don't allow editing completed elections
        if (election.status === 'completed') {
            return res.status(400).json({ error: 'Cannot modify completed elections' });
        }

        // Update fields if provided
        if (title) election.title = title;
        if (description !== undefined) election.description = description;
        if (startDate) {
            const start = new Date(startDate);
            const end = election.endDate;
            if (end && end <= start) {
                return res.status(400).json({ error: 'End date must be after start date' });
            }
            election.startDate = start;
        }
        if (endDate) {
            const end = new Date(endDate);
            const start = election.startDate;
            if (start && end <= start) {
                return res.status(400).json({ error: 'End date must be after start date' });
            }
            election.endDate = end;
        }
        if (candidates) {
            // Validate candidates
            const validCandidates = await Candidate.find({ _id: { $in: candidates } });
            if (validCandidates.length !== candidates.length) {
                return res.status(400).json({ error: 'One or more candidate IDs are invalid' });
            }
            election.candidates = candidates;
        }
        if (status && ['draft', 'active', 'completed', 'cancelled'].includes(status)) {
            election.status = status;
        }

        const response = await election.save();
        const populatedElection = await Election.findById(response._id)
            .populate('candidates', 'name party age voteCount')
            .populate('createdBy', 'name');

        console.log('Election updated:', electionId);
        res.status(200).json(populatedElection);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// POST /election/:id/start - Start an election (Admin only)
router.post('/:id/start', jwtAuthMiddleware, async (req, res) => {
    try {
        if (!(await checkAdminRole(req.user.id))) {
            return res.status(403).json({ message: 'User does not have admin role' });
        }

        const election = await Election.findById(req.params.id);
        if (!election) {
            return res.status(404).json({ error: 'Election not found' });
        }

        if (!election.canStart()) {
            return res.status(400).json({ 
                error: 'Election cannot be started. Ensure it has candidates and dates are valid.' 
            });
        }

        election.status = 'active';
        await election.save();

        console.log('Election started:', req.params.id);
        res.status(200).json({ message: 'Election started successfully', election });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// POST /election/:id/end - End an election (Admin only)
router.post('/:id/end', jwtAuthMiddleware, async (req, res) => {
    try {
        if (!(await checkAdminRole(req.user.id))) {
            return res.status(403).json({ message: 'User does not have admin role' });
        }

        const election = await Election.findById(req.params.id);
        if (!election) {
            return res.status(404).json({ error: 'Election not found' });
        }

        if (election.status === 'completed') {
            return res.status(400).json({ error: 'Election is already completed' });
        }

        election.status = 'completed';
        await election.save();

        console.log('Election ended:', req.params.id);
        res.status(200).json({ message: 'Election ended successfully', election });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// POST /election/:id/candidates - Add candidates to election (Admin only)
router.post('/:id/candidates', jwtAuthMiddleware, async (req, res) => {
    try {
        if (!(await checkAdminRole(req.user.id))) {
            return res.status(403).json({ message: 'User does not have admin role' });
        }

        const { candidateIds } = req.body;
        if (!candidateIds || !Array.isArray(candidateIds) || candidateIds.length === 0) {
            return res.status(400).json({ error: 'candidateIds array is required' });
        }

        const election = await Election.findById(req.params.id);
        if (!election) {
            return res.status(404).json({ error: 'Election not found' });
        }

        if (election.status === 'completed') {
            return res.status(400).json({ error: 'Cannot modify completed elections' });
        }

        // Validate candidates
        const validCandidates = await Candidate.find({ _id: { $in: candidateIds } });
        if (validCandidates.length !== candidateIds.length) {
            return res.status(400).json({ error: 'One or more candidate IDs are invalid' });
        }

        // Add candidates (avoid duplicates)
        const existingCandidateIds = election.candidates.map(id => id.toString());
        const newCandidates = candidateIds.filter(id => !existingCandidateIds.includes(id.toString()));
        election.candidates.push(...newCandidates);

        await election.save();

        const populatedElection = await Election.findById(election._id)
            .populate('candidates', 'name party age');

        res.status(200).json({ 
            message: 'Candidates added successfully', 
            election: populatedElection 
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// DELETE /election/:id/candidates/:candidateId - Remove candidate from election (Admin only)
router.delete('/:id/candidates/:candidateId', jwtAuthMiddleware, async (req, res) => {
    try {
        if (!(await checkAdminRole(req.user.id))) {
            return res.status(403).json({ message: 'User does not have admin role' });
        }

        const election = await Election.findById(req.params.id);
        if (!election) {
            return res.status(404).json({ error: 'Election not found' });
        }

        if (election.status === 'completed') {
            return res.status(400).json({ error: 'Cannot modify completed elections' });
        }

        election.candidates = election.candidates.filter(
            id => id.toString() !== req.params.candidateId
        );

        await election.save();

        const populatedElection = await Election.findById(election._id)
            .populate('candidates', 'name party age');

        res.status(200).json({ 
            message: 'Candidate removed successfully', 
            election: populatedElection 
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// DELETE /election/:id - Delete an election (Admin only)
router.delete('/:id', jwtAuthMiddleware, async (req, res) => {
    try {
        if (!(await checkAdminRole(req.user.id))) {
            return res.status(403).json({ message: 'User does not have admin role' });
        }

        const election = await Election.findById(req.params.id);
        if (!election) {
            return res.status(404).json({ error: 'Election not found' });
        }

        // Don't allow deleting active elections
        if (election.status === 'active') {
            return res.status(400).json({ error: 'Cannot delete active elections. End them first.' });
        }

        await Election.findByIdAndDelete(req.params.id);

        console.log('Election deleted:', req.params.id);
        res.status(200).json({ message: 'Election deleted successfully' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// GET /election/:id/results - Get election results
router.get('/:id/results', async (req, res) => {
    try {
        const election = await Election.findById(req.params.id)
            .populate({
                path: 'candidates',
                select: 'name party age voteCount'
            });

        if (!election) {
            return res.status(404).json({ error: 'Election not found' });
        }

        // Calculate total votes
        const totalVotes = election.candidates.reduce((sum, candidate) => sum + (candidate.voteCount || 0), 0);

        // Sort candidates by vote count
        const results = election.candidates
            .map(candidate => ({
                candidateId: candidate._id,
                name: candidate.name,
                party: candidate.party,
                age: candidate.age,
                votes: candidate.voteCount || 0,
                percentage: totalVotes > 0 ? ((candidate.voteCount || 0) / totalVotes * 100).toFixed(2) : 0
            }))
            .sort((a, b) => b.votes - a.votes);

        res.status(200).json({
            election: {
                id: election._id,
                title: election.title,
                status: election.status,
                startDate: election.startDate,
                endDate: election.endDate
            },
            totalVotes,
            results
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

module.exports = router;

