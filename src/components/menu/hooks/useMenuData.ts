import { useState, useEffect, useCallback } from 'react';
import { generateClient } from 'aws-amplify/api';
import { 
  MenuPlans, 
  MealData, 
  DayData,
  WeekData,
  Template
} from '../types/Menu.types';
import { dateUtils } from '../utils/dateUtils';
import { 
  listMenus
} from '../../../graphql/queries';
import { 
  createMenu, 
  createMenuItem
} from '../../../graphql/mutations';

// GraphQL レスポンス型定義
interface GraphQLMenuItem {
  id: string;
  name: string;
  mealType: string;
  isOutside?: boolean;
  outsideLocation?: string;
  notes?: string;
  menuId: string;
  recipeId?: string;
  recipe?: {
    id: string;
    name: string;
    description?: string;
    imageUrl?: string;
    cookingTime?: number;
    category?: string;
  };
  createdAt: string;
  updatedAt: string;
}

interface GraphQLMenu {
  id: string;
  date: string;
  notes?: string;
  owner?: string;
  menuItems: {
    items: GraphQLMenuItem[];
    nextToken?: string;
  };
  createdAt: string;
  updatedAt: string;
}

/**
 * 空の初期値を定義
 */
const INITIAL_MENU_PLANS: MenuPlans = {
  currentWeek: {
    id: 'current-week',
    startDate: new Date(),
    days: []
  },
  nextWeek: {
    id: 'next-week',
    startDate: dateUtils.addWeek(new Date()),
    days: []
  }
};

/**
 * メニューデータと操作関数を提供するカスタムフック
 */
