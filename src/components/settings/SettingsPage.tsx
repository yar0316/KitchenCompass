import React, { useState } from 'react';
import {
  Container,
  Typography,
  Box,
  Paper,
  Grid,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Switch,
  Divider,
  Button,
  FormControlLabel,
  TextField,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
  SelectChangeEvent,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Alert,
  Snackbar,
  Slider,
  IconButton
} from '@mui/material';
import SettingsIcon from '@mui/icons-material/Settings';
import NotificationsIcon from '@mui/icons-material/Notifications';
import LanguageIcon from '@mui/icons-material/Language';
import DataUsageIcon from '@mui/icons-material/DataUsage';
import SecurityIcon from '@mui/icons-material/Security';
import VisibilityIcon from '@mui/icons-material/Visibility';
import StorageIcon from '@mui/icons-material/Storage';
import DisplaySettingsIcon from '@mui/icons-material/DisplaySettings';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import RestaurantIcon from '@mui/icons-material/Restaurant';
import { useTheme } from '@mui/material/styles';

/**
 * 設定画面コンポーネント
 * アプリケーション全体の設定を管理します
 */
const SettingsPage: React.FC = () => {
  const theme = useTheme();
  
  // 設定の状態
  const [settings, setSettings] = useState({
    darkMode: false, // アプリ全体で管理すべき項目だが、例示用に含める
    fontSize: 'medium',
    language: 'ja',
    notifications: true,
    emailNotifications: true,
    pushNotifications: true,
    autoUpdate: true,
    recipePortionSize: 2,
    // TODO: 将来的にデータ同期機能を実装時に有効化
    dataSync: true,
    privacy: {
      shareRecipes: true,
      publicProfile: false
    }
  });
  
  // ダイアログの状態
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogType, setDialogType] = useState<'clearData' | 'deleteAccount'>('clearData');
  
  // スナックバーの状態
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success' as 'success' | 'info' | 'warning' | 'error'
  });

  // スイッチ切り替えハンドラ
  const handleSwitchChange = (setting: string) => (event: React.ChangeEvent<HTMLInputElement>) => {
    setSettings({
      ...settings,
      [setting]: event.target.checked
    });
    
    showSnackbar(`${setting}設定を${event.target.checked ? 'オン' : 'オフ'}にしました`, 'success');
  };
  
  // ネストされた設定項目の切り替えハンドラ
  const handleNestedSwitchChange = (parent: string, setting: string) => (event: React.ChangeEvent<HTMLInputElement>) => {
    setSettings({
      ...settings,
      [parent]: {
        ...settings[parent as keyof typeof settings] as Record<string, boolean>,
        [setting]: event.target.checked
      }
    });
    
    showSnackbar(`${setting}設定を${event.target.checked ? 'オン' : 'オフ'}にしました`, 'success');
  };

  // セレクト変更ハンドラ
  const handleSelectChange = (setting: string) => (event: SelectChangeEvent<string>) => {
    setSettings({
      ...settings,
      [setting]: event.target.value
    });
    
    showSnackbar(`${setting}設定を「${event.target.value}」に変更しました`, 'success');
  };
  
  // スライダー変更ハンドラ
  const handleSliderChange = (setting: string) => (event: Event, newValue: number | number[]) => {
    setSettings({
      ...settings,
      [setting]: newValue
    });
  };
  
  // スライダー変更完了ハンドラ
  const handleSliderChangeCommitted = (setting: string, displayName: string) => (event: Event | React.SyntheticEvent, newValue: number | number[]) => {
    showSnackbar(`${displayName}を${newValue}に設定しました`, 'success');
  };
  
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
    showSnackbar('すべてのキャッシュデータがクリアされました', 'info');
  };
  
  // アカウント削除処理
  const handleDeleteAccount = () => {
    console.log('アカウント削除処理...');
    setDialogOpen(false);
    showSnackbar('アカウントが削除されました。ログイン画面に戻ります', 'warning');
  };

  // スナックバー表示ハンドラ
  const showSnackbar = (message: string, severity: 'success' | 'info' | 'warning' | 'error') => {
    setSnackbar({
      open: true,
      message,
      severity
    });
  };
  
  // スナックバークローズハンドラ
  const handleCloseSnackbar = () => {
    setSnackbar({
      ...snackbar,
      open: false
    });
  };
  
  // フォントサイズ選択肢
  const fontSizeOptions = [
    { value: 'small', label: '小' },
    { value: 'medium', label: '中' },
    { value: 'large', label: '大' }
  ];
  
  // 言語選択肢
  const languageOptions = [
    { value: 'ja', label: '日本語' },
    { value: 'en', label: 'English (英語)' },
    { value: 'zh', label: '中文 (中国語)' },
    { value: 'ko', label: '한국어 (韓国語)' }
  ];

  return (
    <Container maxWidth="lg" sx={{ mt: 1, mb: 4 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
        <SettingsIcon sx={{ mr: 1, fontSize: 30 }} />
        <Typography variant="h5" component="h1">
          設定
        </Typography>
      </Box>

      <Grid container spacing={3}>
        {/* 表示設定 */}
        <Grid item xs={12} md={6}>
          <Paper elevation={2} sx={{ p: 0 }}>
            <Box sx={{ p: 2, bgcolor: 'primary.main', color: 'primary.contrastText' }}>
              <Typography variant="h6" sx={{ display: 'flex', alignItems: 'center' }}>
                <DisplaySettingsIcon sx={{ mr: 1 }} />
                表示設定
              </Typography>
            </Box>
            <Box sx={{ p: 2 }}>
              <List disablePadding>
                <ListItem>
                  <ListItemIcon>
                    <VisibilityIcon />
                  </ListItemIcon>
                  <ListItemText
                    primary="ダークモード"
                    secondary="アプリの表示テーマを切り替えます"
                  />
                  <Switch
                    edge="end"
                    checked={settings.darkMode}
                    onChange={handleSwitchChange('darkMode')}
                  />
                </ListItem>
                
                <Divider variant="inset" component="li" />
                
                <ListItem>
                  <ListItemIcon>
                    <VisibilityIcon />
                  </ListItemIcon>
                  <ListItemText
                    primary="フォントサイズ"
                    secondary="テキストの表示サイズを調整します"
                  />
                  <FormControl sx={{ minWidth: 120 }}>
                    <Select
                      size="small"
                      value={settings.fontSize}
                      onChange={handleSelectChange('fontSize')}
                    >
                      {fontSizeOptions.map(option => (
                        <MenuItem key={option.value} value={option.value}>
                          {option.label}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </ListItem>
                
                <Divider variant="inset" component="li" />
                
                <ListItem>
                  <ListItemIcon>
                    <LanguageIcon />
                  </ListItemIcon>
                  <ListItemText
                    primary="言語"
                    secondary="アプリの表示言語を選択します"
                  />
                  <FormControl sx={{ minWidth: 120 }}>
                    <Select
                      size="small"
                      value={settings.language}
                      onChange={handleSelectChange('language')}
                    >
                      {languageOptions.map(option => (
                        <MenuItem key={option.value} value={option.value}>
                          {option.label}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </ListItem>
              </List>
            </Box>
          </Paper>
        </Grid>
        
        {/* 通知設定 */}
        <Grid item xs={12} md={6}>
          <Paper elevation={2} sx={{ p: 0 }}>
            <Box sx={{ p: 2, bgcolor: 'secondary.main', color: 'secondary.contrastText' }}>
              <Typography variant="h6" sx={{ display: 'flex', alignItems: 'center' }}>
                <NotificationsIcon sx={{ mr: 1 }} />
                通知設定
              </Typography>
            </Box>
            <Box sx={{ p: 2 }}>
              <List disablePadding>
                <ListItem>
                  <ListItemIcon>
                    <NotificationsIcon />
                  </ListItemIcon>
                  <ListItemText
                    primary="通知"
                    secondary="すべての通知を有効/無効にします"
                  />
                  <Switch
                    edge="end"
                    checked={settings.notifications}
                    onChange={handleSwitchChange('notifications')}
                  />
                </ListItem>
                
                <Divider variant="inset" component="li" />
                
                <ListItem sx={{ pl: 4 }}>
                  <ListItemText
                    primary="メール通知"
                    secondary="献立のリマインドなどをメールで受け取ります"
                  />
                  <Switch
                    edge="end"
                    disabled={!settings.notifications}
                    checked={settings.notifications && settings.emailNotifications}
                    onChange={handleSwitchChange('emailNotifications')}
                  />
                </ListItem>
                
                <Divider variant="inset" component="li" />
                
                <ListItem sx={{ pl: 4 }}>
                  <ListItemText
                    primary="プッシュ通知"
                    secondary="ブラウザのプッシュ通知を受け取ります"
                  />
                  <Switch
                    edge="end"
                    disabled={!settings.notifications}
                    checked={settings.notifications && settings.pushNotifications}
                    onChange={handleSwitchChange('pushNotifications')}
                  />
                </ListItem>
                
                <Divider variant="inset" component="li" />
                
                <ListItem>
                  <ListItemIcon>
                    <DataUsageIcon />
                  </ListItemIcon>
                  <ListItemText
                    primary="自動更新"
                    secondary="新しいコンテンツを自動的に更新します"
                  />
                  <Switch
                    edge="end"
                    checked={settings.autoUpdate}
                    onChange={handleSwitchChange('autoUpdate')}
                  />
                </ListItem>
              </List>
            </Box>
          </Paper>
        </Grid>
        
        {/* レシピ設定 */}
        <Grid item xs={12} md={6}>
          <Paper elevation={2} sx={{ p: 0 }}>
            <Box sx={{ p: 2, bgcolor: 'info.main', color: 'info.contrastText' }}>
              <Typography variant="h6" sx={{ display: 'flex', alignItems: 'center' }}>
                <RestaurantIcon sx={{ mr: 1 }} />
                レシピ設定
              </Typography>
            </Box>
            <Box sx={{ p: 2 }}>
              <List disablePadding>
                <ListItem>
                  <ListItemText
                    primary="デフォルト人数"
                    secondary={`レシピの標準人数: ${settings.recipePortionSize}人前`}
                  />
                </ListItem>
                <ListItem>
                  <Box sx={{ width: '100%', px: 2 }}>
                    <Slider
                      value={settings.recipePortionSize}
                      min={1}
                      max={10}
                      step={1}
                      marks={[
                        { value: 1, label: '1人' },
                        { value: 4, label: '4人' },
                        { value: 10, label: '10人' }
                      ]}
                      onChange={handleSliderChange('recipePortionSize')}
                      onChangeCommitted={handleSliderChangeCommitted('recipePortionSize', 'デフォルト人数')}
                    />
                  </Box>
                </ListItem>
                
                {/* <Divider component="li" />
                
                <ListItem>
                  <ListItemIcon>
                    <SecurityIcon />
                  </ListItemIcon>
                  <ListItemText
                    primary="レシピを公開する"
                    secondary="あなたのレシピを他のユーザーと共有します"
                  />
                  <Switch
                    edge="end"
                    checked={settings.privacy.shareRecipes}
                    onChange={handleNestedSwitchChange('privacy', 'shareRecipes')}
                  />
                </ListItem> */}
                {/* TODO: 将来的にレシピ公開機能を実装時に有効化 */}
                
              </List>
            </Box>
          </Paper>
        </Grid>
        
        {/* データ管理 */}
        {/* TODO: 将来的にデータ同期機能を実装時に有効化
        <Grid item xs={12} md={6}>
          <Paper elevation={2} sx={{ p: 0 }}>
            <Box sx={{ p: 2, bgcolor: 'warning.main', color: 'warning.contrastText' }}>
              <Typography variant="h6" sx={{ display: 'flex', alignItems: 'center' }}>
                <StorageIcon sx={{ mr: 1 }} />
                データ管理
              </Typography>
            </Box>
            <Box sx={{ p: 2 }}>
              <List disablePadding>
                <ListItem>
                  <ListItemIcon>
                    <DataUsageIcon />
                  </ListItemIcon>
                  <ListItemText
                    primary="データ同期"
                    secondary="複数のデバイス間でデータを同期します"
                  />
                  <Switch
                    edge="end"
                    checked={settings.dataSync}
                    onChange={handleSwitchChange('dataSync')}
                  />
                </ListItem>
                
                <Divider variant="inset" component="li" />
                
                <ListItem>
                  <ListItemIcon>
                    <SecurityIcon />
                  </ListItemIcon>
                  <ListItemText
                    primary="プロフィールを公開する"
                    secondary="あなたのプロフィール情報を他のユーザーに表示します"
                  />
                  <Switch
                    edge="end"
                    checked={settings.privacy.publicProfile}
                    onChange={handleNestedSwitchChange('privacy', 'publicProfile')}
                  />
                </ListItem>
              </List>
              
              <Box sx={{ mt: 3, display: 'flex', flexDirection: 'column', gap: 1 }}>
                <Button
                  variant="outlined"
                  color="warning"
                  startIcon={<DeleteForeverIcon />}
                  onClick={() => handleOpenDialog('clearData')}
                >
                  キャッシュデータをクリア
                </Button>
                <Button
                  variant="outlined"
                  color="error"
                  startIcon={<DeleteForeverIcon />}
                  onClick={() => handleOpenDialog('deleteAccount')}
                >
                  アカウントを削除
                </Button>
              </Box>
            </Box>
          </Paper>
        </Grid>
        */}
        
        {/* ヘルプ＆サポート */}
        <Grid item xs={12}>
          <Paper elevation={2} sx={{ p: 0 }}>
            <Box sx={{ p: 2, bgcolor: 'grey.200' }}>
              <Typography variant="h6" sx={{ display: 'flex', alignItems: 'center' }}>
                <HelpOutlineIcon sx={{ mr: 1 }} />
                ヘルプ＆サポート
              </Typography>
            </Box>
            <Box sx={{ p: 2 }}>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={4}>
                  <Button variant="outlined" fullWidth>
                    使い方ガイド
                  </Button>
                </Grid>
                <Grid item xs={12} sm={4}>
                  <Button variant="outlined" fullWidth>
                    よくある質問
                  </Button>
                </Grid>
                <Grid item xs={12} sm={4}>
                  <Button variant="outlined" fullWidth>
                    お問い合わせ
                  </Button>
                </Grid>
              </Grid>
              <Box sx={{ mt: 2 }}>
                <Typography variant="body2" color="text.secondary">
                  Kitchen Compass バージョン 1.0.0
                </Typography>
              </Box>
            </Box>
          </Paper>
        </Grid>
      </Grid>
      
      {/* 確認ダイアログ */}
      <Dialog
        open={dialogOpen}
        onClose={handleCloseDialog}
      >
        <DialogTitle>
          {dialogType === 'clearData' ? 'キャッシュデータをクリア' : 'アカウント削除'}
        </DialogTitle>
        <DialogContent>
          <DialogContentText>
            {dialogType === 'clearData' 
              ? 'すべてのローカルキャッシュデータがクリアされます。この操作は元に戻せません。' 
              : 'アカウントを削除すると、すべてのデータが完全に削除されます。この操作は元に戻せません。'}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} color="inherit">
            キャンセル
          </Button>
          <Button 
            onClick={dialogType === 'clearData' ? handleClearData : handleDeleteAccount} 
            color="error" 
            autoFocus
          >
            {dialogType === 'clearData' ? 'クリアする' : '削除する'}
          </Button>
        </DialogActions>
      </Dialog>
      
      {/* スナックバー */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
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