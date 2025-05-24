import React from 'react';
import {
  Paper,
  Box,
  Typography,
  List,
  ListItem,
  ListItemText,
  Slider
} from '@mui/material';
import RestaurantIcon from '@mui/icons-material/Restaurant';
import { Settings } from '../utils/settingsUtils';
import { PORTION_SIZE_MARKS } from '../constants/settingsConstants';

interface RecipeSettingsProps {
  settings: Settings;
  onSliderChange: (setting: keyof Settings) => (event: Event, newValue: number | number[]) => void;
  onSliderChangeCommitted: (setting: keyof Settings, displayName: string) => (event: Event | React.SyntheticEvent, newValue: number | number[]) => void;
}

/**
 * レシピ設定コンポーネント
 * デフォルト人数設定などレシピ関連の設定を管理
 */
export const RecipeSettings: React.FC<RecipeSettingsProps> = ({
  settings,
  onSliderChange,
  onSliderChangeCommitted
}) => {
  return (
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
                marks={PORTION_SIZE_MARKS}
                onChange={onSliderChange('recipePortionSize')}
                onChangeCommitted={onSliderChangeCommitted('recipePortionSize', 'デフォルト人数')}
              />
            </Box>
          </ListItem>
          
          {/* TODO: 将来的にレシピ公開機能を実装時に有効化 */}
          {/* <Divider component="li" />
          
          <ListItem>
            <ListItemIcon>
              <SecurityIcon />
            </ListItemIcon>
            <ListItemText
              primary="レシピを公開する"
              secondary="あなたのレシピを他のユーザーと共有します"
            />
            <Switch
              edge="end"
              checked={settings.privacy.shareRecipes}
              onChange={handleNestedSwitchChange('privacy', 'shareRecipes')}
            />
          </ListItem> */}
          
        </List>
      </Box>
    </Paper>
  );
};
