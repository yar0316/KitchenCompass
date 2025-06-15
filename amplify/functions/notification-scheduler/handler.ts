import type { Handler } from 'aws-lambda';

export const handler: Handler = async (event) => {
  console.log('Notification scheduler triggered:', event);
  
  // TODO: 通知ロジックを実装
  return {
    statusCode: 200,
    body: JSON.stringify({ message: 'Notification scheduler executed successfully' }),
  };
};