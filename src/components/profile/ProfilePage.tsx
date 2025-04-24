import React, { useState } from 'react';
import {
  Container,
  Typography,
  Box,
  Paper,
  Grid,
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
  // ユーザープロフィール状態
  const [userProfile, setUserProfile] = useState({
    name: '山田 太郎',
    email: 'yamada@example.com',
    bio: '料理初心者です。簡単なレシピを探しています。', // TODO: 将来的にユーザー公開機能を実装時に有効化
    preferences: ['和食', 'イタリアン', '簡単レシピ']
  });

  // 編集モード状態
  const [isEditing, setIsEditing] = useState(false);
  const [editProfile, setEditProfile] = useState({ ...userProfile });
  
  // タブ状態
  const [tabValue, setTabValue] = useState(0);
  
  // スナックバー状態
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success' as 'success' | 'error'
  });

  // 編集モード切り替え
  const handleEditToggle = () => {
    if (isEditing) {
      setEditProfile({ ...userProfile }); // キャンセル時は元のデータに戻す
    }
    setIsEditing(!isEditing);
  };

  // プロフィール更新
  const handleProfileUpdate = () => {
    setUserProfile({ ...editProfile });
    setIsEditing(false);
    setSnackbar({
      open: true,
      message: 'プロフィールが更新されました',
      severity: 'success'
    });
  };

  // 編集中のプロフィール情報更新
  const handleProfileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEditProfile({
      ...editProfile,
      [e.target.name]: e.target.value
    });
  };

  // タブ切り替え
  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  // スナックバーを閉じる
  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  // 好みの料理スタイルを更新
  const handlePreferenceUpdate = (preferences: string[]) => {
    setEditProfile({ ...editProfile, preferences });
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 1, mb: 4 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
        <PersonIcon sx={{ mr: 1, fontSize: 30 }} />
        <Typography variant="h5" component="h1">
          プロフィール
        </Typography>
      </Box>

      <Grid container spacing={3}>
        {/* プロフィール情報セクション */}
        <Grid item xs={12} md={4}>
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
              {userProfile.name.charAt(0)}
            </Avatar>
            
            {!isEditing ? (
              <>
                <Typography variant="h6" gutterBottom sx={{ textAlign: 'center' }}>
                  {userProfile.name}
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                  {userProfile.email}
                </Typography>
                {/* TODO: 将来的にユーザー公開機能を実装時に有効化
                <Typography variant="body2" sx={{ textAlign: 'center', mb: 2 }}>
                  {userProfile.bio}
                </Typography>
                */}
                <Box sx={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: 0.5, mb: 2 }}>
                  {userProfile.preferences.map((pref) => (
                    <Chip 
                      key={pref} 
                      label={pref} 
                      size="small" 
                      color="primary" 
                      variant="outlined" 
                    />
                  ))}
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
                  label="名前"
                  name="name"
                  value={editProfile.name}
                  onChange={handleProfileChange}
                />
                <TextField
                  fullWidth
                  margin="dense"
                  label="メールアドレス"
                  name="email"
                  type="email"
                  value={editProfile.email}
                  onChange={handleProfileChange}
                />
                {/* TODO: 将来的にユーザー公開機能を実装時に有効化
                <TextField
                  fullWidth
                  margin="dense"
                  label="自己紹介"
                  name="bio"
                  multiline
                  rows={3}
                  value={editProfile.bio}
                  onChange={handleProfileChange}
                />
                */}
                
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
                        color={editProfile.preferences.includes(style) ? 'primary' : 'default'}
                        onClick={() => {
                          const newPrefs = editProfile.preferences.includes(style)
                            ? editProfile.preferences.filter(p => p !== style)
                            : [...editProfile.preferences, style];
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
                  >
                    キャンセル
                  </Button>
                  <Button
                    startIcon={<SaveIcon />}
                    variant="contained"
                    onClick={handleProfileUpdate}
                  >
                    保存
                  </Button>
                </Box>
              </Box>
            )}
          </Paper>
        </Grid>

        {/* レシピ関連セクション */}
        <Grid item xs={12} md={8}>
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
                
                <Grid container spacing={2}>
                  {FAVORITE_RECIPES.map((recipe) => (
                    <Grid item xs={12} sm={6} key={recipe.id}>
                      <Card variant="outlined">
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
                    </Grid>
                  ))}
                  
                  {FAVORITE_RECIPES.length === 0 && (
                    <Grid item xs={12}>
                      <Box sx={{ textAlign: 'center', py: 4 }}>
                        <Typography variant="body2" color="text.secondary">
                          お気に入りのレシピはまだありません
                        </Typography>
                      </Box>
                    </Grid>
                  )}
                </Grid>
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
        </Grid>
      </Grid>
      
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