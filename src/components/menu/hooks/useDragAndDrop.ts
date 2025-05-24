import { useState } from 'react';
import { 
  PointerSensor,
  useSensor, 
  useSensors,
  DragStartEvent,
  DragEndEvent,
  Active
} from '@dnd-kit/core';
import { MealData, MenuItemData } from '../types/Menu.types';

interface UseDragAndDropResult {
  sensors: ReturnType<typeof useSensors>;
  activeItem: Active | null;
  handleDragStart: (event: DragStartEvent) => void;
  handleDragEnd: (event: DragEndEvent, onMoveMeal: (meal: MealData, fromDate: Date, toDate: Date, toType: 'breakfast' | 'lunch' | 'dinner') => void) => void;
}

/**
 * ドラッグ&ドロップ機能を管理するカスタムフック
 */
export const useDragAndDrop = (): UseDragAndDropResult => {
  // ドラッグしているアイテムの状態
  const [activeItem, setActiveItem] = useState<Active | null>(null);
  
  // ドラッグ操作のセンサーを定義（ポインター操作のみ）
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        // ドラッグ開始の判定距離を小さくして反応を良くする（1pxに設定）
        distance: 1,
      }
    })
  );

  // ドラッグ開始時のハンドラー
  const handleDragStart = (event: DragStartEvent) => {
    setActiveItem(event.active);
  };

  // ドラッグ終了時のハンドラー
  const handleDragEnd = (
    event: DragEndEvent, 
    onMoveMeal: (meal: MealData, fromDate: Date, toDate: Date, toType: 'breakfast' | 'lunch' | 'dinner') => void
  ) => {
    const { active, over } = event;
    setActiveItem(null);
    
    if (!over) {
      return;
    }
    
    if (active.id === over.id) {
      return;
    }

    try {
      // ドラッグしたアイテムのデータを取得
      const activeData = active.data.current as { 
        item?: MenuItemData; 
        meal?: MealData; 
        date?: Date; 
        mealType?: 'breakfast' | 'lunch' | 'dinner';
        [key: string]: unknown;
      };
      if (!activeData) {
        return;
      }
      
      // ドロップ先のデータを取得
      const overData = over.data.current as { 
        date?: Date; 
        mealType?: 'breakfast' | 'lunch' | 'dinner'; 
        meal?: MealData;
        [key: string]: unknown;
      };
      if (!overData) {
        return;
      }
      
      // メニューアイテムか食事枠全体かを判断
      const isMenuItem = typeof active.id === 'string' && active.id.toString().includes('item-');
      const isActiveAMeal = activeData.meal || activeData.mealType;
      
      // ドロップ先の情報を収集
      let targetDate: Date | null = null;
      let targetType: 'breakfast' | 'lunch' | 'dinner' | null = null;
      
      // ドロップ先から情報を抽出
      if (overData.date) {
        targetDate = overData.date;
      }
      
      if (overData.mealType) {
        // ドロップ先にmealTypeがある場合
        targetType = overData.mealType;
      } else if (overData.meal && overData.meal.type) {
        // ドロップ先にmeal.typeがある場合
        targetType = overData.meal.type;
      } else if (typeof over.id === 'string') {
        // IDから食事タイプを抽出する試み
        const overId = over.id.toString();
        if (overId.includes('drop-') && overId.includes('-breakfast')) {
          targetType = 'breakfast';
        } else if (overId.includes('drop-') && overId.includes('-lunch')) {
          targetType = 'lunch';
        } else if (overId.includes('drop-') && overId.includes('-dinner')) {
          targetType = 'dinner';
        }
        
        // ドロップゾーンIDから日付を抽出
        // 形式: drop-ISO日付-食事タイプ
        if (overId.includes('drop-')) {
          const parts = overId.split('-');
          if (parts.length >= 3) {
            // ISO日付部分を取得
            const dateStr = parts[1];
            try {
              targetDate = new Date(dateStr);
            } catch {
              // 日付のパースに失敗した場合は何もしない
            }
          }
        }
      }
      
      // 必要なデータがすべて揃っているか確認
      if (!targetDate || !targetType) {
        return;
      }

      // 移動元の情報を収集
      let sourceDate: Date | null = null;
      let sourceType: 'breakfast' | 'lunch' | 'dinner' | null = null;
      let mealToMove: MealData | null = null;

      if (isMenuItem && activeData.item) {
        // メニューアイテムの場合
        const { item, date, mealType } = activeData;
        
        // 型ガード: undefinedチェック
        if (!date || !mealType) {
          return;
        }
        
        sourceDate = date;
        sourceType = mealType;
        mealToMove = {
          id: item.id,
          name: item.name,
          type: mealType,
          recipeId: item.recipeId,
          menuItems: [{
            id: item.id,
            name: item.name,
            recipeId: item.recipeId
          }],
          mealType: mealType
        };
      } else if (isActiveAMeal) {
        // 食事枠全体の場合
        const date = activeData.date;
        const mealType = activeData.meal ? activeData.meal.type : activeData.mealType;
        
        // 型ガード: undefinedチェック
        if (!date || !mealType) {
          return;
        }
        
        sourceDate = date;
        sourceType = mealType;
        mealToMove = activeData.meal || {
          id: `meal-${Date.now()}`,
          name: '',
          type: mealType,
          recipeId: null,
          menuItems: [],
          mealType: mealType
        };
      } else {
        return;
      }
      
      // 移動元の情報が揃っているか確認
      if (!sourceDate || !sourceType || !mealToMove) {
        return;
      }
      
      // 親コンポーネントのコールバックを呼び出す前の最終確認
      if (!onMoveMeal) {
        return;
      }

      // 親コンポーネントのコールバックを呼び出し
      onMoveMeal(mealToMove, sourceDate, targetDate, targetType);
    } catch {
      // ドラッグ&ドロップ処理でエラーが発生した場合は何もしない
    }
  };

  return {
    sensors,
    activeItem,
    handleDragStart,
    handleDragEnd
  };
};