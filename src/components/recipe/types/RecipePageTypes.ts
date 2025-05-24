// RecipePage関連の型定義

import { Recipe } from '../../../API';

export interface RecipePageState {
  recipes: Recipe[];
  filteredRecipes: Recipe[];
  searchQuery: string;
  sortOption: string;
  timeFilter: string;
  selectedTags: string[];
  isDialogOpen: boolean;
  selectedRecipe: string | null;
  page: number;
  loading: boolean;
  error: string | null;
}

export interface FilterOption {
  value: string;
  label: string;
}

export interface SortOption {
  value: string;
  label: string;
}

export interface RecipeSearchAndFilterProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  sortOption: string;
  onSortChange: (option: string) => void;
  timeFilter: string;
  onTimeFilterChange: (filter: string) => void;
  selectedTags: string[];
  onTagToggle: (tag: string) => void;
}

export interface RecipeListProps {
  recipes: Recipe[];
  currentPageRecipes: Recipe[];
  loading: boolean;
  error: string | null;
  page: number;
  pageCount: number;
  onPageChange: (page: number) => void;
  onRecipeSelect: (id: string) => void;
  onClearFilters: () => void;
}

export interface RecipePageHeaderProps {
  onAddRecipe: () => void;
}

// 定数
export const FILTER_OPTIONS = {
  cookingTime: [
    { value: 'all', label: 'すべて' },
    { value: 'under15', label: '15分以内' },
    { value: 'under30', label: '30分以内' },
    { value: 'under60', label: '60分以内' },
    { value: 'over60', label: '60分以上' }
  ],
  tags: ['和食', 'イタリアン', '中華', 'サラダ', 'スープ', '肉料理', '魚料理', 'デザート', 'ベジタリアン', '朝食', 'ヘルシー', '定番']
};

export const SORT_OPTIONS = [
  { value: 'newest', label: '新しい順' },
  { value: 'oldest', label: '古い順' },
  { value: 'name_asc', label: '名前昇順' },
  { value: 'name_desc', label: '名前降順' },
  { value: 'cooking_time', label: '調理時間が短い順' }
];

export const ITEMS_PER_PAGE = 8;
