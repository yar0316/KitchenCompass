import React, { useState } from 'react';
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
  alpha
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import NotificationsIcon from '@mui/icons-material/Notifications';
import RestaurantIcon from '@mui/icons-material/Restaurant';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';
import { useMediaQuery } from '@mui/material';

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
  
  // ダミーの通知数（実際のアプリでは状態管理やAPIから取得）
  const notificationCount = 3;

  // ユーザーメニューハンドラー
  const handleUserMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setUserMenuAnchorEl(event.currentTarget);
  };

  const handleUserMenuClose = () => {
    setUserMenuAnchorEl(null);
  };

  // 通知メニューハンドラー
  const handleNotificationsOpen = (event: React.MouseEvent<HTMLElement>) => {
    setNotificationsAnchorEl(event.currentTarget);
  };

  const handleNotificationsClose = () => {
    setNotificationsAnchorEl(null);
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
              <Badge badgeContent={notificationCount} color="error">
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
            <MenuItem onClick={handleNotificationsClose}>
              <Typography variant="subtitle2">今週の人気レシピが更新されました</Typography>
            </MenuItem>
            <MenuItem onClick={handleNotificationsClose}>
              <Typography variant="subtitle2">買い物リスト「週末の買い物」の期限が近づいています</Typography>
            </MenuItem>
            <MenuItem onClick={handleNotificationsClose}>
              <Typography variant="subtitle2">レシピ「夏野菜カレー」が保存されました</Typography>
            </MenuItem>
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