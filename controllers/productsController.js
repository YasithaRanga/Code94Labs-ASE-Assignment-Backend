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

router.get('/:sku', async (req, res) => {
    try {
        const productId = req.params.sku;
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

        if (sku === '') {
            res.status(400).json({ error: 'SKU should not be empty' });
        }

        const newProduct = {
            sku,
            quantity,
            productName,
            defaultImage: images[0],
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

router.put('/:sku', upload.array('images', 5), async (req, res) => {
    try {
        const productId = req.params.sku;
        const { sku, quantity, productName, description, defaultImage } = req.body;
        var updatedProduct = {};

        if (req.files.length !== 0) {
            const images = req.files.map((file) => file.filename);
            updatedProduct = {
                quantity,
                productName,
                images,
                defaultImage: images[0],
                description
            };
        } else {
            updatedProduct = {
                quantity,
                defaultImage,
                productName,
                description,
            };
        }

        const result = await productModel.updateProduct(productId, updatedProduct);
        res.json(result);
    } catch (error) {
        console.error('Error updating product', error);
        res.status(500).json({ error: 'An error occurred while updating the product' });
    }
});

router.put('/favourite/:sku', async (req, res) => {
    try {
        const productId = req.params.sku;
        const { favourite } = req.body;

        const updatedProduct = {
            favourite
        };

        const result = await productModel.updateProduct(productId, updatedProduct);
        res.json(result);
    } catch (error) {
        console.error('Error updating product', error);
        res.status(500).json({ error: 'An error occurred while updating the product' });
    }
});

router.delete('/:sku', async (req, res) => {
    try {
        const productSKU = req.params.sku;
        const result = await productModel.deleteProduct(productSKU);
        res.json(result);
    } catch (error) {
        console.error('Error deleting product', error);
        res.status(500).json({ error: 'An error occurred while deleting the product' });
    }
});

module.exports = router;