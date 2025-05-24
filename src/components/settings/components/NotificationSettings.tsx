import React from 'react';
import {
  Paper,
  Box,
  Typography,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Switch,
  Divider
} from '@mui/material';
import NotificationsIcon from '@mui/icons-material/Notifications';
import DataUsageIcon from '@mui/icons-material/DataUsage';
import { Settings } from '../utils/settingsUtils';

interface NotificationSettingsProps {
  settings: Settings;
  onSwitchChange: (setting: keyof Settings) => (event: React.ChangeEvent<HTMLInputElement>) => void;
}

/**
 * 通知設定コンポーネント
 * 通知、メール、プッシュ通知、自動更新設定を管理
 */
export const NotificationSettings: React.FC<NotificationSettingsProps> = ({
  settings,
  onSwitchChange
}) => {
  return (
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
              onChange={onSwitchChange('notifications')}
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
              onChange={onSwitchChange('emailNotifications')}
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
              onChange={onSwitchChange('pushNotifications')}
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
              onChange={onSwitchChange('autoUpdate')}
            />
          </ListItem>
        </List>
      </Box>
    </Paper>
  );
};
