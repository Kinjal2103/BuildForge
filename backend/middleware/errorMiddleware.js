/**
 * Custom Error Handlers & Middleware Module
 * Consolidates the AppError class, async controller wrapper,
 * global error processing middleware, and route-not-found handlers.
 */

/**
 * AppError Class - Custom operational error extension of native Error
 */
class AppError extends Error {
  /**
   * @param {string} message - Error description message
   * @param {number} statusCode - HTTP status code (400, 404, 500, etc.)
   */
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
    this.status = `${statusCode}`.startsWith('4') ? 'fail' : 'error';
    this.isOperational = true; // Marks as anticipated/expected operational error

    Error.captureStackTrace(this, this.constructor);
  }
}

/**
 * catchAsync Wrapper - Eliminates redundant try-catch blocks in controller handlers
 * @param {Function} fn - Asynchronous route controller function
 */
const catchAsync = (fn) => {
  return (req, res, next) => {
    fn(req, res, next).catch(next);
  };
};

/**
 * Global Error Handling Middleware
 * Catch all thrown errors and format into a consistent JSON response
 */
const errorHandler = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';

  // Standard JSON response structure
  res.status(err.statusCode).json({
    success: false,
    message: err.message || 'Internal Server Error'
  });
};

/**
 * Not Found Middleware (404)
 * Triggers when request hits an undefined routing endpoint
 */
const notFound = (req, res, next) => {
  next(new AppError(`Cannot find routing path ${req.originalUrl} on this server`, 404));
};

module.exports = {
  AppError,
  catchAsync,
  errorHandler,
  notFound
};
