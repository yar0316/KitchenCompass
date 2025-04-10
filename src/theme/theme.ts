// filepath: c:\Users\yutar\workspace\KitchenCompass\src\theme\theme.ts
import { createTheme, responsiveFontSizes } from '@mui/material/styles';

// 要件定義に基づいたカラースキーム
// - プライマリーカラー：緑系
// - アクセントカラー：オレンジ系

/**
 * KitchenCompassアプリケーション用テーマ設定
 * Light Mode（明るいテーマ）とDark Mode（暗いテーマ）の両方を定義
 */
// Light Modeのテーマ定義
export const lightTheme = responsiveFontSizes(
  createTheme({
    palette: {
      mode: 'light',
      primary: {
        main: '#4CAF50', // 緑系カラー
        light: '#81C784',
        dark: '#388E3C',
        contrastText: '#FFFFFF',
      },
      secondary: {
        main: '#FF9800', // オレンジ系カラー
        light: '#FFB74D',
        dark: '#F57C00',
        contrastText: '#000000',
      },
      background: {
        default: '#F5F5F5',
        paper: '#FFFFFF',
      },
      text: {
        primary: '#212121',
        secondary: '#757575',
      },
    },
    typography: {
      fontFamily: [
        '"Noto Sans JP"',
        '"Roboto"',
        '"Helvetica"',
        '"Arial"',
        'sans-serif',
      ].join(','),
      h1: {
        fontWeight: 500,
      },
      h2: {
        fontWeight: 500,
      },
      h3: {
        fontWeight: 500,
      },
      h4: {
        fontWeight: 500,
      },
      h5: {
        fontWeight: 500,
      },
      h6: {
        fontWeight: 500,
      },
    },
    components: {
      MuiButton: {
        styleOverrides: {
          root: {
            borderRadius: 8,
            textTransform: 'none',
          },
        },
      },
      MuiCard: {
        styleOverrides: {
          root: {
            borderRadius: 12,
            boxShadow: '0 4px 8px rgba(0,0,0,0.08)',
          },
        },
      },
    },
  }),
);

// Dark Modeのテーマ定義
export const darkTheme = responsiveFontSizes(
  createTheme({
    palette: {
      mode: 'dark',
      primary: {
        main: '#81C784', // 明るめの緑
        light: '#A5D6A7',
        dark: '#4CAF50',
        contrastText: '#000000',
      },
      secondary: {
        main: '#FFB74D', // 明るめのオレンジ
        light: '#FFCC80',
        dark: '#FF9800',
        contrastText: '#000000',
      },
      background: {
        default: '#121212',
        paper: '#1E1E1E',
      },
      text: {
        primary: '#FFFFFF',
        secondary: '#B0B0B0',
      },
    },
    typography: {
      fontFamily: [
        '"Noto Sans JP"',
        '"Roboto"',
        '"Helvetica"',
        '"Arial"',
        'sans-serif',
      ].join(','),
    },
    components: {
      MuiButton: {
        styleOverrides: {
          root: {
            borderRadius: 8,
            textTransform: 'none',
          },
        },
      },
      MuiCard: {
        styleOverrides: {
          root: {
            borderRadius: 12,
            boxShadow: '0 4px 8px rgba(0,0,0,0.15)',
          },
        },
      },
    },
  }),
);