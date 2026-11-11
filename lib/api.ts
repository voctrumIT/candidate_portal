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

  if (!response.ok) {
    throw new Error(data?.message || data?.error || `API Error: ${response.status} ${response.statusText}`);
  }

  return data;
}
