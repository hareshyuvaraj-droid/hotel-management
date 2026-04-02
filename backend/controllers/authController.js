import {
  register as registerService,
  login as loginService,
  changePassword as changePasswordService
} from '../services/authService.js';

const COOKIE_OPTIONS = {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
  maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days in ms
};

export const register = async (req, res, next) => {
  try {
    const user = await registerService(req.body);
    res.status(201).json(user);
  } catch (error) { next(error); }
};

export const login = async (req, res, next) => {
  try {
    const { token, user } = await loginService(req.body);
    res.cookie('token', token, COOKIE_OPTIONS);
    res.status(200).json({ user });
  } catch (error) { next(error); }
};

export const logout = (req, res) => {
  res.clearCookie('token', COOKIE_OPTIONS);
  res.status(200).json({ message: 'Logged out successfully' });
};

export const changePassword = async (req, res, next) => {
  try {
    const result = await changePasswordService(req.user._id, req.body);
    res.status(200).json(result);
  } catch (error) { next(error); }
};
