import { Box, useTheme } from "@mui/material";
import { format, getDay, parse, startOfWeek } from "date-fns";
import { enUS } from "date-fns/locale";
import { useCallback, useMemo, useState } from "react";
import { Calendar, dateFnsLocalizer, type View } from "react-big-calendar";
import "react-big-calendar/lib/css/react-big-calendar.css";
import { eventsCalendarTestIds } from "@testIds/eventsCalendarTestids";
import { useEvents } from "../hooks/useEvents";

const locales = { "en-US": enUS };

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek,
  getDay,
  locales,
});

interface CalendarEvent {
  id: number;
  title: string;
  start: Date;
  end: Date;
  state: "voting" | "finalized";
}

interface EventsCalendarProps {
  onSelectEvent: (eventId: number) => void;
}

export function EventsCalendar({ onSelectEvent }: EventsCalendarProps) {
  const theme = useTheme();
  const { data: events } = useEvents(true);
  const [date, setDate] = useState(new Date());
  const [view, setView] = useState<View>("month");

  const handleNavigate = useCallback((newDate: Date) => {
    setDate(newDate);
  }, []);

  const handleViewChange = useCallback((newView: View) => {
    setView(newView);
  }, []);

  const calendarEvents = useMemo((): CalendarEvent[] => {
    if (!events) return [];

    const result: CalendarEvent[] = [];

    for (const event of events) {
      if (event.state === "finalized" && event.finalizedTimeId) {
        const finalizedProposal = event.proposals.find(
          (p) => p.id === event.finalizedTimeId,
        );
        if (finalizedProposal) {
          result.push({
            id: event.id,
            title: event.name,
            start: new Date(finalizedProposal.proposedAt),
            end: new Date(finalizedProposal.proposedAt),
            state: "finalized",
          });
        }
      } else if (event.state === "voting" && event.proposals.length > 0) {
        const bestProposal = event.proposals.reduce((best, current) => {
          const bestScore = best.upvotes - best.downvotes;
          const currentScore = current.upvotes - current.downvotes;
          return currentScore > bestScore ? current : best;
        });

        result.push({
          id: event.id,
          title: `${event.name} (voting)`,
          start: new Date(bestProposal.proposedAt),
          end: new Date(bestProposal.proposedAt),
          state: "voting",
        });
      }
    }

    return result;
  }, [events]);

  const eventStyleGetter = (event: CalendarEvent) => {
    const isFinalized = event.state === "finalized";
    return {
      style: {
        backgroundColor: isFinalized
          ? theme.palette.success.main
          : theme.palette.primary.main,
        borderRadius: "4px",
        opacity: isFinalized ? 1 : 0.8,
        color: "white",
        border: "none",
        fontSize: "12px",
      },
    };
  };

  return (
    <Box
      sx={{ height: "100%", p: 2 }}
      data-testid={eventsCalendarTestIds.container}
    >
      <Calendar
        localizer={localizer}
        events={calendarEvents}
        startAccessor="start"
        endAccessor="end"
        style={{ height: "100%" }}
        views={["month", "week", "day"]}
        view={view}
        date={date}
        onNavigate={handleNavigate}
        onView={handleViewChange}
        eventPropGetter={eventStyleGetter}
        onSelectEvent={(event) => onSelectEvent(event.id)}
        popup
      />
    </Box>
  );
}
