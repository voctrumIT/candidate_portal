import { fetchApi } from '../lib/api';

function getCandidateId(): string | null {
  if (typeof window === 'undefined') return null;
  const stored = localStorage.getItem('candidate_id') || localStorage.getItem('candidate_user_id');
  if (stored && stored !== 'undefined' && stored !== 'null') return stored;

  const token = localStorage.getItem('candidate_token');
  if (token) {
    try {
      const parts = token.split('.');
      if (parts.length >= 2) {
        const payload = JSON.parse(atob(parts[1]));
        const cid = payload.nameid || payload.sub || payload.CandidateId || payload.candidateId;
        if (cid) {
          localStorage.setItem('candidate_id', cid);
          return cid;
        }
      }
    } catch {}
  }
  return null;
}

export interface CandidateApplicationDto {
  jobApplicationId: string;
  tenantId?: string;
  applyDate: string;
  applicationStatus: string;
  updatedAt?: string;
  note?: string;
  job: {
    jobId: string;
    jobTitle: string;
    companyName: string;
    status: string;
    employmentType?: number;
    lastApplicationDate?: string;
    createdAt?: string;
    locations?: string[];
    salaryRange?: string;
  };
  id: string;
  jobId: string;
  title: string;
  company: string;
  location: string;
  salaryRange: string;
  postedDate: string;
  applyByDate: string;
  tags: string[];
  status: string;
  rawStatus: string;
  statusLabel: string;
  statusNote: string;
  currentStep: number;
  badgeClass: string;
  dotColor: string;
}

export function parseApplicationStatus(rawStatus?: string) {
  const normalized = String(rawStatus || 'applied').trim().toLowerCase();

  switch (normalized) {
    case 'interview':
    case 'interview scheduled':
      return {
        rawStatus: 'interview',
        status: 'Interview',
        statusLabel: 'Interview Scheduled',
        statusNote: 'Interview stage active. Recruiter will coordinate interview schedule.',
        currentStep: 3,
        badgeClass: 'bg-indigo-50 text-indigo-700 border-indigo-200 dark:bg-indigo-950/40 dark:text-indigo-300 dark:border-indigo-800',
        dotColor: 'bg-indigo-600',
      };
    case 'reviewing':
    case 'under review':
    case 'in review':
      return {
        rawStatus: 'reviewing',
        status: 'In Review',
        statusLabel: 'Under Review',
        statusNote: 'Your profile is actively being reviewed by hiring team.',
        currentStep: 2,
        badgeClass: 'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/40 dark:text-amber-300 dark:border-amber-800',
        dotColor: 'bg-amber-500',
      };
    case 'shortlisted':
      return {
        rawStatus: 'shortlisted',
        status: 'Shortlisted',
        statusLabel: 'Shortlisted',
        statusNote: 'Congratulations! You have passed initial screening and are shortlisted.',
        currentStep: 2,
        badgeClass: 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-800',
        dotColor: 'bg-emerald-600',
      };
    case 'offered':
    case 'offer':
      return {
        rawStatus: 'offered',
        status: 'Offered',
        statusLabel: 'Offer Extended',
        statusNote: 'Congratulations! A formal offer letter has been extended.',
        currentStep: 4,
        badgeClass: 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-800',
        dotColor: 'bg-emerald-600',
      };
    case 'hired':
      return {
        rawStatus: 'hired',
        status: 'Hired',
        statusLabel: 'Hired',
        statusNote: 'Hiring completed. Welcome to the team!',
        currentStep: 4,
        badgeClass: 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-800',
        dotColor: 'bg-emerald-600',
      };
    case 'rejected':
      return {
        rawStatus: 'rejected',
        status: 'Rejected',
        statusLabel: 'Not Selected',
        statusNote: 'Thank you for your interest. Role filled or candidate pool finalized.',
        currentStep: 4,
        badgeClass: 'bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-950/40 dark:text-rose-300 dark:border-rose-800',
        dotColor: 'bg-rose-500',
      };
    case 'pending':
      return {
        rawStatus: 'pending',
        status: 'Pending',
        statusLabel: 'Pending Review',
        statusNote: 'Application received and queued for screening.',
        currentStep: 1,
        badgeClass: 'bg-sky-50 text-sky-700 border-sky-200 dark:bg-sky-950/40 dark:text-sky-300 dark:border-sky-800',
        dotColor: 'bg-sky-500',
      };
    case 'applied':
    default:
      return {
        rawStatus: 'applied',
        status: 'Applied',
        statusLabel: 'Application Submitted',
        statusNote: 'Application submitted and received by recruiter.',
        currentStep: 1,
        badgeClass: 'bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950/40 dark:text-blue-300 dark:border-blue-800',
        dotColor: 'bg-blue-600',
      };
  }
}

