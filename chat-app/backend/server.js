import express from 'express';
import cors from 'cors';

const app = express();
const PORT = 3000;

// Middleware
app.use(cors());
app.use(express.json());

let messages = [];

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
    res.status(201).json(newMessage);
});

app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});