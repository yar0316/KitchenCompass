import React, { useState, ReactNode } from 'react';
import { Box, Toolbar, Container, useMediaQuery, useTheme } from '@mui/material';
import AppHeader from './AppHeader';
import SideNav from './SideNav';

interface LayoutProps {
  children: ReactNode;
  isDarkMode: boolean;
  onDarkModeToggle: () => void;
  currentPath: string;
}

const Layout: React.FC<LayoutProps> = ({ 
  children, 
  isDarkMode, 
  onDarkModeToggle,
  currentPath
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  
  // モバイル用ドロワーの開閉状態
  const [drawerOpen, setDrawerOpen] = useState(false);
  
  const handleDrawerToggle = () => {
    setDrawerOpen(!drawerOpen);
  };
  
  return (
    <Box sx={{ display: 'flex', minHeight: '100vh' }}>
      {/* トップバー */}
      <AppHeader 
        onDrawerToggle={handleDrawerToggle}
        isDarkMode={isDarkMode}
        onDarkModeToggle={onDarkModeToggle}
      />
      
      {/* サイドナビゲーション */}
      <SideNav 
        open={drawerOpen} 
        onClose={() => setDrawerOpen(false)}
        currentPath={currentPath}
      />
      
      {/* メインコンテンツ */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          width: { sm: `calc(100% - 240px)` },
          mt: { xs: 2, sm: 2 }
        }}
      >
        <Toolbar />
        <Container 
          maxWidth={isMobile ? false : "xl"} 
          disableGutters={isMobile}
          sx={{ 
            py: 2,
          }}
        >
          {children}
        </Container>
      </Box>
    </Box>
  );
};

export default Layout;