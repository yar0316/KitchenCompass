import React from 'react';
import { Authenticator, ThemeProvider } from '@aws-amplify/ui-react';
import { amplifyTheme } from './authTheme';
import '@aws-amplify/ui-react/styles.css';

interface AuthWrapperProps {
  children: React.ReactNode;
}

/**
 * 認証ラッパーコンポーネント
 * Amplify UIの標準認証画面を使用
 * サインアップ画面を非表示にし、ログインのみ許可
 */
const AuthWrapper: React.FC<AuthWrapperProps> = ({ children }) => {
  return (
    <ThemeProvider theme={amplifyTheme}>
      <Authenticator
        // サインアップタブを非表示にする
        hideSignUp={true}
        // ログイン画面のカスタマイズ
        components={{
          Header() {
            return (
              <div style={{ textAlign: 'center', padding: '20px' }}>
                <h1>KitchenCompass</h1>
                <p>ログインしてご利用ください</p>
              </div>
            );
          },
        }}
        // フォームフィールドのカスタマイズ
        formFields={{
          signIn: {
            username: {
              placeholder: 'メールアドレスを入力',
              label: 'メールアドレス',
            },
            password: {
              placeholder: 'パスワードを入力',
              label: 'パスワード',
            },
          },
        }}
      >
        {children}
      </Authenticator>
    </ThemeProvider>
  );
};

export default AuthWrapper;