export const useMenuData = () => {
  // 状態
  const [menuPlans, setMenuPlans] = useState<MenuPlans>(INITIAL_MENU_PLANS);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<Error | null>(null);
  const [templates, setTemplates] = useState<Template[]>([]);  /**
   * GraphQLを使用してMenuデータを取得
   */
  const fetchMenus = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      console.log('[fetchMenus] 開始: GraphQLでメニューデータを取得します');
      
      const client = generateClient();
        // 現在の週の開始日と終了日を計算
      const currentWeekStart = dateUtils.getStartOfWeek(new Date());
      const nextWeekStart = dateUtils.addWeek(currentWeekStart);
      const previousWeekStart = dateUtils.subtractWeek(currentWeekStart);
      // 各週の終了日を計算
      const nextWeekEnd = dateUtils.addDays(nextWeekStart, 6);
      
      // UTC時間で日付範囲を作成
      const startDateUTC = new Date(Date.UTC(previousWeekStart.getFullYear(), previousWeekStart.getMonth(), previousWeekStart.getDate(), 0, 0, 0, 0));
      const endDateUTC = new Date(Date.UTC(nextWeekEnd.getFullYear(), nextWeekEnd.getMonth(), nextWeekEnd.getDate(), 23, 59, 59, 999));
      
      // 全てのメニューを取得（日付範囲でフィルタリング）
      const menuResponse = await client.graphql({
        query: listMenus,
        variables: {
          filter: {
            date: {
              between: [
                startDateUTC.toISOString(),
                endDateUTC.toISOString()
              ]
            }
          }
        }
      }) as { data: { listMenus: { items: GraphQLMenu[] } } };

      const menus: GraphQLMenu[] = menuResponse.data.listMenus.items;
      console.log('[fetchMenus] 取得したメニュー数:', menus.length);

      // 取得したメニューを週ごとに分類
      const createWeekData = (startDate: Date, id: string): WeekData => {
        const weekDays = dateUtils.generateWeekDays(startDate);
        
        return {
          id,
          startDate,          days: weekDays.map(date => {
            const dateStr = date.toISOString().split('T')[0];
            const dayMenu = menus.find((menu: GraphQLMenu) => {
              // DynamoDBから取得したAWSDateTime形式と比較するため、日付部分のみを比較
              const menuDateStr = menu.date.split('T')[0];
              return menuDateStr === dateStr;
            });
            
            const dayData: DayData = {
              id: `${id}-${dateStr}`,
              date,
              meals: []
            };

            if (dayMenu && dayMenu.menuItems && dayMenu.menuItems.items) {
              // 食事タイプごとにメニューアイテムを整理
              const mealTypes = ['breakfast', 'lunch', 'dinner'];
              
              mealTypes.forEach(mealType => {                const mealItems = dayMenu.menuItems.items.filter(
                  (item: GraphQLMenuItem) => item.mealType === mealType
                );
                
                if (mealItems.length > 0) {
                  // 複数のアイテムがある場合は最初のものを使用
                  const primaryItem = mealItems[0];
                  const meal: MealData = {
                    id: primaryItem.id,
                    type: mealType as 'breakfast' | 'lunch' | 'dinner',
                    name: primaryItem.name || '',
                    recipeId: primaryItem.recipeId || null,
                    menuItems: mealItems.map((item: GraphQLMenuItem) => ({
                      id: item.id,
                      name: item.name || '',
                      recipeId: item.recipeId || null,
                      mealType: item.mealType as 'breakfast' | 'lunch' | 'dinner',
                      isOutside: item.isOutside || false,
                      outsideLocation: item.outsideLocation || '',
                      notes: item.notes || ''
                    })),
                    mealType: mealType as 'breakfast' | 'lunch' | 'dinner'
                  };
                  dayData.meals.push(meal);
                } else {
                  // 空の食事を追加
                  const meal: MealData = {
                    id: `${dateStr}-${mealType}`,
                    type: mealType as 'breakfast' | 'lunch' | 'dinner',
                    name: '',
                    recipeId: null,
                    menuItems: [],
                    mealType: mealType as 'breakfast' | 'lunch' | 'dinner'
                  };
                  dayData.meals.push(meal);
                }
              });
            } else {
              // メニューがない日は空の食事を作成
              const mealTypes = ['breakfast', 'lunch', 'dinner'];
              mealTypes.forEach(mealType => {
                const meal: MealData = {
                  id: `${dateStr}-${mealType}`,
                  type: mealType as 'breakfast' | 'lunch' | 'dinner',
                  name: '',
                  recipeId: null,
                  menuItems: [],
                  mealType: mealType as 'breakfast' | 'lunch' | 'dinner'
                };
                dayData.meals.push(meal);
              });
            }
            
            return dayData;
          })
        };
      };

      const updatedMenuPlans = {
        previousWeek: createWeekData(previousWeekStart, 'previous-week'),
        currentWeek: createWeekData(currentWeekStart, 'current-week'),
        nextWeek: createWeekData(nextWeekStart, 'next-week')
      };

      setMenuPlans(updatedMenuPlans);
      console.log('[fetchMenus] GraphQLメニュープラン更新完了');
      
    } catch (e) {
      console.error('[fetchMenus] GraphQL Error:', e);
      setError(e as Error);
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * 初回マウント時にデータを取得
   */
  useEffect(() => {
    fetchMenus();
  }, [fetchMenus]);  /**
   * 献立保存処理（GraphQL）
   */  const handleSaveMeal = async (date: Date, mealType: 'breakfast' | 'lunch' | 'dinner', mealData: MealData) => {
    try {      console.log('[handleSaveMeal] GraphQLでmealDataを保存:', mealData);
      console.log('[handleSaveMeal] 元の日付:', date);
        const client = generateClient();
      // DynamoDBのAWSDateTime形式に対応：UTC時間で指定日の午前0時に設定
      const targetDate = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate(), 0, 0, 0, 0));
      const dateTimeStr = targetDate.toISOString();
      
      console.log('[handleSaveMeal] UTC変換後の日付:', dateTimeStr);
      
      // まず対象日のMenuが存在するかチェック（日付の開始と終了時刻で範囲検索）
      const startOfDay = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate(), 0, 0, 0, 0));
      const endOfDay = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate(), 23, 59, 59, 999));
      
      const existingMenuResponse = await client.graphql({
        query: listMenus,
        variables: {
          filter: {
            date: {
              between: [startOfDay.toISOString(), endOfDay.toISOString()]
            }
          }
        }
      }) as { data: { listMenus: { items: GraphQLMenu[] } } };
      
      let menuId: string;
      
      if (existingMenuResponse.data.listMenus.items.length > 0) {
        // 既存のMenuを使用
        menuId = existingMenuResponse.data.listMenus.items[0].id;
      } else {
        // 新しいMenuを作成（AWSDateTime形式で送信）
        const newMenuResponse = await client.graphql({
          query: createMenu,
          variables: {
            input: {
              date: dateTimeStr
            }
          }
        }) as { data: { createMenu: GraphQLMenu } };
        
        menuId = newMenuResponse.data.createMenu.id;
      }
      
      // MenuItemを作成または更新
      if (mealData.menuItems && mealData.menuItems.length > 0) {
        const menuItem = mealData.menuItems[0];
        
        await client.graphql({
          query: createMenuItem,
          variables: {
            input: {
              name: menuItem.name,
              mealType: mealType,
              menuId: menuId,
              recipeId: menuItem.recipeId,
              isOutside: menuItem.isOutside || false,
              outsideLocation: menuItem.outsideLocation || '',
              notes: menuItem.notes || ''
            }
          }
        });
      }
      
      // ローカル状態も更新
      const updatedMenuPlans = { ...menuPlans };
      
      // 該当する週を特定
      let targetWeekKey: keyof MenuPlans | null = null;
      const allWeeks = [
        { key: 'previousWeek' as keyof MenuPlans, data: updatedMenuPlans.previousWeek },
        { key: 'currentWeek' as keyof MenuPlans, data: updatedMenuPlans.currentWeek },
        { key: 'nextWeek' as keyof MenuPlans, data: updatedMenuPlans.nextWeek }
      ].filter(week => week.data);
      
      for (const week of allWeeks) {
        if (week.data && week.data.days.some(day => dateUtils.isSameDay(day.date, date))) {
          targetWeekKey = week.key;
          break;
        }
      }
      
      if (targetWeekKey && updatedMenuPlans[targetWeekKey]) {
        const targetWeek = updatedMenuPlans[targetWeekKey]!;
        const dayIndex = targetWeek.days.findIndex(day => dateUtils.isSameDay(day.date, date));
        
        if (dayIndex !== -1) {
          const mealIndex = targetWeek.days[dayIndex].meals.findIndex(meal => meal.type === mealType);
          
          if (mealIndex !== -1) {
            // 既存のmealを更新
            targetWeek.days[dayIndex].meals[mealIndex] = {
              ...targetWeek.days[dayIndex].meals[mealIndex],
              ...mealData
            };
          } else {
            // 新しいmealを追加
            targetWeek.days[dayIndex].meals.push(mealData);
          }
        }
      }
        setMenuPlans(updatedMenuPlans);
      console.log('[handleSaveMeal] 献立保存完了:', { date: dateTimeStr, mealType, menuId });
      return true;
    } catch (e) {
      console.error('[handleSaveMeal] GraphQL error:', e);
      console.error('[handleSaveMeal] Error details:', {
        date: date.toISOString(),
        mealType,
        mealData,
        error: e
      });
      throw e;
    }
  };

  /**
   * メニューの移動処理
   */
  const handleMoveMeal = (
    meal: MealData,
    fromDate: Date,
    toDate: Date,
    toType: 'breakfast' | 'lunch' | 'dinner'
  ) => {
    const updatedMenuPlans = { ...menuPlans };
    
    // 全ての週データを統合して検索
    const allWeeks = [
      { key: 'previousWeek' as keyof MenuPlans, data: updatedMenuPlans.previousWeek },
      { key: 'currentWeek' as keyof MenuPlans, data: updatedMenuPlans.currentWeek },
      { key: 'nextWeek' as keyof MenuPlans, data: updatedMenuPlans.nextWeek }
    ].filter(week => week.data);
    
    let sourceWeekKey: keyof MenuPlans | null = null;
    let targetWeekKey: keyof MenuPlans | null = null;
    
    // ソースとターゲットの週を特定
    for (const week of allWeeks) {
      if (week.data!.days.some((day: DayData) => dateUtils.isSameDay(day.date, fromDate))) {
        sourceWeekKey = week.key;
      }
      if (week.data!.days.some((day: DayData) => dateUtils.isSameDay(day.date, toDate))) {
        targetWeekKey = week.key;
      }
    }
    
    if (!sourceWeekKey || !targetWeekKey || !updatedMenuPlans[sourceWeekKey] || !updatedMenuPlans[targetWeekKey]) return;
    
    const sourceWeekData = updatedMenuPlans[sourceWeekKey]!;
    const targetWeekData = updatedMenuPlans[targetWeekKey]!;
    
    const sourceDayIndex = sourceWeekData.days.findIndex(
      day => dateUtils.isSameDay(day.date, fromDate)
    );
    
    const targetDayIndex = targetWeekData.days.findIndex(
      day => dateUtils.isSameDay(day.date, toDate)
    );
    
    if (sourceDayIndex === -1 || targetDayIndex === -1) {
      return;
    }
    
    const sourceDay = sourceWeekData.days[sourceDayIndex];
    const targetDay = targetWeekData.days[targetDayIndex];
    
    const itemToMoveIndex = sourceDay.meals.findIndex(item => item.id === meal.id);
    
    if (itemToMoveIndex === -1) {
      return;
    }
    
    const itemToMove = sourceDay.meals[itemToMoveIndex];
    
    // アイテムをソースから削除
    sourceDay.meals.splice(itemToMoveIndex, 1);
    
    // ターゲットに追加
    targetDay.meals.push({
      ...itemToMove,
      type: toType,
      mealType: toType
    });
    
    setMenuPlans(updatedMenuPlans);
  };

  /**
   * テンプレートを適用
   */
  const applyTemplate = (templateId: string) => {
    const template = templates.find(t => t.id === templateId);
    if (!template) return false;
    
    // 現在の週に適用
    const updatedWeek = { ...menuPlans.currentWeek };
    
    template.days.forEach((templateDay, index) => {
      if (index < updatedWeek.days.length) {
        templateDay.meals.forEach(templateMeal => {
          const mealIndex = updatedWeek.days[index].meals.findIndex(
            meal => meal.type === templateMeal.mealType
          );
          
          if (mealIndex !== -1) {
            updatedWeek.days[index].meals[mealIndex] = {
              ...updatedWeek.days[index].meals[mealIndex],
              name: templateMeal.menuItems[0]?.name || '',
              recipeId: templateMeal.menuItems[0]?.recipeId
            };
          }
        });
      }
    });

    setMenuPlans({
      ...menuPlans,
      currentWeek: updatedWeek
    });
    
    return true;
  };

  return {
    menuPlans,
    loading,
    error,
    templates,
    setMenuPlans,
    setTemplates,
    fetchMenus,
    handleSaveMeal,
    handleMoveMeal,
    applyTemplate
  };
};