# Collaborative Rich Text Editor Server

## Overview
This server-side code uses Node.js and Socket.IO to implement a collaborative rich text editor. It allows multiple users to edit the same document in real-time.

## Dependencies
- Node.js
- Express.js
- Socket.IO

## Installation
1. Install Node.js from [nodejs.org](https://nodejs.org/).
2. Clone or download this repository.
3. Navigate to the project directory in your terminal.
4. Run `npm install` to install dependencies.

## Server Setup (server.js)
```javascript
// Import required modules
const express = require('express');
const http = require('http');
const socketIo = require('socket.io');

// Create an Express app
const app = express();

// Create an HTTP server using Express app
const server = http.createServer(app);

// Initialize Socket.IO
const io = socketIo(server);

// Store document content
let document = '';

// Handle socket connections
io.on('connection', (socket) => {
    console.log('New client connected');

    // Send current document content to the new client
    socket.emit('loadDocument', document);

    // Handle changes from clients
    socket.on('sendChanges', (delta) => {
        // Update the document content with the received changes
        // Apply delta to the existing document
        // Broadcast the updated document to all clients except the sender
        socket.broadcast.emit('receiveChanges', delta);
    });

    // Handle saving document on interval
    const SAVE_INTERVAL_MS = 2000;
    const saveInterval = setInterval(() => {
        // Save the document periodically (e.g., every 2 seconds)
        // You can save it to a database or file system
    }, SAVE_INTERVAL_MS);

    // Handle client disconnection
    socket.on('disconnect', () => {
        console.log('Client disconnected');
        clearInterval(saveInterval); // Stop save interval for disconnected clients
    });
});

// Start the server
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
