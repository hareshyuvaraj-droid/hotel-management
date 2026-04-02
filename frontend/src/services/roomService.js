import api from './api';

export const getAllRooms = async () => {
  const response = await api.get('/rooms');
  return response.data;
};

export const searchRooms = async (queryParams) => {
  const response = await api.get('/rooms/search', { params: queryParams });
  return response.data;
};

export const getFeaturedRooms = async () => {
  const response = await api.get('/rooms/featured');
  return response.data;
};

export const getRoomById = async (roomId) => {
  const response = await api.get(`/rooms/${roomId}`);
  return response.data;
};
