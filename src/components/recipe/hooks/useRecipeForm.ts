import { useState, useEffect } from 'react';
import { RecipeFormData, Recipe } from '../types/RecipeFormTypes';
import { DUMMY_IMAGE_URL } from '../../../mock/recipeData';

/**
 * RecipeFormDialogの状態管理フック
 */
export const useRecipeForm = (editRecipe?: Recipe) => {
  const [formData, setFormData] = useState<RecipeFormData>({
    name: '',
    description: '',
    cookingTime: '30',
    prepTime: '10',
    servings: '2',
    category: 'main',
    tags: [],
    ingredients: [],
    steps: [],
    imagePreview: null,
    imageFile: null
  });

  const [tabValue, setTabValue] = useState(0);
  const [nameError, setNameError] = useState(false);

  // 編集モード判定
  const isEditMode = !!editRecipe;

  // 編集時のデータロード
  useEffect(() => {
    if (editRecipe) {
      setFormData({
        name: editRecipe.name || '',
        description: editRecipe.description || '',
        cookingTime: String(editRecipe.cookingTime || 30),
        prepTime: String(editRecipe.prepTime || 10),
        servings: String(editRecipe.servings || 2),
        category: editRecipe.category || 'main',
        tags: editRecipe.tags || [],
        ingredients: editRecipe.ingredients || [],
        steps: editRecipe.steps || [],
        imagePreview: editRecipe.imageUrl || editRecipe.imagePreview || null,
        imageFile: null
      });
    }
  }, [editRecipe]);

  // フォームのリセット
  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      cookingTime: '30',
      prepTime: '10',
      servings: '2',
      category: 'main',
      tags: [],
      ingredients: [],
      steps: [],
      imagePreview: null,
      imageFile: null
    });
    setNameError(false);
    setTabValue(0);
  };

  // フォームデータの部分更新
  const updateFormData = (updates: Partial<RecipeFormData>) => {
    setFormData(prev => ({ ...prev, ...updates }));
  };
  // 保存処理
  const handleSave = (onSave: (recipe: Recipe) => void, onClose: () => void) => {
    // 名前は必須
    if (!formData.name.trim()) {
      setNameError(true);
      return;
    }
      const recipe: Recipe = {
      ...(editRecipe?.id ? { id: editRecipe.id } : {}),
      name: formData.name.trim(),
      description: formData.description.trim(),
      cookingTime: formData.cookingTime,
      prepTime: formData.prepTime,
      servings: formData.servings,
      category: formData.category,
      tags: formData.tags,
      ingredients: formData.ingredients,
      steps: formData.steps,
      imageUrl: formData.imagePreview || DUMMY_IMAGE_URL,
      imageFile: formData.imageFile
    };
    
    onSave(recipe);
    resetForm();
    onClose();
  };

  return {
    formData,
    updateFormData,
    tabValue,
    setTabValue,
    nameError,
    setNameError,
    isEditMode,
    resetForm,
    handleSave
  };
};
