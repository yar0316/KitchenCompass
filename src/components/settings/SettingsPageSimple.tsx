import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Box,
  Paper,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Switch,
  Divider,
  Button,
  MenuItem,
  FormControl,
  Select,
  SelectChangeEvent,
  Alert,
  Snackbar,
  Slider,
  CircularProgress
} from '@mui/material';
import SettingsIcon from '@mui/icons-material/Settings';
import NotificationsIcon from '@mui/icons-material/Notifications';
import LanguageIcon from '@mui/icons-material/Language';
import DataUsageIcon from '@mui/icons-material/DataUsage';
import VisibilityIcon from '@mui/icons-material/Visibility';
import DisplaySettingsIcon from '@mui/icons-material/DisplaySettings';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import RestaurantIcon from '@mui/icons-material/Restaurant';
import { generateClient } from 'aws-amplify/api';
import { getUserProfile } from '../../graphql/queries';
import { updateUserProfile, createUserProfile } from '../../graphql/mutations';
import { getCurrentUserId, getCurrentUserInfo } from '../../utils/authUtils';
import type { UserProfile } from '../../API';

/**
 * 設定画面コンポーネント (簡略版)
 * アプリケーション全体の設定を管理します
 */
const SettingsPageSimple: React.FC = () => {
  const client = generateClient();
  
  // 設定の状態
  const [settings, setSettings] = useState({
    darkMode: false,
    fontSize: 'medium',
    language: 'ja',
    notifications: true,
    emailNotifications: true,
    pushNotifications: true,
    autoUpdate: true,
    recipePortionSize: 2,
    dataSync: true,
    privacy: {
      shareRecipes: true,
      publicProfile: false
    }
  });
  
  // ローディング状態
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  
  // ユーザープロファイル
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);

  // スナックバーの状態
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success' as 'success' | 'info' | 'warning' | 'error'
  });

  // 設定データの読み込み
  useEffect(() => {
    const loadSettings = async () => {
      try {
        setLoading(true);
        const userId = await getCurrentUserId();
        
        if (!userId) {
          console.warn('ユーザーが認証されていません');
          setLoading(false);
          return;
        }

        const response = await client.graphql({
          query: getUserProfile,
          variables: { id: userId }
        });
          // GraphQLResultの型チェック
        if ('data' in response && response.data) {
          const profile = response.data.getUserProfile;
          if (profile) {
            setUserProfile(profile);
            
            // 個別フィールドから設定を復元
            setSettings(prevSettings => ({
              ...prevSettings,
              notifications: profile.notifications ?? prevSettings.notifications,
              emailNotifications: profile.emailNotifications ?? prevSettings.emailNotifications,
              pushNotifications: profile.pushNotifications ?? prevSettings.pushNotifications,
              darkMode: profile.darkMode ?? prevSettings.darkMode,
              autoUpdate: profile.autoUpdate ?? prevSettings.autoUpdate,
              recipePortionSize: profile.recipePortionSize ?? prevSettings.recipePortionSize,
              dataSync: profile.dataSync ?? prevSettings.dataSync,
            }));
          }
        }
      } catch (error) {
        console.error('設定の読み込みに失敗:', error);
        showSnackbar('設定の読み込みに失敗しました', 'error');
      } finally {
        setLoading(false);
      }
    };

    loadSettings();
  }, [client]);

  const saveUserSettings = async (newSettings: typeof settings) => {
    try {
      setSaving(true);      const userId = await getCurrentUserId();
      
      if (!userId) {
        console.warn('ユーザーが認証されていません');
        return;
      }

      if (userProfile) {
        // 既存のプロファイルを更新
        await client.graphql({
          query: updateUserProfile,
          variables: {
            input: {
              id: userProfile.id,
              notifications: newSettings.notifications,
              emailNotifications: newSettings.emailNotifications,
              pushNotifications: newSettings.pushNotifications,
              darkMode: newSettings.darkMode,
              autoUpdate: newSettings.autoUpdate,
              recipePortionSize: newSettings.recipePortionSize,
              dataSync: newSettings.dataSync,
            }
          }
        });
      } else {
        // 新しいプロファイルを作成
        const userInfo = await getCurrentUserInfo();
        
        if (!userInfo) {
          console.error('ユーザー情報を取得できませんでした');
          throw new Error('ユーザー情報を取得できませんでした');
        }

        await client.graphql({
          query: createUserProfile,
          variables: {
            input: {
              id: userId,
              userId: userId,
              email: userInfo.signInDetails?.loginId || 'unknown@example.com',
              givenName: userInfo.signInDetails?.loginId?.split('@')[0] || 'User',
              familyName: '',
              notifications: newSettings.notifications,
              emailNotifications: newSettings.emailNotifications,
              pushNotifications: newSettings.pushNotifications,
              darkMode: newSettings.darkMode,
              autoUpdate: newSettings.autoUpdate,
              recipePortionSize: newSettings.recipePortionSize,
              dataSync: newSettings.dataSync,
            }
          }
        });
      }

      showSnackbar('設定を保存しました', 'success');
    } catch (error) {
      console.error('設定の保存に失敗:', error);
      showSnackbar('設定の保存に失敗しました', 'error');
    } finally {
      setSaving(false);
    }
  };

  // スイッチ切り替えハンドラ
  const handleSwitchChange = (setting: string) => async (event: React.ChangeEvent<HTMLInputElement>) => {
    const newSettings = {
      ...settings,
      [setting]: event.target.checked
    };
    
    setSettings(newSettings);
    await saveUserSettings(newSettings);
    
    showSnackbar(`${setting}設定を${event.target.checked ? 'オン' : 'オフ'}にしました`, 'success');
  };

  // セレクト変更ハンドラ
  const handleSelectChange = (setting: string) => async (event: SelectChangeEvent<string>) => {
    const newSettings = {
      ...settings,
      [setting]: event.target.value
    };
    
    setSettings(newSettings);
    await saveUserSettings(newSettings);
    
    showSnackbar(`${setting}設定を「${event.target.value}」に変更しました`, 'success');
  };

  // スライダー変更完了ハンドラ
  const handleSliderChangeCommitted = (setting: string, displayName: string) => async (_event: Event | React.SyntheticEvent, newValue: number | number[]) => {
    const newSettings = {
      ...settings,
      [setting]: newValue
    };
    
    setSettings(newSettings);
    await saveUserSettings(newSettings);
    
    showSnackbar(`${displayName}を${newValue}に設定しました`, 'success');
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

  // ローディング中の表示
  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ mt: 1, mb: 4 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
          <SettingsIcon sx={{ mr: 1, fontSize: 30 }} />
          <Typography variant="h5" component="h1">
            設定
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: 200 }}>
          <CircularProgress />
          <Typography variant="body1" sx={{ ml: 2 }}>
            設定を読み込み中...
          </Typography>
        </Box>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 1, mb: 4 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
        <SettingsIcon sx={{ mr: 1, fontSize: 30 }} />
        <Typography variant="h5" component="h1">
          設定
        </Typography>
      </Box>

      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
        {/* 表示設定 */}
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
        
        {/* 通知設定 */}
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
        
        {/* レシピ設定 */}
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
                    onChange={(_, newValue) => setSettings({ ...settings, recipePortionSize: newValue as number })}
                    onChangeCommitted={handleSliderChangeCommitted('recipePortionSize', 'デフォルト人数')}
                  />
                </Box>
              </ListItem>
            </List>
          </Box>
        </Paper>
        
        {/* ヘルプ＆サポート */}
        <Paper elevation={2} sx={{ p: 0 }}>
          <Box sx={{ p: 2, bgcolor: 'grey.200' }}>
            <Typography variant="h6" sx={{ display: 'flex', alignItems: 'center' }}>
              <HelpOutlineIcon sx={{ mr: 1 }} />
              ヘルプ＆サポート
            </Typography>
          </Box>
          <Box sx={{ p: 2 }}>
            <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, gap: 2 }}>
              <Button variant="outlined" fullWidth>
                使い方ガイド
              </Button>
              <Button variant="outlined" fullWidth>
                よくある質問
              </Button>
              <Button variant="outlined" fullWidth>
                お問い合わせ
              </Button>
            </Box>
            <Box sx={{ mt: 2 }}>
              <Typography variant="body2" color="text.secondary">
                Kitchen Compass バージョン 1.0.0
              </Typography>
            </Box>
          </Box>
        </Paper>
      </Box>
      
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

      {/* 保存中の表示 */}
      {saving && (
        <Box
          sx={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            bgcolor: 'rgba(0, 0, 0, 0.3)',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            zIndex: 9999
          }}
        >
          <Paper sx={{ p: 3, display: 'flex', alignItems: 'center' }}>
            <CircularProgress size={24} sx={{ mr: 2 }} />
            <Typography>設定を保存中...</Typography>
          </Paper>
        </Box>
      )}
    </Container>
  );
};

export default SettingsPageSimple;
