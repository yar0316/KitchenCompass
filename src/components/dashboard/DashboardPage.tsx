import React from 'react';
import { Container, Typography, Box, Paper } from '@mui/material';
import DashboardIcon from '@mui/icons-material/Dashboard';

/**
 * ダッシュボードページ
 * アプリケーションのホーム画面として機能します
 */
const DashboardPage: React.FC = () => {
  return (
    <Container maxWidth="lg" sx={{ mt: 1, mb: 4 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
        <DashboardIcon sx={{ mr: 1, fontSize: 30 }} />
        <Typography variant="h5" component="h1">
          ダッシュボード
        </Typography>
      </Box>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
        <Box sx={{ width: '100%' }}>
          <Paper 
            elevation={2}
            sx={{ 
              p: 3, 
              display: 'flex', 
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              minHeight: 200
            }}
          >
            <Typography variant="h6" gutterBottom>
              Kitchen Compassへようこそ！
            </Typography>
            <Typography variant="body1" align="center" color="text.secondary">
              このアプリケーションは開発中です。左側のナビゲーションから<br />
              「レシピ」や「買い物リスト」にアクセスすることができます。
            </Typography>          </Paper>
        </Box>
      </Box>
    </Container>
  );
};

export default DashboardPage;