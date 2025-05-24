import { useState, useEffect, useCallback } from 'react';
import { 
  MenuPlans, 
  MealData, 
  DayData,
  WeekData,
  Template
} from '../types/Menu.types';
import { dateUtils } from '../utils/dateUtils';

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
  const [templates, setTemplates] = useState<Template[]>([]);

  /**
   * モックデータを使用してMenuデータを取得
   */
  const fetchMenus = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      console.log('[fetchMenus] 開始: メニューデータを取得します');
      
      // モックデータを返す
      const currentWeekStart = dateUtils.getStartOfWeek(new Date());
      const nextWeekStart = dateUtils.addWeek(currentWeekStart);
      const previousWeekStart = dateUtils.subtractWeek(currentWeekStart);

      const createEmptyWeek = (startDate: Date, id: string): WeekData => ({
        id,
        startDate,
        days: dateUtils.generateWeekDays(startDate).map(date => ({
          id: `${id}-${date.toISOString().split('T')[0]}`,
          date,
          meals: [
            {
              id: `${date.toISOString()}-breakfast`,
              type: 'breakfast',
              name: '',
              recipeId: null,
              menuItems: [],
              mealType: 'breakfast'
            },
            {
              id: `${date.toISOString()}-lunch`,
              type: 'lunch',
              name: '',
              recipeId: null,
              menuItems: [],
              mealType: 'lunch'
            },
            {
              id: `${date.toISOString()}-dinner`,
              type: 'dinner',
              name: '',
              recipeId: null,
              menuItems: [],
              mealType: 'dinner'
            }
          ]
        }))
      });

      const updatedMenuPlans = {
        currentWeek: createEmptyWeek(currentWeekStart, 'current-week'),
        nextWeek: createEmptyWeek(nextWeekStart, 'next-week'),
        previousWeek: createEmptyWeek(previousWeekStart, 'previous-week')
      };

      setMenuPlans(updatedMenuPlans);
      console.log('[fetchMenus] モックメニュープラン更新完了');
      
    } catch (e) {
      console.error('[fetchMenus] Error:', e);
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
  }, [fetchMenus]);

  /**
   * 献立保存処理（モック）
   */
  const handleSaveMeal = async (date: Date, mealType: 'breakfast' | 'lunch' | 'dinner', mealData: MealData) => {
    try {
      console.log('[handleSaveMeal] mealData:', mealData);
      
      // ローカル状態を更新
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
      return true;
    } catch (e) {
      console.error('[handleSaveMeal] error:', e);
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