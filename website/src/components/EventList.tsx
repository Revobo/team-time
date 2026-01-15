import AddIcon from "@mui/icons-material/Add";
import {
  Box,
  CircularProgress,
  Fab,
  FormControlLabel,
  Switch,
  Typography,
} from "@mui/material";
import { useState } from "react";
import { eventListTestIds } from "@testIds/eventListTestIds";
import { useEvents } from "../hooks/useEvents";
import { EventCard } from "./EventCard";

interface EventListProps {
  onSelectEvent: (eventId: number) => void;
  onCreateEvent: () => void;
}

export function EventList({ onSelectEvent, onCreateEvent }: EventListProps) {
  const [includePast, setIncludePast] = useState(false);
  const { data: events, isLoading, error } = useEvents(includePast);

  if (isLoading) {
    return (
      <Box
        sx={{ display: "flex", justifyContent: "center", py: 8 }}
        data-testid={eventListTestIds.loading}
      >
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ p: 2 }} data-testid={eventListTestIds.error}>
        <Typography color="error">Failed to load events</Typography>
      </Box>
    );
  }

  return (
    <Box
      sx={{ display: "flex", flexDirection: "column", height: "100%" }}
      data-testid={eventListTestIds.container}
    >
      <Box
        sx={{
          p: 2,
          borderBottom: 1,
          borderColor: "divider",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
        data-testid={eventListTestIds.header}
      >
        <Typography variant="h6" data-testid={eventListTestIds.title}>
          Events
        </Typography>
        <FormControlLabel
          control={
            <Switch
              size="small"
              checked={includePast}
              onChange={(e) => setIncludePast(e.target.checked)}
              data-testid={eventListTestIds.pastSwitch}
            />
          }
          label="Past"
        />
      </Box>

      <Box
        sx={{ flex: 1, overflow: "auto", p: 2 }}
        data-testid={eventListTestIds.eventsContainer}
      >
        {events?.length === 0 ? (
          <Box
            sx={{ textAlign: "center", py: 4 }}
            data-testid={eventListTestIds.emptyState}
          >
            <Typography color="text.secondary" variant="body2">
              No events yet
            </Typography>
          </Box>
        ) : (
          <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5 }}>
            {events?.map((event) => (
              <EventCard
                key={event.id}
                event={event}
                onClick={() => onSelectEvent(event.id)}
              />
            ))}
          </Box>
        )}
      </Box>

      <Fab
        color="primary"
        size="medium"
        aria-label="create event"
        sx={{ position: "absolute", bottom: 16, right: 16 }}
        onClick={onCreateEvent}
        data-testid={eventListTestIds.createButton}
      >
        <AddIcon />
      </Fab>
    </Box>
  );
}
