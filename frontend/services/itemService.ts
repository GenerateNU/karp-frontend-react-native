const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL;

export async function getItem(itemId: string, token: string) {
  const response = await fetch(`${API_BASE_URL}/item/${itemId}`, {
    headers: { Authorization: `Bearer ${token}` },
  });

  if (!response.ok) {
    throw new Error('Failed to fetch item');
  }

  return response.json();
}
