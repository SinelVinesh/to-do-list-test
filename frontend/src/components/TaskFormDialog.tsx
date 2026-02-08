import { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Box,
  Checkbox,
  Typography,
  CircularProgress,
} from '@mui/material';
import { tasksApi, type Task } from '../api/tasks';

export interface TaskFormDialogProps {
  open: boolean;
  initialTask: Task | null;
  onClose: () => void;
  onSuccess: (message: string) => void;
  onError: (message: string) => void;
}

export function TaskFormDialog({
  open,
  initialTask,
  onClose,
  onSuccess,
  onError,
}: TaskFormDialogProps) {
  const [formTitle, setFormTitle] = useState('');
  const [formDescription, setFormDescription] = useState('');
  const [formCompleted, setFormCompleted] = useState(false);
  const [submitLoading, setSubmitLoading] = useState(false);

  useEffect(() => {
    if (open) {
      if (initialTask) {
        setFormTitle(initialTask.title);
        setFormDescription(initialTask.description ?? '');
        setFormCompleted(initialTask.completed);
      } else {
        setFormTitle('');
        setFormDescription('');
        setFormCompleted(false);
      }
    }
  }, [open, initialTask]);

  const handleSubmit = async () => {
    if (!formTitle.trim()) {
      onError('Title is required');
      return;
    }
    setSubmitLoading(true);
    try {
      if (initialTask) {
        await tasksApi.update(initialTask.id, {
          title: formTitle.trim(),
          description: formDescription.trim() || undefined,
          completed: formCompleted,
        });
        onSuccess('Task updated');
      } else {
        await tasksApi.create({
          title: formTitle.trim(),
          description: formDescription.trim() || undefined,
          completed: formCompleted,
        });
        onSuccess('Task created');
      }
      onClose();
    } catch (e) {
      onError(e instanceof Error ? e.message : 'Request failed');
    } finally {
      setSubmitLoading(false);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>{initialTask ? 'Edit task' : 'Add task'}</DialogTitle>
      <DialogContent>
        <TextField
          autoFocus
          margin="dense"
          label="Title"
          fullWidth
          required
          value={formTitle}
          onChange={(e) => setFormTitle(e.target.value)}
        />
        <TextField
          margin="dense"
          label="Description"
          fullWidth
          multiline
          required
          rows={4}
          sx={{
            '& .MuiInputBase-input': {
              resize: 'vertical', // Allows vertical resizing by the user
            },
          }}
          value={formDescription}
          onChange={(e) => setFormDescription(e.target.value)}
        />
        <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
          <Checkbox
            checked={formCompleted}
            onChange={(e) => setFormCompleted(e.target.checked)}
          />
          <Typography variant="body2">Completed</Typography>
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button onClick={handleSubmit} variant="contained" disabled={submitLoading}>
          {submitLoading ? <CircularProgress size={24} /> : initialTask ? 'Update' : 'Create'}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
