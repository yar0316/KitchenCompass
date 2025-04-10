import { useState, useMemo } from 'react';
import { CssBaseline, ThemeProvider, useMediaQuery } from '@mui/material';
import { Authenticator } from '@aws-amplify/ui-react';
import '@aws-amplify/ui-react/styles.css';
import { lightTheme, darkTheme } from './theme/theme';
import './App.css';

// テーマの切り替え機能を持つKitchenCompassアプリ
function App() {
  // システムの設定に基づいてダークモードかライトモードかを判定
  const prefersDarkMode = useMediaQuery('(prefers-color-scheme: dark)');
  
  // ユーザーが手動で設定したテーマモード（ローカルストレージから取得）
  const [mode, setMode] = useState<'light' | 'dark' | 'system'>(() => {
    const savedMode = localStorage.getItem('themeMode');
    return (savedMode as 'light' | 'dark' | 'system') || 'system';
  });

  // 実際に適用されるテーマを計算
  const theme = useMemo(() => {
    const isSystemDark = mode === 'system' && prefersDarkMode;
    const isDark = mode === 'dark' || isSystemDark;
    
    return isDark ? darkTheme : lightTheme;
  }, [mode, prefersDarkMode]);

  // テーマモードの切り替え処理
  const toggleTheme = () => {
    const newMode = mode === 'light' ? 'dark' : 'light';
    setMode(newMode);
    localStorage.setItem('themeMode', newMode);
  };

  // システム設定への切り替え処理
  const useSystemTheme = () => {
    setMode('system');
    localStorage.setItem('themeMode', 'system');
  };

  return (
    <ThemeProvider theme={theme}>
      {/* Reset CSS */}
      <CssBaseline />
      
      {/* Amplify認証コンポーネント */}
      <Authenticator>
        {({ signOut, user }) => (
          <div className="kitchen-compass-app">
            <header>
              <h1>KitchenCompass</h1>
              <p>ようこそ、{user?.username} さん</p>
              <button onClick={toggleTheme}>
                {theme === lightTheme ? 'ダークモード' : 'ライトモード'}に切り替え
              </button>
              <button onClick={useSystemTheme}>
                システム設定を使用
              </button>
              <button onClick={signOut}>サインアウト</button>
            </header>
            <main>
              <p>
                KitchenCompassアプリケーションへようこそ。このアプリは日々の食事の計画と準備をサポートする料理管理システムです。
              </p>
              <p>
                現在、アプリケーションは開発中です。
              </p>
            </main>
          </div>
        )}
      </Authenticator>
    </ThemeProvider>
  );
}

export default App;
