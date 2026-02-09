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

/**
 * Try to extract a short plain-text preview from either a Yoopta JSON string
 * or legacy plain text. Returns up to `maxLen` characters.
 */
function descriptionPreview(raw: string | null, maxLen = 120): string {
  if (!raw || !raw.trim()) return '—';
  try {
    const parsed = JSON.parse(raw);
    if (parsed && typeof parsed === 'object' && !Array.isArray(parsed)) {
      // Walk Yoopta blocks and extract text nodes
      const texts: string[] = [];
      for (const block of Object.values(parsed) as any[]) {
        const elements = block?.value;
        if (!Array.isArray(elements)) continue;
        for (const el of elements) {
          if (!el?.children) continue;
          for (const child of el.children) {
            if (child?.text) texts.push(child.text);
          }
        }
      }
      const joined = texts.join(' ').trim();
      if (!joined) return '—';
      return joined.length > maxLen ? joined.slice(0, maxLen) + '…' : joined;
    }
  } catch {
    // Legacy plain text
  }
  return raw.length > maxLen ? raw.slice(0, maxLen) + '…' : raw;
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
              <TableCell>Description</TableCell>
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {[1, 2, 3, 4, 5].map((i) => (
              <TableRow key={i}>
                <TableCell padding="checkbox">
                  <Skeleton variant="circular" width={24} height={24} />
                </TableCell>
                <TableCell>
                  <Skeleton variant="text" width="60%" />
                </TableCell>
                <TableCell>
                  <Skeleton variant="text" width="40%" />
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
              <TableCell>Description</TableCell>
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {tasks.map((task) => (
              <TableRow key={task.id}>
                <TableCell padding="checkbox">
                  <Checkbox
                    checked={task.completed}
                    onChange={() => onToggleComplete(task)}
                  />
                </TableCell>
                <TableCell>
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
                <TableCell>
                  <Box sx={{ maxWidth: 300, maxHeight: 80, overflow: 'hidden' }}>
                    <Typography variant="body2" color="text.secondary">
                      {descriptionPreview(task.description)}
                    </Typography>
                  </Box>
                </TableCell>
                <TableCell align="right">
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
