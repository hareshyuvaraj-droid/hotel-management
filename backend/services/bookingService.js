import Booking from '../models/Booking.js';
import Room from '../models/Room.js';

const createError = (message, statusCode) => Object.assign(new Error(message), { statusCode });

export const bookRoom = async (user, { room: roomId, startDate, endDate }) => {
  const room = await Room.findById(roomId);
  if (!room) throw createError('Room not found', 404);
  if (!room.availability) throw createError('Room is not available', 400);

  const start = new Date(startDate);
  const end = new Date(endDate);
  if (start >= end) throw createError('End date must be after start date', 400);
  // Compare against start of today to avoid rejecting same-day bookings due to clock skew
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  if (start < today) throw createError('Start date cannot be in the past', 400);

  // Check for overlapping bookings
  const overlap = await Booking.findOne({
    room: roomId,
    status: 'booked',
    $or: [
      { startDate: { $lt: end }, endDate: { $gt: start } }
    ]
  });
  if (overlap) throw createError('Room is already booked for the selected dates', 409);

  const booking = await Booking.create({ user: user._id, room: roomId, startDate: start, endDate: end });
  return booking;
};

export const getBookingHistory = async (user) => {
  return Booking.find({ user: user._id }).populate('room').sort({ createdAt: -1 });
};

export const cancelBooking = async (bookingId, userId, isAdmin = false) => {
  const booking = await Booking.findById(bookingId);
  if (!booking) throw createError('Booking not found', 404);

  // Only the booking owner or an admin can cancel
  if (!isAdmin && booking.user.toString() !== userId.toString()) {
    throw createError('Not authorised to cancel this booking', 403);
  }
  if (booking.status === 'cancelled') throw createError('Booking is already cancelled', 400);

  booking.status = 'cancelled';
  await booking.save();
  return booking;
};
