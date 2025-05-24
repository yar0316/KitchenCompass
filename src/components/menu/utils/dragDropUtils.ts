import { format } from 'date-fns';
import { ja } from 'date-fns/locale';

/**
 * ドラッグ＆ドロップ関連のユーティリティ関数
 */

/**
 * 月日と曜日の表示形式でフォーマット
 */
export const formatDate = (date: Date): string => {
  return format(date, 'M/d(E)', { locale: ja });
};

/**
 * 今日の日付かどうかをチェック
 */
export const isToday = (date: Date): boolean => {
  const today = new Date();
  return date.getDate() === today.getDate() && 
         date.getMonth() === today.getMonth() && 
         date.getFullYear() === today.getFullYear();
};

/**
 * 全ての献立アイテムのIDを生成（ドラッグ＆ドロップ用）
 */
export const generateAllMealIds = (days: Array<{ date: Date }>): string[] => {
  return days.flatMap(day => 
    ['breakfast', 'lunch', 'dinner'].map(mealType => 
      `${day.date.toISOString()}-${mealType}`
    )
  );
};

/**
 * ドラッグ可能なアイテムIDを検証
 */
export const isValidDragId = (id: string): boolean => {
  return typeof id === 'string' && (
    id.includes('item-') || 
    id.includes('drop-') ||
    /^\d{4}-\d{2}-\d{2}T.*-(breakfast|lunch|dinner)$/.test(id)
  );
};