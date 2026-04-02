import express from 'express';
import { bookRoom, getBookingHistory, cancelBooking } from '../controllers/bookingController.js';
import authMiddleware from '../middlewares/authMiddleware.js';
import { body } from 'express-validator';
import { validateRequest } from '../middlewares/validationMiddleware.js';

const router = express.Router();

// All booking routes require authentication
router.use(authMiddleware);

router.post('/', [
  body('room').isMongoId().withMessage('Valid room ID is required'),
  body('startDate').isISO8601().toDate().withMessage('Valid start date is required'),
  body('endDate').isISO8601().toDate().withMessage('Valid end date is required'),
  validateRequest
], bookRoom);

router.get('/history', getBookingHistory);
// FIX #3: Cancel is a status change, not a deletion — use PATCH not DELETE
router.patch('/:id/cancel', cancelBooking);

export default router;
