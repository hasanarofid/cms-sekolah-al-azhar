/**
 * Utility untuk convert relative image path ke full URL
 * Image path dari API adalah relative seperti /uploads/sliders/...
 * Frontend perlu full URL ke PHP backend
 * 
 * IMPORTANT: Image URL menggunakan BASE URL (localhost:8000), bukan API URL (localhost:8000/api)
 * 
 * ENV Variables:
 * - VITE_API_URL: http://localhost:8000/api (untuk API calls)
 * - VITE_BASE_URL: http://localhost:8000 (untuk static files seperti images) - OPTIONAL
 *   Jika tidak di-set, akan extract dari VITE_API_URL
 */

const API_URL = import.meta.env.VITE_API_URL || '/api';
const BASE_URL = import.meta.env.VITE_BASE_URL; // Optional: base URL untuk static files

/**
 * Get base URL from API URL
 * Example: http://localhost:8000/api -> http://localhost:8000
 * Example: /api -> (use VITE_BASE_URL or extract from API_URL)
 */
function getBaseUrl(): string {
  // Priority 1: Gunakan VITE_BASE_URL jika di-set
  if (BASE_URL) {
    if (import.meta.env.DEV) {
      console.log('[getBaseUrl] Using VITE_BASE_URL:', BASE_URL);
    }
    return BASE_URL;
  }
  
  // Priority 2: Extract dari VITE_API_URL jika full URL
  if (API_URL.startsWith('http://') || API_URL.startsWith('https://')) {
    try {
      const apiUrl = new URL(API_URL);
      // Extract origin (protocol + host + port) tanpa path
      // http://localhost:8000/api -> http://localhost:8000
      const origin = apiUrl.origin;
      if (import.meta.env.DEV) {
        console.log('[getBaseUrl] Extracted from API_URL:', { API_URL, origin });
      }
      return origin;
    } catch (e) {
      console.error('[getBaseUrl] Failed to parse API_URL:', API_URL, e);
    }
  }
  
  // Priority 3: Jika API_URL relative (seperti '/api'), kita perlu tahu base URL
  // Di development, backend biasanya di localhost:8000
  // Di production, bisa sama dengan frontend atau berbeda
  if (typeof window !== 'undefined') {
    // Jika di development (localhost:5173), backend biasanya di localhost:8000
    if (window.location.hostname === 'localhost' && window.location.port === '5173') {
      const devBaseUrl = 'http://localhost:8000';
      if (import.meta.env.DEV) {
        console.log('[getBaseUrl] Development fallback:', devBaseUrl);
      }
      return devBaseUrl;
    }
    
    // Jika production atau tidak di localhost:5173, gunakan window.location.origin
    // Tapi ini akan salah jika backend di server berbeda
    // Sebaiknya set VITE_BASE_URL di env
    console.warn('[getBaseUrl] VITE_BASE_URL not set. Using window.location.origin:', window.location.origin);
    return window.location.origin;
  }
  
  // Fallback untuk SSR
  console.error('[getBaseUrl] No base URL found!');
  return '';
}

/**
 * Convert relative image path ke full URL
 * @param imagePath - Relative path seperti /uploads/sliders/image.png
 * @returns Full URL seperti http://localhost:8000/uploads/sliders/image.png
 */
export function getImageUrl(imagePath: string | null | undefined): string {
  if (!imagePath) {
    return '';
  }

  // Jika sudah full URL (http:// atau https://), return langsung
  if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) {
    return imagePath;
  }

  // Jika path dimulai dengan /, berarti relative path
  // Gunakan BASE URL (bukan API URL) untuk image
  if (imagePath.startsWith('/')) {
    const baseUrl = getBaseUrl();
    if (baseUrl) {
      // Remove trailing slash from baseUrl and leading slash from imagePath to avoid double slashes
      const cleanBaseUrl = baseUrl.replace(/\/+$/, '');
      const cleanImagePath = imagePath.replace(/^\/+/, '/');
      const fullUrl = `${cleanBaseUrl}${cleanImagePath}`;
      // Debug logging untuk development
      if (import.meta.env.DEV) {
        console.log('[getImageUrl] Converting:', {
          input: imagePath,
          baseUrl,
          result: fullUrl,
          API_URL,
          BASE_URL_ENV: BASE_URL
        });
      }
      return fullUrl;
    }
    // Fallback jika baseUrl tidak tersedia
    console.error('[getImageUrl] ERROR: No baseUrl found!', {
      imagePath,
      API_URL,
      BASE_URL_ENV: BASE_URL,
      windowOrigin: typeof window !== 'undefined' ? window.location.origin : 'N/A'
    });
    return imagePath;
  }

  // Jika path tidak dimulai dengan /, tambahkan /uploads/ sebagai default
  const pathWithSlash = imagePath.startsWith('uploads/') ? `/${imagePath}` : `/uploads/${imagePath}`;
  const baseUrl = getBaseUrl();
  const fullUrl = baseUrl ? `${baseUrl}${pathWithSlash}` : pathWithSlash;
  if (import.meta.env.DEV) {
    console.log('[getImageUrl] Adding /uploads prefix:', {
      input: imagePath,
      pathWithSlash,
      baseUrl,
      result: fullUrl
    });
  }
  return fullUrl;
}

/**
 * Convert array of image paths ke array of full URLs
 */
export function getImageUrls(imagePaths: string[] | string | null | undefined): string[] {
  if (!imagePaths) {
    return [];
  }

  if (Array.isArray(imagePaths)) {
    return imagePaths.map(path => getImageUrl(path)).filter(url => url !== '');
  }

  if (typeof imagePaths === 'string') {
    // Coba parse sebagai JSON
    try {
      const parsed = JSON.parse(imagePaths);
      if (Array.isArray(parsed)) {
        return parsed.map(path => getImageUrl(path)).filter(url => url !== '');
      }
    } catch {
      // Bukan JSON, anggap sebagai single path
      const url = getImageUrl(imagePaths);
      return url ? [url] : [];
    }
  }

  return [];
}

