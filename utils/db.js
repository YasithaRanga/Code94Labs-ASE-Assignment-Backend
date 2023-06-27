const { MongoClient } = require('mongodb');
require('dotenv').config();


const uri = process.env['MONGO_DB_URI'];
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

module.exports = {
    connect: async () => {
        try {
            await client.connect();
            console.log('Connected to MongoDB');
        } catch (error) {
            console.error('Error connecting to MongoDB', error);
        }
    },
    getClient: () => client,
};