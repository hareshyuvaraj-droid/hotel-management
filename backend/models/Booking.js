import mongoose from 'mongoose';

const bookingSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  room: { type: mongoose.Schema.Types.ObjectId, ref: 'Room', required: true },
  startDate: { type: Date, required: true },
  endDate: { type: Date, required: true },
  status: { type: String, enum: ['booked', 'cancelled'], default: 'booked' }
}, { timestamps: true });

// Index for fast user booking lookups
bookingSchema.index({ user: 1, status: 1 });
// Index for overlap detection queries
bookingSchema.index({ room: 1, startDate: 1, endDate: 1 });

const Booking = mongoose.model('Booking', bookingSchema);
export default Booking;
