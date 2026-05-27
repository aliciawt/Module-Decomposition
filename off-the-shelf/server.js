const express = require('express');

const app = express();
const PORT = 3000;

// Middleware #1: Extract username from header
app.use((req, res, next) => {
    const username = req.headers['x-username'];
    req.username = username || null;
    next();
})

// Middleware #2: Parse JSON array body
app.use(express.json());

// POST Endpoint
app.post('/subjects', (req, res) => {
    const username = req.username;
    const subjects = req.body;

    if (!Array.isArray(subjects)) {
        return res.status(400).send('Body needs to be array');
    }
    
    for (let item of subjects) {
        if (typeof item !== 'string') {
            return res.status(400).send('Array needs to be in string');
        }
    }
    
    let authText = username ? `You are authenticated as ${username}.` : 'You are not authenticated.';
    let subjectsText = `You have requested information about ${subjects.length} subject(s): ${subjects.join(', ')}.`;
    
    res.send(`${authText}\n${subjectsText}`)
});

app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});