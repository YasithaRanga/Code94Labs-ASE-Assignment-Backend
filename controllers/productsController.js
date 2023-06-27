const express = require('express');
const router = express.Router();
const productModel = require('../models/productModel');

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

router.post('/', async (req, res) => {
    try {
        const newProduct = req.body;
        const createdProduct = await productModel.createProduct(newProduct);
        res.status(200).json(createdProduct);
    } catch (error) {
        console.error('Error creating product', error);
        res.status(500).json({ error: 'An error occurred while creating the product' });
    }
});

router.put('/:id', async (req, res) => {
    try {
        const productId = req.params.id;
        const updatedProduct = req.body;
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