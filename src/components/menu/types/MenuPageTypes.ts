import { MenuItemData } from '../types/Menu.types';

/**
 * MenuPlanningDialogから受け取るデータの型
 */
export interface DialogMealData {
  name: string;
  menuItems: MenuItemData[];
  isOuting?: boolean;
  restaurantName?: string;
  notes?: string;
  recipeId?: string | null;
}

/**
 * MenuPageの状態管理に関する型定義
 */
export interface MenuPageState {
  viewUnit: 'day' | 'threeDay' | 'week';
  viewStartDate: Date;
  isDialogOpen: boolean;
  selectedDate: Date | null;
  selectedMealType: 'breakfast' | 'lunch' | 'dinner' | null;
  editingMeal: MenuItemData | null;
  isTemplateDialogOpen: boolean;
  selectedTemplateId: string | null;
  templateDialogTab: number;
  newTemplateName: string;
  newTemplateDescription: string;
  isRecipeDialogOpen: boolean;
  selectedRecipeId: string | null;
  isLoading: boolean;
}

/**
 * テンプレート処理に関する型
 */
export interface TemplateOperations {
  handleApplyTemplate: (templateId: string) => Promise<void>;
  handleDeleteTemplate: (templateId: string) => Promise<void>;
  handleSaveNewTemplate: () => Promise<void>;
}

/**
 * MenuPage関連のプロパティ型
 */
export interface MenuPageProps {
  className?: string;
}
