const express = require('express');
const router = express.Router();
const Team = require('../models/team');

// Team Routes

// GET teams for display
router.get('/', async (req, res) => {
    try {
        const teams = await Team.find({}).populate('members', 'name'); // Retrieve teams from the database
        res.json(teams); // Send teams as JSON response
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// GET a single team by ID
router.get('/:id', async (req, res) => {
    try {
        const team = await Team.findById(req.params.id).populate('members');
        if (!team) {
            return res.status(404).json({ message: 'Team not found' });
        }
        res.json(team);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Create new team
router.post('/', async (req, res) => {
    const team = new Team({
        name: req.body.name,
        description: req.body.description,
        members: req.body.members // Expecting an array of User ObjectIds
    });
    try {
        const newTeam = await team.save();
        res.status(201).json(newTeam);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// Update team
router.put('/:id', async (req, res) => {
    try {
        const updatedTeam = await Team.findByIdAndUpdate(
            req.params.id, 
            { 
                name: req.body.name, 
                description: req.body.description,
                members: req.body.members 
            }, 
            { new: true }
        );
        res.json(updatedTeam);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// Delete team
router.delete('/:id', async (req, res) => {
    try {
        await Team.findByIdAndDelete(req.params.id);
        res.json({ message: 'Deleted Team' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;


