const express = require('express');
const app = express();
const port = 3000;

app.use(express.json());

const productsV1 = [
    { id: 1, name: "Laptop", price: 999 },
    { id: 2, name: "Phone", price: 599 },
    { id: 3, name: "Tablet", price: 399 }
];

const productsV2 = [
    { id: 1, name: "Laptop", price: 999, description: "High-performance laptop", category: "Electronics", stock: 50 },
    { id: 2, name: "Phone", price: 599, description: "Latest smartphone", category: "Electronics", stock: 100 },
    { id: 3, name: "Tablet", price: 399, description: "Portable tablet", category: "Electronics", stock: 75 }
];

app.get('/health', (req, res) => {
    res.json({ status: 'OK', service: 'product-service' });
});

app.get('/api/products', (req, res) => {
    const version = req.headers['x-version'] || 'v1';
    if (version === 'v2') {
        res.json(productsV2);
    } else {
        res.json(productsV1);
    }
});

app.get('/api/products/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const version = req.headers['x-version'] || 'v1';
    
    let product;
    if (version === 'v2') {
        product = productsV2.find(p => p.id === id);
    } else {
        product = productsV1.find(p => p.id === id);
    }
    
    if (product) {
        res.json(product);
    } else {
        res.status(404).json({ error: 'Product not found' });
    }
});

app.listen(port, '0.0.0.0', () => {
    console.log(`Product service running on port ${port}`);
});