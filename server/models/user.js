const mongoose = require('mongoose');
// Schema for creation and representation of the user model
const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    }
});

module.exports = mongoose.model('User', userSchema);
