'use client';

import { useState, useEffect, useCallback } from 'react';
import type { CalendarEvent } from '../types';
import { calendarEventService } from '../services/calendar-event-service';

export function useCalendarEvent(id: string) {
  const [data, setData] = useState<CalendarEvent | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetch = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const event = await calendarEventService.get(id);
      setData(event);
    } catch (err) {
      setError((err as Error).message);
      setData(null);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => { fetch(); }, [fetch]);

  return { data, loading, error, refetch: fetch };
}
