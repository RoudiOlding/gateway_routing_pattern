const express = require('express');
const app = express();
const port = 3000;

app.use(express.json());

const orders = [
    { id: 1, userId: 1, productId: 1, quantity: 2, status: "completed", total: 1998 },
    { id: 2, userId: 2, productId: 2, quantity: 1, status: "pending", total: 599 },
    { id: 3, userId: 1, productId: 3, quantity: 1, status: "shipped", total: 399 }
];

app.get('/health', (req, res) => {
    res.json({ status: 'OK', service: 'order-service', instance: process.env.HOSTNAME || 'unknown' });
});

app.get('/api/orders', (req, res) => {
    res.json({
        instance: process.env.HOSTNAME || 'unknown',
        orders: orders
    });
});

app.get('/api/orders/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const order = orders.find(o => o.id === id);
    
    if (order) {
        res.json(order);
    } else {
        res.status(404).json({ error: 'Order not found' });
    }
});

app.listen(port, '0.0.0.0', () => {
    console.log(`Order service running on port ${port}`);
});