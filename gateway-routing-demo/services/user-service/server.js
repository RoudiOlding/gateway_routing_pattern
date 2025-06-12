const express = require('express');
const app = express();
const port = 3000;

app.use(express.json());

const users = [
    { id: 1, name: "John Doe", email: "john@example.com", role: "admin" },
    { id: 2, name: "Jane Smith", email: "jane@example.com", role: "user" },
    { id: 3, name: "Bob Johnson", email: "bob@example.com", role: "user" }
];

app.get('/health', (req, res) => {
    res.json({ status: 'OK', service: 'user-service', instance: process.env.HOSTNAME || 'unknown' });
});

app.get('/api/users', (req, res) => {
    res.json({
        instance: process.env.HOSTNAME || 'unknown',
        users
    });
});

app.get('/api/users/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const user = users.find(u => u.id === id);
    
    if (user) {
        res.json(user);
    } else {
        res.status(404).json({ error: 'User not found' });
    }
});

app.listen(port, '0.0.0.0', () => {
    console.log(`User service running on port ${port}`);
});