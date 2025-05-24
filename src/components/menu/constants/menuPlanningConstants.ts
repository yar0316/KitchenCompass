// Menu planning dialog constants and configurations

export const MEAL_TYPE_CONFIG = {
  breakfast: {
    label: '朝食',
    iconName: 'BreakfastDining'
  },
  lunch: {
    label: '昼食', 
    iconName: 'LunchDining'
  },
  dinner: {
    label: '夕食',
    iconName: 'DinnerDining'
  }
} as const;

export const DIALOG_CONFIG = {
  maxWidth: 'sm' as const,
  borderRadius: 2,
  maxRecipeListHeight: 300,
  inputFocusDelay: 100,
  recipeGenerationDelay: 2000
};

export const UI_TEXT = {
  dialog: {
    add: '献立の追加',
    edit: '献立の編集',
    cancel: 'キャンセル',
    save: '保存'
  },
  outing: {
    label: '外食',
    restaurantName: '店舗名',
    notes: 'メモ'
  },
  menu: {
    label: 'メニュー',
    add: 'メニューを追加',
    placeholder: 'メニュー名を入力',
    notEntered: '(未入力)',
    hasRecipe: 'レシピあり'
  },
  recipe: {
    searchLabel: 'レシピからメニューを追加',
    searchPlaceholder: 'レシピを検索',
    loading: '読み込み中...',
    notFound: 'レシピが見つかりません',
    cookingTime: '調理時間',
    add: '追加',
    generate: 'レシピ作成',
    generating: '作成中...',
    generatePrompt: 'のレシピを自動で作成しますか？'
  }
} as const;

export type MealType = keyof typeof MEAL_TYPE_CONFIG;
