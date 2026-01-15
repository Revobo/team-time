import {
  Box,
  Card,
  CardActionArea,
  CardContent,
  Chip,
  Typography,
} from "@mui/material";
import type { Event } from "../hooks/useEvents";
import { eventCardTestIds } from "@testIds/eventCardTestIds";

interface EventCardProps {
  event: Event;
  onClick: () => void;
}

export function EventCard({ event, onClick }: EventCardProps) {
  const isFinalized = event.state === "finalized";
  const finalizedProposal = event.proposals.find(
    (p) => p.id === event.finalizedTimeId
  );

  const totalVotes = event.proposals.reduce(
    (acc, p) => acc + p.upvotes + p.downvotes,
    0
  );

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
      hour: "numeric",
      minute: "2-digit",
    });
  };

  return (
    <Card
      sx={{
        borderLeft: 4,
        borderColor: isFinalized ? "success.main" : "primary.main",
      }}
      data-testid={eventCardTestIds.card}
    >
      <CardActionArea onClick={onClick}>
        <CardContent>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "flex-start",
              mb: 1,
            }}
          >
            <Typography
              variant="h6"
              component="h3"
              data-testid={eventCardTestIds.eventName}
            >
              {event.name}
            </Typography>
            <Chip
              data-testid={eventCardTestIds.state}
              label={isFinalized ? "Finalized" : "Voting"}
              color={isFinalized ? "success" : "primary"}
              size="small"
            />
          </Box>

          {event.description && (
            <Typography
              variant="body2"
              color="text.secondary"
              sx={{ mb: 1 }}
              data-testid={eventCardTestIds.description}
            >
              {event.description}
            </Typography>
          )}

          <Typography
            variant="caption"
            color="text.secondary"
            display="block"
            data-testid={eventCardTestIds.createdBy}
          >
            Created by {event.creatorName}
          </Typography>

          {isFinalized && finalizedProposal ? (
            <Box
              sx={{ mt: 1.5, p: 1, bgcolor: "success.light", borderRadius: 1 }}
            >
              <Typography
                variant="body2"
                fontWeight="medium"
                data-testid={eventCardTestIds.finalizedAt}
              >
                {formatDate(finalizedProposal.proposedAt)}
              </Typography>
            </Box>
          ) : (
            <Box sx={{ mt: 1.5 }}>
              <Typography
                variant="caption"
                color="text.secondary"
                data-testid={eventCardTestIds.voting}
              >
                {event.proposals.length} time
                {event.proposals.length !== 1 ? "s" : ""} proposed |{" "}
                {totalVotes} vote{totalVotes !== 1 ? "s" : ""}
              </Typography>
            </Box>
          )}
        </CardContent>
      </CardActionArea>
    </Card>
  );
}
