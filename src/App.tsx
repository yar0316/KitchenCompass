import { useState } from 'react';
import { ThemeProvider, CssBaseline, Box, Container } from '@mui/material';
import { lightTheme, darkTheme } from './theme/theme';
import ShoppingListPage from './components/shopping/ShoppingListPage';

function App() {
  const [useDarkMode, setUseDarkMode] = useState(false);
  const theme = useDarkMode ? darkTheme : lightTheme;

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box
        sx={{
          minHeight: '100vh',
          bgcolor: 'background.default',
          color: 'text.primary',
        }}
      >
        <Container maxWidth={false} disableGutters>
          <ShoppingListPage />
        </Container>
      </Box>
    </ThemeProvider>
  );
}

export default App;
