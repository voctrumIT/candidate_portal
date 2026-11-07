import { fetchApi } from '../lib/api';

export const jobsService = {
  getJobs: async () => {
    return fetchApi('/api/Candidate/jobs', {
      method: 'GET',
    });
  },

  getJobById: async (jobId: string) => {
    return fetchApi(`/api/Candidate/jobs/${encodeURIComponent(jobId)}`, {
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
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('candidate_token');
      if (!token) return [];
    }
    let url = '/api/Candidate/applications';
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

  saveJob: async (jobId: string, jobData?: any) => {
    if (typeof window === 'undefined') return false;
    const token = localStorage.getItem('candidate_token');
    if (!token) return false;

    const idStr = String(jobId);
    let currentSaved: any[] = [];
    try {
      const raw = localStorage.getItem('candidate_saved_jobs');
      if (raw) currentSaved = JSON.parse(raw);
    } catch {
      currentSaved = [];
    }

    const exists = currentSaved.some((j) => String(j.id) === idStr || String(j.jobId) === idStr);
    if (!exists) {
      const itemToSave = {
        id: idStr,
        jobId: idStr,
        title: jobData?.title || 'Job Opportunity',
        company: jobData?.company || 'Voctrum',
        location: jobData?.location || 'Remote',
        salaryRange: jobData?.salaryRange || jobData?.salary || 'Negotiable',
        tags: jobData?.tags || ['Full-time', 'Remote'],
        postedDate: jobData?.postedDate || jobData?.posted || 'Posted recently',
        applyByDate: jobData?.applyByDate || jobData?.apply || jobData?.deadline || 'Apply by 30 April',
        savedAt: new Date().toISOString(),
      };
      currentSaved.unshift(itemToSave);
      localStorage.setItem('candidate_saved_jobs', JSON.stringify(currentSaved));
    }

    // Trigger local update event for all components
    window.dispatchEvent(new CustomEvent('saved_jobs_updated', { detail: { jobId: idStr, saved: true } }));

    // Sync with backend API
    try {
      await fetchApi('/api/Candidate/jobs/save', {
        method: 'POST',
        body: JSON.stringify({ jobId: idStr, tenantId: 'production_test' }),
      });
    } catch (err) {
      console.warn('Backend saveJob sync notice:', err);
    }

    return true;
  },

  unsaveJob: async (jobId: string) => {
    if (typeof window === 'undefined') return false;
    const idStr = String(jobId);
    let currentSaved: any[] = [];
    try {
      const raw = localStorage.getItem('candidate_saved_jobs');
      if (raw) currentSaved = JSON.parse(raw);
    } catch {
      currentSaved = [];
    }

    const filtered = currentSaved.filter((j) => String(j.id) !== idStr && String(j.jobId) !== idStr);
    localStorage.setItem('candidate_saved_jobs', JSON.stringify(filtered));

    // Trigger local update event
    window.dispatchEvent(new CustomEvent('saved_jobs_updated', { detail: { jobId: idStr, saved: false } }));

    // Sync with backend API
    try {
      await fetchApi('/api/Candidate/jobs/unsave', {
        method: 'POST',
        body: JSON.stringify({ jobId: idStr, tenantId: 'production_test' }),
      });
    } catch (err) {
      console.warn('Backend unsaveJob sync notice:', err);
    }

    return true;
  },

  getSavedJobs: async () => {
    if (typeof window === 'undefined') return [];
    const token = localStorage.getItem('candidate_token');
    if (!token) return [];

    let localSaved: any[] = [];
    try {
      const raw = localStorage.getItem('candidate_saved_jobs');
      if (raw) localSaved = JSON.parse(raw);
    } catch {
      localSaved = [];
    }

    try {
      const res = await fetchApi('/api/Candidate/jobs/saved', {
        method: 'GET',
      });
      const apiSaved = res?.payload || res;
      if (Array.isArray(apiSaved) && apiSaved.length > 0) {
        const mappedApi = apiSaved.map((apiJob: any) => ({
          id: String(apiJob.jobId || apiJob.id),
          jobId: String(apiJob.jobId || apiJob.id),
          title: apiJob.jobTitle || apiJob.title || 'Job Opportunity',
          company: apiJob.companyName || apiJob.company || 'Voctrum',
          location: Array.isArray(apiJob.locations)
            ? apiJob.locations.join(', ')
            : typeof apiJob.locations === 'string'
              ? apiJob.locations
              : 'Remote',
          tags: [
            apiJob.employmentType === 0 ? 'Full-time' : apiJob.employmentType === 1 ? 'Part-time' : 'Contract',
            apiJob.experience || 'Entry Level',
            apiJob.education || 'Graduate',
          ],
          postedDate: apiJob.createdAt ? `Posted ${new Date(apiJob.createdAt).toLocaleDateString()}` : 'Posted recently',
          applyByDate: apiJob.lastApplicationDate
            ? `Apply by ${new Date(apiJob.lastApplicationDate).toLocaleDateString()}`
            : 'Apply by 30 April',
          salaryRange: apiJob.salaryRange || 'Negotiable',
        }));

        const idSet = new Set(mappedApi.map((j: any) => String(j.id)));
        const merged = [...mappedApi, ...localSaved.filter((j: any) => !idSet.has(String(j.id)))];
        localStorage.setItem('candidate_saved_jobs', JSON.stringify(merged));
        return merged;
      }
    } catch (err) {
      // Backend may return 404 or empty if not yet saved on server; use localSaved seamlessly
    }

    return localSaved;
  },

  isJobSaved: (jobId: string): boolean => {
    if (typeof window === 'undefined') return false;
    const token = localStorage.getItem('candidate_token');
    if (!token) return false;
    try {
      const raw = localStorage.getItem('candidate_saved_jobs');
      if (!raw) return false;
      const list = JSON.parse(raw);
      if (!Array.isArray(list)) return false;
      const idStr = String(jobId);
      return list.some((j: any) => String(j.id) === idStr || String(j.jobId) === idStr);
    } catch {
      return false;
    }
  },
};
