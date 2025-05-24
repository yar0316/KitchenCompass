import { useState, useEffect } from 'react';
import { generateClient } from 'aws-amplify/api';
import { listRecipes } from '../../../graphql/queries';
import { createRecipe, updateRecipe, deleteRecipe } from '../../../graphql/mutations';
import { Recipe, CreateRecipeInput, UpdateRecipeInput, DeleteRecipeInput } from '../../../API';
import { DUMMY_IMAGE_URL } from '../../../mock/recipeData';
import { sortRecipes, filterRecipes } from '../utils/recipeUtils';
import { ITEMS_PER_PAGE } from '../types/RecipePageTypes';

// APIクライアントの初期化
const client = generateClient();

// 拡張されたレシピ型（UI用）
type ProcessedRecipe = Omit<Recipe, 'description' | 'name' | 'imageUrl' | 'createdAt' | 'prepTime' | 'servings' | 'category'> & {
  cookingTime: number;
  tags: string[];
  ingredients?: any[];
  steps?: any[];
  description: string;
  name: string;
  imageUrl: string;
  createdAt: string;
  prepTime?: number;
  servings?: number;
  category?: string;
};

export const useRecipePage = () => {
  // State
  const [recipes, setRecipes] = useState<ProcessedRecipe[]>([]);
  const [filteredRecipes, setFilteredRecipes] = useState<ProcessedRecipe[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortOption, setSortOption] = useState('newest');
  const [timeFilter, setTimeFilter] = useState('all');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedRecipe, setSelectedRecipe] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // レシピデータの取得
  useEffect(() => {
    fetchRecipes();
  }, []);  // レシピのフィルタリングとソート
  useEffect(() => {
    const result = filterRecipes(recipes as any, searchQuery, timeFilter, selectedTags) as ProcessedRecipe[];
    
    const sortedResult = sortRecipes(result as any, sortOption) as ProcessedRecipe[];
    setFilteredRecipes(sortedResult);
    setPage(1);
  }, [recipes, searchQuery, sortOption, timeFilter, selectedTags]);

  // レシピデータの取得処理
  const fetchRecipes = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const response: any = await client.graphql({
        query: listRecipes
      });
      
      const recipeData = response.data.listRecipes.items;
        const processedRecipes = recipeData.map((recipe: Recipe) => {
        if (!recipe) return null;
        
        try {
          const ingredientsJson = recipe.ingredientsJson ? JSON.parse(recipe.ingredientsJson) : [];
          const instructionsJson = recipe.instructionsJson ? JSON.parse(recipe.instructionsJson) : [];
            return {
            ...recipe,            ingredients: ingredientsJson,
            steps: instructionsJson,
            cookingTime: recipe.cookTime || 0,
            prepTime: recipe.prepTime || undefined,
            tags: recipe.cuisine ? recipe.cuisine.split(',').map(tag => tag.trim()) : [],            createdAt: recipe.createdAt || new Date().toISOString(),            description: recipe.description || '',
            name: recipe.name || '',
            imageUrl: recipe.imageUrl || '',
            servings: recipe.servings || undefined,
            category: recipe.category || undefined
          } as ProcessedRecipe;
        } catch (error) {
          console.error('レシピデータの解析エラー:', error);return {
            ...recipe,            ingredients: [],
            steps: [],
            cookingTime: recipe.cookTime || 0,
            prepTime: recipe.prepTime || undefined,
            tags: recipe.cuisine ? recipe.cuisine.split(',').map(tag => tag.trim()) : [],
            createdAt: recipe.createdAt || new Date().toISOString(),            description: recipe.description || '',            name: recipe.name || '',
            imageUrl: recipe.imageUrl || '',
            servings: recipe.servings || undefined,
            category: recipe.category || undefined
          } as ProcessedRecipe;
        }
      }).filter(Boolean) as ProcessedRecipe[];
      
      setRecipes(processedRecipes);
      setLoading(false);
    } catch (err) {
      console.error('レシピデータ取得エラー:', err);
      setError('レシピの読み込み中にエラーが発生しました。');
      setLoading(false);
    }
  };

  // 新しいレシピの追加
  const handleAddRecipe = async (newRecipe: any) => {
    try {
      const ingredientsJson = JSON.stringify(newRecipe.ingredients || []);
      const instructionsJson = JSON.stringify(newRecipe.steps || []);
      const cuisine = (newRecipe.tags || []).join(',');
      
      const createInput: CreateRecipeInput = {
        name: newRecipe.name,
        description: newRecipe.description || '',
        prepTime: newRecipe.prepTime || 0,
        cookTime: newRecipe.cookingTime || 0,
        servings: newRecipe.servings || 2,
        category: newRecipe.category || 'other',
        cuisine: cuisine,
        imageUrl: newRecipe.imageUrl || DUMMY_IMAGE_URL,
        ingredientsJson: ingredientsJson,
        instructionsJson: instructionsJson,
        createdBy: 'user',
        favorite: false
      };
      
      const result: any = await client.graphql({
        query: createRecipe,
        variables: { input: createInput }
      });
      
      const createdRecipe = result.data.createRecipe;      const processedRecipe = {
        ...createdRecipe,        ingredients: newRecipe.ingredients || [],
        steps: newRecipe.steps || [],
        cookingTime: createdRecipe.cookTime || 0,
        tags: createdRecipe.cuisine ? createdRecipe.cuisine.split(',').map((tag: string) => tag.trim()) : [],
        description: createdRecipe.description || '',
        name: createdRecipe.name || '',        imageUrl: createdRecipe.imageUrl || '',        createdAt: createdRecipe.createdAt || new Date().toISOString(),
        prepTime: createdRecipe.prepTime || undefined,
        servings: createdRecipe.servings || undefined,
        category: createdRecipe.category || undefined
      } as ProcessedRecipe;
      
      setRecipes([...recipes, processedRecipe]);
      setSelectedRecipe(createdRecipe.id);
    } catch (err) {
      console.error('レシピ作成エラー:', err);
      alert('レシピの保存中にエラーが発生しました。');
    }
  };

  // レシピの更新
  const handleUpdateRecipe = async (updatedRecipe: any) => {
    try {
      const ingredientsJson = JSON.stringify(updatedRecipe.ingredients || []);
      const instructionsJson = JSON.stringify(updatedRecipe.steps || []);
      const cuisine = (updatedRecipe.tags || []).join(',');
      
      const updateInput: UpdateRecipeInput = {
        id: updatedRecipe.id,
        name: updatedRecipe.name,
        description: updatedRecipe.description || '',
        prepTime: updatedRecipe.prepTime || 0,
        cookTime: updatedRecipe.cookingTime || 0,
        servings: updatedRecipe.servings || 2,
        category: updatedRecipe.category || 'other',
        cuisine: cuisine,
        imageUrl: updatedRecipe.imageUrl,
        ingredientsJson: ingredientsJson,
        instructionsJson: instructionsJson
      };
      
      const result: any = await client.graphql({
        query: updateRecipe,
        variables: { input: updateInput }
      });
      
      const updatedRecipeResult = result.data.updateRecipe;      const processedRecipe = {
        ...updatedRecipeResult,        ingredients: updatedRecipe.ingredients || [],
        steps: updatedRecipe.steps || [],
        cookingTime: updatedRecipeResult.cookTime || 0,
        tags: updatedRecipeResult.cuisine ? updatedRecipeResult.cuisine.split(',').map((tag: string) => tag.trim()) : [],
        description: updatedRecipeResult.description || '',
        name: updatedRecipeResult.name || '',        imageUrl: updatedRecipeResult.imageUrl || '',        createdAt: updatedRecipeResult.createdAt || new Date().toISOString(),
        prepTime: updatedRecipeResult.prepTime || undefined,
        servings: updatedRecipeResult.servings || undefined,
        category: updatedRecipeResult.category || undefined
      } as ProcessedRecipe;
      
      setRecipes(recipes.map(recipe => 
        recipe.id === updatedRecipe.id ? processedRecipe : recipe
      ));
    } catch (err) {
      console.error('レシピ更新エラー:', err);
      alert('レシピの更新中にエラーが発生しました。');
    }
  };

  // レシピの削除
  const handleDeleteRecipe = async (id: string) => {
    try {
      const deleteInput: DeleteRecipeInput = { id };
      
      await client.graphql({
        query: deleteRecipe,
        variables: { input: deleteInput }
      });
      
      setRecipes(recipes.filter(recipe => recipe.id !== id));
      
      if (selectedRecipe === id) {
        setSelectedRecipe(null);
      }
    } catch (err) {
      console.error('レシピ削除エラー:', err);
      alert('レシピの削除中にエラーが発生しました。');
    }
  };

  // レシピを選択
  const handleSelectRecipe = (id: string) => {
    setSelectedRecipe(id);
  };

  // フィルターのクリア
  const handleClearFilters = () => {
    setSearchQuery('');
    setTimeFilter('all');
    setSelectedTags([]);
  };

  // タグの選択/解除
  const handleTagToggle = (tag: string) => {
    if (selectedTags.includes(tag)) {
      setSelectedTags(selectedTags.filter(t => t !== tag));
    } else {
      setSelectedTags([...selectedTags, tag]);
    }
  };

  // ページネーション
  const pageCount = Math.ceil(filteredRecipes.length / ITEMS_PER_PAGE);
  const currentPageRecipes = filteredRecipes.slice(
    (page - 1) * ITEMS_PER_PAGE, 
    page * ITEMS_PER_PAGE
  );

  // 選択されたレシピの詳細
  const selectedRecipeDetails = selectedRecipe 
    ? recipes.find(recipe => recipe.id === selectedRecipe) 
    : null;

  return {
    // State
    recipes,
    filteredRecipes,
    currentPageRecipes,
    searchQuery,
    sortOption,
    timeFilter,
    selectedTags,
    isDialogOpen,
    selectedRecipe,
    selectedRecipeDetails,
    page,
    pageCount,
    loading,
    error,
    
    // Actions
    setSearchQuery,
    setSortOption,
    setTimeFilter,
    setSelectedTags,
    setIsDialogOpen,
    setSelectedRecipe,
    setPage,
    handleAddRecipe,
    handleUpdateRecipe,
    handleDeleteRecipe,
    handleSelectRecipe,
    handleClearFilters,
    handleTagToggle
  };
};

export default useRecipePage;
