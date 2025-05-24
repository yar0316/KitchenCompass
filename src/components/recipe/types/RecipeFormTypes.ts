// RecipeFormDialog関連の型定義

export interface Ingredient {
  id: string;
  name: string;
  amount: string;
  unit: string;
}

export interface Step {
  id: string;
  description: string;
}

export interface Recipe {
  id?: string;
  name: string;
  description: string;
  cookingTime: string;
  prepTime: string;
  servings: string;
  category: string;
  tags: string[];
  ingredients: Ingredient[];
  steps: Step[];
  imageUrl?: string | null;
  imagePreview?: string | null;
  imageFile?: File | null;
}

export interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

export interface RecipeFormData {
  name: string;
  description: string;
  cookingTime: string;
  prepTime: string;
  servings: string;
  category: string;
  tags: string[];
  ingredients: Ingredient[];
  steps: Step[];
  imagePreview: string | null;
  imageFile: File | null;
}

export interface RecipeFormDialogProps {
  open: boolean;
  onClose: () => void;
  onSave: (recipe: Recipe) => void;
  editRecipe?: Recipe;
}

export interface BasicInfoTabProps {
  formData: RecipeFormData;
  onFormDataChange: (updates: Partial<RecipeFormData>) => void;
  nameError: boolean;
  onNameErrorChange: (error: boolean) => void;
  isEditMode: boolean;
}

export interface IngredientsTabProps {
  ingredients: Ingredient[];
  onIngredientsChange: (ingredients: Ingredient[]) => void;
  servings: string;
}

export interface StepsTabProps {
  steps: Step[];
  onStepsChange: (steps: Step[]) => void;
}

// カテゴリの選択肢
export const CATEGORY_OPTIONS = [
  { value: 'main', label: 'メイン料理' },
  { value: 'side', label: '副菜' },
  { value: 'soup', label: 'スープ・汁物' },
  { value: 'salad', label: 'サラダ' },
  { value: 'rice', label: 'ご飯もの' },
  { value: 'noodle', label: '麺類' },
  { value: 'dessert', label: 'デザート' },
  { value: 'breakfast', label: '朝食' },
  { value: 'other', label: 'その他' }
];

// 分量の単位選択肢
export const UNIT_OPTIONS = [
  { value: '', label: '個数・その他' },
  { value: 'g', label: 'g（グラム）' },
  { value: 'ml', label: 'ml（ミリリットル）' },
  { value: 'tbsp', label: '大さじ' },
  { value: 'tsp', label: '小さじ' },
  { value: 'cup', label: 'カップ' }
];

// 既存のタグ一覧
export const EXISTING_TAGS = [
  '和食', 'イタリアン', '中華', 'サラダ', 'スープ', '肉料理', '魚料理', 
  'デザート', 'ベジタリアン', '朝食', 'ヘルシー', '定番', '簡単', 
  '時短', 'おもてなし', '作り置き', 'お弁当'
];
