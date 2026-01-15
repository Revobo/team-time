import CheckIcon from "@mui/icons-material/Check";
import ThumbDownIcon from "@mui/icons-material/ThumbDown";
import ThumbUpIcon from "@mui/icons-material/ThumbUp";
import {
  Box,
  Button,
  Chip,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  IconButton,
  List,
  ListItem,
  ListItemText,
  Typography,
} from "@mui/material";
import { useState } from "react";
import { eventDetailTestIds } from "@testIds/eventDetailTestIds";
import { useAuth } from "../hooks/useAuth";
import {
  useDeleteVote,
  useEvent,
  useFinalizeEvent,
  useVote,
} from "../hooks/useEvents";
import { ProposeTimeDialog } from "./ProposeTimeDialog";

interface EventDetailProps {
  eventId: number;
  open: boolean;
  onClose: () => void;
}

export function EventDetail({ eventId, open, onClose }: EventDetailProps) {
  const { user } = useAuth();
  const [proposeDialogOpen, setProposeDialogOpen] = useState(false);

  const { data: event, isLoading } = useEvent(eventId);
  const voteMutation = useVote();
  const deleteVoteMutation = useDeleteVote();
  const finalizeMutation = useFinalizeEvent();

  const isCreator = user?.id === event?.creatorId;
  const isFinalized = event?.state === "finalized";

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString("en-US", {
      weekday: "long",
      month: "long",
      day: "numeric",
      year: "numeric",
      hour: "numeric",
      minute: "2-digit",
    });
  };

  const handleVote = (proposalId: number, vote: 1 | -1) => {
    voteMutation.mutate({ eventId, proposalId, vote });
  };

  const handleRemoveVote = (proposalId: number) => {
    deleteVoteMutation.mutate({ eventId, proposalId });
  };

  const handleFinalize = (proposalId: number) => {
    finalizeMutation.mutate({ eventId, proposalId }, { onSuccess: onClose });
  };

  if (isLoading || !event) {
    return (
      <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
        <DialogContent
          sx={{ display: "flex", justifyContent: "center", py: 4 }}
        >
          <CircularProgress />
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <>
      <Dialog
        open={open}
        onClose={onClose}
        maxWidth="sm"
        fullWidth
        data-testid={eventDetailTestIds.dialog}
      >
        <DialogTitle>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Typography
              variant="h6"
              data-testid={eventDetailTestIds.title}
            >
              {event.name}
            </Typography>
            <Chip
              label={isFinalized ? "Finalized" : "Voting"}
              color={isFinalized ? "success" : "primary"}
              size="small"
              data-testid={eventDetailTestIds.stateChip}
            />
          </Box>
        </DialogTitle>
        <DialogContent>
          {event.description && (
            <Typography
              color="text.secondary"
              sx={{ mb: 2 }}
              data-testid={eventDetailTestIds.description}
            >
              {event.description}
            </Typography>
          )}

          <Typography
            variant="caption"
            color="text.secondary"
            display="block"
            data-testid={eventDetailTestIds.createdBy}
          >
            Created by {event.creatorName}
          </Typography>

          <Divider sx={{ my: 2 }} />

          <Typography variant="subtitle2" gutterBottom>
            Proposed Times
          </Typography>

          <List disablePadding data-testid={eventDetailTestIds.proposalsList}>
            {event.proposals.map((proposal) => {
              const isWinner = proposal.id === event.finalizedTimeId;
              const netVotes = proposal.upvotes - proposal.downvotes;

              return (
                <ListItem
                  key={proposal.id}
                  data-testid={eventDetailTestIds.proposalItem}
                  sx={{
                    bgcolor: isWinner ? "success.light" : "grey.50",
                    borderRadius: 1,
                    mb: 1,
                    flexDirection: "column",
                    alignItems: "stretch",
                  }}
                >
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      width: "100%",
                    }}
                  >
                    <ListItemText
                      primary={formatDate(proposal.proposedAt)}
                      secondary={`Proposed by ${proposal.proposerName}`}
                      data-testid={eventDetailTestIds.proposalDate}
                    />
                    {isWinner && (
                      <Chip
                        icon={<CheckIcon />}
                        label="Selected"
                        color="success"
                        size="small"
                        data-testid={eventDetailTestIds.selectedChip}
                      />
                    )}
                  </Box>

                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      gap: 1,
                      mt: 1,
                    }}
                  >
                    {!isFinalized && (
                      <>
                        <IconButton
                          size="small"
                          color={
                            proposal.userVote === 1 ? "primary" : "default"
                          }
                          onClick={() =>
                            proposal.userVote === 1
                              ? handleRemoveVote(proposal.id)
                              : handleVote(proposal.id, 1)
                          }
                          data-testid={eventDetailTestIds.upvoteButton}
                        >
                          <ThumbUpIcon fontSize="small" />
                        </IconButton>
                        <IconButton
                          size="small"
                          color={proposal.userVote === -1 ? "error" : "default"}
                          onClick={() =>
                            proposal.userVote === -1
                              ? handleRemoveVote(proposal.id)
                              : handleVote(proposal.id, -1)
                          }
                          data-testid={eventDetailTestIds.downvoteButton}
                        >
                          <ThumbDownIcon fontSize="small" />
                        </IconButton>
                      </>
                    )}
                    <Typography
                      variant="body2"
                      data-testid={eventDetailTestIds.voteCount}
                      color={
                        netVotes > 0
                          ? "success.main"
                          : netVotes < 0
                            ? "error.main"
                            : "text.secondary"
                      }
                    >
                      {netVotes > 0 ? "+" : ""}
                      {netVotes} ({proposal.upvotes} up, {proposal.downvotes}{" "}
                      down)
                    </Typography>

                    {isCreator && !isFinalized && (
                      <Button
                        size="small"
                        variant="outlined"
                        color="success"
                        sx={{ ml: "auto" }}
                        onClick={() => handleFinalize(proposal.id)}
                        disabled={finalizeMutation.isPending}
                        data-testid={eventDetailTestIds.selectButton}
                      >
                        Select
                      </Button>
                    )}
                  </Box>
                </ListItem>
              );
            })}
          </List>
        </DialogContent>
        <DialogActions>
          {!isFinalized && (
            <Button
              onClick={() => setProposeDialogOpen(true)}
              data-testid={eventDetailTestIds.proposeTimeButton}
            >
              Propose Time
            </Button>
          )}
          <Button
            onClick={onClose}
            data-testid={eventDetailTestIds.closeButton}
          >
            Close
          </Button>
        </DialogActions>
      </Dialog>

      <ProposeTimeDialog
        eventId={eventId}
        open={proposeDialogOpen}
        onClose={() => setProposeDialogOpen(false)}
      />
    </>
  );
}
