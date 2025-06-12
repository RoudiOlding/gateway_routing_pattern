const express = require('express');
const app = express();
const port = 3000;

app.use(express.json());

const notifications = [
    { id: 1, type: "email", recipient: "john@example.com", message: "Order confirmed", sent: true },
    { id: 2, type: "sms", recipient: "+1234567890", message: "Order shipped", sent: true },
    { id: 3, type: "email", recipient: "jane@example.com", message: "Order pending", sent: false }
];

app.get('/health', (req, res) => {
    res.json({ status: 'OK', service: 'notification-service' });
});

app.get('/api/notifications', (req, res) => {
    res.json(notifications);
});

app.post('/api/notifications', (req, res) => {
    const newNotification = {
        id: notifications.length + 1,
        type: req.body.type || "email",
        recipient: req.body.recipient,
        message: req.body.message,
        sent: true
    };
    notifications.push(newNotification);
    res.status(201).json(newNotification);
});

app.listen(port, '0.0.0.0', () => {
    console.log(`Notification service running on port ${port}`);
});