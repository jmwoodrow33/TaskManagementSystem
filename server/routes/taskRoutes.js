const express = require('express');
const router = express.Router();
const Task = require('../models/task');

// Task Routes

// GET task
router.get('/', async (req, res) => {
    try {
        const tasks = await Task.find().populate('team'); // Populate team data
        res.json(tasks); // Send tasks as JSON response
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// GET a single task
router.get('/:id', async (req, res) => {
    try {
        const task = await Task.findById(req.params.id).populate('team');
        if (!task) {
            return res.status(404).json({ message: 'Task not found' });
        }
        res.json(task);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Create task
router.post('/', async (req, res) => {
    const task = new Task({
        title: req.body.title,
        description: req.body.description,
        deadline: req.body.deadline,
        priority: req.body.priority,
        status: req.body.status, // Optional, as it defaults to 'Backlog'
        team: req.body.team 
    });
    try {
        const newTask = await task.save();
        res.status(201).json(newTask);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// Update task
router.put('/:id', async (req, res) => {
    try {
        const updatedTask = await Task.findByIdAndUpdate(
            req.params.id,
            {
                title: req.body.title,
                description: req.body.description,
                deadline: req.body.deadline,
                priority: req.body.priority,
                status: req.body.status,
                team: req.body.team
            },
            { new: true } // Returns the updated document
        );
        if (!updatedTask) {
            return res.status(404).json({ message: 'Task not found' });
        }
        res.json(updatedTask);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// Delete task
router.delete('/:id', async (req, res) => {
    try {
        const task = await Task.findByIdAndDelete(req.params.id);
        if (!task) {
            return res.status(404).json({ message: 'Task not found' });
        }
        res.json({ message: 'Deleted Task' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;
