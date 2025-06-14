import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Box,
  Paper,
  Avatar,
  Button,
  TextField,
  Divider,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  ListItemButton,
  IconButton,
  Chip,
  Tabs,
  Tab,
  Card,
  CardContent,
  CardActions,
  Alert,
  Snackbar
} from '@mui/material';
import { generateClient } from 'aws-amplify/api';
import { getCurrentUserId } from '../../utils/authUtils';
import { getUserProfile } from '../../../queries';
import { updateUserProfile, createUserProfile } from '../../../mutations';
import { UserProfile, UpdateUserProfileInput, CreateUserProfileInput, UserProfileCookingExperience } from '../../API';
import PersonIcon from '@mui/icons-material/Person';
import EditIcon from '@mui/icons-material/Edit';
import SaveIcon from '@mui/icons-material/Save';
import CancelIcon from '@mui/icons-material/Cancel';
import RestaurantIcon from '@mui/icons-material/Restaurant';
import FavoriteIcon from '@mui/icons-material/Favorite';
import HistoryIcon from '@mui/icons-material/History';
import SettingsIcon from '@mui/icons-material/Settings';
import StarIcon from '@mui/icons-material/Star';
import DeleteIcon from '@mui/icons-material/Delete';

// タブパネルのプロパティ
interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

// タブパネルコンポーネント
const TabPanel = (props: TabPanelProps) => {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`profile-tabpanel-${index}`}
      aria-labelledby={`profile-tab-${index}`}
      {...other}
      style={{ paddingTop: '20px' }}
    >
      {value === index && <>{children}</>}
    </div>
  );
};

// お気に入りレシピのモックデータ
const FAVORITE_RECIPES = [
  { id: '1', name: 'トマトとモッツァレラのカプレーゼ', category: 'サラダ', imageUrl: '' },
  { id: '2', name: '基本の肉じゃが', category: 'メイン', imageUrl: '' },
  { id: '3', name: 'アボカドとエビのサラダ', category: 'サラダ', imageUrl: '' },
];

// 最近閲覧したレシピのモックデータ
const RECENT_RECIPES = [
  { id: '4', name: '手作りピザ', category: 'メイン', date: '2025/04/20', imageUrl: '' },
  { id: '5', name: '鶏肉の照り焼き', category: 'メイン', date: '2025/04/18', imageUrl: '' },
];

/**
 * プロフィールページコンポーネント
 * ユーザープロフィール情報の表示と編集を行います
 */
