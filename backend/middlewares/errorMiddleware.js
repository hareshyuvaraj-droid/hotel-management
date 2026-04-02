const errorMiddleware = (err, req, res, next) => {
  const isProd = process.env.NODE_ENV === 'production';
  if (isProd) {
    console.error('Error:', err.message, '| Status:', err.statusCode || 500);
  } else {
    console.error('Error:', err);
  }

  if (err.message === 'Not allowed by CORS') {
    return res.status(403).json({ success: false, message: 'CORS error: Origin not allowed' });
  }

  if (req.method === 'OPTIONS') return res.status(200).end();

  // Invalid MongoDB ObjectId — return 400 instead of 500
  if (err.name === 'CastError' && err.kind === 'ObjectId') {
    return res.status(400).json({ success: false, message: 'Invalid ID format' });
  }

  // Duplicate key violation (unique index) — return 409 with the offending field
  if (err.code === 11000) {
    const field = Object.keys(err.keyValue || {})[0] || 'field';
    return res.status(409).json({ success: false, message: `${field} is already taken` });
  }

  const status = err.statusCode || 500;
  const message = isProd && status === 500 ? 'Internal server error' : err.message || 'Something went wrong';

  res.status(status).json({
    success: false,
    message,
    ...(isProd ? {} : { stack: err.stack })
  });
};

export default errorMiddleware;
