import { useState, useEffect, useCallback } from 'react';
import { Box, Snackbar, Alert } from '@mui/material';
import { tasksApi, type Task } from '../api/tasks';
import { TaskTable } from '../components/TaskTable';
import { TaskFormDialog } from '../components/TaskFormDialog';
import { DeleteTaskDialog } from '../components/DeleteTaskDialog';

export function TaskList() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [snackbar, setSnackbar] = useState<{ message: string; severity: 'success' | 'error' } | null>(null);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [page, setPage] = useState(1);
  const limit = 50;

  const [formOpen, setFormOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);

  const [deleteOpen, setDeleteOpen] = useState(false);
  const [taskToDelete, setTaskToDelete] = useState<Task | null>(null);

  const loadTasks = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await tasksApi.list(page, limit);
      setTasks(res.data);
      setTotal(res.total);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to load tasks');
      setSnackbar({ message: 'Failed to load tasks', severity: 'error' });
      setSnackbarOpen(true);
    } finally {
      setLoading(false);
    }
  }, [page]);

  useEffect(() => {
    loadTasks();
  }, [loadTasks]);

  const openCreate = () => {
    setEditingTask(null);
    setFormOpen(true);
  };

  const openEdit = (task: Task) => {
    setEditingTask(task);
    setFormOpen(true);
  };

  const openDelete = (task: Task) => {
    setTaskToDelete(task);
    setDeleteOpen(true);
  };

  const handleFormClose = () => {
    setFormOpen(false);
    setEditingTask(null);
  };

  const handleFormSuccess = (message: string) => {
    setSnackbar({ message, severity: 'success' });
    setSnackbarOpen(true);
    loadTasks();
  };

  const handleFormError = (message: string) => {
    setSnackbar({ message, severity: 'error' });
    setSnackbarOpen(true);
  };

  const handleDeleteClose = () => {
    setDeleteOpen(false);
    setTaskToDelete(null);
  };

  const handleDeleteSuccess = (message: string) => {
    setSnackbar({ message, severity: 'success' });
    setSnackbarOpen(true);
    loadTasks();
  };

  const handleDeleteError = (message: string) => {
    setSnackbar({ message, severity: 'error' });
    setSnackbarOpen(true);
  };

  const handleToggleComplete = async (task: Task) => {
    try {
      await tasksApi.update(task.id, { completed: !task.completed });
      loadTasks();
    } catch (e) {
      setSnackbar({
        message: e instanceof Error ? e.message : 'Update failed',
        severity: 'error',
      });
      setSnackbarOpen(true);
    }
  };

  return (
    <Box>
      <TaskTable
        tasks={tasks}
        total={total}
        loading={loading}
        error={error}
        page={page}
        limit={limit}
        onErrorDismiss={() => setError(null)}
        onAddTask={openCreate}
        onEdit={openEdit}
        onDelete={openDelete}
        onToggleComplete={handleToggleComplete}
        onPageChange={setPage}
      />

      <TaskFormDialog
        open={formOpen}
        initialTask={editingTask}
        onClose={handleFormClose}
        onSuccess={handleFormSuccess}
        onError={handleFormError}
      />

      <DeleteTaskDialog
        open={deleteOpen}
        task={taskToDelete}
        onClose={handleDeleteClose}
        onSuccess={handleDeleteSuccess}
        onError={handleDeleteError}
      />

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={2000}
        onClose={() => setSnackbarOpen(false)}
        TransitionProps={{
          onExited: () => setSnackbar(null),
        }}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        {snackbar ? (
          <Alert
            severity={snackbar.severity}
            onClose={() => setSnackbarOpen(false)}
          >
            {snackbar.message}
          </Alert>
        ) : (
          <></>
        )}
      </Snackbar>
    </Box>
  );
}
