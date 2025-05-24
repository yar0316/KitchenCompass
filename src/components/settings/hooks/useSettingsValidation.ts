import { useState } from 'react';

export const useSettingsValidation = () => {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogType, setDialogType] = useState<'clearData' | 'deleteAccount'>('clearData');

  // ダイアログオープンハンドラ
  const handleOpenDialog = (type: 'clearData' | 'deleteAccount') => {
    setDialogType(type);
    setDialogOpen(true);
  };
  
  // ダイアログクローズハンドラ
  const handleCloseDialog = () => {
    setDialogOpen(false);
  };
  
  // データクリア処理
  const handleClearData = () => {
    console.log('データクリア処理...');
    setDialogOpen(false);
    return 'すべてのキャッシュデータがクリアされました';
  };
  
  // アカウント削除処理
  const handleDeleteAccount = () => {
    console.log('アカウント削除処理...');
    setDialogOpen(false);
    return 'アカウントが削除されました。ログイン画面に戻ります';
  };

  return {
    dialogOpen,
    dialogType,
    handleOpenDialog,
    handleCloseDialog,
    handleClearData,
    handleDeleteAccount
  };
};
