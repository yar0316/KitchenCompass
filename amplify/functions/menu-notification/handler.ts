import { Amplify } from 'aws-amplify';
import { generateClient } from 'aws-amplify/data';
import { getAmplifyDataClientConfig } from '@aws-amplify/backend/function/runtime';
import { env } from '$amplify/env/menu-notification';
import type { Schema } from '../../data/resource';
import type { Handler } from "aws-lambda";

// Amplify設定とクライアント初期化
const configPromise = getAmplifyDataClientConfig(env).then(({ resourceConfig, libraryOptions }) => {
  Amplify.configure(resourceConfig, libraryOptions);
  return generateClient<Schema>();
});

interface MenuItem {
  id: string;
  menuId: string;
  mealType: 'breakfast' | 'lunch' | 'dinner';
  name?: string;
  notes?: string;
  owner: string;
}

interface Menu {
  id: string;
  date: string;
  owner: string;
}

interface EventInput {
  notificationType: string;
  triggerTime: string;
  mealType: 'breakfast' | 'lunch' | 'dinner';
}

export const handler: Handler = async (event: EventInput) => {
  console.log('Menu notification function started', { event });

  try {
    // Amplifyクライアントを取得
    const client = await configPromise;
    const { mealType, triggerTime } = event;
    
    // 今日の日付を取得（JST基準）
    const today = new Date();
    const jstOffset = 9 * 60 * 60 * 1000; // 9時間のオフセット
    const jstDate = new Date(today.getTime() + jstOffset);
    const todayString = jstDate.toISOString().split('T')[0]; // YYYY-MM-DD形式
    
    console.log('Processing menu notifications for date:', todayString, 'mealType:', mealType);

    // 今日の献立データを取得
    const menuItems = await getTodayMenuItems(client, todayString, mealType);
    console.log('Found menu items:', menuItems.length);

    // ユーザーごとにグループ化
    const userMenus = groupMenuItemsByUser(menuItems);
    console.log('Users with menus:', Object.keys(userMenus).length);

    // 各ユーザーに通知を送信
    for (const [userId, items] of Object.entries(userMenus)) {
      await createMenuNotification(client, userId, items, mealType, triggerTime);
    }

    console.log('Menu notification function completed successfully');
    return {
      statusCode: 200,
      body: JSON.stringify({
        message: 'Menu notifications sent successfully',
        processedUsers: Object.keys(userMenus).length,
        mealType,
        date: todayString
      })
    };

  } catch (error) {
    console.error('Error in menu notification function:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({
        message: 'Error processing menu notifications',
        error: error instanceof Error ? error.message : 'Unknown error'
      })
    };
  }
};

async function getTodayMenuItems(client: any, date: string, mealType: string): Promise<MenuItem[]> {
  try {
    // 今日のMenuを取得
    const { data: menus } = await client.models.Menu.list({
      filter: {
        date: { beginsWith: date }
      }
    });
    
    if (!menus || menus.length === 0) {
      console.log('No menus found for date:', date);
      return [];
    }

    // 各MenuのMenuItemsを取得
    const allMenuItems: MenuItem[] = [];
    
    for (const menu of menus) {
      const { data: menuItems } = await client.models.MenuItem.list({
        filter: {
          and: [
            { menuId: { eq: menu.id } },
            { mealType: { eq: mealType } }
          ]
        }
      });
      
      if (menuItems) {
        // Menuのownerを各MenuItemに設定
        const itemsWithOwner = menuItems.map(item => ({
          ...item,
          owner: menu.owner || item.owner
        }));
        
        allMenuItems.push(...itemsWithOwner);
      }
    }

    return allMenuItems;
  } catch (error) {
    console.error('Error fetching today menu items:', error);
    return [];
  }
}

function groupMenuItemsByUser(menuItems: MenuItem[]): Record<string, MenuItem[]> {
  return menuItems.reduce((groups, item) => {
    const userId = item.owner;
    if (!groups[userId]) {
      groups[userId] = [];
    }
    groups[userId].push(item);
    return groups;
  }, {} as Record<string, MenuItem[]>);
}

async function createMenuNotification(
  client: any,
  userId: string,
  menuItems: MenuItem[],
  mealType: string,
  triggerTime: string
): Promise<void> {
  try {
    // 食事名を日本語に変換
    const mealTypeJapanese = {
      breakfast: '朝食',
      lunch: '昼食',
      dinner: '夕食'
    }[mealType] || mealType;

    let message: string;
    const navigateTo: string = '/menu';

    if (menuItems.length === 0) {
      // 献立が設定されていない場合の通知
      message = `${mealTypeJapanese}の献立が設定されていません。献立を設定しませんか？`;
    } else if (menuItems.length === 1) {
      // 1つの献立がある場合
      const item = menuItems[0];
      const recipeName = item.name || '献立';
      const notes = item.notes ? ` (${item.notes})` : '';
      message = `${mealTypeJapanese}の時間です！今日は「${recipeName}」${notes}の予定です。`;
    } else {
      // 複数の献立がある場合
      const recipeNames = menuItems
        .map(item => item.name || '献立')
        .slice(0, 2)
        .join('、');
      const moreCount = menuItems.length > 2 ? `他${menuItems.length - 2}品` : '';
      message = `${mealTypeJapanese}の時間です！今日は「${recipeNames}」${moreCount}の予定です。`;
    }

    // 通知の有効期限を設定（6時間後）
    const expireAt = new Date();
    expireAt.setHours(expireAt.getHours() + 6);

    await client.models.NotificationMessage.create({
      message,
      type: 'menu',
      isRead: false,
      relatedItemId: menuItems[0]?.menuId || undefined,
      navigateTo,
      expireAt: expireAt.toISOString(),
      owner: userId
    });

    console.log(`Menu notification created for user ${userId}:`, message);
  } catch (error) {
    console.error('Error creating menu notification:', error);
    throw error;
  }
}