function isGuid(val: string): boolean {
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(String(val || '').trim());
}

export const jobsService = {
  getJobs: async () => {
    return fetchApi('/api/Candidate/jobs', {
      method: 'GET',
    });
  },

  getPreferredJobs: async () => {
    let url = '/api/Candidate/preferred-jobs';
    if (typeof window !== 'undefined') {
      const cid = localStorage.getItem('candidate_id');
      if (cid) {
        url += `?candidateId=${encodeURIComponent(cid)}`;
      }
    }
    try {
      const res = await fetchApi(url, {
        method: 'GET',
      });
      const payload = res?.payload || res;
      if (Array.isArray(payload) && payload.length > 0) {
        return payload;
      }
      if (payload && Array.isArray(payload.preferredJobs) && payload.preferredJobs.length > 0) {
        return payload.preferredJobs;
      }
      if (payload && Array.isArray(payload.jobs) && payload.jobs.length > 0) {
        return payload.jobs;
      }
    } catch (err) {
      console.warn('GET /api/Candidate/preferred-jobs notice:', err);
    }
    // Fallback to active jobs so UI remains populated if user has not set preferences yet
    try {
      const jobsRes = await jobsService.getJobs();
      return jobsRes?.payload?.jobs || (Array.isArray(jobsRes) ? jobsRes : []);
    } catch {
      return [];
    }
  },

  getJobById: async (jobId: string) => {
    return fetchApi(`/api/Candidate/jobs/${encodeURIComponent(jobId)}`, {
      method: 'GET',
    });
  },
  
  applyForJob: async (data: {
    jobId: string;
    tenantId?: string;
    resumeLink?: string;
    note?: string;
    candidateId?: string;
  }) => {
    let candidateId = data.candidateId || getCandidateId();
    let tenantId = data.tenantId;

    if (typeof window !== 'undefined') {
      if (!tenantId || tenantId === 'production_test') {
        tenantId = localStorage.getItem('tenant_id') || 'dotnetapi';
      }
    }
    if (!tenantId) {
      tenantId = 'dotnetapi';
    }

    // Ensure resumeLink is a valid URL meeting ASP.NET [Url] attribute requirement
    let resumeLink = data.resumeLink;
    if (!resumeLink || typeof resumeLink !== 'string' || !resumeLink.startsWith('http')) {
      if (typeof window !== 'undefined' && resumeLink && typeof resumeLink === 'string' && resumeLink.startsWith('/')) {
        resumeLink = `${window.location.origin}${resumeLink}`;
      } else {
        resumeLink = 'https://dotnetapi.voctrum.com/resumes/default-candidate-resume.pdf';
      }
    }

    // Ensure note is trimmed to ASP.NET [MaxLength(200)] limit
    const note = (data.note || 'Applied from Voctrum Candidate Portal').slice(0, 190);

    const safeJobId = String(data.jobId || '').trim();

    // If mock/demo job ID that is not a valid GUID (e.g. "1", "2")
    if (!isGuid(safeJobId)) {
      if (typeof window !== 'undefined') {
        const localAppsRaw = localStorage.getItem('candidate_local_applications') || '[]';
        try {
          const localApps = JSON.parse(localAppsRaw);
          if (!localApps.some((a: any) => String(a.jobId) === safeJobId)) {
            localApps.unshift({
              jobApplicationId: `local-app-${Date.now()}`,
              jobId: safeJobId,
              applyDate: new Date().toISOString().split('T')[0],
              applicationStatus: 'applied',
              note,
            });
            localStorage.setItem('candidate_local_applications', JSON.stringify(localApps));
          }
        } catch {}

        try {
          const rawApplied = localStorage.getItem('candidate_applied_jobs') || '[]';
          const listApplied = JSON.parse(rawApplied);
          if (!listApplied.includes(safeJobId)) {
            listApplied.push(safeJobId);
            localStorage.setItem('candidate_applied_jobs', JSON.stringify(listApplied));
          }
        } catch {}

        window.dispatchEvent(new CustomEvent('job_applied', { detail: { jobId: safeJobId } }));
      }
      return {
        success: true,
        message: 'Application submitted successfully.',
        payload: {
          jobApplicationId: `mock-app-${Date.now()}`,
          candidateId: candidateId || 'demo-candidate',
          jobId: safeJobId,
          applyDate: new Date().toISOString().split('T')[0],
          applicationStatus: 0,
        },
      };
    }

    const payload: any = {
      jobId: safeJobId,
      tenantId,
      resumeLink,
      note,
    };

    if (candidateId) {
      payload.candidateId = candidateId;
    }

    const res = await fetchApi('/api/Candidate/jobs/apply', {
      method: 'POST',
      body: JSON.stringify(payload),
    });

    if (typeof window !== 'undefined') {
      try {
        const rawApplied = localStorage.getItem('candidate_applied_jobs') || '[]';
        const listApplied = JSON.parse(rawApplied);
        if (!listApplied.includes(safeJobId)) {
          listApplied.push(safeJobId);
          localStorage.setItem('candidate_applied_jobs', JSON.stringify(listApplied));
        }
      } catch {}

      window.dispatchEvent(new CustomEvent('job_applied', { detail: { jobId: safeJobId } }));
    }

    return res;
  },

  getApplications: async () => {
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('candidate_token');
      if (!token) return [];
    }
    let url = '/api/Candidate/applications';
    if (typeof window !== 'undefined') {
      const cid = getCandidateId();
      if (cid) {
        url += `?candidateId=${encodeURIComponent(cid)}`;
      }
    }
    let backendApps: any[] = [];
    try {
      const res = await fetchApi(url, {
        method: 'GET',
      });
      const list = res?.payload || (Array.isArray(res) ? res : []);
      if (Array.isArray(list)) {
        backendApps = list;
      }
    } catch (e) {
      console.warn('GET /api/Candidate/applications notice:', e);
    }

    let localApps: any[] = [];
    if (typeof window !== 'undefined') {
      try {
        const raw = localStorage.getItem('candidate_local_applications');
        if (raw) localApps = JSON.parse(raw);
      } catch {}
    }

    const combined = [...backendApps, ...localApps];

    if (typeof window !== 'undefined' && combined.length > 0) {
      try {
        const appliedIds = combined.map((a: any) => String(a.jobId || a.job?.jobId || a.id)).filter(Boolean);
        const existingRaw = localStorage.getItem('candidate_applied_jobs') || '[]';
        const merged = Array.from(new Set([...JSON.parse(existingRaw), ...appliedIds]));
        localStorage.setItem('candidate_applied_jobs', JSON.stringify(merged));
      } catch {}
    }

    return combined.map((item: any): CandidateApplicationDto => {
      const nestedJob = item.job || {};
      const jobId = String(nestedJob.jobId || nestedJob.id || item.jobId || item.id || '');
      const title = nestedJob.jobTitle || nestedJob.title || item.jobTitle || item.title || 'Job Opportunity';
      const company = nestedJob.companyName || nestedJob.company || item.companyName || item.company || 'Voctrum Partner';
      const loc = Array.isArray(nestedJob.locations) && nestedJob.locations.length > 0
        ? nestedJob.locations.join(', ')
        : (typeof nestedJob.locations === 'string' ? nestedJob.locations : (nestedJob.location || item.location || 'Remote'));

      let salary = nestedJob.salaryRange || nestedJob.salary || item.salaryRange;
      if (salary && !String(salary).includes('$') && !String(salary).includes('₹')) {
        const num = Number(salary);
        if (!isNaN(num) && num > 0) {
          salary = num <= 100 ? `₹${num} LPA` : `₹${num.toLocaleString()}/yr`;
        }
      }
      if (!salary) salary = 'Competitive';

      const applyDate = item.applyDate || item.appliedAt || item.createdAt;
      const postedDate = applyDate ? `Applied ${new Date(applyDate).toLocaleDateString()}` : 'Applied recently';

      const statusInfo = parseApplicationStatus(item.applicationStatus || item.status);

      const empType = nestedJob.employmentType === 0 ? 'Full-time' : nestedJob.employmentType === 1 ? 'Part-time' : nestedJob.employmentType === 2 ? 'Contract' : 'Full-time';

      return {
        ...item,
        jobApplicationId: item.jobApplicationId || item.id,
        tenantId: item.tenantId,
        applyDate: applyDate || new Date().toISOString().split('T')[0],
        applicationStatus: statusInfo.rawStatus,
        updatedAt: item.updatedAt,
        note: item.note,
        job: {
          jobId,
          jobTitle: title,
          companyName: company,
          status: nestedJob.status || 'active',
          employmentType: nestedJob.employmentType,
          lastApplicationDate: nestedJob.lastApplicationDate,
          createdAt: nestedJob.createdAt,
          locations: Array.isArray(nestedJob.locations) ? nestedJob.locations : [loc],
          salaryRange: salary,
        },
        id: jobId,
        jobId,
        title,
        company,
        location: loc,
        salaryRange: salary,
        postedDate,
        applyByDate: nestedJob.lastApplicationDate ? `Apply by ${new Date(nestedJob.lastApplicationDate).toLocaleDateString()}` : 'Applied',
        tags: [empType, statusInfo.statusLabel].filter(Boolean),
        status: statusInfo.status,
        rawStatus: statusInfo.rawStatus,
        statusLabel: statusInfo.statusLabel,
        statusNote: item.note || statusInfo.statusNote,
        currentStep: statusInfo.currentStep,
        badgeClass: statusInfo.badgeClass,
        dotColor: statusInfo.dotColor,
      };
    });
  },

  saveJob: async (jobId: string, _jobData?: any) => {
    if (typeof window === 'undefined') return false;
    const token = localStorage.getItem('candidate_token');
    const candidateId = localStorage.getItem('candidate_id');
    if (!token || !candidateId) return false;

    await fetchApi('/api/Candidate/jobs/save', {
      method: 'POST',
      body: JSON.stringify({ candidateId, jobId: String(jobId) }),
    });
    return true;
  },

  unsaveJob: async (jobId: string) => {
    if (typeof window === 'undefined') return false;
    const token = localStorage.getItem('candidate_token');
    const candidateId = localStorage.getItem('candidate_id');
    if (!token || !candidateId) return false;

    await fetchApi('/api/Candidate/jobs/unsave', {
      method: 'POST',
      body: JSON.stringify({ candidateId, jobId: String(jobId) }),
    });
    return true;
  },

  getSavedJobs: async () => {
    if (typeof window === 'undefined') return [];
    const token = localStorage.getItem('candidate_token');
    const candidateId = localStorage.getItem('candidate_id');
    if (!token || !candidateId) return [];

    try {
      const res = await fetchApi(`/api/Candidate/jobs/saved?candidateId=${candidateId}`, { method: 'GET' });
      const apiSaved = res?.payload || res;
      if (!Array.isArray(apiSaved)) return [];

      return apiSaved.map((apiJob: any) => ({
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
    } catch {
      return [];
    }
  },

  isJobApplied: (jobId: string): boolean => {
    if (typeof window === 'undefined') return false;
    const token = localStorage.getItem('candidate_token');
    if (!token) return false;
    try {
      const raw = localStorage.getItem('candidate_applied_jobs');
      if (!raw) return false;
      const list = JSON.parse(raw);
      if (!Array.isArray(list)) return false;
      const idStr = String(jobId);
      return list.some((id: any) => String(id) === idStr);
    } catch {
      return false;
    }
  },

  getApplicationById: async (id: string): Promise<any> => {
    const safeId = String(id || '').trim();
    if (!safeId) return null;

    try {
      // 1. Check all applications from candidate
      const apps = await jobsService.getApplications();
      const match = apps.find(
        (a: any) =>
          String(a.jobApplicationId) === safeId ||
          String(a.jobId) === safeId ||
          String(a.id) === safeId
      );

      // 2. Fetch full job details if we have a jobId
      const targetJobId = match?.jobId || safeId;
      let fullJob: any = null;
      try {
        const jobRes = await jobsService.getJobById(targetJobId);
        fullJob = jobRes?.payload || jobRes;
      } catch {}

      if (match) {
        return {
          ...match,
          fullJob: fullJob || match.job,
        };
      }

      // If no direct application record found, synthesize from job
      if (fullJob) {
        const statusInfo = parseApplicationStatus('applied');
        return {
          jobApplicationId: `app-${safeId}`,
          jobId: targetJobId,
          id: targetJobId,
          title: fullJob.jobTitle || fullJob.title || 'Job Opportunity',
          company: fullJob.companyName || fullJob.company || 'Company',
          location: Array.isArray(fullJob.locations) ? fullJob.locations.join(', ') : (fullJob.location || 'Remote'),
          salaryRange: fullJob.salaryRange || 'Competitive',
          applyDate: new Date().toISOString().split('T')[0],
          postedDate: 'Applied recently',
          status: statusInfo.status,
          rawStatus: statusInfo.rawStatus,
          statusLabel: statusInfo.statusLabel,
          statusNote: statusInfo.statusNote,
          currentStep: 1,
          badgeClass: statusInfo.badgeClass,
          dotColor: statusInfo.dotColor,
          fullJob,
          job: fullJob,
        };
      }
    } catch (err) {
      console.warn('getApplicationById error:', err);
    }
    return null;
  },
};
