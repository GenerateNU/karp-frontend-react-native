import React, {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from 'react';
import { EventFilters } from '@/types/api/event';

type EventFiltersContextValue = {
  filters: EventFilters;
  setFilters: (filters: EventFilters) => void;
  clearFilters: () => void;
};

const EventFiltersContext = createContext<EventFiltersContextValue | undefined>(
  undefined
);

export function EventFiltersProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [filters, setFiltersState] = useState<EventFilters>({});

  const setFilters = useCallback((newFilters: EventFilters) => {
    setFiltersState(newFilters);
  }, []);

  const clearFilters = useCallback(() => {
    setFiltersState({});
  }, []);

  const value = useMemo<EventFiltersContextValue>(
    () => ({
      filters,
      setFilters,
      clearFilters,
    }),
    [filters, setFilters, clearFilters]
  );

  return (
    <EventFiltersContext.Provider value={value}>
      {children}
    </EventFiltersContext.Provider>
  );
}

export function useEventFilters(): EventFiltersContextValue {
  const ctx = useContext(EventFiltersContext);
  if (!ctx)
    throw new Error('useEventFilters must be used within EventFiltersProvider');
  return ctx;
}
