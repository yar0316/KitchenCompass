// アイテムカテゴリーの選択肢
export const ITEM_CATEGORIES = [
  '野菜', '肉類', '魚介類', '乳製品', '調味料', '穀物', '飲料', '冷凍食品', '加工食品', '日用品', 'その他'
] as const;

// アイテムの単位選択肢
export const ITEM_UNITS = [
  'g', 'kg', 'ml', 'L', '個', '本', '袋', '箱', 'パック', '缶', '束', '尾', '切れ', '杯', 'その他'
] as const;

export type ItemCategory = typeof ITEM_CATEGORIES[number];
export type ItemUnit = typeof ITEM_UNITS[number];
