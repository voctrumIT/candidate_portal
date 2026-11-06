import { fetchApi } from '../lib/api';

export const profileService = {
  getProfile: async () => {
    let url = '/api/Candidate/profile';
    if (typeof window !== 'undefined') {
      const cid = localStorage.getItem("candidate_id");
      if (cid) {
        url += `?candidateId=${cid}`;
      }
    }
    return fetchApi(url, {
      method: 'GET',
    });
  },
  
  updateProfile: async (data: any) => {
    return fetchApi('/api/Candidate/profile/update', {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }
};
