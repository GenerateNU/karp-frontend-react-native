import api from '@/api';

export async function getVolunteerOrders(volunteerId: string) {
  const response = await api.get(`/order/volunteer/${volunteerId}`);
  return response.data;
}

export async function createOrder(itemId: string) {
  const response = await api.post(
    `/order/new`,
    { itemId },
    { headers: { 'Content-Type': 'application/json' } }
  );
  return response.data;
}
