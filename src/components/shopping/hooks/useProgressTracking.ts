import { useEffect } from 'react';
import { generateClient } from 'aws-amplify/api';
import { Schema } from '../../../../amplify/data/resource';
import { type ShoppingItem } from '../../../API';
import { calculateProgress } from '../utils/shoppingUtils';

const client = generateClient<Schema>();

export const useProgressTracking = (
  listId: string | undefined,
  items: ShoppingItem[],
  isCompleted: boolean | null | undefined,
  onUpdate?: () => void
) => {
  const { completedItems, progress } = calculateProgress(items);

  // リスト完了状態の更新
  const updateListCompletion = async (allCompleted: boolean) => {
    if (!listId) return;

    try {
      await client.models.ShoppingList.update({
        id: listId,
        isCompleted: allCompleted
      });
      
      // 親コンポーネントに変更を通知
      if (onUpdate) {
        onUpdate();
      }
    } catch (err) {
      console.error('リスト完了状態の更新中にエラーが発生しました:', err);
    }
  };

  // アイテムの完了状態変化を監視してリスト全体の完了状態を更新
  useEffect(() => {
    if (items.length === 0) return;
    
    const allCompleted = items.every(item => item.isChecked);
    
    // リスト全体の完了状態が変わる場合、リスト自体も更新
    if (allCompleted !== isCompleted) {
      updateListCompletion(allCompleted);
    }
  }, [items, isCompleted, listId, onUpdate]);

  return {
    completedItems,
    progress,
    updateListCompletion
  };
};
