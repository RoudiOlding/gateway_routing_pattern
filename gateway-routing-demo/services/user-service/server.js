const express = require('express');
const app = express();
const PORT = process.env.PORT || 3002;

app.use(express.json());

const users = [
    { id: 1, name: 'John Doe', email: 'john@example.com', role: 'customer' },
    { id: 2, name: 'Jane Smith', email: 'jane@example.com', role: 'admin' },
    { id: 3, name: 'Bob Johnson', email: 'bob@example.com', role: 'customer' }
];

app.get('/health', (req, res) => {
    res.json({ status: 'healthy', service: 'user-service', instance: process.env.HOSTNAME || 'local' });
});

app.get('/api/users', (req, res) => {
    res.json({ 
        users, 
        instance: process.env.HOSTNAME || 'local',
        timestamp: new Date().toISOString()
    });
});

app.get('/api/users/:id', (req, res) => {
    const user = users.find(u => u.id === parseInt(req.params.id));
    
    if (!user) {
        return res.status(404).json({ error: 'User not found' });
    }
    
    res.json({ 
        user, 
        instance: process.env.HOSTNAME || 'local',
        timestamp: new Date().toISOString()
    });
});

app.post('/api/users', (req, res) => {
    const newUser = {
        id: users.length + 1,
        name: req.body.name,
        email: req.body.email,
        role: req.body.role || 'customer'
    };
    
    users.push(newUser);
    res.status(201).json({ 
        user: newUser, 
        instance: process.env.HOSTNAME || 'local' 
    });
});

app.listen(PORT, () => {
    console.log(`User Service running on port ${PORT}`);
});