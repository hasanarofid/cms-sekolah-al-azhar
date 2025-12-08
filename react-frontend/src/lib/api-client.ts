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
    });

    if (!response.ok) {
      // Check if response is JSON before trying to parse
      const contentType = response.headers.get('content-type');
      if (contentType && contentType.includes('application/json')) {
        const error = await response.json().catch(() => ({ error: 'Unknown error' }));
        throw new Error(error.error || 'Request failed');
      } else {
        // If not JSON, get text response
        const text = await response.text().catch(() => 'Request failed');
        throw new Error(text || 'Request failed');
      }
    }

    // Check if response is JSON before trying to parse
    const contentType = response.headers.get('content-type');
    if (contentType && contentType.includes('application/json')) {
      return response.json();
    } else {
      // If not JSON, return empty array or null based on context
      const text = await response.text();
      // Try to parse as JSON if it looks like JSON
      try {
        return JSON.parse(text);
      } catch {
        // If parsing fails, return empty array for list endpoints, null for others
        if (endpoint.includes('/admin/')) {
          return [];
        }
        return null;
      }
    }
  },

  async post(endpoint: string, data: any, includeAuth = true) {
    const response = await fetch(buildUrl(endpoint), {
      method: 'POST',
      headers: getHeaders(includeAuth),
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

  async upload(
    endpoint: string, 
    file: File, 
    type: string = 'general', 
    includeAuth = true, 
    isVideo: boolean = false, 
    isDocument: boolean = false,
    trimVideo: boolean = false,
    trimDuration: number = 5
  ) {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('type', type); // Add type parameter like Next.js
    if (isVideo) {
      formData.append('isVideo', 'true'); // Indicate this is a video upload
    }
    if (isDocument) {
      formData.append('isDocument', 'true'); // Indicate this is a document upload
    }
    if (trimVideo) {
      formData.append('trimVideo', 'true'); // Enable server-side video trimming
      formData.append('trimDuration', trimDuration.toString()); // Trim duration in seconds
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
      body: formData,
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ error: 'Unknown error' }));
      throw new Error(error.error || 'Upload failed');
    }

    return response.json();
  },
};

