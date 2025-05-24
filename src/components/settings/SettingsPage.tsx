import React from 'react';
import {
  Container,
  Typography,
  Box,
  Alert,
  Snackbar
} from '@mui/material';
import SettingsIcon from '@mui/icons-material/Settings';
import { DisplaySettings } from './components/DisplaySettings';
import { NotificationSettings } from './components/NotificationSettings';
import { RecipeSettings } from './components/RecipeSettings';
import { HelpSupport } from './components/HelpSupport';
import { useSettings } from './hooks/useSettings';

const SettingsPage: React.FC = () => {
  const {
    settings,
    snackbar,
    handleSwitchChange,
    handleSelectChange,
    handleSliderChange,
    handleSliderChangeCommitted,
    handleCloseSnackbar
  } = useSettings();

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 4 }}>
        <SettingsIcon sx={{ mr: 2, fontSize: 32 }} />
        <Typography variant="h4" component="h1">
          設定
        </Typography>
      </Box>

      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
        <DisplaySettings
          settings={settings}
          onSwitchChange={handleSwitchChange}
          onSelectChange={handleSelectChange}
        />

        <NotificationSettings
          settings={settings}
          onSwitchChange={handleSwitchChange}
        />

        <RecipeSettings
          settings={settings}
          onSliderChange={handleSliderChange}
          onSliderChangeCommitted={handleSliderChangeCommitted}
        />

        <HelpSupport />
      </Box>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity={snackbar.severity}
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default SettingsPage;