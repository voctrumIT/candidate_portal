import { getUserFriendlyErrorMessage } from './errorUtils';

const BASE_URL = '';

/**
 * Helper function to handle standard fetch requests with auth and error handling
 */
export async function fetchApi(endpoint: string, options: RequestInit = {}) {
  // Always ensure headers exist
  const headers = new Headers(options.headers || {});
  
  // Set JSON content type by default (unless it's FormData)
  if (!(options.body instanceof FormData)) {
    if (!headers.has('Content-Type')) {
      headers.set('Content-Type', 'application/json');
    }
  }

  // Attach Authorization token if available in localStorage
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('candidate_token');
    if (token) {
      headers.set('Authorization', `Bearer ${token}`);
    }

    const tenantId = localStorage.getItem('tenant_id');
    if (tenantId && !headers.has('X-Tenant-ID')) {
      headers.set('X-Tenant-ID', tenantId);
    }
  }

  const response = await fetch(`${BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });

  // Handle No Content response
  if (response.status === 204) {
    return null;
  }

  const data = await response.json().catch(() => null);

  // Context deduction from endpoint
  let endpointContext: 'login' | 'register' | 'profile' | 'general' | undefined;
  if (endpoint.includes('/login')) endpointContext = 'login';
  else if (endpoint.includes('/register')) endpointContext = 'register';
  else if (endpoint.includes('/profile')) endpointContext = 'profile';

  if (!response.ok) {
    const rawMsg =
      data?.Message ||
      data?.message ||
      data?.Error ||
      data?.error ||
      data?.Title ||
      data?.title;
    const errorsObj = data?.Errors || data?.errors;
    let errorMsg = rawMsg;
    if (errorsObj) {
      if (Array.isArray(errorsObj)) {
        errorMsg = errorsObj.filter(Boolean).join(", ");
      } else if (typeof errorsObj === "object") {
        const flat = Object.entries(errorsObj)
          .map(([k, v]) => `${k}: ${Array.isArray(v) ? v.join(", ") : v}`)
          .join("; ");
        if (flat) errorMsg = flat;
      }
    }
    const statusCode = response.status || data?.StatusCode || data?.statusCode || 400;
    const friendlyMessage = getUserFriendlyErrorMessage(
      {
        message: errorMsg,
        rawMessage: errorMsg,
        status: statusCode,
        data,
      },
      endpointContext
    );

    const err = new Error(friendlyMessage);
    (err as any).status = statusCode;
    (err as any).data = data;
    (err as any).rawMessage = errorMsg;
    throw err;
  }

  if (data && (data.success === false || data.Success === false)) {
    const rawMsg =
      data.Message ||
      data.message ||
      data.Error ||
      data.error ||
      data.Title ||
      data.title;
    const errorsObj = data.Errors || data.errors;
    let errorMsg = rawMsg;
    if (errorsObj) {
      if (Array.isArray(errorsObj)) {
        errorMsg = errorsObj.filter(Boolean).join(", ");
      } else if (typeof errorsObj === "object") {
        const flat = Object.entries(errorsObj)
          .map(([k, v]) => `${k}: ${Array.isArray(v) ? v.join(", ") : v}`)
          .join("; ");
        if (flat) errorMsg = flat;
      }
    }
    const statusCode = data.StatusCode || data.statusCode || 400;
    const friendlyMessage = getUserFriendlyErrorMessage(
      {
        message: errorMsg,
        rawMessage: errorMsg,
        status: statusCode,
        data,
      },
      endpointContext
    );

    const err = new Error(friendlyMessage);
    (err as any).status = statusCode;
    (err as any).data = data;
    (err as any).rawMessage = errorMsg;
    throw err;
  }

  return data;
}
