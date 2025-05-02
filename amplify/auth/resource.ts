import { defineAuth, secret } from '@aws-amplify/backend';

/**
 * KitchenCompass アプリケーション用認証設定
 * ユーザー管理に必要な機能を設定
 * @see https://docs.amplify.aws/gen2/build-a-backend/auth
 */
export const auth = defineAuth({
  loginWith: {
    email: true, // メールによるログイン
    // username: true, // 最新のAmplify SDKではサポートされていないためコメントアウト
    
    // 外部認証プロバイダーの設定
    externalProviders: {
      // Google認証の追加
      google: {
        clientId: secret('GOOGLE_CLIENT_ID'),      // Google Developer ConsoleでのOAuthクライアントID
        clientSecret: secret('GOOGLE_CLIENT_SECRET'), // Google Developer Consoleで取得したクライアントシークレット
      },
      // リダイレクトURLの設定
      callbackUrls: [
        'http://localhost:5173/', // ローカル開発用
        // 'https://YOUR_DOMAIN.com/' // 本番環境用 TODO: 適切なドメインに変更してください
      ],
      logoutUrls: [
        'http://localhost:5173/',  // ローカル開発用
        // 'https://YOUR_DOMAIN.com/' // 本番環境用TODO (適切なドメインに変更してください)
      ],
    }
  },
  // ユーザー属性の設定 - 単一のユーザー名(nickname)のみ
  userAttributes: {
    nickname: {
      required: true,
      mutable: true,
    }
  },
  // 多要素認証を無効化（ユーザー利便性のため）
  multifactor: {
    mode: 'OFF',
  },
  // アカウント回復方法の設定
  accountRecovery: 'EMAIL_ONLY',
});
