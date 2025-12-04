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

async function getAllVendors(): Promise<Vendor[]> {
  try {
    const response = await api.get(`/vendor/all`);
    console.log('Fetched all vendors:', response.data);
    return response.data;
  } catch (error) {
    console.error('Failed to fetch vendors:', error);
    return [];
  }
}

export const vendorService = {
  getVendorById,
  getAllVendors,
};