const ProfilePage: React.FC = () => {
  const client = generateClient();  // null値を適切なデフォルト値に変換するユーティリティ関数
  const sanitizeUserProfile = (profile: UserProfile): UserProfile => {
    return {
      ...profile,
      // 文字列型のnullを空文字に変換
      preferredCuisine: profile.preferredCuisine ?? '',
      profileImageKey: profile.profileImageKey ?? '',
      bio: profile.bio ?? '',
      // boolean型のnullをfalseに変換
      notifications: profile.notifications ?? false,
      emailNotifications: profile.emailNotifications ?? false,
      pushNotifications: profile.pushNotifications ?? false,
      darkMode: profile.darkMode ?? false,
      autoUpdate: profile.autoUpdate ?? false,
      dataSync: profile.dataSync ?? false,
      // 数値型のnullを適切なデフォルト値に変換
      recipePortionSize: profile.recipePortionSize ?? 4,
      recipesCreatedCount: profile.recipesCreatedCount ?? 0,
      favoriteRecipesCount: profile.favoriteRecipesCount ?? 0,
      // 列挙型のnullをデフォルト値に変換
      cookingExperience: profile.cookingExperience ?? UserProfileCookingExperience.BEGINNER,
    };
  };

  // ユーザープロフィール状態
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  // 編集モード状態
  const [isEditing, setIsEditing] = useState(false);
  const [editProfile, setEditProfile] = useState<Partial<UserProfile>>({});
  
  // タブ状態
  const [tabValue, setTabValue] = useState(0);
  
  // 初期化フラグ（無限ループ防止）
  const [isInitialized, setIsInitialized] = useState(false);
    // スナックバー状態
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success' as 'success' | 'error' | 'info'
  });  // プロフィール取得
  useEffect(() => {
    // 既に初期化済みの場合は処理をスキップ
    if (isInitialized) {
      return;
    }

    // 初期化フラグを設定（無限ループ防止）
    setIsInitialized(true);

    // デフォルトプロフィールを作成する関数
    const createDefaultProfile = async (userId: string) => {
      try {
        console.log('デフォルトプロフィールの作成を開始します:', userId);        const defaultInput: CreateUserProfileInput = {
          id: userId,
          userId: userId,
          givenName: 'ユーザー',
          familyName: '',
          email: 'user@example.com',
          preferredCuisine: '和食,洋食',
          bio: 'プロフィールを設定してください',
          // null値になりやすい項目にデフォルト値を設定
          notifications: false,
          emailNotifications: false,
          pushNotifications: false,
          darkMode: false,
          autoUpdate: false,
          dataSync: false,
          recipePortionSize: 4,
          recipesCreatedCount: 0,
          favoriteRecipesCount: 0,
          cookingExperience: UserProfileCookingExperience.BEGINNER,
          profileImageKey: '',
        };

        const response = await client.graphql({
          query: createUserProfile,
          variables: { input: defaultInput }
        });        const createdProfile = response.data?.createUserProfile;
        if (createdProfile) {
          console.log('デフォルトプロフィールの作成に成功しました（生データ）:', createdProfile);
          // null値を適切なデフォルト値に変換
          const sanitizedProfile = sanitizeUserProfile(createdProfile);
          console.log('デフォルトプロフィールの作成に成功しました（変換後）:', sanitizedProfile);
          setUserProfile(sanitizedProfile);
          setEditProfile(sanitizedProfile);
          setSnackbar({
            open: true,
            message: 'デフォルトプロフィールを作成しました。',
            severity: 'info'
          });
          return true;
        }
        console.log('デフォルトプロフィールの作成に失敗しました');
        return false;
      } catch (err: unknown) {
        console.error('デフォルトプロフィール作成エラー:', err);
        setSnackbar({
          open: true,
          message: 'デフォルトプロフィールの作成に失敗しました',
          severity: 'error'
        });
        return false;
      }
    };    const fetchUserProfile = async () => {
      try {
        console.log('プロフィール取得を開始します');
        setLoading(true);
        
        const userId = await getCurrentUserId();
        if (!userId) {
          console.error('認証情報がありません');
          setSnackbar({
            open: true,
            message: '認証情報が取得できません',
            severity: 'error'
          });
          throw new Error('認証情報がありません');
        }

        console.log('ユーザーID取得成功:', userId);

        const response = await client.graphql({
          query: getUserProfile,
          variables: { id: userId }
        });        const profile = response.data?.getUserProfile;
        if (profile) {
          console.log('プロフィール取得成功（生データ）:', profile);
          // null値を適切なデフォルト値に変換
          const sanitizedProfile = sanitizeUserProfile(profile);
          console.log('プロフィール取得成功（変換後）:', sanitizedProfile);
          setUserProfile(sanitizedProfile);
          setEditProfile(sanitizedProfile);
          setSnackbar({
            open: true,
            message: 'プロフィールを読み込みました',
            severity: 'success'
          });
        } else {
          console.log('プロフィールが存在しません。デフォルトプロフィールを作成します');
          const defaultCreated = await createDefaultProfile(userId);
          if (!defaultCreated) {
            console.error('デフォルトプロフィール作成に失敗しました');
            setSnackbar({
              open: true,
              message: 'プロフィールの初期化に失敗しました',
              severity: 'error'
            });
          }
        }
      } catch (err: unknown) {
        console.error('プロフィール取得エラー:', err);
        const errorMessage = (err as Error).message || 'プロフィール情報の取得に失敗しました';
        setError(errorMessage);
        setSnackbar({
          open: true,
          message: errorMessage,
          severity: 'error'
        });
      } finally {
        setLoading(false);
        console.log('プロフィール取得処理完了');
      }    };    fetchUserProfile();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // 依存関係を空にして、マウント時のみ実行
  // 編集モード切り替え
  const handleEditToggle = () => {
    if (isEditing) {
      setEditProfile(userProfile ? { ...userProfile } : {}); // キャンセル時は元のデータに戻す
    } else {
      // 編集モードに入る時はエラーをクリア
      setError(null);
    }
    setIsEditing(!isEditing);
  };

  // プロフィール更新
  const handleProfileUpdate = async () => {
    if (!editProfile || saving) return;

    try {
      setSaving(true);
      const userId = await getCurrentUserId();
      
      if (!userId) {
        throw new Error('認証情報がありません');
      }

      if (userProfile) {        // 既存プロフィールを更新
        const updateInput: UpdateUserProfileInput = {
          id: userProfile.id,
          givenName: editProfile.givenName || userProfile.givenName,
          familyName: editProfile.familyName || userProfile.familyName,
          email: editProfile.email || userProfile.email,
          preferredCuisine: editProfile.preferredCuisine ?? '',
          bio: editProfile.bio ?? '',
          profileImageKey: editProfile.profileImageKey ?? '',
          // null値になりやすい項目を明示的に設定
          notifications: editProfile.notifications ?? false,
          emailNotifications: editProfile.emailNotifications ?? false,
          pushNotifications: editProfile.pushNotifications ?? false,
          darkMode: editProfile.darkMode ?? false,
          autoUpdate: editProfile.autoUpdate ?? false,
          dataSync: editProfile.dataSync ?? false,
          recipePortionSize: editProfile.recipePortionSize ?? 4,
          recipesCreatedCount: editProfile.recipesCreatedCount ?? 0,
          favoriteRecipesCount: editProfile.favoriteRecipesCount ?? 0,
          cookingExperience: editProfile.cookingExperience ?? UserProfileCookingExperience.BEGINNER,
        };

        const response = await client.graphql({
          query: updateUserProfile,
          variables: { input: updateInput }
        });        const updatedProfile = response.data?.updateUserProfile;
        if (updatedProfile) {
          console.log('プロフィール更新成功（生データ）:', updatedProfile);
          // null値を適切なデフォルト値に変換
          const sanitizedProfile = sanitizeUserProfile(updatedProfile);
          console.log('プロフィール更新成功（変換後）:', sanitizedProfile);
          setUserProfile(sanitizedProfile);
          setEditProfile(sanitizedProfile);
          setError(null); // 成功時はエラーをクリア
          setSnackbar({
            open: true,
            message: 'プロフィールが更新されました',
            severity: 'success'
          });
        }
      } else {        // 新規プロフィールを作成
        const createInput: CreateUserProfileInput = {
          id: userId,
          userId: userId,
          givenName: editProfile.givenName || 'User',
          familyName: editProfile.familyName || '',
          email: editProfile.email || 'unknown@example.com',
          preferredCuisine: editProfile.preferredCuisine ?? '',
          bio: editProfile.bio ?? '',
          // null値になりやすい項目にデフォルト値を設定
          notifications: editProfile.notifications ?? false,
          emailNotifications: editProfile.emailNotifications ?? false,
          pushNotifications: editProfile.pushNotifications ?? false,
          darkMode: editProfile.darkMode ?? false,
          autoUpdate: editProfile.autoUpdate ?? false,
          dataSync: editProfile.dataSync ?? false,
          recipePortionSize: editProfile.recipePortionSize ?? 4,
          recipesCreatedCount: 0,
          favoriteRecipesCount: 0,
          cookingExperience: editProfile.cookingExperience ?? UserProfileCookingExperience.BEGINNER,
          profileImageKey: '',
        };

        const response = await client.graphql({
          query: createUserProfile,
          variables: { input: createInput }
        });        const createdProfile = response.data?.createUserProfile;
        if (createdProfile) {
          console.log('新規プロフィール作成成功（生データ）:', createdProfile);
          // null値を適切なデフォルト値に変換
          const sanitizedProfile = sanitizeUserProfile(createdProfile);
          console.log('新規プロフィール作成成功（変換後）:', sanitizedProfile);
          setUserProfile(sanitizedProfile);
          setEditProfile(sanitizedProfile);
          setError(null); // 成功時はエラーをクリア
          setSnackbar({
            open: true,
            message: 'プロフィールが作成されました',
            severity: 'success'
          });
        }
      }

      setIsEditing(false);
    } catch (err: unknown) {
      console.error('Profile save error:', err);
      setSnackbar({
        open: true,
        message: 'プロフィールの保存に失敗しました',
        severity: 'error'
      });
    } finally {
      setSaving(false);
    }
  };

  // 編集中のプロフィール情報更新
  const handleProfileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEditProfile({
      ...editProfile,
      [e.target.name]: e.target.value
    });
  };

  // タブ切り替え
  const handleTabChange = (_: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  // スナックバーを閉じる
  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  // 好みの料理スタイルを更新
  const handlePreferenceUpdate = (preferences: string[]) => {
    setEditProfile({ 
      ...editProfile, 
      preferredCuisine: preferences.join(',') // 暫定的に文字列として保存
    });
  };

  // ローディング中の表示
  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ mt: 1, mb: 4 }}>
        <Typography>読み込み中...</Typography>
      </Container>
    );
  }  // エラー時の表示（編集モードの場合は表示しない）
  if (error && !isEditing) {
    return (
      <Container maxWidth="lg" sx={{ mt: 1, mb: 4 }}>
        <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>
        {/* 編集ボタンを一時的に無効化
        <Button
          variant="contained"
          onClick={() => setIsEditing(true)}
          startIcon={<EditIcon />}
        >
          プロフィールを新規作成
        </Button>
        */}
        <Typography>プロフィール情報の読み込みに問題があります。</Typography>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 1, mb: 4 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
        <PersonIcon sx={{ mr: 1, fontSize: 30 }} />
        <Typography variant="h5" component="h1">
          プロフィール
        </Typography>
      </Box>

      <Box sx={{ display: 'flex', gap: 3, flexWrap: 'wrap' }}>
        {/* プロフィール情報セクション */}
        <Box sx={{ flex: '0 0 300px', minWidth: 300 }}>
          <Paper 
            elevation={2}
            sx={{ 
              p: 3, 
              display: 'flex', 
              flexDirection: 'column',
              alignItems: 'center',
              minHeight: 200
            }}
          >
            <Avatar 
              sx={{ 
                width: 100, 
                height: 100, 
                bgcolor: 'primary.main',
                fontSize: '2rem',
                mb: 2 
              }}
            >
              {userProfile?.givenName?.charAt(0) || 'U'}
            </Avatar>
            
            {!isEditing ? (
              <>
                <Typography variant="h6" gutterBottom sx={{ textAlign: 'center' }}>
                  {userProfile?.givenName} {userProfile?.familyName}
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                  {userProfile?.email}
                </Typography>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: 0.5, mb: 2 }}>
                  {userProfile?.preferredCuisine?.split(',').map((pref: string) => (
                    <Chip 
                      key={pref} 
                      label={pref} 
                      size="small" 
                      color="primary" 
                      variant="outlined" 
                    />
                  )) || []}
                </Box>
                <Button
                  startIcon={<EditIcon />}
                  variant="outlined"
                  onClick={handleEditToggle}
                  sx={{ mt: 1 }}
                >
                  編集する
                </Button>
              </>
            ) : (
              <Box sx={{ width: '100%' }}>
                <TextField
                  fullWidth
                  margin="dense"
                  label="名前（姓）"
                  name="familyName"
                  value={editProfile.familyName || ''}
                  onChange={handleProfileChange}
                />
                <TextField
                  fullWidth
                  margin="dense"
                  label="名前（名）"
                  name="givenName"
                  value={editProfile.givenName || ''}
                  onChange={handleProfileChange}
                />
                <TextField
                  fullWidth
                  margin="dense"
                  label="メールアドレス"
                  name="email"
                  type="email"
                  value={editProfile.email || ''}
                  onChange={handleProfileChange}
                />
                
                {/* 好みの料理スタイル選択 */}
                <Box sx={{ mt: 2, mb: 1 }}>
                  <Typography variant="subtitle2" gutterBottom>
                    好みの料理スタイル
                  </Typography>
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                    {['和食', 'イタリアン', '中華', '洋食', 'フレンチ', 'エスニック', '簡単レシピ', 'ヘルシー'].map((style) => (
                      <Chip
                        key={style}
                        label={style}
                        color={(editProfile.preferredCuisine || '').split(',').includes(style) ? 'primary' : 'default'}
                        onClick={() => {
                          const currentPrefs = (editProfile.preferredCuisine || '').split(',').filter(p => p.trim() !== '');
                          const newPrefs = currentPrefs.includes(style)
                            ? currentPrefs.filter((p: string) => p !== style)
                            : [...currentPrefs, style];
                          handlePreferenceUpdate(newPrefs);
                        }}
                        sx={{ mb: 0.5 }}
                      />
                    ))}
                  </Box>
                </Box>
                
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 2 }}>
                  <Button
                    startIcon={<CancelIcon />}
                    onClick={handleEditToggle}
                    color="inherit"
                    disabled={saving}
                  >
                    キャンセル
                  </Button>
                  <Button
                    startIcon={<SaveIcon />}
                    variant="contained"
                    onClick={handleProfileUpdate}
                    disabled={saving}
                  >
                    {saving ? '保存中...' : '保存'}
                  </Button>
                </Box>
              </Box>
            )}
          </Paper>
        </Box>

        {/* レシピ関連セクション */}
        <Box sx={{ flex: '1 1 500px', minWidth: 500 }}>
          <Paper elevation={2} sx={{ p: 0 }}>
            <Tabs
              value={tabValue}
              onChange={handleTabChange}
              variant="fullWidth"
              indicatorColor="primary"
              textColor="primary"
              aria-label="プロフィールタブ"
            >
              <Tab icon={<FavoriteIcon />} iconPosition="start" label="お気に入り" />
              <Tab icon={<HistoryIcon />} iconPosition="start" label="閲覧履歴" />
              <Tab icon={<SettingsIcon />} iconPosition="start" label="設定" />
            </Tabs>

            {/* お気に入りタブ */}
            <TabPanel value={tabValue} index={0}>
              <Box sx={{ px: 2, pb: 2 }}>
                <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 500 }}>
                  お気に入りレシピ
                </Typography>
                
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                  {FAVORITE_RECIPES.map((recipe) => (
                    <Card key={recipe.id} variant="outlined">
                      <CardContent sx={{ pt: 2, pb: 1 }}>
                        <Box sx={{ display: 'flex', alignItems: 'flex-start' }}>
                          <Box 
                            sx={{ 
                              width: 60, 
                              height: 60, 
                              bgcolor: 'grey.100', 
                              borderRadius: 1,
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              mr: 2
                            }}
                          >
                            <RestaurantIcon color="primary" />
                          </Box>
                          <Box sx={{ flex: 1 }}>
                            <Typography variant="subtitle2">{recipe.name}</Typography>
                            <Typography variant="body2" color="text.secondary">
                              {recipe.category}
                            </Typography>
                          </Box>
                          <IconButton size="small" color="primary">
                            <StarIcon fontSize="small" />
                          </IconButton>
                        </Box>
                      </CardContent>
                      <CardActions sx={{ pt: 0, justifyContent: 'flex-end' }}>
                        <Button size="small">詳細</Button>
                        <IconButton size="small" color="error">
                          <DeleteIcon fontSize="small" />
                        </IconButton>
                      </CardActions>
                    </Card>
                  ))}
                  
                  {FAVORITE_RECIPES.length === 0 && (
                    <Box sx={{ textAlign: 'center', py: 4 }}>
                      <Typography variant="body2" color="text.secondary">
                        お気に入りのレシピはまだありません
                      </Typography>
                    </Box>
                  )}
                </Box>
              </Box>
            </TabPanel>

            {/* 閲覧履歴タブ */}
            <TabPanel value={tabValue} index={1}>
              <Box sx={{ px: 2, pb: 2 }}>
                <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 500 }}>
                  最近閲覧したレシピ
                </Typography>
                
                <List>
                  {RECENT_RECIPES.map((recipe) => (
                    <ListItem 
                      key={recipe.id}
                      disablePadding
                      secondaryAction={
                        <IconButton edge="end">
                          <FavoriteIcon fontSize="small" />
                        </IconButton>
                      }
                    >
                      <ListItemButton>
                        <ListItemAvatar>
                          <Avatar sx={{ bgcolor: 'grey.100' }}>
                            <RestaurantIcon color="primary" />
                          </Avatar>
                        </ListItemAvatar>
                        <ListItemText
                          primary={recipe.name}
                          secondary={`${recipe.category} - ${recipe.date}`}
                        />
                      </ListItemButton>
                    </ListItem>
                  ))}
                  
                  {RECENT_RECIPES.length === 0 && (
                    <ListItem>
                      <ListItemText
                        primary="閲覧履歴はありません"
                        primaryTypographyProps={{ 
                          color: 'text.secondary',
                          align: 'center'
                        }}
                      />
                    </ListItem>
                  )}
                </List>
                
                <Box sx={{ textAlign: 'center', mt: 2 }}>
                  <Button size="small" color="inherit">
                    履歴をすべて見る
                  </Button>
                </Box>
              </Box>
            </TabPanel>

            {/* アカウント設定タブ */}
            <TabPanel value={tabValue} index={2}>
              <Box sx={{ px: 2, pb: 2 }}>
                <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 500 }}>
                  アカウント設定
                </Typography>
                
                <List>
                  <ListItem disablePadding>
                    <ListItemButton>
                      <ListItemText 
                        primary="パスワード変更"
                        secondary="アカウントのパスワードを変更します"
                      />
                    </ListItemButton>
                  </ListItem>
                  <ListItem disablePadding>
                    <ListItemButton>
                    <ListItemText 
                        primary="メール通知設定"
                        secondary="メール通知のオン/オフを設定します"
                      />
                    </ListItemButton>
                  </ListItem>
                  <ListItem disablePadding>
                    <ListItemButton>
                      <ListItemText 
                        primary="プライバシー設定"
                        secondary="プロフィール情報の公開範囲を設定します"
                      />
                    </ListItemButton>
                  </ListItem>
                </List>
                
                <Box sx={{ mt: 3 }}>
                  <Divider sx={{ mb: 2 }} />
                  <Button 
                    variant="outlined" 
                    color="error"
                    startIcon={<DeleteIcon />}
                  >
                    アカウントを削除
                  </Button>
                </Box>
              </Box>
            </TabPanel>
          </Paper>
        </Box>
      </Box>
      
      {/* 通知スナックバー */}
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

export default ProfilePage;