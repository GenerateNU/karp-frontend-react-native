const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL;

export async function getVolunteer(volunteerId: string, token: string) {
  const response = await fetch(`${API_BASE_URL}/volunteer/${volunteerId}`, {
    headers: { Authorization: `Bearer ${token}` },
  });

  if (!response.ok) {
    throw new Error('Failed to fetch volunteer');
  }

  return response.json();
}
