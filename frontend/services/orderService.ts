import api from '@/api';
const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL;

export async function getVolunteerOrders(volunteerId: string) {
  const response = await api.get(
    `${API_BASE_URL}/order/volunteer/${volunteerId}`
  );
  return response.data;
}

export async function createOrder(itemId: string) {
  const response = await api.post(
    `${API_BASE_URL}/order/new`,
    { itemId },
    { headers: { 'Content-Type': 'application/json' } }
  );
  return response.data;
}
