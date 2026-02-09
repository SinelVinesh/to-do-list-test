import { useState, useEffect, useCallback } from 'react';
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
import { YooptaDescriptionEditor } from './YooptaDescriptionEditor';

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

  // Key to force-remount the editor when the dialog opens with different data
  const [editorKey, setEditorKey] = useState(0);

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
      // Force remount the Yoopta editor so it picks up the new value
      setEditorKey((k) => k + 1);
    }
  }, [open, initialTask]);

  const handleDescriptionChange = useCallback((serialised: string) => {
    setFormDescription(serialised);
  }, []);

  const handleSubmit = async () => {
    if (!formTitle.trim()) {
      onError('Title is required');
      return;
    }
    setSubmitLoading(true);
    try {
      const descriptionPayload = formDescription.trim() || undefined;
      if (initialTask) {
        await tasksApi.update(initialTask.id, {
          title: formTitle.trim(),
          description: descriptionPayload,
          completed: formCompleted,
        });
        onSuccess('Task updated');
      } else {
        await tasksApi.create({
          title: formTitle.trim(),
          description: descriptionPayload,
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
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
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

        <Typography variant="subtitle2" sx={{ mt: 2, mb: 1 }}>
          Description
        </Typography>
        {open && (
          <YooptaDescriptionEditor
            key={editorKey}
            value={formDescription}
            onChange={handleDescriptionChange}
            placeholder="Type / for commands…"
            autoFocus={false}
          />
        )}

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
