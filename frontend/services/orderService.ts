const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL;

export async function getVolunteerOrders(volunteerId: string, token: string) {
  const response = await fetch(
    `${API_BASE_URL}/order/volunteer/${volunteerId}`,
    {
      headers: { Authorization: `Bearer ${token}` },
    }
  );

  if (!response.ok) {
    throw new Error('Failed to fetch orders');
  }

  return response.json();
}

export async function createOrder(itemId: string, token: string) {
  const response = await fetch(`${API_BASE_URL}/order/new`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ item_id: itemId }),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.detail || 'Failed to place order');
  }

  return response.json();
}
