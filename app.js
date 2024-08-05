const express = require('express');
const http = require('http');
const path = require('path');
const socketio = require('socket.io');
require('dotenv').config();

const app = express();
const server = http.createServer(app);
const io = socketio(server);

// Set view engine to EJS
app.set("view engine", "ejs");

// Serve static files from the 'public' directory
app.use(express.static(path.join(__dirname, "public")));

// Handle Socket.IO connections
io.on("connection", (socket) => {
    console.log(`User connected: ${socket.id}`);

    // Handle location sending
    socket.on("send-location", (data) => {
        io.emit("receive-location", { id: socket.id, ...data });
    });
    
    // Handle user disconnection
    socket.on("disconnect", () => {
        io.emit("user-disconnected", socket.id);
        console.log(`User disconnected: ${socket.id}`);
    });
});

// Render the main page
app.get('/', (req, res) => {
    res.render('index');
});

// Start the server
const port = process.env.PORT || 8080;
server.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
