// function to handle when user go on another route
const notFound = (req, res, next) => {
    const error = new Error(`Not Found - ${req.originalUrl}`); // Create a new error for not found routes
    res.status(404); // Set response status to 404 (Not Found)
    next(error); // Pass the error to the next middleware
};

// Error handling middleware
const errorHandler = (err, req, res, next) => {
    const statusCode = res.statusCode === 200 ? 500 : res.statusCode; // Set status code to 500 if not already set
    res.status(statusCode); // Set the response status code
    res.json({ // Send JSON response with error details
        message: err.message, // Error message
        stack: process.env.NODE_ENV === "production" ? null : err.stack, // Stack trace if not in production
    });
}; // Export the error handling middleware for use in other files

export { notFound, errorHandler }; // Export the notFound and errorHandler functions for use in other files
// Compare this snippet from backend/models/userModel.js: