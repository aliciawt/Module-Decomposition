import express from 'express';
import cors from 'cors';

const app = express();
const PORT = 3000;

// Middleware
app.use(cors({
    origin: 'http://xd69sn3wykcfxt3c98sdbokg.178.105.39.91.sslip.io',
    methods: ['GET', 'POST'],
    allowedHeaders: ['Content-Type']
}));
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

app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running at http://0.0.0.0:${PORT}`);
});