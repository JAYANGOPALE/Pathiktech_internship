/**
 * Global Express error handler middleware.
 * Catches errors passed via next(err) and returns JSON responses.
 */
function errorHandler(err, req, res, next) {
  console.error('❌ Unhandled error:', err.message);

  // Multer errors (file size, wrong type)
  if (err.code === 'LIMIT_FILE_SIZE') {
    return res.status(413).json({ error: 'File too large. Maximum size is 1 MB.' });
  }

  if (err.message && err.message.includes('Only .json files')) {
    return res.status(400).json({ error: err.message });
  }

  const status = err.status || err.statusCode || 500;
  const message = err.message || 'Internal server error';

  res.status(status).json({ error: message });
}

module.exports = errorHandler;
