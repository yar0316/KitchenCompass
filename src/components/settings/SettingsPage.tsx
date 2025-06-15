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
  Alert,
  Snackbar,
  Slider,
  CircularProgress
} from '@mui/material';
import SettingsIcon from '@mui/icons-material/Settings';
import NotificationsIcon from '@mui/icons-material/Notifications';
import DataUsageIcon from '@mui/icons-material/DataUsage';
import DisplaySettingsIcon from '@mui/icons-material/DisplaySettings';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import RestaurantIcon from '@mui/icons-material/Restaurant';
import { generateClient } from 'aws-amplify/api';
import { getUserProfile } from '../../graphql/queries';
import { updateUserProfile, createUserProfile } from '../../graphql/mutations';
import { getCurrentUserId, getCurrentUserInfo } from '../../utils/authUtils';
import type { UserProfile } from '../../API';
import { DEFAULT_SETTINGS, type UserSettings } from '../../config/defaultSettings';

/**
 * 設定画面コンポーネント
 * アプリケーション全体の設定を管理し、GraphQLバックエンドと連携します
 */
const SettingsPage: React.FC = () => {
  const client = generateClient();
  
  // 設定の状態（デフォルト値を使用）
  const [settings, setSettings] = useState<UserSettings>(DEFAULT_SETTINGS);
  
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
  });// 設定データの読み込み
  useEffect(() => {
    let isUnmounted = false;
    const graphqlClient = generateClient();

    // スナックバー表示関数
    const showSnackbarLocal = (message: string, severity: 'success' | 'info' | 'warning' | 'error') => {
      if (!isUnmounted) {
        setSnackbar({ open: true, message, severity });
      }
    };

    // 新しいUserProfileを作成する関数
    const createNewUserProfile = async (userId: string): Promise<UserProfile | null> => {
      try {
        console.log('新しいUserProfileを作成中...');
        const userInfo = await getCurrentUserInfo();
          if (!userInfo) {
          console.error('ユーザー情報を取得できませんでした');
          throw new Error('ユーザー情報を取得できませんでした');
        }

        const createResponse = await graphqlClient.graphql({
          query: createUserProfile,
          variables: {
            input: {
              id: userId,
              userId: userId,
              email: userInfo.signInDetails?.loginId || 'unknown@example.com',
              givenName: userInfo.signInDetails?.loginId?.split('@')[0] || 'User',
              familyName: '',
              // 設定項目はDynamoDBのデフォルト値を使用するため明示的に設定しない
            }
          }
        });        // GraphQLResultの型チェック
        if ('data' in createResponse && createResponse.data) {
          const newProfile = createResponse.data.createUserProfile;
          if (newProfile) {
            console.log('UserProfileが正常に作成されました');
            showSnackbarLocal('新しいユーザープロファイルを作成しました', 'success');
            return newProfile;
          }
        }
        
        return null;
      } catch (createError) {
        console.error('UserProfile作成エラー:', createError);
        showSnackbarLocal('プロファイル作成に失敗しました', 'error');
        return null;
      }
    };

    const loadSettings = async () => {
      try {
        const userId = await getCurrentUserId();
        
        if (isUnmounted) return;
        
        if (!userId) {
          console.warn('ユーザーが認証されていません');
          setLoading(false);
          return;
        }

        try {
          const response = await graphqlClient.graphql({
            query: getUserProfile,
            variables: { id: userId }
          });

          if (isUnmounted) return;
            // GraphQLResultの型チェック
          if ('data' in response && response.data) {
            const profile = response.data.getUserProfile;
            if (profile) {
              setUserProfile(profile);
              
              // 個別フィールドから設定を復元
              const userSettings: UserSettings = {
                notifications: profile.notifications ?? DEFAULT_SETTINGS.notifications,
                emailNotifications: profile.emailNotifications ?? DEFAULT_SETTINGS.emailNotifications,
                pushNotifications: profile.pushNotifications ?? DEFAULT_SETTINGS.pushNotifications,
                darkMode: profile.darkMode ?? DEFAULT_SETTINGS.darkMode,
                autoUpdate: profile.autoUpdate ?? DEFAULT_SETTINGS.autoUpdate,
                recipePortionSize: profile.recipePortionSize ?? DEFAULT_SETTINGS.recipePortionSize,
                dataSync: profile.dataSync ?? DEFAULT_SETTINGS.dataSync,
              };
              setSettings(userSettings);
            } else {
              // UserProfileが存在しない場合、新規作成
              console.log('UserProfileが存在しません。新規作成します。');
              const newProfile = await createNewUserProfile(userId);
              
              if (isUnmounted) return;
              
              if (newProfile) {
                setUserProfile(newProfile);
              }
              setSettings(DEFAULT_SETTINGS);
            }
          }
        } catch (error) {
          if (isUnmounted) return;
          
          console.error('UserProfile取得エラー:', error);
          
          // UserProfileが見つからない場合、新規作成を試行
          if (error instanceof Error && (error.message.includes('No item found') || error.message.includes('not found'))) {
            console.log('UserProfileが見つからないため、新規作成します。');
            const newProfile = await createNewUserProfile(userId);
            
            if (isUnmounted) return;
            
            if (newProfile) {
              setUserProfile(newProfile);
            }
            setSettings(DEFAULT_SETTINGS);
          } else {
            showSnackbarLocal('設定の読み込みに失敗しました', 'error');
          }
        }
      } catch (error) {
        if (isUnmounted) return;
        
        console.error('設定の読み込みに失敗:', error);
        showSnackbarLocal('設定の読み込みに失敗しました', 'error');
      } finally {
        if (!isUnmounted) {
          setLoading(false);
        }
      }
    };

    loadSettings();

    return () => {
      isUnmounted = true;
    };
  }, []); // 空の依存配列で初回のみ実行
  // スナックバー表示関数
  const showSnackbar = (message: string, severity: typeof snackbar.severity) => {
    setSnackbar({ open: true, message, severity });
  };

  // 設定保存関数
  const saveUserSettings = async (newSettings: UserSettings) => {
    try {
      setSaving(true);
      const userId = await getCurrentUserId();
      
      if (!userId) {
        console.warn('ユーザーが認証されていません');
        showSnackbar('ユーザーが認証されていません', 'error');
        return;
      }      if (userProfile) {
        // 既存のプロファイルを更新
        const updateResponse = await client.graphql({
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
        });        // GraphQLResultの型チェック  
        if ('data' in updateResponse && updateResponse.data) {
          if (updateResponse.data.updateUserProfile) {
            setUserProfile(updateResponse.data.updateUserProfile);
            showSnackbar('設定が正常に保存されました', 'success');
          }
        }
      } else {
        // 新しいプロファイルを作成
        const userInfo = await getCurrentUserInfo();
        
        if (!userInfo) {
          console.error('ユーザー情報を取得できませんでした');
          throw new Error('ユーザー情報を取得できませんでした');
        }

        const createResponse = await client.graphql({
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
        });        // GraphQLResultの型チェック
        if ('data' in createResponse && createResponse.data) {
          const newProfile = createResponse.data.createUserProfile;
          if (newProfile) {
            setUserProfile(newProfile);
            showSnackbar('新しいプロファイルが作成され、設定が保存されました', 'success');
          }
        }
      }

      // 最新の設定をstateに反映
      setSettings(newSettings);
      
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
  // スナックバークローズハンドラ
  const handleCloseSnackbar = () => {
    setSnackbar({
      ...snackbar,
      open: false
    });
  };

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

      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>        {/* 表示設定 */}
        <Paper elevation={2} sx={{ p: 0 }}>
          <Box sx={{ p: 2, bgcolor: 'primary.main', color: 'primary.contrastText' }}>
            <Typography variant="h6" sx={{ display: 'flex', alignItems: 'center' }}>
              <DisplaySettingsIcon sx={{ mr: 1 }} />
              表示設定
            </Typography>
          </Box>
          <Box sx={{ p: 2 }}>
            <List disablePadding>              <ListItem>
                <ListItemIcon>
                  <DisplaySettingsIcon />
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
              </ListItem>            </List>
          </Box>        </Paper>
        
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

export default SettingsPage;
