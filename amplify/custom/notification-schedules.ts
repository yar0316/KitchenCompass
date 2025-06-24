import { Stack } from 'aws-cdk-lib';
import { Rule, Schedule, RuleTargetInput } from 'aws-cdk-lib/aws-events';
import { LambdaFunction } from 'aws-cdk-lib/aws-events-targets';
import { IFunction } from 'aws-cdk-lib/aws-lambda';

/**
 * 買い物リスト通知スケジュールを設定するカスタムリソース
 */
export function addShoppingListNotificationSchedule(
  stack: Stack,
  shoppingListNotificationFunction: IFunction
) {
  console.log('Setting up shopping list notification schedule...');

  // 買い物リスト通知 (7:00 JST = 22:00 UTC前日)
  const shoppingListRule = new Rule(stack, 'ShoppingListNotificationRule', {
    description: 'Daily shopping list notification at 7:00 AM JST',
    schedule: Schedule.cron({
      minute: '0',
      hour: '22', // UTC時間 (JST 7:00 - 9:00 = 22:00 UTC前日)
      day: '*',
      month: '*',
      year: '*'
    })
  });

  shoppingListRule.addTarget(
    new LambdaFunction(shoppingListNotificationFunction, {
      event: RuleTargetInput.fromObject({
        notificationType: 'shopping-list',
        triggerTime: '07:00'
      })
    })
  );

  console.log('Shopping list notification schedule configured successfully');
  
  return {
    shoppingListRule
  };
}

/**
 * 献立通知スケジュールを設定するカスタムリソース
 */
export function addMenuNotificationSchedule(
  stack: Stack,
  menuNotificationFunction: IFunction
) {
  console.log('Setting up menu notification schedules...');

  // 朝食通知 (7:00 JST = 22:00 UTC前日)
  const breakfastRule = new Rule(stack, 'BreakfastNotificationRule', {
    description: 'Daily breakfast notification at 7:00 AM JST',
    schedule: Schedule.cron({
      minute: '0',
      hour: '22', // UTC時間 (JST 7:00 - 9:00 = 22:00 UTC前日)
      day: '*',
      month: '*',
      year: '*'
    })
  });

  breakfastRule.addTarget(
    new LambdaFunction(menuNotificationFunction, {
      event: RuleTargetInput.fromObject({
        notificationType: 'menu',
        triggerTime: '07:00',
        mealType: 'breakfast'
      })
    })
  );

  // 昼食通知 (11:00 JST = 02:00 UTC)
  const lunchRule = new Rule(stack, 'LunchNotificationRule', {
    description: 'Daily lunch notification at 11:00 AM JST',
    schedule: Schedule.cron({
      minute: '0',
      hour: '2', // UTC時間 (JST 11:00 - 9:00 = 2:00 UTC)
      day: '*',
      month: '*',
      year: '*'
    })
  });

  lunchRule.addTarget(
    new LambdaFunction(menuNotificationFunction, {
      event: RuleTargetInput.fromObject({
        notificationType: 'menu',
        triggerTime: '11:00',
        mealType: 'lunch'
      })
    })
  );

  // 夕食通知 (17:00 JST = 08:00 UTC)
  const dinnerRule = new Rule(stack, 'DinnerNotificationRule', {
    description: 'Daily dinner notification at 5:00 PM JST',
    schedule: Schedule.cron({
      minute: '0',
      hour: '8', // UTC時間 (JST 17:00 - 9:00 = 8:00 UTC)
      day: '*',
      month: '*',
      year: '*'
    })
  });

  dinnerRule.addTarget(
    new LambdaFunction(menuNotificationFunction, {
      event: RuleTargetInput.fromObject({
        notificationType: 'menu',
        triggerTime: '17:00',
        mealType: 'dinner'
      })
    })
  );

  console.log('Menu notification schedules configured successfully');
  
  return {
    breakfastRule,
    lunchRule,
    dinnerRule
  };
}