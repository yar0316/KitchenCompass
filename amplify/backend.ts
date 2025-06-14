import { defineBackend } from '@aws-amplify/backend';
import { auth } from './auth/resource';
import { data } from './data/resource';
import { storage } from './storage/resource';
import { notificationScheduler } from './functions/notification-scheduler/resource';
import { shoppingReminder } from './functions/shopping-reminder/resource';

/**
 * KitchenCompassアプリケーション用バックエンド定義
 * - auth: 認証機能（Cognito）
 * - data: データモデル（DynamoDB）
 * - storage: ストレージ機能（S3）
 * - notificationScheduler: 通知スケジューラ（Lambda）
 * - shoppingReminder: 買い物リマインダー通知（Lambda） // 新しい関数を追加
 * @see https://docs.amplify.aws/react/build-a-backend/
 */
const backend = defineBackend({
  auth,
  data,
  storage,
  notificationScheduler,
  shoppingReminder, // 新しい関数を登録
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

// Lambda関数にDynamoDBテーブルアクセス権限を付与
backend.data.resources.tables['UserProfile'].grantReadWriteData(backend.notificationScheduler.resources.lambda);
backend.data.resources.tables['Menu'].grantReadData(backend.notificationScheduler.resources.lambda);
backend.data.resources.tables['MenuItem'].grantReadData(backend.notificationScheduler.resources.lambda);
backend.data.resources.tables['ShoppingList'].grantReadData(backend.notificationScheduler.resources.lambda);
// NotificationMessageテーブルへの書き込み権限を notificationScheduler にも付与
backend.data.resources.tables['NotificationMessage'].grantReadWriteData(backend.notificationScheduler.resources.lambda);


// shoppingReminderにも同様の権限を付与
backend.data.resources.tables['UserProfile'].grantReadData(backend.shoppingReminder.resources.lambda);
backend.data.resources.tables['ShoppingList'].grantReadData(backend.shoppingReminder.resources.lambda);
// shoppingReminder に NotificationMessage テーブルへの書き込み権限を付与
backend.data.resources.tables['NotificationMessage'].grantReadWriteData(backend.shoppingReminder.resources.lambda);

//TODO: NotificationMessageにTTLを設定する

export default backend;
