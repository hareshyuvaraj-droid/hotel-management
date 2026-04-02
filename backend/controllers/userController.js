import User from '../models/User.js';
import {
  getUserProfile as getUserProfileService,
  updateUserProfile as updateUserProfileService
} from '../services/userService.js';

export const getUserProfile = async (req, res, next) => {
  try {
    const user = await getUserProfileService(req.user);
    res.status(200).json(user);
  } catch (error) { next(error); }
};

export const updateUserProfile = async (req, res, next) => {
  try {
    // Strip any role or password changes from this endpoint
    const { username, email } = req.body;
    const user = await updateUserProfileService(req.user, { username, email });
    res.status(200).json(user);
  } catch (error) { next(error); }
};

// Admin-only
export const getAllUsers = async (req, res, next) => {
  try {
    const users = await User.find().select('-password').sort({ createdAt: -1 });
    res.status(200).json(users);
  } catch (error) { next(error); }
};

export const updateUser = async (req, res, next) => {
  try {
    // Admin can update role; strip password — only set fields that were actually sent
    const allowed = ['username', 'email', 'role'];
    const updates = {};
    for (const key of allowed) {
      if (req.body[key] !== undefined) updates[key] = req.body[key];
    }
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { $set: updates },
      { new: true, runValidators: true }
    ).select('-password');
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.status(200).json(user);
  } catch (error) { next(error); }
};

export const deleteUser = async (req, res, next) => {
  try {
    // Prevent admin from deleting themselves
    if (req.params.id === req.user._id.toString()) {
      return res.status(400).json({ message: 'Cannot delete your own account' });
    }
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.status(200).json({ message: 'User deleted successfully' });
  } catch (error) { next(error); }
};
