import { Stack } from 'aws-cdk-lib';
import { Rule, Schedule, RuleTargetInput } from 'aws-cdk-lib/aws-events';
import { LambdaFunction } from 'aws-cdk-lib/aws-events-targets';
import { Function } from 'aws-cdk-lib/aws-lambda';
import { PolicyStatement } from 'aws-cdk-lib/aws-iam';

/**
 * 通知スケジュールを設定するカスタムリソース
 */
export function addNotificationSchedules(
  stack: Stack,
  notificationFunction: Function
) {
  console.log('Setting up notification schedules...');

  // SESとDynamoDBへのアクセス権限を追加
  notificationFunction.addToRolePolicy(
    new PolicyStatement({
      actions: [
        'ses:SendEmail',
        'ses:SendRawEmail',
        'dynamodb:Query',
        'dynamodb:Scan',
        'dynamodb:GetItem'
      ],
      resources: ['*'] // 本番環境では適切なリソースARNに制限する
    })
  );

  // 1. 朝の献立通知 (7:00 JST = 22:00 UTC前日)
  const morningMenuRule = new Rule(stack, 'MorningMenuNotificationRule', {
    description: 'Daily menu notification at 7:00 AM JST',
    schedule: Schedule.cron({
      minute: '0',
      hour: '22', // UTC時間 (JST 7:00 - 9:00 = 22:00 UTC前日)
      day: '*',
      month: '*',
      year: '*'
    })
  });

  morningMenuRule.addTarget(
    new LambdaFunction(notificationFunction, {
      event: RuleTargetInput.fromObject({
        notificationType: 'daily-menu',
        time: '07:00'
      })
    })
  );

  // 2. 昼の献立通知 (11:00 JST = 02:00 UTC)
  const lunchMenuRule = new Rule(stack, 'LunchMenuNotificationRule', {
    description: 'Daily menu notification at 11:00 AM JST',
    schedule: Schedule.cron({
      minute: '0',
      hour: '2', // UTC時間 (JST 11:00 - 9:00 = 02:00 UTC)
      day: '*',
      month: '*',
      year: '*'
    })
  });

  lunchMenuRule.addTarget(
    new LambdaFunction(notificationFunction, {
      event: RuleTargetInput.fromObject({
        notificationType: 'daily-menu',
        time: '11:00'
      })
    })
  );

  // 3. 夕方の献立通知 (17:00 JST = 08:00 UTC)
  const eveningMenuRule = new Rule(stack, 'EveningMenuNotificationRule', {
    description: 'Daily menu notification at 5:00 PM JST',
    schedule: Schedule.cron({
      minute: '0',
      hour: '8', // UTC時間 (JST 17:00 - 9:00 = 08:00 UTC)
      day: '*',
      month: '*',
      year: '*'
    })
  });

  eveningMenuRule.addTarget(
    new LambdaFunction(notificationFunction, {
      event: RuleTargetInput.fromObject({
        notificationType: 'daily-menu',
        time: '17:00'
      })
    })
  );

  // 4. 買い物リスト通知 (8:00 JST = 23:00 UTC前日)
  const shoppingListRule = new Rule(stack, 'ShoppingListNotificationRule', {
    description: 'Daily shopping list notification at 8:00 AM JST',
    schedule: Schedule.cron({
      minute: '0',
      hour: '23', // UTC時間 (JST 8:00 - 9:00 = 23:00 UTC前日)
      day: '*',
      month: '*',
      year: '*'
    })
  });

  shoppingListRule.addTarget(
    new LambdaFunction(notificationFunction, {
      event: RuleTargetInput.fromObject({
        notificationType: 'shopping-list'
      })
    })
  );

  console.log('Notification schedules configured successfully');
  
  return {
    morningMenuRule,
    lunchMenuRule,
    eveningMenuRule,
    shoppingListRule
  };
}