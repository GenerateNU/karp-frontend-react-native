import { useState, useEffect } from 'react';
import { getEventRegistrations } from '@/services/registrationService';
import { volunteerService } from '@/services/volunteerService';
import { Registration } from '@/types/api/registration';
import { Volunteer } from '@/types/api/volunteer';

interface VolunteerWithRegistration {
  registration: Registration;
  volunteer: Volunteer | null;
}

export function useEventVolunteers(eventId: string) {
  const [volunteers, setVolunteers] = useState<VolunteerWithRegistration[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchVolunteers = async () => {
      try {
        setLoading(true);
        const registrations = await getEventRegistrations(eventId);

        const volunteersWithDetails = await Promise.all(
          registrations.map(async reg => {
            try {
              const volunteer = await volunteerService.getVolunteer(
                reg.volunteerId
              );
              return { registration: reg, volunteer };
            } catch (err) {
              console.error(
                `Failed to fetch volunteer ${reg.volunteerId}:`,
                err
              );
              return { registration: reg, volunteer: null };
            }
          })
        );

        setVolunteers(volunteersWithDetails);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : 'Failed to load volunteers'
        );
      } finally {
        setLoading(false);
      }
    };

    if (eventId) {
      fetchVolunteers();
    }
  }, [eventId]);

  return { volunteers, loading, error };
}
