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
  Divider,
  FormControl,
  Select,
  MenuItem
} from '@mui/material';
import DisplaySettingsIcon from '@mui/icons-material/DisplaySettings';
import VisibilityIcon from '@mui/icons-material/Visibility';
import LanguageIcon from '@mui/icons-material/Language';
import { Settings } from '../utils/settingsUtils';
import { FONT_SIZE_OPTIONS, LANGUAGE_OPTIONS } from '../constants/settingsConstants';

interface DisplaySettingsProps {
  settings: Settings;
  onSwitchChange: (setting: keyof Settings) => (event: React.ChangeEvent<HTMLInputElement>) => void;
  onSelectChange: (setting: keyof Settings) => (event: { target: { value: string } }) => void;
}

/**
 * 表示設定コンポーネント
 * ダークモード、フォントサイズ、言語設定を管理
 */
export const DisplaySettings: React.FC<DisplaySettingsProps> = ({
  settings,
  onSwitchChange,
  onSelectChange
}) => {
  return (
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
              onChange={onSwitchChange('darkMode')}
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
                onChange={onSelectChange('fontSize')}
              >                {FONT_SIZE_OPTIONS.map((option: { value: string; label: string }) => (
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
                onChange={onSelectChange('language')}
              >                {LANGUAGE_OPTIONS.map((option: { value: string; label: string }) => (
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
  );
};
