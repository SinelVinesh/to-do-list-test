import { Typography, Container } from '@mui/material';
import { TaskList } from './pages/TaskList';

function App() {
  return (
    <Container maxWidth="md" sx={{ py: 3 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        To-Do List
      </Typography>
      <TaskList />
    </Container>
  );
}

export default App;
