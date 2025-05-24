import { MEAL_TYPE_CONFIG, MealType } from '../constants/menuPlanningConstants';

// Recipe type definition
export type Recipe = {
  id: string;
  name: string;
  description?: string | null;
  cookingTime?: number | null;
  prepTime?: number | null;
  servings?: number | null;
  difficulty?: string | null;
  category?: string | null;
  tags?: string[] | null;
  owner?: string | null;
  createdAt?: string | null;
  updatedAt?: string | null;
};

// Types
export interface MenuItem {
  id: string;
  name: string;
  recipeId: string | null;
}

export interface OutingInfo {
  isOuting: boolean;
  restaurantName: string;
  notes: string;
}

export interface MenuPlanningDialogProps {
  open: boolean;
  onClose: () => void;
  onSave: (mealData: MealData) => void;
  date: Date | null;
  mealType: MealType | null;
  editingMeal: MealData | null;
}

export interface MealData {
  name: string;
  menuItems: MenuItem[];
  isOuting: boolean;
  restaurantName: string;
  notes: string;
}

// Utility functions
export const formatFullDate = (date: Date | null): string => {
  if (!date) return '';
  return `${date.getFullYear()}年${date.getMonth() + 1}月${date.getDate()}日`;
};

export const getMealTypeInfo = (mealType: MealType | null) => {
  if (!mealType || !MEAL_TYPE_CONFIG[mealType]) {
    return { label: '', icon: null };
  }
  const config = MEAL_TYPE_CONFIG[mealType];
  
  return {
    label: config.label,
    iconName: config.iconName
  };
};

export const createInitialMenuItem = (): MenuItem => ({
  id: `menu-${Date.now()}`,
  name: '',
  recipeId: null
});

export const createInitialOutingInfo = (): OutingInfo => ({
  isOuting: false,
  restaurantName: '',
  notes: ''
});

export const validateMealData = (
  menuItems: MenuItem[], 
  outingInfo: OutingInfo
): boolean => {
  if (outingInfo.isOuting) {
    return outingInfo.restaurantName.trim().length > 0;
  }
  return menuItems.some(item => item.name.trim().length > 0);
};

export const createMealData = (
  menuItems: MenuItem[],
  outingInfo: OutingInfo
): MealData => {
  const validMenuItems = menuItems.filter(item => item.name.trim());
  
  return {
    name: validMenuItems.length > 0 ? validMenuItems[0].name : '',
    menuItems: validMenuItems,
    isOuting: outingInfo.isOuting,
    restaurantName: outingInfo.isOuting ? outingInfo.restaurantName : '',
    notes: outingInfo.isOuting ? outingInfo.notes : ''
  };
};

export const filterRecipesByQuery = (recipes: Recipe[], query: string): Recipe[] => {
  if (!query) return recipes;
  
  const lowerQuery = query.toLowerCase();
  return recipes.filter(recipe =>
    (recipe.name || '').toLowerCase().includes(lowerQuery)
  );
};
