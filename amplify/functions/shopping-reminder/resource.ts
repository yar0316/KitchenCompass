import { defineFunction } from '@aws-amplify/backend';

export const shoppingReminder = defineFunction({
  name: 'shopping-reminder',
  entry: './handler.ts',
  // environment: {},
  // memoryMB: 128,
  // timeoutSeconds: 10,
  // schedule: 'cron(0 7 * * ? *)', // UTCで毎日午前7時 (JST午後4時)
  // JST午前7時に実行したい場合は、UTCで前日の22時を指定
  schedule: 'cron(0 22 * * ? *)', // UTCで毎日午後10時 (JST午前7時)
});
