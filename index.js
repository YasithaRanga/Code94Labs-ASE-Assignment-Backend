const express = require('express');
const db = require('./utils/db');

const app = express();
const PORT = 3000;

// Connect to MongoDB Database
db.connect();

// Parse JSON request bodies
app.use(express.json());

// Routes
const productRoutes = require('./routes/products');
app.use('/products', productRoutes);

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
