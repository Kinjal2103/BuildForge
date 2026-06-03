/**
 * Product Controller Layer
 * Contains the controller handlers for incoming requests on product routes.
 * Utilizes the catchAsync wrapper, Product model, and QueryFeatures utility.
 */

const Product = require('../models/productModel');
const QueryFeatures = require('../utils/queryFeatures');
const { AppError, catchAsync } = require('../middleware/errorMiddleware');

/**
 * @desc    Get all products (with optional filtering and sorting)
 * @route   GET /api/products
 * @access  Public
 */
exports.getProducts = catchAsync(async (req, res, next) => {
  // Retrieve raw array database records from Model
  const allProducts = await Product.find();

  // Instantiate query compiler chain
  const features = new QueryFeatures(allProducts, req.query)
    .filter()
    .sort();

  // Send successful JSON payload
  res.status(200).json({
    success: true,
    results: features.query.length,
    products: features.query
  });
});

/**
 * @desc    Get a single product by ID
 * @route   GET /api/products/:id
 * @access  Public
 */
exports.getProductById = catchAsync(async (req, res, next) => {
  // Query specific product records from Model
  const product = await Product.findById(req.params.id);

  // Validate presence - Trigger operational 404 Error if null
  if (!product) {
    return next(new AppError('Product not found', 404));
  }

  // Send matched single record payload
  res.status(200).json({
    success: true,
    product
  });
});
