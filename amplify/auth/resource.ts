import { defineAuth } from '@aws-amplify/backend';

/**
 * KitchenCompass アプリケーション用認証設定
 * ユーザー管理に必要な機能を設定
 * @see https://docs.amplify.aws/gen2/build-a-backend/auth
 */
export const auth = defineAuth({
  loginWith: {
    email: true, // メールによるログイン
    username: true, // ユーザー名によるログインも許可
  },
  // ユーザー属性の設定
  userAttributes: {
    givenName: {
      required: true,
      mutable: true,
    },
    familyName: {
      required: true,
      mutable: true,
    },
  },
  // 多要素認証を無効化（ユーザー利便性のため）
  multifactor: {
    mode: 'OFF',
  },
  // パスワードポリシー
  passwordPolicy: {
    minLength: 8,
    requireLowercase: true,
    requireUppercase: true,
    requireNumbers: true,
    requireSymbols: false,
  },
});
