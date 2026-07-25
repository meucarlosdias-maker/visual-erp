export const ALLOWED_AVATAR_TYPES = ['image/png', 'image/jpeg', 'image/webp'];
export const MAX_AVATAR_SIZE = 3 * 1024 * 1024;

export const AVATAR_BUCKET = 'avatars';

export interface AvatarValidation {
  valid: boolean;
  error?: string;
}

export function validateAvatar(file: File): AvatarValidation {
  if (!ALLOWED_AVATAR_TYPES.includes(file.type)) {
    return { valid: false, error: 'Formato permitido: PNG, JPG ou WEBP' };
  }
  if (file.size > MAX_AVATAR_SIZE) {
    return { valid: false, error: `Tamanho máximo: 3 MB` };
  }
  return { valid: true };
}

export async function uploadAvatar(userId: string, file: File): Promise<string> {
  const validation = validateAvatar(file);
  if (!validation.valid) throw new Error(validation.error);

  const formData = new FormData();
  formData.append('file', file);

  const res = await fetch(`/api/storage/${AVATAR_BUCKET}/${userId}/avatar`, {
    method: 'POST',
    body: formData,
  });
  if (!res.ok) throw new Error('Falha ao enviar avatar');

  const { url } = await res.json();
  return url as string;
}

export async function deleteAvatar(userId: string): Promise<void> {
  await fetch(`/api/storage/${AVATAR_BUCKET}/${userId}/avatar`, { method: 'DELETE' });
}

export async function updateAvatar(userId: string, oldUrl: string | null, newFile: File): Promise<string> {
  if (oldUrl) await deleteAvatar(userId);
  return uploadAvatar(userId, newFile);
}
