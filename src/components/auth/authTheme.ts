import { createTheme } from '@aws-amplify/ui-react';

/**
 * Amplify UIのカスタムテーマ設定
 * アプリケーションのデザインシステムに合わせて認証画面をカスタマイズ
 */
export const amplifyTheme = createTheme({
  name: 'kitchen-compass-theme',
  tokens: {
    colors: {
      brand: {
        primary: {
          '10': '#f0f9ff',
          '20': '#e0f2fe',
          '40': '#0ea5e9',
          '60': '#0284c7',
          '80': '#0369a1',
          '90': '#0c4a6e',
          '100': '#082f49',
        },
      },
    },    components: {
      authenticator: {
        router: {
          boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
        },
        form: {
          padding: '2rem',
        },
      },
      button: {
        primary: {
          backgroundColor: '{colors.brand.primary.80}',
          _hover: {
            backgroundColor: '{colors.brand.primary.90}',
          },
        },
      },
      fieldcontrol: {
        // borderRadius: '4px', // この設定は別の方法で適用
      },
    },
  },
});

/**
 * 認証画面のテキスト設定（日本語化）
 */
export const authTexts = {
  ja: {
    'Sign In': 'ログイン',
    'Sign Up': 'サインアップ',
    'Enter your Email': 'メールアドレスを入力',
    'Enter your Password': 'パスワードを入力',
    'Forgot your password?': 'パスワードをお忘れですか？',
    'Reset Password': 'パスワードリセット',
    'Back to Sign In': 'ログインに戻る',
  },
};
