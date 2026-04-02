import express from 'express';
import { body, param } from 'express-validator';
import { getAllUsers, updateUser, deleteUser } from '../controllers/userController.js';
import { createRoom, updateRoom, deleteRoom, listRooms } from '../controllers/roomController.js';
import { getAllBookings, updateBooking, deleteBooking, adminCancelBooking } from '../controllers/bookingController.js';
import authMiddleware from '../middlewares/authMiddleware.js';
import adminMiddleware from '../middlewares/adminMiddleware.js';
import { validateRequest } from '../middlewares/validationMiddleware.js';

const router = express.Router();

// All admin routes require auth + admin role
router.use(authMiddleware, adminMiddleware);

// User management
router.get('/users', getAllUsers);
// FIX #2: validate role on user update
router.put('/users/:id', [
  param('id').isMongoId().withMessage('Invalid user ID'),
  body('username').optional().trim().isLength({ min: 2, max: 30 }).withMessage('Username must be 2–30 characters'),
  body('email').optional().isEmail().normalizeEmail().withMessage('Valid email required'),
  body('role').optional().isIn(['user', 'admin']).withMessage('Role must be user or admin'),
  validateRequest
], updateUser);
router.delete('/users/:id', [
  param('id').isMongoId().withMessage('Invalid user ID'),
  validateRequest
], deleteUser);

// Room management
router.get('/rooms', listRooms);
// FIX #2: validate required fields on create, optional fields on update
router.post('/rooms', [
  body('type').trim().notEmpty().withMessage('Room type is required'),
  body('price').isFloat({ min: 0 }).withMessage('Price must be a non-negative number'),
  body('capacity').optional().isInt({ min: 1 }).withMessage('Capacity must be at least 1'),
  body('size').optional().isFloat({ min: 0 }).withMessage('Size must be non-negative'),
  validateRequest
], createRoom);
router.put('/rooms/:id', [
  param('id').isMongoId().withMessage('Invalid room ID'),
  body('type').optional().trim().notEmpty().withMessage('Type cannot be blank'),
  body('price').optional().isFloat({ min: 0 }).withMessage('Price must be a non-negative number'),
  body('capacity').optional().isInt({ min: 1 }).withMessage('Capacity must be at least 1'),
  body('size').optional().isFloat({ min: 0 }).withMessage('Size must be non-negative'),
  validateRequest
], updateRoom);
router.delete('/rooms/:id', [
  param('id').isMongoId().withMessage('Invalid room ID'),
  validateRequest
], deleteRoom);

// Booking management
router.get('/bookings', getAllBookings);
router.put('/bookings/:id', [
  param('id').isMongoId().withMessage('Invalid booking ID'),
  body('status').optional().isIn(['booked', 'cancelled']).withMessage('Status must be booked or cancelled'),
  validateRequest
], updateBooking);
router.patch('/bookings/:id/cancel', [
  param('id').isMongoId().withMessage('Invalid booking ID'),
  validateRequest
], adminCancelBooking); // soft-cancel, preserves audit trail
router.delete('/bookings/:id', [
  param('id').isMongoId().withMessage('Invalid booking ID'),
  validateRequest
], deleteBooking);            // hard delete

export default router;
