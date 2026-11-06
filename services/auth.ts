import { fetchApi } from '../lib/api';

export const authService = {
  login: async (data: any) => {
    return fetchApi('/api/Candidate/login', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },
  
  register: async (data: any) => {
    return fetchApi('/api/Candidate/register', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  forgotPassword: async (data: any) => {
    return fetchApi('/api/Candidate/forgot-password', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },
};
