import { fetchApi } from '../lib/api';

export const documentsService = {
  getDocuments: async () => {
    let url = '/api/Candidate/documents';
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
  },
  
  uploadDocument: async (formData: FormData) => {
    let url = '/api/Candidate/document/upload';
    if (typeof window !== 'undefined') {
      const cid = localStorage.getItem("candidate_id");
      if (cid) {
        url += `?candidateId=${cid}`;
        formData.append("CandidateId", cid);
      }
    }
    return fetchApi(url, {
      method: 'POST',
      body: formData,
    });
  },

  deleteDocument: async (fileUrl: string) => {
    let url = `/api/Candidate/document?fileUrl=${encodeURIComponent(fileUrl)}`;
    if (typeof window !== 'undefined') {
      const cid = localStorage.getItem("candidate_id");
      if (cid) {
        url += `&candidateId=${cid}`;
      }
    }
    return fetchApi(url, {
      method: 'DELETE',
    });
  }
};
