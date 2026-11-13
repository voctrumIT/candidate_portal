import { fetchApi } from '../lib/api';

export interface EducationDto {
  id?: string;
  institution: string;
  degree: string;
  grade?: string | null;
  yearOfPassing?: number | null;
  startDate?: string | null;
  endDate?: string | null;
}

export interface WorkExperienceDto {
  id?: string;
  role?: string;
  title?: string;
  position?: string;
  jobTitle?: string;
  designation?: string;
  company?: string;
  companyName?: string;
  organization?: string;
  location?: string;
  employmentType?: string;
  startDate?: string | null;
  endDate?: string | null;
  currentRole?: boolean;
  current?: boolean;
  isCurrent?: boolean;
  skills?: string[];
  description?: string;
  responsibilities?: string;
}

export interface AddressDto {
  addressLine1?: string | null;
  addressLine2?: string | null;
  city?: string | null;
  state?: string | null;
  postalCode?: string | null;
  country?: string | null;
}

export interface UpdateCandidateProfileData {
  candidateId?: string;
  name?: string;
  email?: string;
  contactNumber?: string | null;
  addressLine1?: string | null;
  addressLine2?: string | null;
  city?: string | null;
  state?: string | null;
  country?: string | null;
  postalCode?: string | null;
  address?: AddressDto | null;
  skills?: string[] | null;
  educations?: EducationDto[] | null;
  workExperiences?: WorkExperienceDto[] | null;
  experiences?: WorkExperienceDto[] | null;
  aboutMe?: string | null;
  summary?: string | null;
  about?: string | null;
  bio?: string | null;
  [key: string]: any;
}

export interface CandidateProfilePayload {
  candidateId: string;
  name: string;
  email: string;
  contactNumber?: string | null;
  address?: AddressDto | null;
  skills?: string[] | null;
  educations?: EducationDto[] | null;
  workExperiences?: WorkExperienceDto[] | null;
  experiences?: WorkExperienceDto[] | null;
  aboutMe?: string | null;
  summary?: string | null;
  about?: string | null;
  bio?: string | null;
  [key: string]: any;
}

/**
 * Checks whether a string is a valid UUID/GUID format.
 * Client-generated dummy IDs (e.g. "exp-1731464...") must not be sent to .NET GUID properties.
 */
export function isGuid(val?: string | null): boolean {
  if (!val) return false;
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(val.trim());
}

/**
 * Normalizes date inputs to strict "YYYY-MM-DD" DateOnly format required by .NET System.DateOnly.
 * Prevents 400 Bad Request deserialization errors caused by ISO strings with timestamps.
 */
export function toDateOnlyString(val: any): string | null {
  if (!val) return null;
  const str = String(val).trim();
  if (!str || str.toLowerCase() === 'present') return null;
  const match = str.match(/^(\d{4}-\d{2}-\d{2})/);
  if (match) return match[1];
  try {
    const d = new Date(str);
    if (!isNaN(d.getTime())) {
      const yyyy = d.getFullYear();
      const mm = String(d.getMonth() + 1).padStart(2, '0');
      const dd = String(d.getDate()).padStart(2, '0');
      return `${yyyy}-${mm}-${dd}`;
    }
  } catch {}
  return null;
}

/**
 * Decodes candidate claims from the stored JWT token as a safe fallback for required fields.
 */
