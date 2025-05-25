import { MealData, DayData, MenuItemData } from '../types/Menu.types';
import { dateUtils } from './dateUtils';

/**
 * メニューデータ変換に関するユーティリティ関数
 */

/**
 * APIレスポンスからDayData配列へ変換
 */
export const convertMenusToDays = (menusArr: unknown[], weekStart: Date): DayData[] => {
  const days: DayData[] = [];
  const mealTypes: MealData['type'][] = ['breakfast', 'lunch', 'dinner'];
  
  for (let i = 0; i < 7; i++) {
    const date = new Date(weekStart);
    date.setDate(weekStart.getDate() + i);
    const dateYMD = dateUtils.toYMDString(date);
    
    // 対応するMenuを検索
    const menu = menusArr.find((m: unknown) => {
      // APIから取得した日付をYYYY-MM-DD形式に正規化して比較
      const menuItem = m as { date?: string };
      if (!menuItem.date) return false;
      const menuDateYMD = dateUtils.toYMDString(new Date(menuItem.date));
      return menuDateYMD === dateYMD;
    });
    
    // menuItemsデータを取得（APIレスポンスの構造に対応）
    const menuObject = menu as { menuItems?: { items?: unknown[] } } | undefined;
    const menuItems = menuObject?.menuItems?.items ?? [];
    
    const meals: MealData[] = mealTypes.map(type => {
      const item = menuItems.find((mi: unknown) => {
        const menuItem = mi as { mealType?: string };
        return menuItem.mealType === type;
      });
      
      const menuItem = item as {
        id?: string;
        name?: string;
        recipeId?: string;
        isOutside?: boolean;
        outsideLocation?: string;
        notes?: string;
      } | undefined;
        return menuItem ? {
        id: menuItem.id || `empty-${date.toISOString()}-${type}`,
        type: type,
        mealType: type,
        name: menuItem.name || '',
        recipeId: menuItem.recipeId || null,
        menuItems: [], // 空配列で初期化
        isOuting: menuItem.isOutside || false,
        isOutside: menuItem.isOutside || false,
        restaurantName: menuItem.outsideLocation || '',
        outsideLocation: menuItem.outsideLocation || ''
      } : {
        id: `empty-${date.toISOString()}-${type}`,
        type: type,
        mealType: type,
        name: '',
        recipeId: null,
        menuItems: [], // 空配列で初期化
        isOuting: false,
        isOutside: false,
        restaurantName: '',
        outsideLocation: ''
      };
    });
    
    days.push({ 
      id: `day-${dateYMD}`,
      date, 
      meals 
    });
  }
  
  return days;
};

/**
 * MealDataからMenuItemDataへの変換
 */
export const convertMealToMenuItem = (meal: MealData): MenuItemData => {
  return {
    id: meal.id,
    name: meal.name,
    recipeId: meal.recipeId || undefined
  };
};

/**
 * 前の週のデータを生成
 */
export const generatePreviousWeekDays = (currentWeekFirstDay: Date): DayData[] => {
  const previousFirstDay = new Date(currentWeekFirstDay);
  previousFirstDay.setDate(currentWeekFirstDay.getDate() - 7);
  const previousWeekStart = dateUtils.getStartOfWeek(previousFirstDay);
    // 前の週のデータを生成
  return Array(7).fill(null).map((_, index) => {
    const date = new Date(previousWeekStart);
    date.setDate(previousWeekStart.getDate() + index);
    const dateYMD = dateUtils.toYMDString(date);
    return {
      id: `prev-day-${dateYMD}`,
      date,
      meals: [
        { 
          id: `prev-b${index+1}-${Date.now()}`, 
          type: 'breakfast' as const, 
          mealType: 'breakfast' as const,
          name: '',
          menuItems: [],
          isOuting: false, 
          recipeId: null
        },
        { 
          id: `prev-l${index+1}-${Date.now()}`, 
          type: 'lunch' as const, 
          mealType: 'lunch' as const,
          name: '',
          menuItems: [],
          isOuting: false, 
          recipeId: null
        },
        { 
          id: `prev-d${index+1}-${Date.now()}`, 
          type: 'dinner' as const, 
          mealType: 'dinner' as const,
          name: '',
          menuItems: [],
          isOuting: false, 
          recipeId: null
        }
      ]
    };
  });
};

/**
 * 次の週のデータを生成
 */
export const generateNextWeekDays = (currentWeekLastDay: Date): DayData[] => {
  const nextFirstDay = new Date(currentWeekLastDay);
  nextFirstDay.setDate(currentWeekLastDay.getDate() + 1);
  const nextWeekStart = dateUtils.getStartOfWeek(nextFirstDay);
    // 新しい次の週のデータを生成
  return Array(7).fill(null).map((_, index) => {
    const date = new Date(nextWeekStart);
    date.setDate(nextWeekStart.getDate() + index);
    const dateYMD = dateUtils.toYMDString(date);
    return {
      id: `next-day-${dateYMD}`,
      date,
      meals: [
        { 
          id: `new-b${index+1}-${Date.now()}`, 
          type: 'breakfast' as const, 
          mealType: 'breakfast' as const,
          name: '',
          menuItems: [],
          isOuting: false, 
          recipeId: null
        },
        { 
          id: `new-l${index+1}-${Date.now()}`, 
          type: 'lunch' as const, 
          mealType: 'lunch' as const,
          name: '',
          menuItems: [],
          isOuting: false, 
          recipeId: null
        },
        { 
          id: `new-d${index+1}-${Date.now()}`, 
          type: 'dinner' as const, 
          mealType: 'dinner' as const,
          name: '',
          menuItems: [],
          isOuting: false, 
          recipeId: null
        }
      ]
    };
  });
};

export const menuUtils = {
  convertMenusToDays,
  convertMealToMenuItem,
  generatePreviousWeekDays,
  generateNextWeekDays
};