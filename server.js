const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

// ===== MONGODB CONNECTION =====
mongoose.connect('mongodb+srv://abdullah1869:<db_password>@victoria-vouge.kotvzpo.mongodb.net/?appName=Victoria-Vouge')
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

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
