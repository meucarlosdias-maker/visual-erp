import { uploadService } from './upload-service';

const LOGO_BUCKET = 'logos';
const FAVICON_BUCKET = 'favicons';

export class CompanyStorageService {
  async uploadLogo(companyId: string, file: File): Promise<string> {
    const validation = uploadService.validateLogo(file);
    if (!validation.valid) throw new Error(validation.error);
    return uploadService.uploadToStorage(LOGO_BUCKET, `${companyId}/logo`, file);
  }

  async uploadFavicon(companyId: string, file: File): Promise<string> {
    const validation = uploadService.validateFavicon(file);
    if (!validation.valid) throw new Error(validation.error);
    return uploadService.uploadToStorage(FAVICON_BUCKET, `${companyId}/favicon`, file);
  }

  async deleteLogo(companyId: string): Promise<void> {
    await fetch(`/api/storage/${LOGO_BUCKET}/${companyId}/logo`, { method: 'DELETE' });
  }

  async deleteFavicon(companyId: string): Promise<void> {
    await fetch(`/api/storage/${FAVICON_BUCKET}/${companyId}/favicon`, { method: 'DELETE' });
  }

  async updateLogo(companyId: string, oldUrl: string | null, newFile: File): Promise<string> {
    if (oldUrl) await this.deleteLogo(companyId);
    return this.uploadLogo(companyId, newFile);
  }

  async updateFavicon(companyId: string, oldUrl: string | null, newFile: File): Promise<string> {
    if (oldUrl) await this.deleteFavicon(companyId);
    return this.uploadFavicon(companyId, newFile);
  }
}

export const companyStorage = new CompanyStorageService();
