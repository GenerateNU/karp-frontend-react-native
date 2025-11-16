import api from '@/api';

export interface Vendor {
  id: string;
  name: string;
  businessType: string;
  status: string;
  approved: boolean;
}

async function getVendorById(vendorId: string): Promise<Vendor | null> {
  try {
    const response = await api.get(`/vendor/${vendorId}`);
    return response.data;
  } catch (error) {
    console.error(`Failed to fetch vendor ${vendorId}:`, error);
    return null;
  }
}

export const vendorService = {
  getVendorById,
};
