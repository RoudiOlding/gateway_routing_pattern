const express = require('express');
const app = express();
const PORT = process.env.PORT || 3001;

app.use(express.json());

const productsV1 = [
    { id: 1, name: 'Laptop', price: 999.99 },
    { id: 2, name: 'Phone', price: 599.99 },
    { id: 3, name: 'Tablet', price: 399.99 }
];

const productsV2 = [
    { id: 1, name: 'Laptop', price: 999.99, description: 'High-performance laptop', category: 'Electronics', stock: 15 },
    { id: 2, name: 'Phone', price: 599.99, description: 'Latest smartphone', category: 'Electronics', stock: 25 },
    { id: 3, name: 'Tablet', price: 399.99, description: 'Portable tablet device', category: 'Electronics', stock: 10 }
];

app.get('/health', (req, res) => {
    res.json({ status: 'healthy', service: 'product-service', version: process.env.VERSION || 'v1' });
});

app.get('/api/products', (req, res) => {
    const version = req.headers['x-api-version'] || process.env.VERSION || 'v1';
    const products = version === 'v2' ? productsV2 : productsV1;
    res.json({ products, version, instance: process.env.HOSTNAME || 'local' });
});

app.get('/api/products/:id', (req, res) => {
    const version = req.headers['x-api-version'] || process.env.VERSION || 'v1';
    const products = version === 'v2' ? productsV2 : productsV1;
    const product = products.find(p => p.id === parseInt(req.params.id));
    
    if (!product) {
        return res.status(404).json({ error: 'Product not found' });
    }
    
    res.json({ product, version, instance: process.env.HOSTNAME || 'local' });
});

app.listen(PORT, () => {
    console.log(`Product Service running on port ${PORT}`);
});