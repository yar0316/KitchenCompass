import React from 'react';
import {
  Paper,
  Box,
  Typography,
  Button
} from '@mui/material';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import { APP_VERSION } from '../constants/settingsConstants';

/**
 * ヘルプ＆サポートコンポーネント
 * ヘルプリンク、FAQ、お問い合わせ、アプリバージョン情報を表示
 */
export const HelpSupport: React.FC = () => {
  return (
    <Paper elevation={2} sx={{ p: 0 }}>
      <Box sx={{ p: 2, bgcolor: 'grey.200' }}>
        <Typography variant="h6" sx={{ display: 'flex', alignItems: 'center' }}>
          <HelpOutlineIcon sx={{ mr: 1 }} />
          ヘルプ＆サポート
        </Typography>
      </Box>
      <Box sx={{ p: 2 }}>        <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, gap: 2 }}>
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
            Kitchen Compass バージョン {APP_VERSION}
          </Typography>
        </Box>
      </Box>
    </Paper>
  );
};
