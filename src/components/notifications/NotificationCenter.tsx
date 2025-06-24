import React, { useState, useEffect } from 'react';
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
  Button,
  Alert,
  CircularProgress
} from '@mui/material';
import NotificationsIcon from '@mui/icons-material/Notifications';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import RestaurantMenuIcon from '@mui/icons-material/RestaurantMenu';
import { generateClient } from 'aws-amplify/api';
import { getCurrentUser } from 'aws-amplify/auth';
import { Schema } from '../../../amplify/data/resource';
import { listNotificationsByOwnerAndCreatedAt, updateNotificationMessage } from '../../graphql/notificationQueries';
import { useNavigate } from 'react-router-dom';
import { NotificationMessage } from '../../types/notifications';

const client = generateClient<Schema>();

const NotificationCenter: React.FC = () => {
  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);
  const [notifications, setNotifications] = useState<NotificationMessage[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const unreadCount = notifications.filter(n => !n.isRead).length;
  const open = Boolean(anchorEl);

  const fetchNotifications = async () => {
    setLoading(true);
    try {
      const user = await getCurrentUser();
      const result = await client.graphql({
        query: listNotificationsByOwnerAndCreatedAt,
        variables: {
          owner: user.userId,
          sortDirection: 'DESC',
          limit: 20
        }
      });
      
      if (result && 'data' in result) {
        setNotifications(result.data.notificationsByOwnerAndCreatedAt?.items || []);
      }
      setError(null);
    } catch (err) {
      console.error('通知の取得中にエラーが発生しました:', err);
      setError('通知の読み込みに失敗しました。');
    } finally {
      setLoading(false);
    }
  };

  const markAsRead = async (notification: NotificationMessage) => {
    if (notification.isRead) return;

    try {
      await client.graphql({
        query: updateNotificationMessage,
        variables: {
          input: {
            id: notification.id,
            isRead: true
          }
        }
      });

      setNotifications(prev => 
        prev.map(n => 
          n.id === notification.id ? { ...n, isRead: true } : n
        )
      );
    } catch (err) {
      console.error('通知の既読処理中にエラーが発生しました:', err);
    }
  };

  const handleNotificationClick = async (notification: NotificationMessage) => {
    await markAsRead(notification);
    
    if (notification.navigateTo) {
      navigate(notification.navigateTo);
    }
    
    setAnchorEl(null);
  };

  const handleOpen = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
    if (notifications.length === 0) {
      fetchNotifications();
    }
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

  // 定期的に通知を更新
  useEffect(() => {
    fetchNotifications();
    const interval = setInterval(fetchNotifications, 5 * 60 * 1000); // 5分ごと
    return () => clearInterval(interval);
  }, []);

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

          {loading && (
            <Box sx={{ display: 'flex', justifyContent: 'center', p: 2 }}>
              <CircularProgress size={24} />
            </Box>
          )}

          {error && (
            <Alert severity="error" sx={{ m: 1 }}>
              {error}
            </Alert>
          )}

          <List sx={{ maxHeight: 300, overflow: 'auto' }}>
            {notifications.length === 0 && !loading ? (
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

export default NotificationCenter;