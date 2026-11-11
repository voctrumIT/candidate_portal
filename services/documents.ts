import { fetchApi } from '../lib/api';

export const documentsService = {
  getDocuments: async () => {
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('candidate_token');
      if (!token) return [];
    }
    let url = '/api/Candidate/documents';
    if (typeof window !== 'undefined') {
      const cid = localStorage.getItem("candidate_id");
      if (cid) {
        url += `?candidateId=${cid}`;
      }
    }
    try {
      const res = await fetchApi(url, {
        method: 'GET',
      });
      return res?.payload || [];
    } catch {
      return [];
    }
  },
  
  uploadDocument: async (formData: FormData) => {
    let url = '/api/Candidate/document/upload';
    if (typeof window !== 'undefined') {
      const cid = localStorage.getItem("candidate_id");
      if (cid) {
        url += `?candidateId=${cid}`;
        if (typeof formData.has === 'function' ? !formData.has("CandidateId") : true) {
          formData.append("CandidateId", cid);
        }
      }
    }
    if (typeof formData.has === 'function' ? !formData.has("DocumentType") : true) {
      formData.append("DocumentType", "Resume");
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