export function getCandidateInfoFromToken(): { name?: string; email?: string; candidateId?: string } {
  if (typeof window === 'undefined') return {};
  try {
    const token = localStorage.getItem('candidate_token');
    if (!token) return {};
    const parts = token.split('.');
    if (parts.length === 3) {
      const base64Url = parts[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const jsonPayload = decodeURIComponent(
        atob(base64)
          .split('')
          .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
          .join('')
      );
      const parsed = JSON.parse(jsonPayload);
      return {
        name:
          parsed.name ||
          parsed.unique_name ||
          parsed.fullName ||
          parsed['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name'],
        email:
          parsed.email ||
          parsed['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress'],
        candidateId:
          parsed.candidateId ||
          parsed.sub ||
          parsed.nameid ||
          parsed['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier'],
      };
    }
  } catch {}
  return {};
}

/**
 * Sanitizes and normalizes a single work experience object for the .NET backend API.
 * Prevents 400 Bad Request errors by:
 * 1. Supplying designation and organization (the exact property names required by .NET DTO).
 * 2. Never sending string literals like "Present" for endDate (sends null instead).
 * 3. Formatting startDate and endDate as strict "YYYY-MM-DD" DateOnly strings.
 * 4. Omitting non-GUID client temporary IDs so .NET GUID deserializers do not crash.
 */
export function formatExperienceForApi(exp: any): WorkExperienceDto | null {
  if (!exp) return null;
  const roleTitle = (exp.designation || exp.role || exp.title || exp.position || exp.jobTitle || '').trim();
  const compName = (exp.organization || exp.company || exp.companyName || '').trim();
  const loc = (exp.location || '').trim();
  const empType = exp.employmentType || 'Full-time';
  const desc = (exp.description || exp.responsibilities || '').trim();
  const isCurrent = Boolean(
    exp.currentRole || exp.current || exp.isCurrent || String(exp.endDate || '').toLowerCase() === 'present' || !exp.endDate
  );

  const startStr = toDateOnlyString(exp.startDate);
  const endStr = isCurrent ? null : toDateOnlyString(exp.endDate);

  const result: any = {
    designation: roleTitle,
    organization: compName,
    role: roleTitle,
    title: roleTitle,
    position: roleTitle,
    jobTitle: roleTitle,
    company: compName,
    companyName: compName,
    location: loc,
    employmentType: empType,
    startDate: startStr,
    endDate: endStr,
    currentRole: isCurrent,
    current: isCurrent,
    isCurrent: isCurrent,
    skills: Array.isArray(exp.skills) ? exp.skills : [],
    description: desc,
    responsibilities: desc,
  };

  // Only attach ID if it is a valid UUID/GUID from backend
  if (exp.id && isGuid(exp.id)) {
    result.id = exp.id;
  }

  return result;
}

/**
 * Sanitizes and normalizes an education record for the backend API.
 */
export function formatEducationForApi(edu: any): EducationDto | null {
  if (!edu) return null;
  const startStr = toDateOnlyString(edu.startDate);
  const endStr = toDateOnlyString(edu.endDate);
  const yearNum = edu.yearOfPassing ? Number(edu.yearOfPassing) : null;
  const result: any = {
    institution: (edu.institution || '').trim(),
    degree: (edu.degree || '').trim(),
    grade: edu.grade ? String(edu.grade).trim() : null,
    yearOfPassing: !isNaN(yearNum as any) ? yearNum : null,
    startDate: startStr,
    endDate: endStr,
  };
  if (edu.id && isGuid(edu.id)) {
    result.id = edu.id;
  }
  return result;
}

/**
 * Validates candidate profile update data before sending to API
 */
export function validateProfileUpdate(data: Partial<UpdateCandidateProfileData>): {
  isValid: boolean;
  errors: Record<string, string>;
} {
  const errors: Record<string, string> = {};

  if (data.name !== undefined) {
    const trimmed = data.name.trim();
    if (!trimmed) {
      errors.name = 'Full name is required.';
    } else if (trimmed.length < 2) {
      errors.name = 'Full name must be at least 2 characters long.';
    } else if (trimmed.length > 100) {
      errors.name = 'Full name cannot exceed 100 characters.';
    }
  }

  if (data.contactNumber !== undefined && data.contactNumber !== null && data.contactNumber !== '') {
    const trimmed = data.contactNumber.trim();
    // Allow phone numbers with digits, spaces, hyphens, and optional leading +
    const phoneRegex = /^[+]?[\d\s-]{7,20}$/;
    if (!phoneRegex.test(trimmed)) {
      errors.contactNumber = 'Please enter a valid contact number (7 to 20 digits).';
    }
  }

  if (data.addressLine1 && data.addressLine1.length > 255) {
    errors.addressLine1 = 'Address line 1 cannot exceed 255 characters.';
  }

  if (data.addressLine2 && data.addressLine2.length > 255) {
    errors.addressLine2 = 'Address line 2 cannot exceed 255 characters.';
  }

  if (data.city && data.city.length > 100) {
    errors.city = 'City cannot exceed 100 characters.';
  }

  if (data.state && data.state.length > 100) {
    errors.state = 'State cannot exceed 100 characters.';
  }

  if (data.country && data.country.length > 100) {
    errors.country = 'Country cannot exceed 100 characters.';
  }

  if (data.postalCode && data.postalCode.length > 20) {
    errors.postalCode = 'Postal code cannot exceed 20 characters.';
  }

  if (data.educations && Array.isArray(data.educations)) {
    data.educations.forEach((edu, idx) => {
      if (!edu.institution || !edu.institution.trim()) {
        errors[`education_${idx}_institution`] = 'Institution name is required.';
      } else if (edu.institution.length > 150) {
        errors[`education_${idx}_institution`] = 'Institution cannot exceed 150 characters.';
      }

      if (!edu.degree || !edu.degree.trim()) {
        errors[`education_${idx}_degree`] = 'Degree is required.';
      } else if (edu.degree.length > 100) {
        errors[`education_${idx}_degree`] = 'Degree cannot exceed 100 characters.';
      }

      if (edu.yearOfPassing !== undefined && edu.yearOfPassing !== null) {
        const year = Number(edu.yearOfPassing);
        if (isNaN(year) || year < 1950 || year > 2100) {
          errors[`education_${idx}_year`] = 'Please enter a valid year between 1950 and 2100.';
        }
      }
    });
  }

  if (data.workExperiences && Array.isArray(data.workExperiences)) {
    data.workExperiences.forEach((exp, idx) => {
      const role = (exp.role || exp.title || '').trim();
      const comp = (exp.company || exp.organization || '').trim();
      if (!role) {
        errors[`workExperience_${idx}_role`] = 'Job title / designation is required.';
      } else if (role.length > 100) {
        errors[`workExperience_${idx}_role`] = 'Job title cannot exceed 100 characters.';
      }
      if (!comp) {
        errors[`workExperience_${idx}_company`] = 'Company / organisation name is required.';
      } else if (comp.length > 150) {
        errors[`workExperience_${idx}_company`] = 'Company name cannot exceed 150 characters.';
      }
      if (!exp.startDate) {
        errors[`workExperience_${idx}_startDate`] = 'Start date is required.';
      }
      if (!exp.currentRole && !exp.current && !exp.endDate) {
        errors[`workExperience_${idx}_endDate`] = 'End date is required unless currently working here.';
      }
    });
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
}

export const profileService = {
  getProfile: async () => {
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('candidate_token');
      if (!token) return null;
    }
    let url = '/api/Candidate/profile';
    const params = new URLSearchParams();
    if (typeof window !== 'undefined') {
      const cid = localStorage.getItem('candidate_id');
      if (cid) {
        params.append('candidateId', cid);
      }
    }
    params.append('_t', String(Date.now()));
    url += `?${params.toString()}`;

    try {
      return await fetchApi(url, {
        method: 'GET',
        cache: 'no-store',
        headers: {
          'Cache-Control': 'no-cache, no-store, must-revalidate',
          Pragma: 'no-cache',
        },
      });
    } catch (err) {
      console.warn('Profile fetch failed:', err);
      return null;
    }
  },

  /**
   * Updates candidate profile details using PUT /api/Candidate/profile/update.
   * Merges with existing profile by default so unspecified fields are not wiped.
   * Guarantees all required fields (candidateId, name, contact) are never omitted,
   * avoiding 400 Bad Request model validation errors.
   */
  updateProfile: async (
    data: Partial<UpdateCandidateProfileData>,
    mergeWithExisting: boolean = true
  ) => {
    const tokenInfo = getCandidateInfoFromToken();
    let candidateId =
      data.candidateId ||
      (typeof window !== 'undefined' ? localStorage.getItem('candidate_id') || undefined : undefined) ||
      tokenInfo.candidateId;
    let candidateName =
      data.name ||
      (typeof window !== 'undefined' ? localStorage.getItem('candidate_name') || undefined : undefined) ||
      tokenInfo.name;
    let candidateContact =
      data.contactNumber ||
      (typeof window !== 'undefined' ? localStorage.getItem('candidate_contact') || undefined : undefined);
    let candidateEmail = data.email || tokenInfo.email;

    let addr: AddressDto = {
      addressLine1: data.addressLine1 || null,
      addressLine2: data.addressLine2 || null,
      city: data.city || null,
      state: data.state || null,
      country: data.country || null,
      postalCode: data.postalCode || null,
    };

    let targetSkills = Array.isArray(data.skills) ? data.skills : undefined;
    let targetEdus = Array.isArray(data.educations) ? data.educations : undefined;
    let targetExps =
      data.workExperiences !== undefined
        ? data.workExperiences
        : data.experiences !== undefined
          ? data.experiences
          : undefined;

    const summaryVal =
      data.aboutMe !== undefined
        ? data.aboutMe
        : data.summary !== undefined
          ? data.summary
          : data.about !== undefined
            ? data.about
            : data.bio !== undefined
              ? data.bio
              : undefined;

    let existingSummary: string | null = null;

    if (mergeWithExisting) {
      try {
        const currentRes = await profileService.getProfile();
        const current = currentRes?.payload || currentRes;
        if (current) {
          if (!candidateId) candidateId = current.candidateId || current.id;
          if (!candidateName) candidateName = current.name || current.fullName;
          if (!candidateContact) candidateContact = current.contactNumber || current.mobile;
          if (!candidateEmail) candidateEmail = current.email;

          let currentAddr = current.address || {};
          if (typeof window !== 'undefined' && (!currentAddr.addressLine1 && !currentAddr.city)) {
            try {
              const cached = localStorage.getItem('candidate_address');
              if (cached) {
                currentAddr = { ...JSON.parse(cached), ...currentAddr };
              }
            } catch {}
          }

          addr = {
            addressLine1:
              data.addressLine1 !== undefined ? data.addressLine1 : currentAddr.addressLine1 || current.addressLine1 || null,
            addressLine2:
              data.addressLine2 !== undefined ? data.addressLine2 : currentAddr.addressLine2 || current.addressLine2 || null,
            city:
              data.city !== undefined ? data.city : currentAddr.city || current.city || null,
            state:
              data.state !== undefined ? data.state : currentAddr.state || current.state || null,
            country:
              data.country !== undefined ? data.country : currentAddr.country || current.country || null,
            postalCode:
              data.postalCode !== undefined ? data.postalCode : currentAddr.postalCode || current.postalCode || null,
          };

          if (targetSkills === undefined) {
            targetSkills = Array.isArray(current.skills) ? current.skills : [];
          }

          if (targetEdus === undefined) {
            targetEdus = Array.isArray(current.educations) ? current.educations : [];
          }

          if (targetExps === undefined) {
            targetExps = Array.isArray(current.workExperiences)
              ? current.workExperiences
              : Array.isArray(current.experiences)
                ? current.experiences
                : [];
          }

          existingSummary = current.aboutMe || current.summary || current.about || current.bio || null;
        }
      } catch (err) {
        console.warn('Could not fetch existing profile to merge, continuing with fallback profile state', err);
      }
    }

    // Format all work experiences for API (cleans "Present" string, provides DateOnly YYYY-MM-DD, and maps designation & organization)
    const formattedExps: WorkExperienceDto[] = Array.isArray(targetExps)
      ? targetExps
          .map(formatExperienceForApi)
          .filter((item): item is WorkExperienceDto => item !== null)
      : [];

    // Format all educations for API
    const formattedEdus: EducationDto[] = Array.isArray(targetEdus)
      ? targetEdus
          .map(formatEducationForApi)
          .filter((item): item is EducationDto => item !== null)
      : [];

    const finalSummary = summaryVal !== undefined ? summaryVal : existingSummary;

    // Build the consolidated payload matching .NET Candidate update requirements
    const payload: UpdateCandidateProfileData = {
      candidateId: candidateId || undefined,
      name: (candidateName || 'Candidate').trim(),
      email: candidateEmail || undefined,
      contactNumber: candidateContact || null,
      addressLine1: addr.addressLine1,
      addressLine2: addr.addressLine2,
      city: addr.city,
      state: addr.state,
      country: addr.country,
      postalCode: addr.postalCode,
      address: addr,
      skills: targetSkills || [],
      educations: formattedEdus,
      workExperiences: formattedExps,
      experiences: formattedExps,
      aboutMe: finalSummary,
      summary: finalSummary,
      about: finalSummary,
      bio: finalSummary,
    };

    const res = await fetchApi('/api/Candidate/profile/update', {
      method: 'PUT',
      body: JSON.stringify(payload),
    });

    if (typeof window !== 'undefined') {
      if (candidateName) {
        try {
          localStorage.setItem('candidate_name', candidateName);
        } catch {}
      }
      if (candidateContact) {
        try {
          localStorage.setItem('candidate_contact', candidateContact);
        } catch {}
      }
      if (res && res.payload && res.payload.address) {
        try {
          localStorage.setItem('candidate_address', JSON.stringify(res.payload.address));
        } catch {}
      } else if (addr.addressLine1 || addr.city) {
        try {
          localStorage.setItem('candidate_address', JSON.stringify(addr));
        } catch {}
      }
    }

    return res;
  },
};
