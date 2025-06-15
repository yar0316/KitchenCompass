import { defineBackend } from '@aws-amplify/backend';
import { auth } from './auth/resource';
import { data } from './data/resource';
import { storage } from './storage/resource';
import { notificationScheduler } from './functions/notification-scheduler/resource';
import { shoppingReminder } from './functions/shopping-reminder/resource';
import * as sns from 'aws-cdk-lib/aws-sns'; // CDK for SNS
import * as iam from 'aws-cdk-lib/aws-iam'; // CDK for IAM
import { Stack } from 'aws-cdk-lib'; // CDK Stack

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

// --- SNS Topic for Shopping Reminders ---
// Create a new SNS topic
// Amplifyが管理するリソースと同じスタック内にSNSトピックを作成します。
// backend.data や backend.auth など、Amplifyが生成する主要なリソースからスタックを取得できます。
const stack = Stack.of(backend.data);

const shoppingRemindersSnsTopic = new sns.Topic(stack, 'ShoppingRemindersSnsTopic', {
  displayName: 'Shopping Reminders Topic for KitchenCompass',
  // リージョンとアカウントIDをトピック名に含めることで、グローバルな一意性を高めます。
  // 物理名を指定する場合は、デプロイメント間で変更されないように注意が必要です。
  // topicName: `kitchencompass-shopping-reminders-${stack.region}-${stack.account}`,
  // Amplifyが物理名を自動生成するように、明示的なtopicNameはコメントアウトまたは削除します。
  // displayNameで識別し、topicArnを環境変数経由でLambdaに渡すのが一般的です。
});

// shoppingReminder LambdaにSNSトピックへの発行権限を付与
backend.shoppingReminder.resources.lambda.addToRolePolicy(
  new iam.PolicyStatement({
    actions: ['sns:Publish'],
    resources: [shoppingRemindersSnsTopic.topicArn],
  })
);

// shoppingReminder Lambdaに関数環境変数としてSNSトピックARNを設定
backend.shoppingReminder.resources.lambda.addEnvironment('SNS_TOPIC_ARN', shoppingRemindersSnsTopic.topicArn);

// --- End SNS Topic for Shopping Reminders ---

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

//TODO: NotificationMessageにTTLを設定する (これは amplify/data/resource.ts で対応済みのはず)

// Amplify Outputs にSNSトピックARNを追加 (フロントエンドや他のリソースで参照する場合に便利)
backend.addOutput({
  custom: {
    ShoppingRemindersSnsTopicArn: shoppingRemindersSnsTopic.topicArn,
  }
});

export default backend;
