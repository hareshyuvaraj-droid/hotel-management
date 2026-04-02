import User from '../models/User.js';

export const getUserProfile = async (user) => {
  return User.findById(user._id).select('-password');
};

export const updateUserProfile = async (user, { username, email }) => {
  const updates = {};
  if (username !== undefined) updates.username = username;
  if (email !== undefined) updates.email = email;
  const updated = await User.findByIdAndUpdate(
    user._id,
    { $set: updates },
    { new: true, runValidators: true }
  ).select('-password');
  return updated;
};
