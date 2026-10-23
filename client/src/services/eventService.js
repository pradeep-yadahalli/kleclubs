
import api from './api';

export const getEvents = async (filters = {}) => {
  const response = await api.get('/events', {
    params: filters,
  });

  return response.data;
};
