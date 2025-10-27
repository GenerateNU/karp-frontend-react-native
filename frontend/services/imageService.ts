import api from '@/api';

async function getImageUrl(
  entityType: string,
  entityId: string
): Promise<string | null> {
  try {
    const res = await api.get(`${entityType}/${entityId}/image`);
    const data = res.data;
    return data.url; // data.url is the pre-signed GET URL
  } catch (err) {
    console.error('Failed to fetch image URL:', err);
    return null;
  }
}

export const imageService = {
  getImageUrl,
};
