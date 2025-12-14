const mongoose = require('mongoose');

const electionSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true
    },
    description: {
        type: String,
        trim: true
    },
    startDate: {
        type: Date,
        required: true
    },
    endDate: {
        type: Date,
        required: true
    },
    status: {
        type: String,
        enum: ['draft', 'active', 'completed', 'cancelled'],
        default: 'draft'
    },
    candidates: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Candidate'
    }],
    totalVotes: {
        type: Number,
        default: 0
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
});

// Update the updatedAt field before saving
electionSchema.pre('save', function(next) {
    this.updatedAt = Date.now();
    next();
});

// Method to check if election is active
electionSchema.methods.isActive = function() {
    const now = new Date();
    return this.status === 'active' && 
           now >= this.startDate && 
           now <= this.endDate;
};

// Method to check if election can be started
electionSchema.methods.canStart = function() {
    const now = new Date();
    return this.status === 'draft' && 
           this.startDate <= now && 
           this.endDate > now &&
           this.candidates.length > 0;
};

const Election = mongoose.model('Election', electionSchema);
module.exports = Election;

