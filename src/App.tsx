import { useState } from 'react';
import { ThemeProvider, CssBaseline } from '@mui/material';
import { BrowserRouter, useLocation } from 'react-router-dom';
import { lightTheme, darkTheme } from './theme/theme';
import Layout from './components/layout/Layout';
import AppRoutes from './routes/AppRoutes';
import AuthWrapper from './components/auth/AuthWrapper';
// Amplify設定を読み込む
import './amplify/config';

// 現在のパスを取得するためのラッパーコンポーネント
const AppContent = () => {
  // ダークモード設定
  const [useDarkMode, setUseDarkMode] = useState(false);
  const theme = useDarkMode ? darkTheme : lightTheme;
  
  // 現在のパスをReact Routerから取得
  const location = useLocation();
  const currentPath = location.pathname;
  
  // ダークモード切り替え
  const handleDarkModeToggle = () => {
    setUseDarkMode(!useDarkMode);
  };
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AuthWrapper>
        <Layout
          isDarkMode={useDarkMode}
          onDarkModeToggle={handleDarkModeToggle}
          currentPath={currentPath}
        >
          <AppRoutes />
        </Layout>
      </AuthWrapper>
    </ThemeProvider>
  );
};

// メインのAppコンポーネント - BrowserRouterを提供
function App() {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  );
}

export default App;
