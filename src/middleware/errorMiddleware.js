const errorHandler = (err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  res.status(statusCode);
  const response = {
    success: false,
    message: err.message || 'Internal Server Error',
  };
  if (process.env.NODE_ENV === 'development') {
    response.stack = err.stack;
  }
  console.error(err);
  res.json(response);
};

module.exports = errorHandler;
