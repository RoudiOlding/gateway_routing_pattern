const express = require('express');
const app = express();
const PORT = process.env.PORT || 3003;

app.use(express.json());

const orders = [
    { id: 1, userId: 1, productId: 1, quantity: 2, status: 'shipped', total: 1999.98 },
    { id: 2, userId: 2, productId: 2, quantity: 1, status: 'processing', total: 599.99 },
    { id: 3, userId: 1, productId: 3, quantity: 1, status: 'delivered', total: 399.99 }
];

app.get('/health', (req, res) => {
    res.json({ status: 'healthy', service: 'order-service', instance: process.env.HOSTNAME || 'local' });
});

app.get('/api/orders', (req, res) => {
    res.json({ 
        orders, 
        instance: process.env.HOSTNAME || 'local',
        timestamp: new Date().toISOString()
    });
});

app.get('/api/orders/:id', (req, res) => {
    const order = orders.find(o => o.id === parseInt(req.params.id));
    
    if (!order) {
        return res.status(404).json({ error: 'Order not found' });
    }
    
    res.json({ 
        order, 
        instance: process.env.HOSTNAME || 'local',
        timestamp: new Date().toISOString()
    });
});

app.post('/api/orders', (req, res) => {
    const newOrder = {
        id: orders.length + 1,
        userId: req.body.userId,
        productId: req.body.productId,
        quantity: req.body.quantity || 1,
        status: 'processing',
        total: req.body.total || 0
    };
    
    orders.push(newOrder);
    res.status(201).json({ 
        order: newOrder, 
        instance: process.env.HOSTNAME || 'local' 
    });
});

app.listen(PORT, () => {
    console.log(`Order Service running on port ${PORT}`);
});