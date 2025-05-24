import { format } from 'date-fns';
import { ja } from 'date-fns/locale';
import { type ShoppingItem } from '../../../API';

// インターフェース定義
export interface ShoppingFormData {
  newItemName: string;
  newItemAmount: string;
  newItemUnit: string;
  newItemCategory: string;
  newItemNotes: string;
}

export interface EditFormData {
  editName: string;
  editDescription: string;
}

export interface ExpandedState {
  isDetailsExpanded: boolean;
  isAddItemExpanded: boolean;
}

// 日付フォーマット用ヘルパー
export const formatDueDate = (dueDate: string | null | undefined): string | null => {
  if (!dueDate) return null;
  return format(new Date(dueDate), 'yyyy年M月d日(E)', { locale: ja });
};

// 進捗計算用ヘルパー
export const calculateProgress = (items: ShoppingItem[]): { completedItems: number; progress: number } => {
  const completedItems = items.filter(item => item.isChecked).length;
  const progress = items.length > 0 ? (completedItems / items.length) * 100 : 0;
  return { completedItems, progress };
};

// カテゴリー別グループ化用ヘルパー
export const groupItemsByCategory = (items: ShoppingItem[]): Record<string, ShoppingItem[]> => {
  const itemsByCategory: Record<string, ShoppingItem[]> = {};
  items.forEach(item => {
    const category = item.category || 'その他';
    if (!itemsByCategory[category]) {
      itemsByCategory[category] = [];
    }
    itemsByCategory[category].push(item);
  });
  return itemsByCategory;
};

// フォームデータの初期化
export const initializeShoppingFormData = (): ShoppingFormData => ({
  newItemName: '',
  newItemAmount: '',
  newItemUnit: '個',
  newItemCategory: 'その他',
  newItemNotes: ''
});

// 編集フォームデータの初期化
export const initializeEditFormData = (name: string, description?: string | null): EditFormData => ({
  editName: name,
  editDescription: description || ''
});

// フォームリセット用ヘルパー
export const resetShoppingForm = (setFormData: (data: ShoppingFormData) => void): void => {
  setFormData(initializeShoppingFormData());
};
