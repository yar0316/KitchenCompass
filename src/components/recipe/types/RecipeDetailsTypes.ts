// RecipeDetails関連の型定義

export interface RecipeIngredient {
  id: string;
  name: string;
  amount: string;
  unit: string;
}

export interface RecipeStep {
  id: string;
  description: string;
}

export interface RecipeDetailsData {
  id: string;
  name: string;
  description: string;
  imageUrl: string;
  cookingTime: number;
  prepTime?: number;
  servings?: number;
  category?: string;
  tags: string[];
  createdAt: string;
  ingredients?: RecipeIngredient[];
  steps?: RecipeStep[];
}

export interface RecipeDetailsProps {
  recipe?: RecipeDetailsData | null;
  open?: boolean; // ダイアログとして表示するかどうか
  onClose?: () => void; // ダイアログを閉じる関数
  onDelete?: (id: string) => void;
  onUpdate?: (updatedRecipe: RecipeDetailsData) => void;
}

export interface RecipeHeaderProps {
  recipe: RecipeDetailsData;
  onEdit: () => void;
  onDelete: () => void;
  onFavoriteToggle: () => void;
  isFavorite: boolean;
}

export interface RecipeInfoProps {
  recipe: RecipeDetailsData;
}

export interface RecipeIngredientsProps {
  ingredients: RecipeIngredient[];
  servings?: number;
}

export interface RecipeStepsProps {
  steps: RecipeStep[];
}

// カテゴリに対応するラベル
export const CATEGORY_LABELS: Record<string, string> = {
  main: 'メイン料理',
  side: '副菜',
  soup: 'スープ・汁物',
  salad: 'サラダ',
  rice: 'ご飯もの',
  noodle: '麺類',
  dessert: 'デザート',
  breakfast: '朝食',
  other: 'その他'
};
