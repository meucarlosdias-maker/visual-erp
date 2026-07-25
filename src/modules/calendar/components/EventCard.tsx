'use client';

import { Card, CardContent } from '@/components/ui/card';
import { Calendar, MapPin, Clock, User } from '@/constants/icons';
import { CALENDAR_EVENT_TYPE_LABELS, CALENDAR_STATUS_LABELS, CALENDAR_STATUS_COLORS } from '../validators';
import type { CalendarEvent } from '../types';

interface EventCardProps {
  event: CalendarEvent;
  onClick?: (event: CalendarEvent) => void;
  compact?: boolean;
}

function formatTime(d: Date | string) {
  return new Date(d).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
}

function formatDate(d: Date | string) {
  return new Date(d).toLocaleDateString('pt-BR');
}

export function EventCard({ event, onClick, compact }: EventCardProps) {
  const statusColor = CALENDAR_STATUS_COLORS[event.status] ?? 'bg-gray-100 text-gray-700';
  const typeLabel = CALENDAR_EVENT_TYPE_LABELS[event.type] ?? event.type;

  return (
    <Card
      className={`cursor-pointer hover:shadow-md transition-shadow ${compact ? 'p-2' : ''}`}
      onClick={() => onClick?.(event)}
    >
      <CardContent className={`${compact ? 'p-0' : 'p-4'} space-y-2`}>
        <div className="flex items-center justify-between gap-2">
          <span className="text-xs font-medium text-muted-foreground">{typeLabel}</span>
          <span className={`text-xs px-1.5 py-0.5 rounded ${statusColor}`}>
            {CALENDAR_STATUS_LABELS[event.status] ?? event.status}
          </span>
        </div>
        <p className={`font-medium leading-tight ${compact ? 'text-sm' : ''}`}>{event.title}</p>
        {!compact && event.description && (
          <p className="text-sm text-muted-foreground line-clamp-2">{event.description}</p>
        )}
        <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-muted-foreground">
          <span className="flex items-center gap-1">
            <Calendar className="h-3 w-3" />
            {event.allDay ? formatDate(event.startDate) : `${formatDate(event.startDate)} ${formatTime(event.startDate)}`}
          </span>
          {!event.allDay && (
            <span className="flex items-center gap-1">
              <Clock className="h-3 w-3" />
              Até {formatTime(event.endDate)}
            </span>
          )}
          {event.location && (
            <span className="flex items-center gap-1">
              <MapPin className="h-3 w-3" />
              {event.location}
            </span>
          )}
          {event.assignedUserId && (
            <span className="flex items-center gap-1">
              <User className="h-3 w-3" />
              {event.assignedUserId}
            </span>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
