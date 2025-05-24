import { MealData, DayData, MenuItemData } from '../types/Menu.types';
import { dateUtils } from './dateUtils';

/**
 * メニューデータ変換に関するユーティリティ関数
 */

/**
 * APIレスポンスからDayData配列へ変換
 */
export const convertMenusToDays = (menusArr: any[], weekStart: Date): DayData[] => {
  const days: DayData[] = [];
  const mealTypes: MealData['type'][] = ['breakfast', 'lunch', 'dinner'];
  
  for (let i = 0; i < 7; i++) {
    const date = new Date(weekStart);
    date.setDate(weekStart.getDate() + i);
    const dateYMD = dateUtils.toYMDString(date);
    
    // 対応するMenuを検索
    const menu = menusArr.find((m: any) => {
      // APIから取得した日付をYYYY-MM-DD形式に正規化して比較
      const menuDateYMD = dateUtils.toYMDString(new Date(m.date));
      return menuDateYMD === dateYMD;
    });
    
    // menuItemsデータを取得（APIレスポンスの構造に対応）
    const menuItems = menu && menu.menuItems && menu.menuItems.items ? menu.menuItems.items : [];
    
    const meals: MealData[] = mealTypes.map(type => {
      const item = menuItems.find((mi: any) => mi.mealType === type);
        return item ? {
        id: item.id,
        type: type,
        name: item.name || '',
        recipeId: item.recipeId || null,
        isOuting: item.isOutside || false,
        restaurantName: item.outsideLocation || '',
        notes: item.notes || '',
        menuItems: [],
        mealType: type,
      } : {
        id: `empty-${date.toISOString()}-${type}`,
        type: type,
        name: '',        recipeId: null,
        isOuting: false,
        restaurantName: '',
        notes: '',
        menuItems: [],
        mealType: type
      };
    });
    
    days.push({ 
      id: `day-${dateUtils.toYMDString(date)}`,
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
    recipeId: meal.recipeId || undefined,
    description: meal.notes || '',
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
    return {
      id: `prev-day-${dateUtils.toYMDString(date)}`,
      date,
      meals: [
        { 
          id: `prev-b${index+1}-${Date.now()}`, 
          type: 'breakfast' as const, 
          isOuting: false, 
          recipeId: null, 
          name: '',
          menuItems: [],
          mealType: 'breakfast' as const,
          restaurantName: '',
          notes: ''
        },
        { 
          id: `prev-l${index+1}-${Date.now()}`, 
          type: 'lunch' as const, 
          isOuting: false, 
          recipeId: null, 
          name: '',
          menuItems: [],
          mealType: 'lunch' as const,
          restaurantName: '',
          notes: ''
        },
        { 
          id: `prev-d${index+1}-${Date.now()}`, 
          type: 'dinner' as const, 
          isOuting: false, 
          recipeId: null, 
          name: '',
          menuItems: [],
          mealType: 'dinner' as const,
          restaurantName: '',
          notes: ''
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
    return {
      id: `next-day-${dateUtils.toYMDString(date)}`,
      date,
      meals: [
        { 
          id: `new-b${index+1}-${Date.now()}`, 
          type: 'breakfast' as const, 
          isOuting: false, 
          recipeId: null, 
          name: '',
          menuItems: [],
          mealType: 'breakfast' as const,
          restaurantName: '',
          notes: ''
        },
        { 
          id: `new-l${index+1}-${Date.now()}`, 
          type: 'lunch' as const, 
          isOuting: false, 
          recipeId: null, 
          name: '',
          menuItems: [],
          mealType: 'lunch' as const,
          restaurantName: '',
          notes: ''
        },
        { 
          id: `new-d${index+1}-${Date.now()}`, 
          type: 'dinner' as const, 
          isOuting: false, 
          recipeId: null, 
          name: '',
          menuItems: [],
          mealType: 'dinner' as const,
          restaurantName: '',
          notes: ''
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