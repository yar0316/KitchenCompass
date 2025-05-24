import React from 'react';
import {
  Box,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Alert,
  IconButton
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

interface RecipeNotFoundProps {
  isDialog?: boolean;
  onClose?: () => void;
}

/**
 * レシピが見つからない場合のエラーメッセージコンポーネント
 */
const RecipeNotFound: React.FC<RecipeNotFoundProps> = ({ 
  isDialog = false, 
  onClose 
}) => {
  if (isDialog && onClose) {
    return (
      <Dialog
        open={true}
        onClose={onClose}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          エラー
          <IconButton
            aria-label="close"
            onClick={onClose}
            sx={{
              position: 'absolute',
              right: 8,
              top: 8,
            }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          <Alert severity="error" sx={{ mt: 2 }}>
            レシピデータが見つかりません。
          </Alert>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose}>閉じる</Button>
        </DialogActions>
      </Dialog>
    );
  }
  
  return (
    <Box sx={{ mt: 2 }}>
      <Alert severity="error">
        レシピデータが見つかりません。
      </Alert>
    </Box>
  );
};

export default RecipeNotFound;
