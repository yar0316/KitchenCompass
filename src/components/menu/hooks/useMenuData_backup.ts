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

const client = generateClient();

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
        console.log('[fetchMenus] API response:', response);
        // APIレスポンスから必要なデータを取得
      const menus: any[] = (response as any).data?.listMenus?.items || [];
      console.log('[fetchMenus] 取得したメニュー数:', menus.length);
      
      const sortedMenus = menus.sort((a: any, b: any) => new Date(a.date).getTime() - new Date(b.date).getTime());
      
      // 現在の日付を取得して、それを基準に週の開始日を計算
      const today = new Date();
      const startOfWeek = dateUtils.getStartOfWeek(today);
      const startOfNextWeek = dateUtils.addWeek(startOfWeek);
      
      console.log('[fetchMenus] 週の開始日:', startOfWeek.toISOString());
      console.log('[fetchMenus] 来週の開始日:', startOfNextWeek.toISOString());
      
      // 各週のメニューをフィルタリング
      const currentWeekMenus = sortedMenus.filter(menu => {
        const menuDate = new Date(menu.date);
        // dateオブジェクトをYYYY-MM-DDの形式に正規化して比較する
        const menuDateStr = dateUtils.toYMDString(menuDate);
        const startWeekStr = dateUtils.toYMDString(startOfWeek);
        const endWeekStr = dateUtils.toYMDString(startOfNextWeek);
        
        // 週の範囲内かチェック（startOfWeek ≤ menuDate < startOfNextWeek）
        return menuDateStr >= startWeekStr && menuDateStr < endWeekStr;
      });
      
      const nextWeekMenus = sortedMenus.filter(menu => {
        const menuDate = new Date(menu.date);
        // dateオブジェクトをYYYY-MM-DDの形式に正規化して比較する
        const menuDateStr = dateUtils.toYMDString(menuDate);
        const startNextWeekStr = dateUtils.toYMDString(startOfNextWeek);
        const endNextWeekStr = dateUtils.toYMDString(dateUtils.addWeek(startOfNextWeek));
        
        // 次の週の範囲内かチェック（startOfNextWeek ≤ menuDate < startOfNextWeek+7日）
        return menuDateStr >= startNextWeekStr && menuDateStr < endNextWeekStr;
      });
      
      console.log('[fetchMenus] 現在週のメニュー数:', currentWeekMenus.length);
      console.log('[fetchMenus] 来週のメニュー数:', nextWeekMenus.length);
      
      // 日付がなくても必ず7日分のカードを生成する
      const currentWeekDays = menuUtils.convertMenusToDays(currentWeekMenus, startOfWeek);
      const nextWeekDays = menuUtils.convertMenusToDays(nextWeekMenus, startOfNextWeek);
      
      console.log('[fetchMenus] 変換後の今週の日数:', currentWeekDays.length);
      console.log('[fetchMenus] 変換後の来週の日数:', nextWeekDays.length);
      
      // データが存在するか確認
      const hasCurrentWeekData = currentWeekDays.some(day => 
        day.meals.some(meal => meal.name !== '')
      );
      
      const hasNextWeekData = nextWeekDays.some(day => 
        day.meals.some(meal => meal.name !== '')
      );
      
      console.log('[fetchMenus] 今週のデータ有無:', hasCurrentWeekData);
      console.log('[fetchMenus] 来週のデータ有無:', hasNextWeekData);
      
      // menuPlansを更新
      const updatedMenuPlans = {
        currentWeek: {
          id: 'current-week',
          startDate: startOfWeek,
          days: currentWeekDays
        },
        nextWeek: {
          id: 'next-week',
          startDate: startOfNextWeek,
          days: nextWeekDays
        }
      };
      
      setMenuPlans(updatedMenuPlans);
      console.log('[fetchMenus] メニュープラン更新完了');
      
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
   * 献立保存処理
   */
  const handleSaveMeal = async (date: Date, mealType: 'breakfast' | 'lunch' | 'dinner', mealData: any) => {
    try {
      console.log('[handleSaveMeal] mealData:', mealData);
      
      // Menuのdateで既存Menuを検索
      const menus = await client.models.Menu.list({
        filter: { date: { eq: date.toISOString() } }
      });
      console.log('[handleSaveMeal] Menu.list result:', menus);
      
      let menu = menus.data[0];
      if (!menu) {
        // 新規Menu作成
        menu = await client.models.Menu.create({
          date: date.toISOString(),
          notes: mealData.notes || '',
        });
        console.log('[handleSaveMeal] Menu.create result:', menu);
      } else {
        // 既存Menuのnotes等を更新（必要なら）
        const updatedMenu = await client.models.Menu.update({
          id: menu.id,
          notes: mealData.notes || menu.notes || '',
        });
        console.log('[handleSaveMeal] Menu.update result:', updatedMenu);
      }
      
      // 既存のMenuItemを検索（同じmealTypeのもの）
      const existingItems = await client.models.MenuItem.list({
        filter: {
          menuId: { eq: menu.id },
          mealType: { eq: mealType }
        }
      });
      console.log('[handleSaveMeal] MenuItem.list result:', existingItems);
      
      // 外食か通常のメニューアイテムかで処理を分岐
      if (mealData.isOuting) {
        // 外食の場合は単一のMenuItemとして処理
        const menuItemInput = {
          menuId: menu.id,
          mealType: mealType,
          isOutside: true,
          outsideLocation: mealData.restaurantName || '',
          notes: mealData.notes || '',
          recipeId: null,
          name: mealData.restaurantName || '外食' // 外食先の名前を追加
        };
        
        if (existingItems.data.length > 0) {
          // 既存項目の更新
          const updatedItem = await client.models.MenuItem.update({
            id: existingItems.data[0].id,
            ...menuItemInput
          });
          console.log('[handleSaveMeal] MenuItem.update result (outing):', updatedItem);
        } else {
          // 新規作成
          const createdItem = await client.models.MenuItem.create(menuItemInput);
          console.log('[handleSaveMeal] MenuItem.create result (outing):', createdItem);
        }
      } else {
        // 通常のメニューアイテム処理
        // 既存の項目を一旦削除（複数のメニューアイテムに対応するため）
        for (const existingItem of existingItems.data) {
          await client.models.MenuItem.delete({ id: existingItem.id });
          console.log('[handleSaveMeal] MenuItem.delete result:', existingItem.id);
        }
        
        // 有効なメニューアイテムをフィルタリング
        const validMenuItems = Array.isArray(mealData.menuItems) 
          ? mealData.menuItems.filter((item: any) => item.name && item.name.trim())
          : [];
          
        // メニューアイテムがない場合は空のアイテムを作成
        if (validMenuItems.length === 0) {
          const emptyItemInput = {
            menuId: menu.id,
            mealType: mealType,
            isOutside: false,
            outsideLocation: '',
            notes: '',
            recipeId: null,
            name: '未設定のメニュー' // 空の名前ではなく、デフォルト値を設定
          };
          const createdItem = await client.models.MenuItem.create(emptyItemInput);
          console.log('[handleSaveMeal] MenuItem.create result (empty):', createdItem);
        } else {
          // 各メニューアイテムを保存
          for (const item of validMenuItems) {
            const menuItemInput = {
              menuId: menu.id,
              mealType: mealType,
              isOutside: false,
              outsideLocation: '',
              notes: '',
              recipeId: item.recipeId || null,
              name: item.name || '未設定のメニュー' // nameが空の場合にデフォルト値を設定
            };
            
            const createdItem = await client.models.MenuItem.create(menuItemInput);
            console.log('[handleSaveMeal] MenuItem.create result (regular):', createdItem);
          }
        }
      }
      
      // 保存後にデータを再取得
      await fetchMenus();
      
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
    // 現在のmenuPlansから直接操作
    const updatedMenuPlans = { ...menuPlans };
    
    // 全ての週データを統合して検索
    const allWeeks = [
      { key: 'previousWeek', data: updatedMenuPlans.previousWeek },
      { key: 'currentWeek', data: updatedMenuPlans.currentWeek },
      { key: 'nextWeek', data: updatedMenuPlans.nextWeek }
    ].filter(week => week.data);
    
    let sourceWeekKey = '';
    let targetWeekKey = '';
    
    // ソースとターゲットの週を特定
    for (const week of allWeeks) {
      if (week.data!.days.some((day: DayData) => dateUtils.isSameDay(day.date, fromDate))) {
        sourceWeekKey = week.key;
      }
      if (week.data!.days.some((day: DayData) => dateUtils.isSameDay(day.date, toDate))) {
        targetWeekKey = week.key;
      }
    }
    
    if (!sourceWeekKey || !targetWeekKey) return;
    
    const sourceWeekData = { ...(updatedMenuPlans as any)[sourceWeekKey] };
    const targetWeekData = sourceWeekKey === targetWeekKey ? sourceWeekData : { ...(updatedMenuPlans as any)[targetWeekKey] };
    
    const sourceDayIndex = updatedWeekData.days.findIndex(
      day => dateUtils.isSameDay(day.date, fromDate)
    );
    
    const targetDayIndex = updatedWeekData.days.findIndex(
      day => dateUtils.isSameDay(day.date, toDate)
    );
    
    if (sourceDayIndex === -1 || targetDayIndex === -1) {
      return;
    }
    
    const sourceDay = updatedWeekData.days[sourceDayIndex];
    const targetDay = updatedWeekData.days[targetDayIndex];
    
    const itemToMoveIndex = sourceDay.meals.findIndex(item => item.id === meal.id);
    
    if (itemToMoveIndex === -1) {
      return;
    }
    
    const itemToMove = sourceDay.meals[itemToMoveIndex];
    
    sourceDay.meals.splice(itemToMoveIndex, 1);
    
    targetDay.meals.push({
      ...itemToMove,
      type: toType
    });
    
    updatedMenuPlans[weekKey] = updatedWeekData;
    setMenuPlans(updatedMenuPlans);  };

  /**
   * テンプレートを適用
   */  const applyTemplate = (templateId: string) => {
    const template = templates.find(t => t.id === templateId);
    if (!template) return false;
    
    // 現在の週に適用
    const updatedWeek = { ...menuPlans.currentWeek };
    
    template.days.forEach((templateDay, index) => {
      if (index < updatedWeek.days.length) {
        templateDay.meals.forEach(templateItem => {
          const itemIndex = updatedWeek.days[index].meals.findIndex(
            item => item.type === templateItem.type
          );
          
          if (itemIndex !== -1) {
            updatedWeek.days[index].meals[itemIndex] = {
              ...updatedWeek.days[index].meals[itemIndex],
              name: templateItem.name,
              recipeId: templateItem.recipeId
            };
          } else {
            updatedWeek.days[index].meals.push({
              id: `menu-item-${Date.now()}-${index}-${templateItem.type}`,
              ...templateItem
            });
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