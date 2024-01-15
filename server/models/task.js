const mongoose = require('mongoose');
// Schema for creation and representation of the task model
const taskSchema = new mongoose.Schema({
    title: { 
        type: String, 
        required: true 
    },
    description: { 
        type: String 
    },
    deadline: { 
        type: Date 
    },
    priority: { 
        type: String, 
        enum: ['Low', 'Medium', 'High'] 
    },
    status: { 
        type: String, 
        enum: ['Backlog', 'In Progress', 'Completed'], 
        default: 'Backlog' 
    },
    team: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Team' 
    }
});

module.exports = mongoose.model('Task', taskSchema, 'tasks');
