const express = require('express');
const app = express();
const PORT = process.env.PORT || 3004;

app.use(express.json());

const notifications = [
    { id: 1, userId: 1, type: 'email', message: 'Order shipped', sent: true },
    { id: 2, userId: 2, type: 'sms', message: 'Payment confirmed', sent: true },
    { id: 3, userId: 1, type: 'email', message: 'Order delivered', sent: false }
];

app.get('/health', (req, res) => {
    res.json({ status: 'healthy', service: 'notification-service', instance: process.env.HOSTNAME || 'local' });
});

app.get('/api/notifications', (req, res) => {
    res.json({ 
        notifications, 
        instance: process.env.HOSTNAME || 'local',
        timestamp: new Date().toISOString()
    });
});

app.post('/api/notifications', (req, res) => {
    const newNotification = {
        id: notifications.length + 1,
        userId: req.body.userId,
        type: req.body.type || 'email',
        message: req.body.message,
        sent: false
    };
    
    notifications.push(newNotification);
    
    setTimeout(() => {
        newNotification.sent = true;
    }, 1000);
    
    res.status(201).json({ 
        notification: newNotification, 
        instance: process.env.HOSTNAME || 'local' 
    });
});

app.listen(PORT, () => {
    console.log(`Notification Service running on port ${PORT}`);
});