/**
 * Authentication helper untuk React Frontend
 * Menggunakan PHP Backend API
 */

// Normalize API URL - remove trailing slash
const API_URL = (import.meta.env.VITE_API_URL || 'http://localhost:8000/api').replace(/\/+$/, '');

// Helper untuk menggabungkan URL dengan benar (menghindari double slash)
function buildUrl(endpoint: string): string {
  const baseUrl = API_URL;
  const cleanEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
  return `${baseUrl}${cleanEndpoint}`;
}

export type User = {
  id: string;
  email: string;
  name: string;
  role: string;
}

export interface AuthResponse {
  user: User;
  token: string;
}

/**
 * Login dengan email dan password
 */
export async function login(email: string, password: string): Promise<AuthResponse> {
  const endpoint = buildUrl('/auth/login');
  
  const response = await fetch(endpoint, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: 'Login failed' }));
    throw new Error(error.error || 'Email atau password salah');
  }

  const data: AuthResponse = await response.json();
  
  // Simpan token dan user di localStorage
  if (typeof window !== 'undefined') {
    localStorage.setItem('auth_token', data.token);
    localStorage.setItem('user', JSON.stringify(data.user));
    
    // Simpan token di cookie juga
    const expires = new Date();
    expires.setTime(expires.getTime() + (30 * 24 * 60 * 60 * 1000)); // 30 hari
    document.cookie = `auth_token=${data.token}; path=/; expires=${expires.toUTCString()}; SameSite=Lax`;
  }

  return data;
}

/**
 * Logout user
 */
export async function logout() {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('user');
    
    // Hapus cookie juga
    document.cookie = 'auth_token=; path=/; max-age=0';
  }
  window.location.href = '/login';
}

/**
 * Get authentication token
 */
export function getToken(): string | null {
  if (typeof window !== 'undefined') {
    return localStorage.getItem('auth_token');
  }
  return null;
}

/**
 * Get current user
 */
export function getUser(): User | null {
  if (typeof window !== 'undefined') {
    const userStr = localStorage.getItem('user');
    return userStr ? JSON.parse(userStr) : null;
  }
  return null;
}

/**
 * Check if user is authenticated
 */
export function isAuthenticated(): boolean {
  return getToken() !== null;
}

/**
 * Get current session (check dengan server)
 */
export async function getSession(): Promise<User | null> {
  const token = getToken();
  if (!token) {
    return null;
  }

  try {
    const endpoint = buildUrl('/auth/session');
    
    // Create abort controller for timeout
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5000); // 5 second timeout
    
    const response = await fetch(endpoint, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
      signal: controller.signal,
    });
    
    clearTimeout(timeoutId);

    if (!response.ok) {
      // Token invalid, clear storage
      if (typeof window !== 'undefined') {
        localStorage.removeItem('auth_token');
        localStorage.removeItem('user');
      }
      return null;
    }

    const data = await response.json();
    if (data.user) {
      // Update user di localStorage
      localStorage.setItem('user', JSON.stringify(data.user));
      return data.user;
    }
    return null;
  } catch (error) {
    // Network error or timeout - don't clear token, just return null
    // This allows retry without forcing logout
    console.error('Session check failed:', error);
    return null;
  }
}

