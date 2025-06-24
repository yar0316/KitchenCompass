import React, { useState } from 'react';
import {
  Box,
  Badge,
  IconButton,
  Popover,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Typography,
  Divider,
  Button
} from '@mui/material';
import NotificationsIcon from '@mui/icons-material/Notifications';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import RestaurantMenuIcon from '@mui/icons-material/RestaurantMenu';
import { useNavigate } from 'react-router-dom';

interface MockNotification {
  id: string;
  message: string;
  type: string;
  isRead: boolean;
  navigateTo?: string;
  createdAt: string;
}

const NotificationCenterMock: React.FC = () => {
  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);
  const navigate = useNavigate();

  // モックデータ
  const [notifications, setNotifications] = useState<MockNotification[]>([
    {
      id: '1',
      message: '今日は「週末の買い物」の買い物予定があります！',
      type: 'shopping-list',
      isRead: false,
      navigateTo: '/shopping',
      createdAt: new Date().toISOString()
    },
    {
      id: '2', 
      message: '今日は 2 件の買い物予定があります：日用品、食材',
      type: 'shopping-list',
      isRead: false,
      navigateTo: '/shopping',
      createdAt: new Date(Date.now() - 60 * 60 * 1000).toISOString() // 1時間前
    },
    {
      id: '3',
      message: '今日の献立が設定されています',
      type: 'menu',
      isRead: true,
      navigateTo: '/menu',
      createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString() // 2時間前
    }
  ]);

  const unreadCount = notifications.filter(n => !n.isRead).length;
  const open = Boolean(anchorEl);

  const markAsRead = (notification: MockNotification) => {
    if (notification.isRead) return;

    setNotifications(prev => 
      prev.map(n => 
        n.id === notification.id ? { ...n, isRead: true } : n
      )
    );
  };

  const handleNotificationClick = (notification: MockNotification) => {
    markAsRead(notification);
    
    if (notification.navigateTo) {
      navigate(notification.navigateTo);
    }
    
    setAnchorEl(null);
  };

  const handleOpen = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'shopping-list':
        return <ShoppingCartIcon color="primary" />;
      case 'menu':
        return <RestaurantMenuIcon color="secondary" />;
      default:
        return <NotificationsIcon />;
    }
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) {
      return 'たった今';
    } else if (diffInHours < 24) {
      return `${diffInHours}時間前`;
    } else {
      const diffInDays = Math.floor(diffInHours / 24);
      return `${diffInDays}日前`;
    }
  };

  return (
    <>
      <IconButton
        color="inherit"
        onClick={handleOpen}
        aria-label="通知"
      >
        <Badge badgeContent={unreadCount} color="error">
          <NotificationsIcon />
        </Badge>
      </IconButton>

      <Popover
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
      >
        <Box sx={{ width: 350, maxHeight: 400 }}>
          <Box sx={{ p: 2, borderBottom: 1, borderColor: 'divider' }}>
            <Typography variant="h6">通知</Typography>
          </Box>

          <List sx={{ maxHeight: 300, overflow: 'auto' }}>
            {notifications.length === 0 ? (
              <ListItem>
                <ListItemText
                  primary="通知はありません"
                  secondary="新しい通知があると、ここに表示されます。"
                />
              </ListItem>
            ) : (
              notifications.map((notification, index) => (
                <React.Fragment key={notification.id}>
                  <ListItem
                    component="div"
                    onClick={() => handleNotificationClick(notification)}
                    sx={{
                      backgroundColor: notification.isRead ? 'transparent' : 'action.hover',
                      '&:hover': {
                        backgroundColor: 'action.selected'
                      },
                      cursor: 'pointer'
                    }}
                  >
                    <ListItemIcon>
                      {getNotificationIcon(notification.type)}
                    </ListItemIcon>
                    <ListItemText
                      primary={notification.message}
                      secondary={formatTime(notification.createdAt)}
                      primaryTypographyProps={{
                        fontWeight: notification.isRead ? 'normal' : 'bold'
                      }}
                    />
                  </ListItem>
                  {index < notifications.length - 1 && <Divider />}
                </React.Fragment>
              ))
            )}
          </List>

          {notifications.length > 0 && (
            <Box sx={{ p: 1, borderTop: 1, borderColor: 'divider' }}>
              <Button
                fullWidth
                size="small"
                onClick={() => {
                  // 全ての通知を既読にする
                  notifications.forEach(notification => {
                    if (!notification.isRead) {
                      markAsRead(notification);
                    }
                  });
                }}
                disabled={unreadCount === 0}
              >
                すべて既読にする
              </Button>
            </Box>
          )}
        </Box>
      </Popover>
    </>
  );
};

export default NotificationCenterMock;