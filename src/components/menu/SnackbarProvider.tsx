import React from 'react';
import { 
  Snackbar,
  Alert
} from '@mui/material';
import { SnackbarState } from './types/Menu.types';

interface SnackbarProviderProps {
  snackbar: SnackbarState;
  onClose: () => void;
}

/**
 * スナックバー表示コンポーネント
 */
const SnackbarProvider: React.FC<SnackbarProviderProps> = ({
  snackbar,
  onClose
}) => {
  return (
    <Snackbar
      open={snackbar.open}
      autoHideDuration={3000}
      onClose={onClose}
      anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
    >
      <Alert 
        onClose={onClose} 
        severity={snackbar.severity}
        sx={{ width: '100%' }}
      >
        {snackbar.message}
      </Alert>
    </Snackbar>
  );
};

export default SnackbarProvider;
