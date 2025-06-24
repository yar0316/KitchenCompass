import { defineFunction } from '@aws-amplify/backend';

export const shoppingListNotification = defineFunction({
  name: 'shopping-list-notification',
  entry: './handler.ts',
  environment: {
    NODE_OPTIONS: '--enable-source-maps'
  }
});