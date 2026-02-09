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
import { useMemo } from 'react';
import type { Task } from '../api/tasks';

// Format date from YYYY-MM-DD to DD/MM/YYYY
function formatDate(dateString: string | null): string {
  if (!dateString) return '';
  const date = new Date(dateString);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);
  if (date.toDateString() === today.toDateString()) return 'Today';
  if (date.toDateString() === tomorrow.toDateString()) return 'Tomorrow';
  if (date.toDateString() === yesterday.toDateString()) return 'Yesterday';
  const day = String(date.getDate()).padStart(2, '0');

  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();
  return `${day}/${month}/${year}`;
}

// Get date key for grouping (YYYY-MM-DD format)
function getDateKey(dateString: string | null): string {
  if (!dateString) return '__NO_DATE__';
  // Extract YYYY-MM-DD from ISO string
  return dateString.split('T')[0];
}
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
  // Group tasks by date
  const groupedTasks = useMemo(() => {
    const groups: Map<string, Task[]> = new Map();
    
    tasks.forEach((task) => {
      const dateKey = getDateKey(task.dueDate);
      if (!groups.has(dateKey)) {
        groups.set(dateKey, []);
      }
      groups.get(dateKey)!.push(task);
    });

    // Convert to array and sort by date (descending)
    const sortedGroups = Array.from(groups.entries()).sort(([dateKeyA], [dateKeyB]) => {
      if (dateKeyA === '__NO_DATE__') return 1; // No date goes to the end
      if (dateKeyB === '__NO_DATE__') return -1;
      return dateKeyB.localeCompare(dateKeyA); // Descending order
    });

    return sortedGroups;
  }, [tasks]);

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
        <>
          {groupedTasks.map(([dateKey, dateTasks]) => (
            <Box key={dateKey} sx={{ mb: 3 }}>
              <Typography
                variant="subtitle1"
                sx={{
                  fontWeight: 600,
                  mb: 1,
                  color: 'text.secondary',
                  textTransform: 'uppercase',
                  fontSize: '0.875rem',
                }}
              >
                {
                dateKey === '__NO_DATE__' ? 'Without date' : formatDate(dateKey)}
              </Typography>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell padding="checkbox">Done</TableCell>
                    <TableCell>Title</TableCell>
                    <TableCell align="right">Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {dateTasks.map((task) => (
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
                      <TableCell 
                        onClick={() => onEdit(task)}
                        width={"80%"}
                      >
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
            </Box>
          ))}
        </>
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
