import Room from '../models/Room.js';
import Booking from '../models/Booking.js';
import { listRooms as listRoomsService, searchRooms as searchRoomsService } from '../services/roomService.js';

export const listRooms = async (req, res, next) => {
  try {
    const rooms = await listRoomsService();
    res.status(200).json(rooms);
  } catch (error) { next(error); }
};

export const searchRooms = async (req, res, next) => {
  try {
    const rooms = await searchRoomsService(req.query);
    res.status(200).json(rooms);
  } catch (error) { next(error); }
};

export const getFeaturedRooms = async (req, res, next) => {
  try {
    const rooms = await Room.find({ featured: true }).limit(6);
    res.status(200).json(rooms);
  } catch (error) { next(error); }
};

export const getRoomById = async (req, res, next) => {
  try {
    const room = await Room.findById(req.params.id);
    if (!room) return res.status(404).json({ message: 'Room not found' });
    res.status(200).json(room);
  } catch (error) { next(error); }
};

// Admin-only mutations
export const createRoom = async (req, res, next) => {
  try {
    const { type, price, description, capacity, size, amenities, images, availability, featured } = req.body;
    const room = new Room({
      type, price, description, capacity, size,
      amenities: amenities || [],
      images: images || [],
      availability: availability !== undefined ? availability : true,
      featured: featured !== undefined ? featured : false
    });
    await room.save();
    res.status(201).json(room);
  } catch (error) { next(error); }
};

export const updateRoom = async (req, res, next) => {
  try {
    // FIX #1: Only update fields that were explicitly sent — avoids silently dropping
    // fields that are absent from a partial update request.
    const allowed = ['type', 'price', 'description', 'capacity', 'size', 'amenities', 'images', 'availability', 'featured'];
    const updates = {};
    for (const key of allowed) {
      if (req.body[key] !== undefined) updates[key] = req.body[key];
    }
    const room = await Room.findByIdAndUpdate(
      req.params.id,
      { $set: updates },
      { new: true, runValidators: true }
    );
    if (!room) return res.status(404).json({ message: 'Room not found' });
    res.status(200).json(room);
  } catch (error) { next(error); }
};

export const deleteRoom = async (req, res, next) => {
  try {
    const activeBookings = await Booking.countDocuments({ room: req.params.id, status: 'booked' });
    if (activeBookings > 0) {
      return res.status(409).json({ message: `Cannot delete room with ${activeBookings} active booking(s). Cancel them first.` });
    }
    const room = await Room.findByIdAndDelete(req.params.id);
    if (!room) return res.status(404).json({ message: 'Room not found' });
    res.status(200).json({ message: 'Room deleted successfully' });
  } catch (error) { next(error); }
};
