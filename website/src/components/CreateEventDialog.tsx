import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  List,
  ListItem,
  ListItemText,
  TextField,
} from "@mui/material";
import { useState } from "react";
import { createEventDialogTestIds } from "@testIds/CreateEventDialogTestIds";
import { useCreateEvent } from "../hooks/useEvents";

interface CreateEventDialogProps {
  open: boolean;
  onClose: () => void;
}

export function CreateEventDialog({ open, onClose }: CreateEventDialogProps) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [proposedTimes, setProposedTimes] = useState<string[]>([]);
  const [newTime, setNewTime] = useState("");

  const createMutation = useCreateEvent();

  const handleAddTime = () => {
    if (newTime && !proposedTimes.includes(newTime)) {
      setProposedTimes([...proposedTimes, newTime]);
      setNewTime("");
    }
  };

  const handleRemoveTime = (index: number) => {
    setProposedTimes(proposedTimes.filter((_, i) => i !== index));
  };

  const handleSubmit = () => {
    if (!name || proposedTimes.length === 0) return;

    createMutation.mutate(
      {
        name,
        description: description || undefined,
        proposedTimes: proposedTimes.map((t) => new Date(t).toISOString()),
      },
      {
        onSuccess: () => {
          resetForm();
          onClose();
        },
      }
    );
  };

  const resetForm = () => {
    setName("");
    setDescription("");
    setProposedTimes([]);
    setNewTime("");
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

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
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth="sm"
      fullWidth
      data-testid={createEventDialogTestIds.dialog}
    >
      <DialogTitle data-testid={createEventDialogTestIds.title}>
        Create Event
      </DialogTitle>
      <DialogContent>
        <TextField
          label="Event Name"
          fullWidth
          value={name}
          onChange={(e) => setName(e.target.value)}
          sx={{ mt: 1, mb: 2 }}
          required
          data-testid={createEventDialogTestIds.nameInput}
        />
        <TextField
          label="Description (optional)"
          fullWidth
          multiline
          rows={2}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          sx={{ mb: 2 }}
          data-testid={createEventDialogTestIds.descriptionInput}
        />

        <Box sx={{ display: "flex", gap: 1, mb: 1 }}>
          <TextField
            type="datetime-local"
            fullWidth
            value={newTime}
            onChange={(e) => setNewTime(e.target.value)}
            inputProps={{
              min: new Date().toISOString().slice(0, 16),
            }}
            data-testid={createEventDialogTestIds.datetimeInput}
          />
          <IconButton
            onClick={handleAddTime}
            disabled={!newTime}
            data-testid={createEventDialogTestIds.addTimeButton}
          >
            <AddIcon />
          </IconButton>
        </Box>

        {proposedTimes.length > 0 && (
          <List dense data-testid={createEventDialogTestIds.timesList}>
            {proposedTimes.map((time, index) => (
              <ListItem
                key={time}
                data-testid={createEventDialogTestIds.timeItem}
                secondaryAction={
                  <IconButton
                    edge="end"
                    size="small"
                    onClick={() => handleRemoveTime(index)}
                    data-testid={createEventDialogTestIds.removeTimeButton}
                  >
                    <DeleteIcon fontSize="small" />
                  </IconButton>
                }
              >
                <ListItemText primary={formatDate(time)} />
              </ListItem>
            ))}
          </List>
        )}
      </DialogContent>
      <DialogActions>
        <Button
          onClick={handleClose}
          data-testid={createEventDialogTestIds.cancelButton}
        >
          Cancel
        </Button>
        <Button
          onClick={handleSubmit}
          variant="contained"
          disabled={
            !name || proposedTimes.length === 0 || createMutation.isPending
          }
          data-testid={createEventDialogTestIds.createButton}
        >
          Create
        </Button>
      </DialogActions>
    </Dialog>
  );
}
