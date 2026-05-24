const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

// ===== MONGODB CONNECTION =====
mongoose.connect(process.env.MONGODB_URI)
    .then(() => console.log('MongoDB connected'))
    .catch(err => console.log(err));

// ===== PRODUCT SCHEMA =====
const productSchema = new mongoose.Schema({
    name: String,
    category: String,
    price: Number,
    originalPrice: Number,
    stock: Number,
    description: String,
    ingredients: String,
    images: [String]
});

const Product = mongoose.model('Product', productSchema);

// ===== API ROUTES =====
app.get('/api/products', async (req, res) => {
    const products = await Product.find();
    res.json(products);
});

app.post('/api/products', async (req, res) => {
    const newProduct = new Product(req.body);
    await newProduct.save();
    res.status(201).json(newProduct);
});

app.delete('/api/products/:id', async (req, res) => {
    await Product.findByIdAndDelete(req.params.id);
    res.json({ message: 'Product deleted' });
});

// ===== ADMIN ROUTES =====
app.get('/api/admin/stats', async (req, res) => {
    try {
        const productCount = await Product.countDocuments();
        res.json({
            products: productCount,
            orders: 0,
            users: 0,
            revenue: 0
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.get('/api/admin/orders', async (req, res) => {
    try {
        res.json([]);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// ===== SERVER START =====
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
