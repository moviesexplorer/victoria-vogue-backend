const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

// ===== DUMMY DATA (No Database) =====
let products = [
    { id: 1, name: 'Radiance Cream', category: 'Skincare', price: 68, images: ['https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=300'] },
    { id: 2, name: 'Velvet Lipstick', category: 'Makeup', price: 42, images: ['https://images.unsplash.com/photo-1586495777744-4413f21062fa?w=300'] }
];

// ===== HEALTH CHECK =====
app.get('/api/health', (req, res) => {
    res.json({ status: 'OK' });
});

// ===== PRODUCTS =====
app.get('/api/products', (req, res) => {
    res.json(products);
});

app.post('/api/products', (req, res) => {
    const newProduct = { id: Date.now(), ...req.body };
    products.push(newProduct);
    res.status(201).json(newProduct);
});

app.delete('/api/products/:id', (req, res) => {
    const id = parseInt(req.params.id);
    products = products.filter(p => p.id !== id);
    res.json({ message: 'Product deleted' });
});

// ===== ADMIN ROUTES =====
app.get('/api/admin/stats', (req, res) => {
    res.json({
        products: products.length,
        orders: 0,
        users: 0,
        revenue: 0
    });
});

app.get('/api/admin/orders', (req, res) => {
    res.json([]);
});

// ===== SERVER START =====
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
