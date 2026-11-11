import { fetchApi } from '../lib/api';

export interface EducationDto {
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
  company?: string;
  organization?: string;
  location?: string;
  employmentType?: string;
  startDate?: string;
  endDate?: string;
  currentRole?: boolean;
  current?: boolean;
  skills?: string[];
  description?: string;
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
  contactNumber?: string | null;
  addressLine1?: string | null;
  addressLine2?: string | null;
  city?: string | null;
  state?: string | null;
  country?: string | null;
  postalCode?: string | null;
  skills?: string[] | null;
  educations?: EducationDto[] | null;
  workExperiences?: WorkExperienceDto[] | null;
  experiences?: WorkExperienceDto[] | null;
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
  [key: string]: any;
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
    if (trimmed.length < 3) {
      errors.name = 'Full name must be at least 3 characters long.';
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
    if (typeof window !== 'undefined') {
      const cid = localStorage.getItem('candidate_id');
      if (cid) {
        url += `?candidateId=${cid}`;
      }
    }
    try {
      return await fetchApi(url, {
        method: 'GET',
      });
    } catch (err) {
      console.warn('Profile fetch failed:', err);
      return null;
    }
  },

  /**
   * Updates candidate profile details using PUT /api/Candidate/profile/update.
   * Merges with existing profile by default so unspecified fields are not wiped.
   */
  updateProfile: async (
    data: Partial<UpdateCandidateProfileData>,
    mergeWithExisting: boolean = true
  ) => {
    let candidateId = data.candidateId;
    if (!candidateId && typeof window !== 'undefined') {
      candidateId = localStorage.getItem('candidate_id') || undefined;
    }

    let payload: UpdateCandidateProfileData = {
      candidateId,
      name: data.name,
      contactNumber: data.contactNumber,
      addressLine1: data.addressLine1,
      addressLine2: data.addressLine2,
      city: data.city,
      state: data.state,
      country: data.country,
      postalCode: data.postalCode,
      skills: data.skills,
      educations: data.educations,
      workExperiences: data.workExperiences || data.experiences,
      experiences: data.experiences || data.workExperiences,
    };

    if (mergeWithExisting) {
      try {
        const currentRes = await profileService.getProfile();
        const current = currentRes?.payload || currentRes;
        if (current) {
          let addr = current.address || {};
          if (typeof window !== 'undefined' && (!addr.addressLine1 && !addr.city)) {
            try {
              const cached = localStorage.getItem('candidate_address');
              if (cached) {
                addr = { ...JSON.parse(cached), ...addr };
              }
            } catch {}
          }

          const existingExp = Array.isArray(current.workExperiences)
            ? current.workExperiences
            : (Array.isArray(current.experiences) ? current.experiences : []);

          payload = {
            candidateId: candidateId || current.candidateId,
            name: data.name !== undefined ? data.name : current.name,
            contactNumber:
              data.contactNumber !== undefined ? data.contactNumber : current.contactNumber,
            addressLine1:
              data.addressLine1 !== undefined ? data.addressLine1 : addr.addressLine1 || null,
            addressLine2:
              data.addressLine2 !== undefined ? data.addressLine2 : addr.addressLine2 || null,
            city: data.city !== undefined ? data.city : addr.city || null,
            state: data.state !== undefined ? data.state : addr.state || null,
            country: data.country !== undefined ? data.country : addr.country || null,
            postalCode: data.postalCode !== undefined ? data.postalCode : addr.postalCode || null,
            skills:
              data.skills !== undefined
                ? data.skills
                : Array.isArray(current.skills)
                  ? current.skills
                  : [],
            educations:
              data.educations !== undefined
                ? data.educations
                : Array.isArray(current.educations)
                  ? current.educations
                  : [],
            workExperiences:
              data.workExperiences !== undefined
                ? data.workExperiences
                : (data.experiences !== undefined ? data.experiences : existingExp),
            experiences:
              data.experiences !== undefined
                ? data.experiences
                : (data.workExperiences !== undefined ? data.workExperiences : existingExp),
          };
        }
      } catch (err) {
        console.warn('Could not fetch existing profile to merge, continuing with partial payload', err);
      }
    }

    const res = await fetchApi('/api/Candidate/profile/update', {
      method: 'PUT',
      body: JSON.stringify(payload),
    });

    if (typeof window !== 'undefined') {
      if (res && res.payload && res.payload.address) {
        try {
          localStorage.setItem('candidate_address', JSON.stringify(res.payload.address));
        } catch {}
      }
      if (data.workExperiences || data.experiences) {
        try {
          localStorage.setItem(
            'candidate_work_experience',
            JSON.stringify(data.workExperiences || data.experiences)
          );
        } catch {}
      }
    }

    return res;
  },
};
