'use client';

import { useState, useEffect, useCallback } from 'react';
import type { CalendarEvent } from '../types';
import { calendarEventService } from '../services/calendar-event-service';

export function useCalendarEvents() {
  const [data, setData] = useState<CalendarEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetch = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const events = await calendarEventService.list();
      setData(events);
    } catch (err) {
      setError((err as Error).message);
      setData([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetch(); }, [fetch]);

  const deleteEvent = useCallback(async (id: string): Promise<boolean> => {
    try {
      await calendarEventService.delete(id);
      setData((prev) => prev.filter((e) => e.id !== id));
      return true;
    } catch { return false; }
  }, []);

  return { data, loading, error, delete: deleteEvent, refetch: fetch };
}

export function useCalendarEventsByDateRange() {
  const [data, setData] = useState<CalendarEvent[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchRange = useCallback(async (start: Date, end: Date) => {
    setLoading(true);
    setError(null);
    try {
      const events = await calendarEventService.listByDateRange(start, end);
      setData(events);
    } catch (err) {
      setError((err as Error).message);
      setData([]);
    } finally {
      setLoading(false);
    }
  }, []);

  return { data, loading, error, fetchRange };
}

export function useDashboardStats() {
  const [data, setData] = useState({ todayCount: 0, installationsCount: 0, visitsCount: 0, productionsCount: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    calendarEventService.getDashboardStats()
      .then(setData)
      .catch((err) => setError((err as Error).message))
      .finally(() => setLoading(false));
  }, []);

  return { data, loading, error };
}
