import { Component, type ReactNode } from 'react';
import { Box, Typography, Button, Paper } from '@mui/material';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
}

export class ErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false };

  static getDerivedStateFromError(): State {
    return { hasError: true };
  }

  render() {
    if (this.state.hasError) {
      return (
        <Box sx={{ p: 3, display: 'flex', justifyContent: 'center' }}>
          <Paper sx={{ p: 3, maxWidth: 400 }}>
            <Typography variant="h6" gutterBottom>
              Something went wrong
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              An unexpected error occurred. Try refreshing the page.
            </Typography>
            <Button
              variant="contained"
              onClick={() => window.location.reload()}
            >
              Reload page
            </Button>
          </Paper>
        </Box>
      );
    }
    return this.props.children;
  }
}
