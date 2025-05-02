import { defineBackend } from '@aws-amplify/backend';
import { auth } from './auth/resource';
import { data } from './data/resource';
import { storage } from './storage/resource';

/**
 * KitchenCompassアプリケーション用バックエンド定義
 * - auth: 認証機能（Cognito）
 * - data: データモデル（DynamoDB）
 * - storage: ストレージ機能（S3）
 * @see https://docs.amplify.aws/react/build-a-backend/
 */
const backend = defineBackend({
  auth,
  data,
  storage,
});

// パスワードポリシーのカスタマイズ
const { cfnUserPool } = backend.auth.resources.cfnResources;

// 安全性とユーザビリティのバランスの取れたパスワードポリシーを設定
cfnUserPool.policies = {
  passwordPolicy: {
    minimumLength: 8, // 最小8文字
    requireLowercase: true, // 小文字必須
    requireUppercase: true, // 大文字必須
    requireNumbers: true, // 数字必須
    requireSymbols: true, // 記号必須
    temporaryPasswordValidityDays: 7, // 一時パスワード有効期間: 7日間
  },
};
