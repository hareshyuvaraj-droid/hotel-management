import express from 'express';
import { register, login, logout, changePassword } from '../controllers/authController.js';
import { getUserProfile, updateUserProfile } from '../controllers/userController.js';
import authMiddleware from '../middlewares/authMiddleware.js';
import { body } from 'express-validator';
import { validateRequest } from '../middlewares/validationMiddleware.js';

const router = express.Router();

router.post('/register', [
  body('username').trim().isLength({ min: 2, max: 30 }).withMessage('Username must be 2–30 characters'),
  body('email').isEmail().normalizeEmail().withMessage('Valid email required'),
  body('password').isLength({ min: 8 }).withMessage('Password must be at least 8 characters'),
  validateRequest
], register);

router.post('/login', [
  body('email').isEmail().normalizeEmail().withMessage('Valid email required'),
  body('password').notEmpty().withMessage('Password is required'),
  validateRequest
], login);

router.post('/logout', logout);

router.get('/profile', authMiddleware, getUserProfile);
router.put('/profile', authMiddleware, [
  body('username').optional().trim().isLength({ min: 2, max: 30 }).withMessage('Username must be 2–30 characters'),
  body('email').optional().isEmail().normalizeEmail().withMessage('Valid email required'),
  validateRequest
], updateUserProfile);
router.post('/change-password', authMiddleware, [
  body('currentPassword').notEmpty().withMessage('Current password required'),
  body('newPassword').isLength({ min: 8 }).withMessage('New password must be at least 8 characters'),
  validateRequest
], changePassword);

export default router;
