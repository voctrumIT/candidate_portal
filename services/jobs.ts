import { fetchApi } from '../lib/api';

export const jobsService = {
  getJobs: async () => {
    return fetchApi('/api/Candidate/jobs', {
      method: 'GET',
    });
  },
  
  applyForJob: async (data: any) => {
    return fetchApi('/api/Candidate/jobs/apply', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  getApplications: async () => {
    let url = '/api/Candidate/applications';
    if (typeof window !== 'undefined') {
      const cid = localStorage.getItem("candidate_id");
      if (cid) {
        url += `?candidateId=${cid}`;
      }
    }
    const res = await fetchApi(url, {
      method: 'GET',
    });
    return res?.payload || [];
  }
};
