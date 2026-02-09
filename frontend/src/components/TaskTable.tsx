import {
  Box,
  Button,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Checkbox,
  IconButton,
  Typography,
  Alert,
  Skeleton,
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import type { Task } from '../api/tasks';
export interface TaskTableProps {
  tasks: Task[];
  total: number;
  loading: boolean;
  error: string | null;
  page: number;
  limit: number;
  onErrorDismiss: () => void;
  onAddTask: () => void;
  onEdit: (task: Task) => void;
  onDelete: (task: Task) => void;
  onToggleComplete: (task: Task) => void;
  onPageChange: (page: number) => void;
}

export function TaskTable({
  tasks,
  total,
  loading,
  error,
  page,
  limit,
  onErrorDismiss,
  onAddTask,
  onEdit,
  onDelete,
  onToggleComplete,
  onPageChange,
}: TaskTableProps) {
  return (
    <>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="body2" color="text.secondary">
          {total} task{total !== 1 ? 's' : ''}
        </Typography>
        <Button variant="contained" onClick={onAddTask}>
          Add task
        </Button>
      </Box>

      {loading ? (
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell padding="checkbox" />
              <TableCell>Title</TableCell>
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {[1, 2, 3].map((i) => (
              <TableRow key={i}>
                <TableCell padding="checkbox">
                  <Skeleton variant="circular" width={24} height={24} />
                </TableCell>
                <TableCell>
                  <Skeleton variant="text" width="100%" />
                </TableCell>
                <TableCell align="right">
                  <Skeleton
                    variant="rectangular"
                    width={80}
                    height={32}
                    sx={{ display: 'inline-block' }}
                  />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      ) : error ? (
        <Alert severity="error" onClose={onErrorDismiss}>
          {error}
        </Alert>
      ) : tasks.length === 0 ? (
        <Typography color="text.secondary">No tasks yet. Add one to get started.</Typography>
      ) : (
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell padding="checkbox">Done</TableCell>
              <TableCell>Title</TableCell>
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {tasks.map((task) => (
              <TableRow
                key={task.id}
                onClick={() => onEdit(task)}
                sx={{
                  cursor: 'pointer',
                  '&:hover': {
                    backgroundColor: 'action.hover',
                  },
                }}
              >
                <TableCell 
                  padding="checkbox" 
                  onClick={(e) => e.stopPropagation()}
                >
                  <Checkbox
                    checked={task.completed}
                    onChange={() => onToggleComplete(task)}
                  />
                </TableCell>
                <TableCell onClick={() => onEdit(task)}>
                  <Typography
                    component="span"
                    variant="body2"
                    sx={{
                      textDecoration: task.completed ? 'line-through' : 'none',
                      display: 'block',
                    }}
                  >
                    {task.title?.trim() || '—'}
                  </Typography>
                </TableCell>
                <TableCell 
                  align="right" 
                  onClick={(e) => e.stopPropagation()}
                >
                  <IconButton size="small" onClick={() => onEdit(task)} aria-label="Edit">
                    <EditIcon />
                  </IconButton>
                  <IconButton size="small" onClick={() => onDelete(task)} aria-label="Delete">
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}

      {total > limit && (
        <Box sx={{ display: 'flex', gap: 1, justifyContent: 'center', mt: 2 }}>
          <Button
            size="small"
            disabled={page <= 1}
            onClick={() => onPageChange(page - 1)}
          >
            Previous
          </Button>
          <Typography variant="body2" sx={{ alignSelf: 'center' }}>
            Page {page}
          </Typography>
          <Button
            size="small"
            disabled={page * limit >= total}
            onClick={() => onPageChange(page + 1)}
          >
            Next
          </Button>
        </Box>
      )}
    </>
  );
}
