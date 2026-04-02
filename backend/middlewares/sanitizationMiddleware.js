// Strips HTML tags and MongoDB operator injection keys ($, .) from request body
const sanitizeValue = (value) => {
  if (typeof value === 'string') {
    return value.replace(/<[^>]*>?/gm, ''); // strip HTML tags
  }
  if (Array.isArray(value)) {
    return value.map(sanitizeValue);
  }
  if (value !== null && typeof value === 'object') {
    return sanitizeObject(value);
  }
  return value;
};

const sanitizeObject = (obj) => {
  const result = {};
  for (const key of Object.keys(obj)) {
    // Block MongoDB operator injection (keys starting with $ or containing .)
    if (key.startsWith('$') || key.includes('.')) continue;
    result[key] = sanitizeValue(obj[key]);
  }
  return result;
};

export const sanitizeRequestBody = (req, res, next) => {
  if (req.method === 'OPTIONS') return next();
  if (req.body) req.body = sanitizeObject(req.body);
  next();
};
