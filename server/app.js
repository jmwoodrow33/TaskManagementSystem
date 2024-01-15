// BACK END JAVASCRIPT FILE

// Importing the mongoose package to interact with MongoDB
const mongoose = require('mongoose');
// Importing the express package to create a web server
const express = require('express');
const path = require('path');

// Creating an instance of an express application
const app = express();

// Connection String (needs to be hidden in the .env file)
require('dotenv').config();

// MongoDB connection setup
mongoose.connect(process.env.MONGODB_URI, {
    useNewUrlParser: true, // Using a new URL parser to avoid deprecation warnings
    useUnifiedTopology: true // Allowing the driver to discover and monitor servers in a replica set or sharded cluster
}).then(() => {
    console.log("Connected to MongoDB");
}).catch(err => {
    console.error("Error connecting to MongoDB", err.message);
});

// Middleware to parse JSON bodies. This replaces body-parser which is now included in Express.
app.use(express.json());

// Routes
const taskRoutes = require('./routes/taskRoutes');
const teamRoutes = require('./routes/teamRoutes');
const userRoutes = require('./routes/userRoutes');

// Use routes
app.use('/api/tasks', taskRoutes);
app.use('/api/teams', teamRoutes);
app.use('/api/users', userRoutes);

// GET front end
app.use(express.static(path.join(__dirname, '..', 'public')));

// All other GET requests not handled before will return the frontend app
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'public', 'index.html'));
  });

// Setting up the port number 3000 as default
const PORT = process.env.PORT || 3000;
// Starting the express server on the specified port and logging a message to the console
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});


