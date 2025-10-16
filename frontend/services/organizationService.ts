import api from '@/api';
import { Organization, OrgFilters } from '@/types/api/organization';

async function getAllOrganizations(
  filters?: OrgFilters
): Promise<Organization[]> {
  const { data: events } = await api.get('organization/all', {
    params: filters,
  });
  return events;
}

async function getOrganizationById(id: string): Promise<Organization | null> {
  const endpoint = `organization/${id}`;
  const { data: event } = await api.get(endpoint);
  return event;
}

// async function searchEvents(
//   query: string,
//   filters?: EventFilters
// ): Promise<Event[]> {
//   const params: Record<string, unknown> = {
//     q: query,
//     statuses: EventStatus.PUBLISHED,
//   };
//   if (filters) Object.assign(params, filters);

//   const { data: events } = await api.get('event/search', { params });
//   return events;
// }

// async function getNearEvents(filters?: EventFilters): Promise<Event[]> {
//   const { data: events } = await api.get('event/near', {
//     params: filters,
//   });
//   return events;
// }

export const orgService = {
  getAllOrganizations,
  getOrganizationById,
};
