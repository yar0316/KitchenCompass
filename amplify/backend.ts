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
defineBackend({
  auth,
  data,
  storage,
});
