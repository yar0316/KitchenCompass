import { useState, useEffect, useCallback } from 'react';
import { generateClient } from 'aws-amplify/api';
import { Schema } from '../../../../amplify/data/resource';
import { type ShoppingItem } from '../../../API';
import { 
  ShoppingFormData, 
  initializeShoppingFormData, 
  resetShoppingForm 
} from '../utils/shoppingUtils';

const client = generateClient<Schema>();

export const useShoppingItems = (listId: string | undefined) => {
  const [items, setItems] = useState<ShoppingItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [saveLoading, setSaveLoading] = useState(false);
  const [formData, setFormData] = useState<ShoppingFormData>(initializeShoppingFormData());
  // 買い物アイテムの取得
  const fetchShoppingItems = useCallback(async () => {
    if (!listId) return;
    
    setLoading(true);
    try {
      const result = await client.models.ShoppingItem.list({
        filter: {
          shoppingListId: {
            eq: listId
          }
        }
      });
      setItems(result.data as unknown as ShoppingItem[]);
      setError(null);
    } catch (err) {
      console.error('買い物アイテムの取得中にエラーが発生しました:', err);
      setError('アイテムの読み込みに失敗しました。');
    } finally {
      setLoading(false);
    }
  }, [listId]);

  // 新しいアイテムを追加
  const handleAddItem = async () => {
    if (!formData.newItemName.trim() || !listId) return;
    
    setSaveLoading(true);
    try {
      const result = await client.models.ShoppingItem.create({
        name: formData.newItemName.trim(),
        amount: parseFloat(formData.newItemAmount) || 1,
        unit: formData.newItemUnit,
        category: formData.newItemCategory,
        isChecked: false,
        notes: formData.newItemNotes.trim() || undefined,
        shoppingListId: listId
      });      if (result.data) {
        setItems([...items, result.data as unknown as ShoppingItem]);
      }
      
      resetShoppingForm(setFormData);
      setError(null);
    } catch (err) {
      console.error('アイテムの追加中にエラーが発生しました:', err);
      setError('アイテムの追加に失敗しました。');
    } finally {
      setSaveLoading(false);
    }
  };

  // アイテムのチェック状態を切り替え
  const toggleItemCheck = async (item: ShoppingItem) => {
    try {
      const result = await client.models.ShoppingItem.update({
        id: item.id,
        isChecked: !item.isChecked
      });
        if (result.data) {
        setItems(items.map(i => 
          i.id === item.id ? result.data as unknown as ShoppingItem : i
        ));
      }
    } catch (err) {
      console.error('アイテム状態の更新中にエラーが発生しました:', err);
      setError('アイテム状態の更新に失敗しました。');
    }
  };

  // アイテムの削除
  const deleteItem = async (itemId: string) => {
    try {
      await client.models.ShoppingItem.delete({
        id: itemId
      });
      
      setItems(items.filter(item => item.id !== itemId));
    } catch (err) {
      console.error('アイテムの削除中にエラーが発生しました:', err);
      setError('アイテムの削除に失敗しました。');
    }
  };
  // リストIDが変更されたらアイテムを再取得
  useEffect(() => {
    fetchShoppingItems();
  }, [fetchShoppingItems]);

  return {
    items,
    loading,
    error,
    saveLoading,
    formData,
    setFormData,
    handleAddItem,
    toggleItemCheck,
    deleteItem,
    setError
  };
};
