import Booking from '../models/Booking.js';
import {
  bookRoom as bookRoomService,
  getBookingHistory as getBookingHistoryService,
  cancelBooking as cancelBookingService
} from '../services/bookingService.js';

export const bookRoom = async (req, res, next) => {
  try {
    const booking = await bookRoomService(req.user, req.body);
    res.status(201).json(booking);
  } catch (error) { next(error); }
};

export const getBookingHistory = async (req, res, next) => {
  try {
    const bookings = await getBookingHistoryService(req.user);
    res.status(200).json(bookings);
  } catch (error) { next(error); }
};

export const cancelBooking = async (req, res, next) => {
  try {
    const booking = await cancelBookingService(req.params.id, req.user._id, false);
    res.status(200).json(booking);
  } catch (error) { next(error); }
};

// Admin-only
export const getAllBookings = async (req, res, next) => {
  try {
    const bookings = await Booking.find().populate('user', '-password').populate('room').sort({ createdAt: -1 });
    res.status(200).json(bookings);
  } catch (error) { next(error); }
};

export const updateBooking = async (req, res, next) => {
  try {
    // Only allow status updates from admin route — never let raw body overwrite user/room refs
    const allowed = { status: req.body.status };
    const booking = await Booking.findByIdAndUpdate(req.params.id, allowed, { new: true, runValidators: true });
    if (!booking) return res.status(404).json({ message: 'Booking not found' });
    res.status(200).json(booking);
  } catch (error) { next(error); }
};

// Admin soft-cancel — preserves the booking record with status='cancelled' for audit trail
export const adminCancelBooking = async (req, res, next) => {
  try {
    const booking = await cancelBookingService(req.params.id, req.user._id, true);
    res.status(200).json(booking);
  } catch (error) { next(error); }
};

export const deleteBooking = async (req, res, next) => {
  try {
    const booking = await Booking.findByIdAndDelete(req.params.id);
    if (!booking) return res.status(404).json({ message: 'Booking not found' });
    res.status(200).json({ message: 'Booking deleted successfully' });
  } catch (error) { next(error); }
};
