const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
dotenv.config();

const app = express();

// ===== CORS CONFIGURATION (Important) =====
const allowedOrigins = [
    'https://victoria-vouge-admin-vercel.vercel.app',
    'https://abdullah1869.github.io',
    'http://localhost:3000'
];

app.use(cors({
    origin: function(origin, callback) {
        if(!origin || allowedOrigins.indexOf(origin) !== -1) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    credentials: true
}));

app.use(express.json());

// ===== TEMP DATA =====
let products = [
    { id: 1, name: 'Radiance Cream', category: 'Skincare', price: 68, originalPrice: 85, stock: 15, images: ['https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=300'], description: 'Luxurious daily moisturizer with vitamin C', ingredients: 'Vitamin C, Hyaluronic Acid' },
    { id: 2, name: 'Velvet Lipstick', category: 'Makeup', price: 42, originalPrice: 52, stock: 8, images: ['https://images.unsplash.com/photo-1586495777744-4413f21062fa?w=300'], description: 'Velvet matte lipstick', ingredients: 'Castor Oil, Beeswax' }
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
    const newProduct = {
        id: Date.now(),
        name: req.body.name,
        category: req.body.category,
        price: parseFloat(req.body.price),
        originalPrice: parseFloat(req.body.originalPrice) || 0,
        stock: parseInt(req.body.stock) || 0,
        description: req.body.description || '',
        ingredients: req.body.ingredients || '',
        images: req.body.images || []
    };
    products.push(newProduct);
    res.status(201).json(newProduct);
});

app.delete('/api/products/:id', (req, res) => {
    const id = parseInt(req.params.id);
    products = products.filter(p => p.id !== id);
    res.json({ message: 'Product deleted successfully' });
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