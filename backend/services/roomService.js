import Room from '../models/Room.js';

export const listRooms = async () => Room.find();

export const searchRooms = async ({ type, minPrice, maxPrice, available }) => {
  const query = {};

  if (type) {
    // Escape user input before using in RegExp — prevents ReDoS / regex injection
    const escaped = type.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    query.type = new RegExp(escaped, 'i');
  }

  if (minPrice !== undefined || maxPrice !== undefined) {
    query.price = {};
    const min = Number(minPrice);
    const max = Number(maxPrice);
    if (minPrice !== undefined && !isNaN(min)) query.price.$gte = min;
    if (maxPrice !== undefined && !isNaN(max)) query.price.$lte = max;
    // Remove empty price object if nothing valid was added
    if (!Object.keys(query.price).length) delete query.price;
  }

  if (available !== undefined) query.availability = available === 'true';

  return Room.find(query);
};
