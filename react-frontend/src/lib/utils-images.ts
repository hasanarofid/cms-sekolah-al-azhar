/**
 * Utility untuk handle images field
 * Images bisa berupa:
 * - Array (sudah di-decode dari PHP backend)
 * - JSON string (dari database langsung)
 * - String biasa (single image path)
 */

export function parseImages(images: any): string[] {
  if (!images) {
    return [];
  }

  // Jika sudah array, return langsung
  if (Array.isArray(images)) {
    return images;
  }

  // Jika string, coba parse sebagai JSON
  if (typeof images === 'string') {
    // Jika string kosong, return empty array
    if (images.trim() === '') {
      return [];
    }

    // Coba parse sebagai JSON
    try {
      const parsed = JSON.parse(images);
      // Jika hasil parse adalah array, return
      if (Array.isArray(parsed)) {
        return parsed;
      }
      // Jika hasil parse bukan array, anggap sebagai single image
      return [images];
    } catch {
      // Jika bukan JSON, anggap sebagai single image path
      return [images];
    }
  }

  // Fallback: return empty array
  return [];
}

