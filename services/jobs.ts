import { fetchApi } from '../lib/api';
import { emailService } from './email';
import { dummyJobs } from '../app/jobs/data';

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
  currentCtc?: string;
  expectedCtc?: string;
  currentSalary?: string;
  expectedSalary?: string;
  noticePeriod?: string;
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
        currentStep: 4,
        badgeClass: 'bg-indigo-50 text-indigo-700 border-indigo-200 dark:bg-indigo-950/40 dark:text-indigo-300 dark:border-indigo-800',
        dotColor: 'bg-indigo-600',
      };
    case 'screening':
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
        currentStep: 3,
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
        currentStep: 5,
        badgeClass: 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-800',
        dotColor: 'bg-emerald-600',
      };
    case 'hired':
      return {
        rawStatus: 'hired',
        status: 'Hired',
        statusLabel: 'Hired',
        statusNote: 'Hiring completed. Welcome to the team!',
        currentStep: 5,
        badgeClass: 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-800',
        dotColor: 'bg-emerald-600',
      };
    case 'rejected':
      return {
        rawStatus: 'rejected',
        status: 'Rejected',
        statusLabel: 'Not Selected',
        statusNote: 'Thank you for your interest. Role filled or candidate pool finalized.',
        currentStep: 5,
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
    const safeId = String(jobId || '').trim();
    if (!safeId) return null;

    try {
      const res = await fetchApi(`/api/Candidate/jobs/${encodeURIComponent(safeId)}`, {
        method: 'GET',
      });
      if (res?.payload || res?.jobId || res?.id) {
        return res;
      }
    } catch {}

    // Fallback to dummyJobs for mock or seeded jobs
    const dummy = dummyJobs.find((d) => String(d.id) === safeId);
    if (dummy) {
      return {
        success: true,
        payload: {
          jobId: dummy.id,
          id: dummy.id,
          jobTitle: dummy.title,
          companyName: dummy.company,
          locations: [dummy.location],
          location: dummy.location,
          salaryRange: dummy.salaryRange,
          jobDescription: dummy.overview,
          overview: dummy.overview,
          responsibilities: dummy.responsibilities,
          qualifications: dummy.qualifications,
          skills: dummy.keySkills,
          aboutCompany: dummy.aboutCompany,
          createdAt: new Date().toISOString(),
          lastApplicationDate: '2026-04-30',
          employmentType: 0,
        },
      };
    }

    return null;
  },
  
  applyForJob: async (data: {
    jobId: string;
    tenantId?: string;
    resumeLink?: string;
    note?: string;
    noticePeriod?: string;
    currentCtc?: string;
    expectedCtc?: string;
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
    const note = (data.note || 'Applied from Voctrum Candidate Portal').trim().slice(0, 195);
    const noticePeriod = (data.noticePeriod || '').trim();
    const currentCtc = (data.currentCtc || '').trim();
    const expectedCtc = (data.expectedCtc || '').trim();

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
              noticePeriod,
              currentCtc,
              expectedCtc,
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
      noticePeriod,
      currentCtc,
      expectedCtc,
      currentSalary: currentCtc,
      expectedSalary: expectedCtc,
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
        const localAppsRaw = localStorage.getItem('candidate_local_applications') || '[]';
        const localApps = JSON.parse(localAppsRaw);
        if (!localApps.some((a: any) => String(a.jobId) === safeJobId)) {
          localApps.unshift({
            jobApplicationId: res?.payload?.jobApplicationId || `app-${safeJobId}`,
            jobId: safeJobId,
            applyDate: new Date().toISOString().split('T')[0],
            applicationStatus: 'applied',
            note,
            noticePeriod,
            currentCtc,
            expectedCtc,
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

    return res || { success: true, message: 'Application submitted.' };
  },

  getApplications: async () => {
    let token: string | null = null;
    if (typeof window !== 'undefined') {
      token = localStorage.getItem('candidate_token');
    }

    let backendApps: any[] = [];
    if (token) {
      let url = '/api/Candidate/applications';
      if (typeof window !== 'undefined') {
        const cid = getCandidateId();
        if (cid) {
          url += `?candidateId=${encodeURIComponent(cid)}`;
        }
      }
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
    }

    let localApps: any[] = [];
    if (typeof window !== 'undefined') {
      try {
        const raw = localStorage.getItem('candidate_local_applications');
        if (raw) localApps = JSON.parse(raw);
      } catch {}

      // Also ensure any job recorded in candidate_applied_jobs or candidate_application_meta is included
      try {
        const rawApplied = localStorage.getItem('candidate_applied_jobs') || '[]';
        const appliedList: string[] = JSON.parse(rawApplied);
        const existingJobIds = new Set(
          [...backendApps, ...localApps].map((a: any) => String(a.jobId || a.job?.jobId || a.id))
        );

        for (const jid of appliedList) {
          const strId = String(jid).trim();
          if (strId && !existingJobIds.has(strId)) {
            const dummy = dummyJobs.find((d) => String(d.id) === strId);
            let meta: any = null;
            try {
              const rawMeta = localStorage.getItem('candidate_application_meta');
              if (rawMeta) meta = JSON.parse(rawMeta)[strId];
            } catch {}

            localApps.push({
              jobApplicationId: `app-${strId}`,
              jobId: strId,
              id: strId,
              title: dummy?.title || 'Job Opportunity',
              company: dummy?.company || 'Hiring Partner',
              location: dummy?.location || 'Remote',
              salaryRange: dummy?.salaryRange || 'Competitive',
              applyDate: meta?.appliedAt ? new Date(meta.appliedAt).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
              applicationStatus: 'applied',
              note: meta?.note || 'Application submitted via Candidate Portal',
              currentCtc: meta?.currentCtc,
              expectedCtc: meta?.expectedCtc,
              noticePeriod: meta?.noticePeriod,
              job: dummy
                ? {
                    jobId: dummy.id,
                    jobTitle: dummy.title,
                    companyName: dummy.company,
                    locations: [dummy.location],
                    salaryRange: dummy.salaryRange,
                  }
                : undefined,
            });
            existingJobIds.add(strId);
          }
        }
      } catch {}
    }

    let statusOverrides: Record<string, { status: string; statusNote?: string; updatedAt?: string }> = {};
    if (typeof window !== 'undefined') {
      try {
        const rawOverrides = localStorage.getItem('candidate_status_overrides');
        if (rawOverrides) statusOverrides = JSON.parse(rawOverrides);
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

      const appKey = String(item.jobApplicationId || item.id || jobId);
      const override = statusOverrides[appKey] || statusOverrides[jobId];
      const effectiveRawStatus = override?.status || item.applicationStatus || item.status;
      const effectiveNote = override?.statusNote || item.note;

      const statusInfo = parseApplicationStatus(effectiveRawStatus);

      const empType = nestedJob.employmentType === 0 ? 'Full-time' : nestedJob.employmentType === 1 ? 'Part-time' : nestedJob.employmentType === 2 ? 'Contract' : 'Full-time';

      return {
        ...item,
        jobApplicationId: item.jobApplicationId || item.id,
        tenantId: item.tenantId,
        applyDate: applyDate || new Date().toISOString().split('T')[0],
        applicationStatus: statusInfo.rawStatus,
        updatedAt: override?.updatedAt || item.updatedAt,
        note: effectiveNote,
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
        statusNote: effectiveNote || statusInfo.statusNote,
        currentStep: statusInfo.currentStep,
        badgeClass: statusInfo.badgeClass,
        dotColor: statusInfo.dotColor,
        currentCtc: item.currentSalary || item.currentCtc,
        expectedCtc: item.expectedSalary || item.expectedCtc,
        noticePeriod: item.noticePeriod,
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
    const rawId = String(id || '').trim();
    if (!rawId) return null;
    const cleanId = rawId.replace(/^app-/i, '').trim();

    try {
      // 1. Check all applications from candidate
      const apps = await jobsService.getApplications();
      let match = apps.find(
        (a: any) =>
          String(a.jobApplicationId) === rawId ||
          String(a.jobApplicationId) === cleanId ||
          String(a.jobId) === rawId ||
          String(a.jobId) === cleanId ||
          String(a.id) === rawId ||
          String(a.id) === cleanId
      );

      // 2. Fetch full job details
      const targetJobId = match?.jobId || cleanId || rawId;
      let fullJob: any = null;
      try {
        const jobRes = await jobsService.getJobById(targetJobId);
        fullJob = jobRes?.payload || jobRes;
      } catch {}

      if (!fullJob) {
        const dummy = dummyJobs.find(
          (d) => String(d.id) === targetJobId || String(d.id) === cleanId || String(d.id) === rawId
        );
        if (dummy) {
          fullJob = {
            jobId: dummy.id,
            id: dummy.id,
            jobTitle: dummy.title,
            companyName: dummy.company,
            locations: [dummy.location],
            location: dummy.location,
            salaryRange: dummy.salaryRange,
            overview: dummy.overview,
            responsibilities: dummy.responsibilities,
            qualifications: dummy.qualifications,
            keySkills: dummy.keySkills,
            aboutCompany: dummy.aboutCompany,
          };
        }
      }

      // Check localStorage for overrides and application meta
      let overrideStatus = match?.applicationStatus || 'applied';
      let overrideNote = match?.note || match?.statusNote || '';
      let metaDetails: any = null;

      if (typeof window !== 'undefined') {
        try {
          const rawOverrides = localStorage.getItem('candidate_status_overrides');
          if (rawOverrides) {
            const parsed = JSON.parse(rawOverrides);
            const ov = parsed[rawId] || parsed[cleanId] || parsed[targetJobId];
            if (ov?.status) overrideStatus = ov.status;
            if (ov?.statusNote) overrideNote = ov.statusNote;
          }
        } catch {}

        try {
          const rawMeta = localStorage.getItem('candidate_application_meta');
          if (rawMeta) {
            const parsed = JSON.parse(rawMeta);
            metaDetails = parsed[rawId] || parsed[cleanId] || parsed[targetJobId];
            if (metaDetails?.note && !overrideNote) {
              overrideNote = metaDetails.note;
            }
          }
        } catch {}
      }

      const statusInfo = parseApplicationStatus(overrideStatus);

      if (match) {
        return {
          ...match,
          fullJob: fullJob || match.job,
          applicationStatus: statusInfo.rawStatus,
          rawStatus: statusInfo.rawStatus,
          status: statusInfo.status,
          statusLabel: statusInfo.statusLabel,
          statusNote: overrideNote || statusInfo.statusNote,
          currentStep: statusInfo.currentStep,
          badgeClass: statusInfo.badgeClass,
          dotColor: statusInfo.dotColor,
          currentCtc: metaDetails?.currentCtc || match.currentSalary || match.currentCtc,
          expectedCtc: metaDetails?.expectedCtc || match.expectedSalary || match.expectedCtc,
          noticePeriod: metaDetails?.noticePeriod || match.noticePeriod,
          note: overrideNote || match.note,
        };
      }

      // If no direct application record found in list, synthesize from job
      if (fullJob) {
        return {
          jobApplicationId: rawId.startsWith('app-') ? rawId : `app-${rawId}`,
          jobId: targetJobId,
          id: targetJobId,
          title: fullJob.jobTitle || fullJob.title || 'Job Opportunity',
          company: fullJob.companyName || fullJob.company || 'Company',
          location: Array.isArray(fullJob.locations) ? fullJob.locations.join(', ') : (fullJob.location || 'Remote'),
          salaryRange: fullJob.salaryRange || 'Competitive',
          applyDate: metaDetails?.appliedAt
            ? new Date(metaDetails.appliedAt).toISOString().split('T')[0]
            : new Date().toISOString().split('T')[0],
          postedDate: 'Applied recently',
          status: statusInfo.status,
          rawStatus: statusInfo.rawStatus,
          statusLabel: statusInfo.statusLabel,
          statusNote: overrideNote || statusInfo.statusNote,
          currentStep: statusInfo.currentStep,
          badgeClass: statusInfo.badgeClass,
          dotColor: statusInfo.dotColor,
          currentCtc: metaDetails?.currentCtc,
          expectedCtc: metaDetails?.expectedCtc,
          noticePeriod: metaDetails?.noticePeriod,
          note: overrideNote,
          fullJob,
          job: fullJob,
        };
      }
    } catch (err) {
      console.warn('getApplicationById error:', err);
    }
    return null;
  },

  updateApplicationStatus: async (params: {
    applicationIdOrJobId: string;
    newStatus: string;
    statusNote?: string;
    candidateEmail?: string;
    candidateName?: string;
    jobTitle?: string;
    companyName?: string;
    oldStatus?: string;
  }) => {
    const {
      applicationIdOrJobId,
      newStatus,
      statusNote,
      candidateEmail,
      candidateName,
      jobTitle,
      companyName,
      oldStatus,
    } = params;

    const key = String(applicationIdOrJobId).trim();
    const statusInfo = parseApplicationStatus(newStatus);
    const finalNote = statusNote || statusInfo.statusNote;

    if (typeof window !== 'undefined') {
      try {
        const raw = localStorage.getItem('candidate_status_overrides') || '{}';
        const overrides = JSON.parse(raw);
        overrides[key] = {
          status: statusInfo.rawStatus,
          statusNote: finalNote,
          updatedAt: new Date().toISOString(),
        };
        localStorage.setItem('candidate_status_overrides', JSON.stringify(overrides));
      } catch {}

      try {
        const rawLocal = localStorage.getItem('candidate_local_applications') || '[]';
        const localApps = JSON.parse(rawLocal);
        let changed = false;
        for (const app of localApps) {
          if (
            String(app.jobApplicationId) === key ||
            String(app.jobId) === key ||
            String(app.id) === key
          ) {
            app.applicationStatus = statusInfo.rawStatus;
            app.statusNote = finalNote;
            app.updatedAt = new Date().toISOString();
            changed = true;
          }
        }
        if (changed) {
          localStorage.setItem('candidate_local_applications', JSON.stringify(localApps));
        }
      } catch {}

      window.dispatchEvent(
        new CustomEvent('application_status_updated', {
          detail: {
            applicationId: key,
            newStatus: statusInfo.rawStatus,
            statusLabel: statusInfo.statusLabel,
            statusNote: finalNote,
          },
        })
      );
    }

    let emailDispatched = false;
    let emailMessage = '';
    if (candidateEmail) {
      try {
        const emailRes = await emailService.sendStageChangedEmail({
          email: candidateEmail,
          candidateName: candidateName || 'Candidate',
          jobTitle: jobTitle || 'Position Applied',
          companyName: companyName || 'Hiring Team',
          oldStage: oldStatus || 'Previous Stage',
          newStage: statusInfo.statusLabel,
          statusNote: finalNote,
          applicationId: key,
        });
        emailDispatched = emailRes.success;
        emailMessage = emailRes.message;
      } catch (e: any) {
        console.warn('Failed to send stage change email:', e);
        emailMessage = e?.message || 'Failed to dispatch email';
      }
    }

    return {
      success: true,
      newStatus: statusInfo.rawStatus,
      statusInfo,
      statusNote: finalNote,
      emailDispatched,
      emailMessage,
    };
  },
};
