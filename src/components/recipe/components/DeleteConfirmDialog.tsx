import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography
} from '@mui/material';

interface DeleteConfirmDialogProps {
  open: boolean;
  recipeName: string;
  onClose: () => void;
  onConfirm: () => void;
}

/**
 * レシピ削除確認ダイアログコンポーネント
 */
const DeleteConfirmDialog: React.FC<DeleteConfirmDialogProps> = ({
  open,
  recipeName,
  onClose,
  onConfirm
}) => {
  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>レシピの削除</DialogTitle>
      <DialogContent>
        <Typography>
          「{recipeName}」を削除してもよろしいですか？この操作は元に戻せません。
        </Typography>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>キャンセル</Button>
        <Button onClick={onConfirm} color="error" variant="contained">
          削除する
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default DeleteConfirmDialog;
