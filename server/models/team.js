const mongoose = require('mongoose');
// Schema for creation and representation of the team model
const teamSchema = new mongoose.Schema({
    name: { 
        type: String, 
        required: true 
    },
    description: {
        type: String
    },
    members: [{ 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User' 
    }]
});

module.exports = mongoose.model('Team', teamSchema, 'Team');
