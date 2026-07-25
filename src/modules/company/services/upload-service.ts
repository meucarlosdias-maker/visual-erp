export const ALLOWED_LOGO_TYPES = ['image/png', 'image/jpeg', 'image/svg+xml'];
export const MAX_LOGO_SIZE = 5 * 1024 * 1024;

export const ALLOWED_FAVICON_TYPES = ['image/png', 'image/x-icon', 'image/svg+xml'];
export const MAX_FAVICON_SIZE = 1 * 1024 * 1024;

export interface UploadValidation {
  valid: boolean;
  error?: string;
}

class UploadService {
  validateLogo(file: File): UploadValidation {
    if (!ALLOWED_LOGO_TYPES.includes(file.type)) {
      return { valid: false, error: 'Formato permitido: PNG, JPG ou SVG' };
    }
    if (file.size > MAX_LOGO_SIZE) {
      return { valid: false, error: 'Tamanho máximo: 5 MB' };
    }
    return { valid: true };
  }

  validateFavicon(file: File): UploadValidation {
    if (!ALLOWED_FAVICON_TYPES.includes(file.type)) {
      return { valid: false, error: 'Formato permitido: PNG, ICO ou SVG' };
    }
    if (file.size > MAX_FAVICON_SIZE) {
      return { valid: false, error: 'Tamanho máximo: 1 MB' };
    }
    return { valid: true };
  }

  async uploadToStorage(bucket: string, path: string, file: File): Promise<string> {
    const formData = new FormData();
    formData.append('file', file);

    const response = await fetch(`/api/storage/${bucket}/${path}`, {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) throw new Error('Erro ao fazer upload');

    const data = await response.json();
    return data.url as string;
  }
}

export const uploadService = new UploadService();
