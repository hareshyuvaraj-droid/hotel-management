import User from '../models/User.js';
import jwt from 'jsonwebtoken';

const createError = (message, statusCode) => Object.assign(new Error(message), { statusCode });

export const register = async ({ username, email, password }) => {
  const existing = await User.findOne({ email: email.toLowerCase() });
  if (existing) throw createError('User already exists', 400);

  const user = await User.create({ username, email, password });
  return { id: user._id, username: user.username, email: user.email, role: user.role };
};

export const login = async ({ email, password }) => {
  const user = await User.findOne({ email: email.toLowerCase() });
  // Constant-time check — run matchPassword even if no user to prevent timing attacks
  const passwordMatch = user ? await user.matchPassword(password) : false;
  if (!user || !passwordMatch) throw createError('Invalid credentials', 401);

  const token = jwt.sign(
    { id: user._id, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
  );
  return { token, user: { id: user._id, username: user.username, email: user.email, role: user.role } };
};

export const changePassword = async (userId, { currentPassword, newPassword }) => {
  const user = await User.findById(userId);
  if (!user || !(await user.matchPassword(currentPassword))) {
    throw createError('Current password is incorrect', 400);
  }
  if (currentPassword === newPassword) throw createError('New password must differ from current', 400);
  user.password = newPassword;
  await user.save();
  return { message: 'Password updated successfully' };
};
