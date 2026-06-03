/**
 * Product Model Layer
 * Simulates database communication interface by returning Promises.
 * Mimics Mongoose query methods to ensure seamless MongoDB integration in the future.
 */

const products = require('../data/products');

class Product {
  /**
   * Retrieves all product records from the dataset.
   * @returns {Promise<Array>} Resolves to the array of all products.
   */
  static async find() {
    // Wrap in Promise.resolve to simulate async database query retrieval
    return Promise.resolve(products);
  }

  /**
   * Retrieves a single product record matching the target ID.
   * @param {string} id - The unique ID of the product
   * @returns {Promise<Object|null>} Resolves to the matched product object or null if not found.
   */
  static async findById(id) {
    const product = products.find((p) => p.id === id);
    return Promise.resolve(product || null);
  }
}

module.exports = Product;
