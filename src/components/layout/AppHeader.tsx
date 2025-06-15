import React, { useState, useEffect, useCallback } from 'react';
import { 
  AppBar, 
  Toolbar, 
  Typography, 
  IconButton, 
  Box, 
  Avatar, 
  Menu, 
  MenuItem,
  Tooltip,
  Switch,
  Badge,
  useTheme,
  alpha,
  CircularProgress,
  Chip,
  Divider
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import NotificationsIcon from '@mui/icons-material/Notifications';
import RestaurantIcon from '@mui/icons-material/Restaurant';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';
import FiberNewIcon from '@mui/icons-material/FiberNew';
import { useMediaQuery } from '@mui/material';
import { generateClient } from 'aws-amplify/api';
import { getCurrentUser } from 'aws-amplify/auth';
import { 
  listNotificationsByOwnerAndCreatedAt, 
  updateNotificationMessage 
} from '../../graphql/notificationQueries';

interface NotificationMessage {
  id: string;
  owner: string;
  message: string;
  type: string;
  isRead: boolean;
  relatedItemId?: string | null;
  navigateTo?: string | null;
  expireAt: number;
  createdAt: string;
  updatedAt: string;
}

interface AppHeaderProps {
  onDrawerToggle: () => void;
  isDarkMode: boolean;
  onDarkModeToggle: () => void;
}

const AppHeader: React.FC<AppHeaderProps> = ({ 
  onDrawerToggle, 
  isDarkMode,
  onDarkModeToggle
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  
  // ユーザーメニューの状態
  const [userMenuAnchorEl, setUserMenuAnchorEl] = useState<null | HTMLElement>(null);
  const isUserMenuOpen = Boolean(userMenuAnchorEl);

  // 通知メニューの状態
  const [notificationsAnchorEl, setNotificationsAnchorEl] = useState<null | HTMLElement>(null);
  const isNotificationsMenuOpen = Boolean(notificationsAnchorEl);
  
  // 通知データの状態
  const [notifications, setNotifications] = useState<NotificationMessage[]>([]);
  const [loading, setLoading] = useState(false);
  const [hasUnreadNotifications, setHasUnreadNotifications] = useState(false);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  
  const client = generateClient();

  // コンポーネントマウント時に現在のユーザーを取得
  useEffect(() => {
    const fetchCurrentUser = async () => {
      try {
        const user = await getCurrentUser();
        setCurrentUserId(user.userId);
      } catch (error) {
        console.error('Failed to get current user:', error);
      }
    };
    
    fetchCurrentUser();
  }, []);

  // 通知データを取得する関数
  const fetchNotifications = useCallback(async () => {
    if (!currentUserId) return;

    setLoading(true);
    try {
      // 過去3日以内の通知を取得
      const threeDaysAgo = new Date();
      threeDaysAgo.setDate(threeDaysAgo.getDate() - 3);
      
      const result = await client.graphql({
        query: listNotificationsByOwnerAndCreatedAt,
        variables: {
          owner: currentUserId,
          createdAt: {
            ge: threeDaysAgo.toISOString()
          },
          sortDirection: 'DESC', // 最新順
          limit: 20 // 最大20件
        }
      });
      
      // GraphQLResultの型チェック
      if ('data' in result && result.data) {
        const fetchedNotifications = result.data.notificationsByOwnerAndCreatedAt?.items || [];
        setNotifications(fetchedNotifications as NotificationMessage[]);
        
        // 未読通知があるかチェック（件数ではなくbooleanフラグ）
        const hasUnread = fetchedNotifications.some((notif: unknown) => {
          const notification = notif as NotificationMessage;
          return !notification.isRead;
        });
        setHasUnreadNotifications(hasUnread);
      }
      
    } catch (error) {
      console.error('Failed to fetch notifications:', error);
    } finally {
      setLoading(false);
    }
  }, [currentUserId, client]);

  // 通知を既読にマークする関数
  const markNotificationsAsRead = async (notificationIds: string[]) => {
    try {
      const updatePromises = notificationIds.map(notificationId =>
        client.graphql({
          query: updateNotificationMessage,
          variables: {
            input: {
              id: notificationId,
              isRead: true
            }
          }
        })
      );
      
      await Promise.all(updatePromises);
      
      // ローカル状態を更新
      setNotifications(prev => 
        prev.map(notif => 
          notificationIds.includes(notif.id) 
            ? { ...notif, isRead: true }
            : notif
        )
      );
      
      // 未読フラグを更新
      setHasUnreadNotifications(false);
      
    } catch (error) {
      console.error('Failed to mark notifications as read:', error);
    }
  };

  // currentUserIdが設定された時に通知を取得
  useEffect(() => {
    if (currentUserId) {
      fetchNotifications();
    }
  }, [currentUserId, fetchNotifications]);

  // ユーザーメニューハンドラー
  const handleUserMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setUserMenuAnchorEl(event.currentTarget);
  };

  const handleUserMenuClose = () => {
    setUserMenuAnchorEl(null);
  };

  // 通知メニューハンドラー
  const handleNotificationsOpen = async (event: React.MouseEvent<HTMLElement>) => {
    setNotificationsAnchorEl(event.currentTarget);
    
    // 表示されている未読通知をすべて既読にマーク
    const unreadNotifications = notifications.filter(notif => !notif.isRead);
    if (unreadNotifications.length > 0) {
      const unreadIds = unreadNotifications.map(notif => notif.id);
      await markNotificationsAsRead(unreadIds);
    }
  };

  const handleNotificationsClose = () => {
    setNotificationsAnchorEl(null);
  };

  // 通知アイテムクリック時の処理（画面遷移）
  const handleNotificationClick = (notification: NotificationMessage) => {
    if (notification.navigateTo) {
      // React Routerでの画面遷移ロジックをここに実装
      // 例: navigate(notification.navigateTo);
      console.log('Navigate to:', notification.navigateTo);
    }
    handleNotificationsClose();
  };

  return (
    <AppBar 
      position="fixed" 
      sx={{ 
        zIndex: (theme) => theme.zIndex.drawer + 1,
        bgcolor: (theme) => alpha(theme.palette.primary.main, 0.95),
        backdropFilter: 'blur(8px)'
      }}
      elevation={1}
    >
      <Toolbar>
        {/* ハンバーガーメニュー（モバイル時のみ表示） */}
        <IconButton
          color="inherit"
          aria-label="メニューを開く"
          onClick={onDrawerToggle}
          edge="start"
          sx={{ 
            mr: 2,
            display: { sm: 'none' }
          }}
        >
          <MenuIcon />
        </IconButton>
        
        {/* ロゴ */}
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <RestaurantIcon sx={{ mr: 1 }} />
          <Typography
            variant="h6"
            noWrap
            component="div"
            sx={{
              mr: 2,
              fontWeight: 600,
              display: { xs: isMobile ? 'none' : 'block', sm: 'block' },
              letterSpacing: '0.02em'
            }}
          >
            Kitchen Compass
          </Typography>
        </Box>
        
        <Box sx={{ flexGrow: 1 }} />
        
        {/* 右側のアクション */}
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          {/* ダークモードスイッチ */}
          <Box sx={{ 
            display: 'flex', 
            alignItems: 'center',
            mr: 1,
            px: 1,
            borderRadius: 1,
            bgcolor: 'rgba(255,255,255,0.1)',
          }}>
            {isDarkMode ? <Brightness4Icon fontSize="small" /> : <Brightness7Icon fontSize="small" />}
            <Switch
              size="small"
              checked={isDarkMode}
              onChange={onDarkModeToggle}
              name="darkModeSwitch"
              color="default"
            />
          </Box>
          
          {/* 通知アイコン */}
          <Tooltip title="通知">
            <IconButton
              onClick={handleNotificationsOpen}
              color="inherit"
              size="large"
            >
              <Badge 
                variant={hasUnreadNotifications ? "dot" : "standard"} 
                color="error"
                invisible={!hasUnreadNotifications}
              >
                <NotificationsIcon />
              </Badge>
            </IconButton>
          </Tooltip>
          
          {/* 通知メニュー */}
          <Menu
            anchorEl={notificationsAnchorEl}
            open={isNotificationsMenuOpen}
            onClose={handleNotificationsClose}
            PaperProps={{
              sx: { width: 320, maxHeight: 480 }
            }}
            transformOrigin={{ horizontal: 'right', vertical: 'top' }}
            anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
          >
            {loading ? (
              <MenuItem>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, justifyContent: 'center', width: '100%' }}>
                  <CircularProgress size={16} />
                  <Typography variant="body2">読み込み中...</Typography>
                </Box>
              </MenuItem>
            ) : notifications.length === 0 ? (
              <MenuItem>
                <Typography variant="body2" color="textSecondary" sx={{ textAlign: 'center', width: '100%' }}>
                  新しい通知はありません
                </Typography>
              </MenuItem>
            ) : (
              notifications.map((notification) => (
                <MenuItem 
                  key={notification.id}
                  onClick={() => handleNotificationClick(notification)}
                  sx={{ 
                    whiteSpace: 'normal',
                    py: 1.5,
                    borderLeft: !notification.isRead ? `3px solid ${theme.palette.primary.main}` : 'none'
                  }}
                >
                  <Box sx={{ width: '100%' }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
                      <Typography variant="body2" sx={{ fontWeight: notification.isRead ? 'normal' : 'medium' }}>
                        {notification.message}
                      </Typography>
                      {!notification.isRead && (
                        <FiberNewIcon color="primary" fontSize="small" />
                      )}
                    </Box>
                    <Typography variant="caption" color="textSecondary">
                      {new Date(notification.createdAt).toLocaleString('ja-JP')}
                    </Typography>
                    {notification.type && (
                      <Chip 
                        label={notification.type} 
                        size="small" 
                        variant="outlined" 
                        sx={{ mt: 0.5, fontSize: '0.75rem' }}
                      />
                    )}
                  </Box>
                </MenuItem>
              ))
            )}
            {notifications.length > 0 && (
              <>
                <Divider />
                <MenuItem onClick={handleNotificationsClose}>
                  <Typography variant="body2" color="primary" sx={{ textAlign: 'center', width: '100%' }}>
                    すべての通知を確認
                  </Typography>
                </MenuItem>
              </>
            )}
          </Menu>
          
          {/* プロフィールアバター */}
          <Tooltip title="設定">
            <IconButton
              onClick={handleUserMenuOpen}
              size="small"
              sx={{ ml: 1 }}
              aria-controls={isUserMenuOpen ? 'account-menu' : undefined}
              aria-haspopup="true"
              aria-expanded={isUserMenuOpen ? 'true' : undefined}
            >
              <Avatar sx={{ width: 32, height: 32, bgcolor: theme.palette.secondary.main }}>U</Avatar>
            </IconButton>
          </Tooltip>
          
          {/* ユーザーメニュー */}
          <Menu
            id="account-menu"
            anchorEl={userMenuAnchorEl}
            open={isUserMenuOpen}
            onClose={handleUserMenuClose}
            MenuListProps={{
              'aria-labelledby': 'user-button',
            }}
            transformOrigin={{ horizontal: 'right', vertical: 'top' }}
            anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
          >
            <MenuItem onClick={handleUserMenuClose}>プロフィール</MenuItem>
            <MenuItem onClick={handleUserMenuClose}>アカウント設定</MenuItem>
            <MenuItem onClick={handleUserMenuClose}>ログアウト</MenuItem>
          </Menu>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default AppHeader;