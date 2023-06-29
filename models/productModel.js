const { ObjectId } = require('mongodb');
const { getClient } = require('../utils/db');

const getProductCollection = () => getClient().db().collection('products');

module.exports = {
    getAllProducts: async () => {
        const collection = getProductCollection();
        return collection.find().toArray();
    },

    getProductById: async (productSKU) => {
        const collection = getProductCollection();
        return collection.findOne({ sku: productSKU });
    },

    createProduct: async (product) => {
        const collection = getProductCollection();
        const { sku, quantity, productName, images, description, defaultImage } = product;

        // Check if SKU already exists
        const existingProduct = await collection.findOne({ sku: sku });
        if (existingProduct) {
            return { error: 'SKU already exists' };
        }

        if (sku === '') {
            return { error: 'SKU should not be empty' };
        }

        const newProduct = {
            sku,
            quantity,
            productName,
            images,
            description,
            favourite: false,
            defaultImage: ""
        };

        const result = await collection.insertOne(newProduct);
        if (result.acknowledged) {
            return { success: "Product added successfully" };
        } else {
            return { error: "Product addition failed" };
        }
    },

    updateProduct: async (productId, updatedProduct) => {
        const collection = getProductCollection();
        const result = await collection.updateOne({ sku: productId }, { $set: updatedProduct });
        return result;
    },

    deleteProduct: async (productSKU) => {
        const collection = getProductCollection();
        const result = await collection.deleteOne({ sku: productSKU });
        return result;
    },
};
