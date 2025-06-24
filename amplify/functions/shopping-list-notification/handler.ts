import { Amplify } from 'aws-amplify';
import { generateClient } from 'aws-amplify/data';
import { getAmplifyDataClientConfig } from '@aws-amplify/backend/function/runtime';
import { env } from '$amplify/env/shopping-list-notification';
import type { Schema } from '../../data/resource';

// Amplify設定とクライアント初期化
const configPromise = getAmplifyDataClientConfig(env).then(({ resourceConfig, libraryOptions }) => {
  Amplify.configure(resourceConfig, libraryOptions);
  return generateClient<Schema>();
});

interface ShoppingList {
  id: string;
  name: string;
  dueDate: string;
  owner: string;
  isCompleted: boolean;
}

interface NotificationMessage {
  id: string;
  message: string;
  type: string;
  isRead: boolean;
  relatedItemId: string;
  navigateTo: string;
  expireAt: string;
  owner: string;
  createdAt: string;
  updatedAt: string;
}

export const handler = async (event: any) => {
  console.log('Shopping list notification handler started', JSON.stringify(event));
  
  try {
    // Amplifyクライアントを取得
    const client = await configPromise;
    // 今日の日付を取得（JST）
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const todayISO = today.toISOString().split('T')[0];
    
    console.log('Processing notifications for date:', todayISO);
    
    // 今日予定の買い物リストを取得
    const { data: shoppingLists } = await client.models.ShoppingList.list({
      filter: {
        and: [
          { dueDate: { beginsWith: todayISO } },
          { isCompleted: { eq: false } }
        ]
      }
    });
    
    console.log(`Found ${shoppingLists?.length || 0} shopping lists for today`);
    
    if (!shoppingLists || shoppingLists.length === 0) {
      console.log('No shopping lists scheduled for today');
      return { statusCode: 200, body: 'No shopping lists for today' };
    }
    
    const userShoppingLists = new Map<string, typeof shoppingLists>();
    
    // ユーザーごとに買い物リストをグループ化
    shoppingLists.forEach(list => {
      const owner = list.owner || '';
      if (!userShoppingLists.has(owner)) {
        userShoppingLists.set(owner, []);
      }
      userShoppingLists.get(owner)!.push(list);
    });
    
    // 各ユーザーに通知を作成
    for (const [owner, lists] of userShoppingLists) {
      const listNames = lists.map(list => list.name).join('、');
      const message = lists.length === 1 
        ? `今日は「${listNames}」の買い物予定があります！`
        : `今日は ${lists.length} 件の買い物予定があります：${listNames}`;
      
      const expireAt = new Date();
      expireAt.setDate(expireAt.getDate() + 7); // 7日後に期限切れ
      
      await client.models.NotificationMessage.create({
        message,
        type: 'shopping-list',
        isRead: false,
        relatedItemId: lists[0].id,
        navigateTo: '/shopping',
        expireAt: expireAt.toISOString(),
        owner
      });
      
      console.log(`Notification created for user ${owner}: ${message}`);
    }
    
    return {
      statusCode: 200,
      body: JSON.stringify({
        message: `Notifications sent to ${userShoppingLists.size} users`,
        totalLists: shoppingLists.length
      })
    };
    
  } catch (error) {
    console.error('Error in shopping list notification handler:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Internal server error' })
    };
  }
};