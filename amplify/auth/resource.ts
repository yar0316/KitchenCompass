import { defineAuth } from '@aws-amplify/backend';

/**
 * KitchenCompass アプリケーション用認証設定
 * ユーザー管理に必要な機能を設定
 * @see https://docs.amplify.aws/gen2/build-a-backend/auth
 */
export const auth = defineAuth({
  loginWith: {
    email: true, // メールによるログイン
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
