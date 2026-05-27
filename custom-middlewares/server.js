const express = require('express');
const cors = require('cors');

const app = express();
const PORT = 3000;

// Middleware #1: Extract username from header
app.use((req, res, next) => {
    const username = req.headers['x-username'];
    req.username = username || null;
    next();
})

// Middleware #2: Parse JSON array body
app.use((req, res, next) => {
    if (req.method !== 'POST') {
        next();
        return;
    }

    let body = "";

    req.on('data', chunk => {
        body += chunk.toString();
    });

    req.on('end', () => {
        try {
            const parsedBody = JSON.parse(body);

            if(!Array.isArray(parsedBody)) {
                res.status(400).send('Body needs to be array');
                return;
            }

            for (let item of parsedBody) {
                if (typeof item !== "string") {
                    res.status(400).send('Array needs to be in string');
                    return;
                }
            }

            req.body = parsedBody;
            next();
        } catch (error) {
            res.status(400).send('Not valid JSON');
        }
    });
});

// POST Endpoint
app.post('/subjects', (req, res) => {
    const username = req.username;
    const subjects = req.body;

    let authText = username ? `You are authenticated as ${username}.` : 'You are not authenticated.';
    let subjectsText = `You have requested information about ${subjects.length} subject(s): ${subjects.join(', ')}.`;
    
    res.send(`${authText}\n${subjectsText}`)
});

app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});