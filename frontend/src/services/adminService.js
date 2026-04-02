import api from './api';

// Bookings
export const getAllBookings = async () => (await api.get('/admin/bookings')).data;
export const updateBooking = async (id, data) => (await api.put(`/admin/bookings/${id}`, data)).data;
// FIX #5: Added missing admin booking actions
export const cancelBooking = async (id) => (await api.patch(`/admin/bookings/${id}/cancel`)).data;
export const deleteBooking = async (id) => (await api.delete(`/admin/bookings/${id}`)).data;

// Users
export const getAllUsers = async () => (await api.get('/admin/users')).data;
export const updateUser = async (id, data) => (await api.put(`/admin/users/${id}`, data)).data;
export const deleteUser = async (id) => (await api.delete(`/admin/users/${id}`)).data;

// Rooms
export const getAllRooms = async () => (await api.get('/admin/rooms')).data;

export const createRoom = async (data) => {
  const formatted = {
    ...data,
    amenities: Array.isArray(data.amenities)
      ? data.amenities
      : (data.amenities?.split(',').map(i => i.trim()).filter(Boolean) || []),
    images: Array.isArray(data.images)
      ? data.images
      : (data.images?.split(',').map(i => i.trim()).filter(Boolean) || [])
  };
  return (await api.post('/admin/rooms', formatted)).data;
};

export const updateRoom = async (id, data) => {
  const formatted = {
    ...data,
    amenities: Array.isArray(data.amenities)
      ? data.amenities
      : (data.amenities?.split(',').map(i => i.trim()).filter(Boolean) || []),
    images: Array.isArray(data.images)
      ? data.images
      : (data.images?.split(',').map(i => i.trim()).filter(Boolean) || [])
  };
  return (await api.put(`/admin/rooms/${id}`, formatted)).data;
};

export const deleteRoom = async (id) => (await api.delete(`/admin/rooms/${id}`)).data;
