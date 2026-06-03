/**
 * Product Routes Module
 * Defines API routing endpoints mapping to product controller functions.
 */

const express = require('express');
const productController = require('../controllers/productController');

const router = express.Router();

// Route definitions for /api/products
router.route('/')
  .get(productController.getProducts);

// Route definitions for /api/products/:id
router.route('/:id')
  .get(productController.getProductById);

module.exports = router;
