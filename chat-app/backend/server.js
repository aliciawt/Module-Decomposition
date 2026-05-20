import express from 'express';
import cors from 'cors';

const app = express();
const PORT = 3000;

// Middleware
app.use(cors());
app.use(express.json());

let messages = [];
let pendingResponses = [];

app.get('/messages', (req, res) => {
    res.json(messages);
});

app.post('/messages', (req, res) => {
    const { message, username, timestamp } = req.body;
    
    const newMessage = {
        id: Date.now(),
        message: message,
        username: username,
        timestamp: timestamp
    };
    
    messages.push(newMessage);
    for (const pendingRes of pendingResponses) {
    pendingRes.json([newMessage]);
    };
    pendingResponses = [];

    res.status(201).json(newMessage);
});

app.get('/messages/live', (req, res) => {
    req.setTimeout(30000);
    
    pendingResponses.push(res);
    
    req.on('timeout', () => {
        const index = pendingResponses.indexOf(res);
        if (index !== -1) pendingResponses.splice(index, 1);
        res.status(204).end();
    });
    
    req.on('close', () => {
        const index = pendingResponses.indexOf(res);
        if (index !== -1) pendingResponses.splice(index, 1);
    });
});

app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});