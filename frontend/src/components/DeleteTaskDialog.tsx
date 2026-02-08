import { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  CircularProgress,
} from '@mui/material';
import { tasksApi, type Task } from '../api/tasks';

export interface DeleteTaskDialogProps {
  open: boolean;
  task: Task | null;
  onClose: () => void;
  onSuccess: (message: string) => void;
  onError: (message: string) => void;
}

export function DeleteTaskDialog({
  open,
  task,
  onClose,
  onSuccess,
  onError,
}: DeleteTaskDialogProps) {
  const [deleteLoading, setDeleteLoading] = useState(false);

  const handleConfirm = async () => {
    if (!task) return;
    setDeleteLoading(true);
    try {
      await tasksApi.delete(task.id);
      onSuccess('Task deleted');
      onClose();
    } catch (e) {
      onError(e instanceof Error ? e.message : 'Delete failed');
    } finally {
      setDeleteLoading(false);
    }
  };

  const handleClose = () => {
    if (!deleteLoading) onClose();
  };

  return (
    <Dialog open={open} onClose={handleClose}>
      <DialogTitle>Delete task?</DialogTitle>
      <DialogContent>
        {task && (
          <Typography>
            Are you sure you want to delete &quot;{task.title}&quot;?
          </Typography>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} disabled={deleteLoading}>
          Cancel
        </Button>
        <Button
          color="error"
          variant="contained"
          onClick={handleConfirm}
          disabled={deleteLoading || !task}
        >
          {deleteLoading ? <CircularProgress size={24} /> : 'Delete'}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
