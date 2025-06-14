import { defineFunction } from '@aws-amplify/backend';

export const notificationScheduler = defineFunction({
  name: 'notification-scheduler',
  entry: './handler.ts',
});