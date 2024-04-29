const express = require('express');
const db = require('./utils/db');
const cors = require('cors');

const app = express();
const PORT = 3000;

app.use(cors({ origin: process.env['FRONTEND_APP_URL'] }));

app.use(express.static('uploads'));

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
