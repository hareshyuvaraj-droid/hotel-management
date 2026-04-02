const adminMiddleware = (req, res, next) => {
  if (req.method === 'OPTIONS') return next();

  if (!req.user || req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Access denied: Admin privileges required' });
  }

  next();
};

export default adminMiddleware;
