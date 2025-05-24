import { useState } from 'react';
import { MenuItem } from '../utils/menuPlanningUtils';
import { DIALOG_CONFIG } from '../constants/menuPlanningConstants';

// Recipe type definition
type Recipe = {
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

export const useRecipeGeneration = () => {
  const [generatingRecipe, setGeneratingRecipe] = useState(false);
  const [selectedRecipe, setSelectedRecipe] = useState<Recipe | null>(null);

  const handleGenerateRecipe = (
    itemName: string, 
    onAddMenuItemFromRecipe: (recipe: { id: string; name: string }) => void
  ) => {
    setGeneratingRecipe(true);

    // シミュレートされたレシピ生成
    setTimeout(() => {
      const generatedRecipe = {
        id: `generated-${Date.now()}`,
        name: `${itemName}のレシピ`,
        cookingTime: Math.floor(Math.random() * 30) + 10,
        ingredients: ['材料1', '材料2', '材料3'],
        steps: ['手順1', '手順2', '手順3']
      };

      onAddMenuItemFromRecipe({
        id: generatedRecipe.id,
        name: generatedRecipe.name
      });

      setGeneratingRecipe(false);
    }, DIALOG_CONFIG.recipeGenerationDelay);
  };

  const handleUpdateMenuItemRecipe = (
    recipe: { id: string; name: string } | null,
    currentEditingItem: MenuItem | null,
    menuItems: MenuItem[],
    setMenuItems: (items: MenuItem[]) => void
  ) => {
    if (!currentEditingItem || !recipe) return;

    const updatedItems = menuItems.map(item => {
      if (item.id === currentEditingItem.id) {
        return {
          ...item,
          name: recipe.name,
          recipeId: recipe.id
        };
      }
      return item;
    });

    setMenuItems(updatedItems);
  };
  const handleSelectRecipe = (recipe: Recipe) => {
    setSelectedRecipe(recipe);
  };

  const findRecipeById = (recipeId: string | null, allRecipes: Recipe[]) => {
    if (!recipeId) return null;
    return allRecipes.find(r => r.id === recipeId) || null;
  };

  return {
    generatingRecipe,
    selectedRecipe,
    setSelectedRecipe,
    handleGenerateRecipe,
    handleUpdateMenuItemRecipe,
    handleSelectRecipe,
    findRecipeById
  };
};
