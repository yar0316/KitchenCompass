export type ViewUnit = 'day' | 'threeDay' | 'week';

export interface MealData {
  id: string;
  type: 'breakfast' | 'lunch' | 'dinner';
  name: string;
  recipeId?: string | null;
  menuItems: MenuItemData[];
  mealType: 'breakfast' | 'lunch' | 'dinner';
  isOuting?: boolean;
  isOutside?: boolean;
  outsideLocation?: string;
  restaurantName?: string;
}

export interface MenuItemData {
  id: string;
  name: string;
  recipeId?: string | null;
  category?: string;
  description?: string;
  calories?: number;
  protein?: number;
  carbs?: number;
  fat?: number;
  order?: number;
}

export interface DayData {
  id: string;
  date: Date;
  meals: MealData[];
}

export interface WeekData {
  id: string;
  startDate: Date;
  days: DayData[];
}

export interface MenuPlans {
  currentWeek: WeekData;
  nextWeek: WeekData;
  previousWeek?: WeekData;
}

export interface TemplateData {
  id: string;
  name: string;
  days: DayData[];
}

export interface Template {
  id: string;
  name: string;
  description?: string;
  days: Array<{
    meals: Array<{
      mealType: 'breakfast' | 'lunch' | 'dinner';
      menuItems: Array<{
        name: string;
        recipeId?: string;
      }>;
    }>;
  }>;
}

export interface SnackbarState {
  open: boolean;
  message: string;
  severity: 'success' | 'error' | 'warning' | 'info';
}