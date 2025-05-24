import React from 'react';
import {
  Box,
  Typography,
  Paper,
  Dialog,
  DialogContent
} from '@mui/material';
import RecipeFormDialog from './RecipeFormDialog';
import RecipeImageHeader from './components/RecipeImageHeader';
import RecipeActions from './components/RecipeActions';
import SectionNavigation from './components/SectionNavigation';
import RecipeIngredients from './components/RecipeIngredients';
import RecipeSteps from './components/RecipeSteps';
import RecipeMetadata from './components/RecipeMetadata';
import DeleteConfirmDialog from './components/DeleteConfirmDialog';
import RecipeNotFound from './components/RecipeNotFound';
import { useRecipeDetails } from './hooks/useRecipeDetails';
import { RecipeDetailsProps, RecipeDetailsData } from './types/RecipeDetailsTypes';
import { Recipe } from './types/RecipeFormTypes';

// 型変換ヘルパー関数
const convertToRecipeFormData = (recipe: RecipeDetailsData): Recipe => {
  return {
    id: recipe.id,
    name: recipe.name || '',
    description: recipe.description || '',
    cookingTime: recipe.cookingTime?.toString() || '0',
    prepTime: recipe.prepTime?.toString() || '0',
    servings: recipe.servings?.toString() || '2',
    category: recipe.category || '',
    tags: recipe.tags || [],
    ingredients: recipe.ingredients || [],
    steps: recipe.steps || [],
    imageUrl: recipe.imageUrl || null,
    imagePreview: null,
    imageFile: null
  };
};

const RecipeDetails: React.FC<RecipeDetailsProps> = ({ 
  recipe, 
  open = false,
  onClose,
  onDelete, 
  onUpdate 
}) => {
  const {
    isFavorite,
    deleteDialogOpen,
    editDialogOpen,
    activeSection,
    handleToggleFavorite,
    handleOpenDeleteDialog,
    handleCloseDeleteDialog,
    handleOpenEditDialog,
    handleCloseEditDialog,
    handleSectionChange
  } = useRecipeDetails();

  // recipeがnullまたはundefinedの場合、エラーメッセージを表示
  if (!recipe) {
    return <RecipeNotFound isDialog={open} onClose={onClose} />;
  }
  
  const { id, name, description } = recipe;
  
  // レシピ更新処理
  const handleUpdateRecipe = (updatedRecipe: Recipe) => {
    if (onUpdate) {
      // RecipeFormのデータをRecipeDetailsの形式に変換
      const mergedRecipe = {
        ...recipe,
        name: updatedRecipe.name,
        description: updatedRecipe.description,
        cookingTime: parseInt(updatedRecipe.cookingTime) || recipe.cookingTime,
        prepTime: parseInt(updatedRecipe.prepTime) || recipe.prepTime,
        servings: parseInt(updatedRecipe.servings) || recipe.servings,
        category: updatedRecipe.category,
        tags: updatedRecipe.tags,
        ingredients: updatedRecipe.ingredients,
        steps: updatedRecipe.steps,
        imageUrl: recipe.imageUrl, // 画像URLは既存のものを保持
      };
      onUpdate(mergedRecipe);
    }
    handleCloseEditDialog();
  };

  // レシピの削除
  const handleDelete = () => {
    if (onDelete) {
      onDelete(id);
    }
    handleCloseDeleteDialog();
  };

  // ダイアログとして表示する場合
  if (open) {
    return (
      <Dialog
        open={open}
        onClose={onClose}
        maxWidth="md"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 2,
            overflow: 'hidden'
          }
        }}
      >
        <DialogContent sx={{ p: 0 }}>
          {/* ヘッダー部分 */}
          <RecipeImageHeader
            recipe={recipe}
            isDialog={true}
            onClose={onClose}
            isFavorite={isFavorite}
            onFavoriteToggle={handleToggleFavorite}
            onEdit={onUpdate ? handleOpenEditDialog : undefined}
            onDelete={onDelete ? handleOpenDeleteDialog : undefined}
          />
          
          {/* コンテンツ部分 */}
          <Box sx={{ p: 3 }}>
            {/* 説明文 */}
            <Typography variant="body1" sx={{ mb: 3 }}>
              {description}
            </Typography>
            
            {/* アクションボタン */}
            <RecipeActions
              isFavorite={isFavorite}
              onFavoriteToggle={handleToggleFavorite}
            />
            
            {/* セクションナビゲーション */}
            <SectionNavigation
              activeSection={activeSection}
              onSectionChange={handleSectionChange}
            />
            
            {/* 材料セクション */}
            {activeSection === 'ingredients' && (
              <RecipeIngredients
                ingredients={recipe.ingredients || []}
                servings={recipe.servings}
              />
            )}
            
            {/* 手順セクション */}
            {activeSection === 'steps' && (
              <RecipeSteps
                steps={recipe.steps || []}
              />
            )}
            
            {/* 作成情報 */}
            <RecipeMetadata createdAt={recipe.createdAt} />
          </Box>
        </DialogContent>
          {/* 削除確認ダイアログ */}
        <DeleteConfirmDialog
          open={deleteDialogOpen}
          recipeName={name}
          onClose={handleCloseDeleteDialog}
          onConfirm={handleDelete}
        />

        {/* 編集ダイアログ */}
        <RecipeFormDialog
          open={editDialogOpen}
          onClose={handleCloseEditDialog}
          onSave={handleUpdateRecipe}
          editRecipe={convertToRecipeFormData(recipe)}
        />
      </Dialog>
    );
  }
  // 通常のコンポーネントとして表示する場合
  return (
    <Box sx={{ mt: 2 }}>
      <Paper elevation={0} sx={{ overflow: 'hidden', borderRadius: 2 }}>
        {/* ヘッダー部分 */}
        <RecipeImageHeader
          recipe={recipe}
          isFavorite={isFavorite}
          onFavoriteToggle={handleToggleFavorite}
          onEdit={onUpdate ? handleOpenEditDialog : undefined}
          onDelete={onDelete ? handleOpenDeleteDialog : undefined}
        />
        
        {/* コンテンツ部分 */}
        <Box sx={{ p: 3 }}>
          {/* 説明文 */}
          <Typography variant="body1" sx={{ mb: 3 }}>
            {description}
          </Typography>
          
          {/* アクションボタン */}
          <RecipeActions
            isFavorite={isFavorite}
            onFavoriteToggle={handleToggleFavorite}
          />
          
          {/* セクションナビゲーション */}
          <SectionNavigation
            activeSection={activeSection}
            onSectionChange={handleSectionChange}
          />
          
          {/* 材料セクション */}
          {activeSection === 'ingredients' && (
            <RecipeIngredients
              ingredients={recipe.ingredients || []}
              servings={recipe.servings}
            />
          )}
          
          {/* 手順セクション */}
          {activeSection === 'steps' && (
            <RecipeSteps
              steps={recipe.steps || []}
            />
          )}
          
          {/* 作成情報 */}
          <RecipeMetadata createdAt={recipe.createdAt} />
        </Box>
      </Paper>
        {/* 削除確認ダイアログ */}
      <DeleteConfirmDialog
        open={deleteDialogOpen}
        recipeName={name}
        onClose={handleCloseDeleteDialog}
        onConfirm={handleDelete}
      />

      {/* 編集ダイアログ */}
      <RecipeFormDialog
        open={editDialogOpen}
        onClose={handleCloseEditDialog}
        onSave={handleUpdateRecipe}
        editRecipe={convertToRecipeFormData(recipe)}
      />
    </Box>
  );
};

export default RecipeDetails;