import LogoutIcon from "@mui/icons-material/Logout";
import { AppBar, Box, IconButton, Toolbar, Typography } from "@mui/material";
import { useState } from "react";
import { appPageTestIds } from "@testIds/appPageTestIds";
import { CreateEventDialog } from "../components/CreateEventDialog";
import { EventDetail } from "../components/EventDetail";
import { EventList } from "../components/EventList";
import { EventsCalendar } from "../components/EventsCalendar";
import { useAuth } from "../hooks/useAuth";

export function AppPage() {
  const { user, logout } = useAuth();
  const [selectedEventId, setSelectedEventId] = useState<number | null>(null);
  const [createDialogOpen, setCreateDialogOpen] = useState(false);

  return (
    <Box sx={{ display: "flex", flexDirection: "column", height: "100vh" }}>
      <AppBar position="static" elevation={1}>
        <Toolbar>
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            Team Time
          </Typography>
          <Typography
            variant="body2"
            sx={{ mr: 2 }}
            data-testid={appPageTestIds.userName}
          >
            {user?.name}
          </Typography>
          <IconButton
            color="inherit"
            onClick={logout}
            title="Sign out"
            data-testid={appPageTestIds.logoutButton}
          >
            <LogoutIcon />
          </IconButton>
        </Toolbar>
      </AppBar>

      <Box sx={{ display: "flex", flex: 1, overflow: "hidden" }}>
        <Box
          sx={{
            width: "33.33%",
            borderRight: 1,
            borderColor: "divider",
            position: "relative",
            overflow: "hidden",
          }}
        >
          <EventList
            onSelectEvent={setSelectedEventId}
            onCreateEvent={() => setCreateDialogOpen(true)}
          />
        </Box>

        <Box sx={{ width: "66.67%", overflow: "hidden" }}>
          <EventsCalendar onSelectEvent={setSelectedEventId} />
        </Box>
      </Box>

      <CreateEventDialog
        open={createDialogOpen}
        onClose={() => setCreateDialogOpen(false)}
      />

      {selectedEventId && (
        <EventDetail
          eventId={selectedEventId}
          open={!!selectedEventId}
          onClose={() => setSelectedEventId(null)}
        />
      )}
    </Box>
  );
}
