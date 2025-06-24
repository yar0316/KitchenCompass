import { defineFunction } from '@aws-amplify/backend';

export const menuNotification = defineFunction({
  name: 'menu-notification',
  entry: './handler.ts',
  timeoutSeconds: 300, // 5分
  environment: {
    NODE_OPTIONS: '--enable-source-maps'
  }
});