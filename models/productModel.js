const { getClient } = require('../utils/db');

const getProductCollection = () => getClient().db().collection('products');

module.exports = {
    getAllProducts: async () => {
        const collection = getProductCollection();
        return collection.find().toArray();
    },

    getProductById: async (productId) => {
        const collection = getProductCollection();
        return collection.findOne({ _id: productId });
    },

    createProduct: async (product) => {
        const collection = getProductCollection();
        const { sku, quantity, productName, images, description } = product;
        const newProduct = {
            sku,
            quantity,
            productName,
            images,
            description,
        };

        const result = await collection.insertOne(newProduct);
        if (result.acknowledged) {
            return "Product added successfully";
        } else {
            return "Product addition failed";
        }
    },

    updateProduct: async (productId, updatedProduct) => {
        const collection = getProductCollection();
        const result = await collection.updateOne({ _id: productId }, { $set: updatedProduct });
        return result;
    },

    deleteProduct: async (productId) => {
        const collection = getProductCollection();
        const result = await collection.deleteOne({ _id: productId });
        return result;
    },
};
