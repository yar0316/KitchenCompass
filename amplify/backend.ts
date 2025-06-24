import { defineBackend } from '@aws-amplify/backend';
import { auth } from './auth/resource';
import { data } from './data/resource';
import { storage } from './storage/resource';
import { shoppingListNotification } from './functions/shopping-list-notification/resource';
import { menuNotification } from './functions/menu-notification/resource';
import { addShoppingListNotificationSchedule, addMenuNotificationSchedule } from './custom/notification-schedules';

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
  shoppingListNotification,
  menuNotification,
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

// Lambda関数にData APIアクセス権限を付与
backend.data.addDataAccessGrantsToFunction(backend.shoppingListNotification, ['ShoppingList', 'NotificationMessage']);
backend.data.addDataAccessGrantsToFunction(backend.menuNotification, ['Menu', 'MenuItem', 'NotificationMessage']);

// 買い物リスト通知スケジュールを設定
addShoppingListNotificationSchedule(
  backend.createStack('ShoppingListNotificationScheduleStack'),
  backend.shoppingListNotification.resources.lambda
);

// 献立通知スケジュールを設定
addMenuNotificationSchedule(
  backend.createStack('MenuNotificationScheduleStack'),
  backend.menuNotification.resources.lambda
);
