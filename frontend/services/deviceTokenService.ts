import api from '@/api';

export interface DeviceToken {
  id: string;
  deviceToken: string;
  volunteerId: string;
}

async function registerDeviceToken(deviceToken: string): Promise<DeviceToken> {
  const response = await api.post('/device-token/register', {
    device_token: deviceToken,
  });
  return response.data as DeviceToken;
}

async function unregisterDeviceToken(): Promise<void> {
  await api.delete('/device-token/unregister');
}

export const deviceTokenService = {
  registerDeviceToken,
  unregisterDeviceToken,
};
