import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Box,
  CircularProgress
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { ja } from 'date-fns/locale';

interface NewShoppingListDialogProps {
  open: boolean;
  onClose: () => void;
  onSave: (list: {
    name: string;
    description?: string;
    dueDate?: string;
  }) => void;
}

const NewShoppingListDialog: React.FC<NewShoppingListDialogProps> = ({
  open,
  onClose,
  onSave
}) => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [dueDate, setDueDate] = useState<Date | null>(null);
  const [nameError, setNameError] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  // フォームリセット
  const resetForm = () => {
    setName('');
    setDescription('');
    setDueDate(null);
    setNameError('');
    setIsSaving(false);
  };

  // ダイアログを閉じる
  const handleClose = () => {
    resetForm();
    onClose();
  };

  // 保存処理
  const handleSave = () => {
    // 名前は必須
    if (!name.trim()) {
      setNameError('リスト名を入力してください');
      return;
    }    setIsSaving(true);

    // AWS Amplifyに送信するためのフォーマット処理
    // ISO文字列としてデータを渡す
    onSave({
      name: name.trim(),
      description: description.trim() || undefined,
      dueDate: dueDate ? dueDate.toISOString() : undefined
    });

    resetForm();
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      aria-labelledby="new-shopping-list-dialog-title"
      maxWidth="sm"
      fullWidth
    >
      <DialogTitle id="new-shopping-list-dialog-title">
        新しい買い物リスト
      </DialogTitle>
      
      <DialogContent>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}>
          <TextField
            autoFocus
            label="リスト名"
            fullWidth
            value={name}
            onChange={(e) => {
              setName(e.target.value);
              if (e.target.value.trim()) {
                setNameError('');
              }
            }}
            error={!!nameError}
            helperText={nameError}
            placeholder="例: 週末の買い物"
            required
            disabled={isSaving}
          />
          
          <TextField
            label="説明（オプション）"
            fullWidth
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="例: 日曜日のディナーパーティー用"
            multiline
            rows={2}
            disabled={isSaving}
          />
          
          <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={ja}>
            <DatePicker
              label="予定日（オプション）"
              value={dueDate}
              onChange={(newValue) => setDueDate(newValue)}
              slotProps={{
                textField: {
                  fullWidth: true,
                  placeholder: '買い物予定日',
                  disabled: isSaving
                }
              }}
            />
          </LocalizationProvider>
        </Box>
      </DialogContent>
      
      <DialogActions sx={{ px: 3, pb: 2 }}>
        <Button 
          onClick={handleClose} 
          color="inherit"
          disabled={isSaving}
        >
          キャンセル
        </Button>
        <Button 
          onClick={handleSave} 
          variant="contained" 
          color="primary"
          disabled={isSaving || !name.trim()}
          startIcon={isSaving ? <CircularProgress size={20} /> : null}
        >
          {isSaving ? '作成中...' : '作成'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default NewShoppingListDialog;