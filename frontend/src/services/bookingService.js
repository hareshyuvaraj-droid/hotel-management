import api from './api';

export const createBooking = async (bookingData) => {
  const response = await api.post('/bookings', bookingData);
  return response.data;
};

export const getBookingHistory = async () => {
  const response = await api.get('/bookings/history');
  return response.data;
};

export const cancelBooking = async (bookingId) => {
  // FIX #3: matches the corrected PATCH /:id/cancel route
  const response = await api.patch(`/bookings/${bookingId}/cancel`);
  return response.data;
};
