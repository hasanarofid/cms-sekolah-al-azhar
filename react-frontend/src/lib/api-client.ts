/**
 * API Client untuk menghubungkan React dengan PHP Backend
 */

// Normalize API URL - remove trailing slash
const API_URL = (import.meta.env.VITE_API_URL || 'http://localhost:8000/api').replace(/\/+$/, '');

// Helper untuk menggabungkan URL dengan benar (menghindari double slash)
function buildUrl(endpoint: string): string {
  const baseUrl = API_URL;
  const cleanEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
  return `${baseUrl}${cleanEndpoint}`;
}

// Get auth token from localStorage
function getAuthToken(): string | null {
  if (typeof window !== 'undefined') {
    return localStorage.getItem('auth_token');
  }
  return null;
}

// Helper untuk membuat headers dengan auth
function getHeaders(includeAuth = true): HeadersInit {
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
  };

  if (includeAuth) {
    const token = getAuthToken();
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
  }

  return headers;
}

export const apiClient = {
  async get(endpoint: string, includeAuth = true) {
    const response = await fetch(buildUrl(endpoint), {
      method: 'GET',
      headers: getHeaders(includeAuth),
      credentials: 'include',
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ error: 'Unknown error' }));
      throw new Error(error.error || 'Request failed');
    }

    return response.json();
  },

  async post(endpoint: string, data: any, includeAuth = true) {
    const response = await fetch(buildUrl(endpoint), {
      method: 'POST',
      headers: getHeaders(includeAuth),
      credentials: 'include',
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ error: 'Unknown error' }));
      throw new Error(error.error || 'Request failed');
    }

    return response.json();
  },

  async put(endpoint: string, data: any, includeAuth = true) {
    const response = await fetch(buildUrl(endpoint), {
      method: 'PUT',
      headers: getHeaders(includeAuth),
      credentials: 'include',
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ error: 'Unknown error' }));
      throw new Error(error.error || 'Request failed');
    }

    return response.json();
  },

  async delete(endpoint: string, includeAuth = true) {
    const response = await fetch(buildUrl(endpoint), {
      method: 'DELETE',
      headers: getHeaders(includeAuth),
      credentials: 'include',
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ error: 'Unknown error' }));
      throw new Error(error.error || 'Request failed');
    }

    // DELETE might return empty response
    const contentType = response.headers.get('content-type');
    if (contentType && contentType.includes('application/json')) {
      return response.json();
    }
    return { success: true };
  },

  async upload(endpoint: string, file: File, type: string = 'general', includeAuth = true, isVideo: boolean = false) {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('type', type); // Add type parameter like Next.js
    if (isVideo) {
      formData.append('isVideo', 'true'); // Indicate this is a video upload
    }

    const headers: HeadersInit = {};
    if (includeAuth) {
      const token = getAuthToken();
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }
    }

    const response = await fetch(buildUrl(endpoint), {
      method: 'POST',
      headers,
      credentials: 'include',
      body: formData,
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ error: 'Unknown error' }));
      throw new Error(error.error || 'Upload failed');
    }

    return response.json();
  },
};

