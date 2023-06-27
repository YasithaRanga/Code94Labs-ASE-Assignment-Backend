const express = require('express');
const router = express.Router();
const productModel = require('../models/productModel');
const multer = require('multer');

// Multer configuration
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/'); // Set the destination folder for uploaded images
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + '-' + file.originalname); // Set a unique filename for each uploaded image
    },
});

const upload = multer({ storage: storage });

router.get('/', async (req, res) => {
    try {
        const products = await productModel.getAllProducts();
        res.json(products);
    } catch (error) {
        console.error('Error retrieving products', error);
        res.status(500).json({ error: 'An error occurred while retrieving products' });
    }
});

router.get('/:id', async (req, res) => {
    try {
        const productId = req.params.id;
        const product = await productModel.getProductById(productId);
        if (!product) {
            return res.status(404).json({ error: 'Product not found' });
        }
        res.json(product);
    } catch (error) {
        console.error('Error retrieving product', error);
        res.status(500).json({ error: 'An error occurred while retrieving the product' });
    }
});

router.post('/', upload.array('images', 5), async (req, res) => {
    try {
        const { sku, quantity, productName, description } = req.body;
        const images = req.files.map((file) => file.filename);

        const newProduct = {
            sku,
            quantity,
            productName,
            images,
            description,
        };

        const createdProduct = await productModel.createProduct(newProduct);
        res.status(200).json(createdProduct);
    } catch (error) {
        console.error('Error creating product', error);
        res.status(500).json({ error: 'An error occurred while creating the product' });
    }
});

router.put('/:id', upload.array('images', 5), async (req, res) => {
    try {
        const productId = req.params.id;
        const { sku, quantity, productName, description } = req.body;
        const images = req.files.map((file) => file.filename);

        const updatedProduct = {
            sku,
            quantity,
            productName,
            images,
            description,
        };

        const result = await productModel.updateProduct(productId, updatedProduct);
        res.json(result);
    } catch (error) {
        console.error('Error updating product', error);
        res.status(500).json({ error: 'An error occurred while updating the product' });
    }
});

router.delete('/:id', async (req, res) => {
    try {
        const productId = req.params.id;
        const result = await productModel.deleteProduct(productId);
        res.json(result);
    } catch (error) {
        console.error('Error deleting product', error);
        res.status(500).json({ error: 'An error occurred while deleting the product' });
    }
});

module.exports = router;