// レシピ関連のユーティリティ関数

import { Recipe } from '../../../API';

/**
 * レシピをソートする
 */
export const sortRecipes = (recipesToSort: Recipe[], option: string): Recipe[] => {
  switch (option) {
    case 'newest':
      return [...recipesToSort].sort((a, b) => 
        new Date((b.createdAt as string) || '').getTime() - new Date((a.createdAt as string) || '').getTime()
      );
    case 'oldest':
      return [...recipesToSort].sort((a, b) => 
        new Date((a.createdAt as string) || '').getTime() - new Date((b.createdAt as string) || '').getTime()
      );
    case 'name_asc':
      return [...recipesToSort].sort((a, b) => (a.name || '').localeCompare(b.name || ''));
    case 'name_desc':
      return [...recipesToSort].sort((a, b) => (b.name || '').localeCompare(a.name || ''));
    case 'cooking_time':
      return [...recipesToSort].sort((a, b) => (a.cookTime || 0) - (b.cookTime || 0));
    default:
      return recipesToSort;
  }
};

/**
 * レシピをフィルタリングする
 */
export const filterRecipes = (
  recipes: Recipe[],
  searchQuery: string,
  timeFilter: string,
  selectedTags: string[]
): Recipe[] => {
  let result = [...recipes];

  // 検索フィルター
  if (searchQuery) {
    const query = searchQuery.toLowerCase();
    result = result.filter(recipe => 
      (recipe.name?.toLowerCase().includes(query) || false) || 
      (recipe.description?.toLowerCase().includes(query) || false) ||
      (recipe.tags?.some((tag: string) => tag.toLowerCase().includes(query)) || false)
    );
  }

  // 調理時間フィルター
  if (timeFilter !== 'all') {
    switch (timeFilter) {
      case 'under15':
        result = result.filter(recipe => (recipe.cookTime || 0) <= 15);
        break;
      case 'under30':
        result = result.filter(recipe => (recipe.cookTime || 0) <= 30);
        break;
      case 'under60':
        result = result.filter(recipe => (recipe.cookTime || 0) <= 60);
        break;
      case 'over60':
        result = result.filter(recipe => (recipe.cookTime || 0) > 60);
        break;
    }
  }

  // タグフィルター
  if (selectedTags.length > 0) {
    result = result.filter(recipe => 
      recipe.tags?.some((tag: string) => selectedTags.includes(tag)) || false
    );
  }

  return result;
};

/**
 * DBから取得したレシピデータを表示用に変換する
 */
export const processRecipeData = (recipe: Recipe): Recipe | null => {
  if (!recipe) return null;
  
  try {
    // JSONデータのパース
    const ingredientsJson = recipe.ingredientsJson ? JSON.parse(recipe.ingredientsJson) : [];
    const instructionsJson = recipe.instructionsJson ? JSON.parse(recipe.instructionsJson) : [];
      // 処理されたレシピの返却
    return {
      ...recipe,
      // レシピに必要なプロパティのマッピング
      ingredients: ingredientsJson as Array<{ id: string; name: string; amount: string; unit: string }>,
      steps: instructionsJson as Array<{ id: string; description: string }>,
      // 表示用データ変換
      cookingTime: recipe.cookTime || 0,
      prepTime: recipe.prepTime || 0,
      tags: recipe.cuisine ? recipe.cuisine.split(',').map(tag => tag.trim()) : [],
      createdAt: recipe.createdAt || new Date().toISOString()
    };
  } catch (error) {
    console.error('レシピデータの解析エラー:', error);
    // エラーが発生しても他のレシピには影響しないよう、基本情報だけ設定したオブジェクトを返す
    return {
      ...recipe,
      ingredients: [] as Array<{ id: string; name: string; amount: string; unit: string }>,
      steps: [] as Array<{ id: string; description: string }>,
      cookingTime: recipe.cookTime || 0,
      prepTime: recipe.prepTime || 0,
      tags: recipe.cuisine ? recipe.cuisine.split(',').map(tag => tag.trim()) : [],
      createdAt: recipe.createdAt || new Date().toISOString()
    };
  }
};
