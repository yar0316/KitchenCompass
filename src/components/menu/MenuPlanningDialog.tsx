import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Box,
  Typography,
  IconButton
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

// Local imports
import { useMenuPlanning } from './hooks/useMenuPlanning';
import { useRecipeGeneration } from './hooks/useRecipeGeneration';
import OutingForm from './components/OutingForm';
import MenuItemsList from './components/MenuItemsList';
import RecipeSelector from './components/RecipeSelector';
import MenuItemEditor from './components/MenuItemEditor';
import { 
  MenuPlanningDialogProps,
  formatFullDate,
  getMealTypeInfo,
  validateMealData,
  createMealData
} from './utils/menuPlanningUtils';
import { UI_TEXT, DIALOG_CONFIG } from './constants/menuPlanningConstants';

const MenuPlanningDialog: React.FC<MenuPlanningDialogProps> = ({
  open,
  onClose,
  onSave,
  date,
  mealType,
  editingMeal
}) => {
  // Custom hooks
  const menuPlanning = useMenuPlanning(open, editingMeal);
  const recipeGeneration = useRecipeGeneration();

  // Handle save with validation
  const handleSave = () => {
    if (menuPlanning.editingItemId) {
      menuPlanning.handleFinishEditing();
    }

    if (!validateMealData(menuPlanning.menuItems, menuPlanning.outingInfo)) {
      return;
    }

    const mealData = createMealData(menuPlanning.menuItems, menuPlanning.outingInfo);
    onSave(mealData);
  };

  // Handle outing info changes
  const handleOutingInfoChange = (field: keyof typeof menuPlanning.outingInfo, value: string) => {
    menuPlanning.handleOutingInfoChange(field, value);
  };

  // Handle recipe generation
  const handleGenerateRecipe = (itemName: string) => {
    recipeGeneration.handleGenerateRecipe(itemName, menuPlanning.handleAddMenuItemFromRecipe);
  };

  const mealTypeInfo = getMealTypeInfo(mealType);
  const dialogTitle = editingMeal ? UI_TEXT.dialog.edit : UI_TEXT.dialog.add;

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth={DIALOG_CONFIG.maxWidth}
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: DIALOG_CONFIG.borderRadius,
          overflow: 'hidden'
        }
      }}
    >
      <DialogTitle sx={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        mb: 0,
        py: 2
      }}>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          {mealTypeInfo.icon}
          <Typography variant="h6" component="span" sx={{ ml: 1 }}>
            {dialogTitle}
          </Typography>
        </Box>
        <IconButton edge="end" onClick={onClose}>
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent dividers>
        <Box sx={{ mb: 2 }}>
          <Typography variant="subtitle1" sx={{ mb: 1, fontWeight: 500 }}>
            {formatFullDate(date)} （{mealTypeInfo.label}）
          </Typography>
        </Box>

        <OutingForm
          outingInfo={menuPlanning.outingInfo}
          onOutingToggle={menuPlanning.handleOutingToggle}
          onOutingInfoChange={handleOutingInfoChange}
        />

        <MenuItemsList
          menuItems={menuPlanning.menuItems}
          currentEditingItem={menuPlanning.currentEditingItem}
          editingItemId={menuPlanning.editingItemId}
          tempItemName={menuPlanning.tempItemName}
          outingInfo={menuPlanning.outingInfo}
          inputRef={menuPlanning.inputRef}
          onSelectMenuItem={menuPlanning.handleSelectMenuItem}
          onStartEditing={menuPlanning.handleStartEditing}
          onFinishEditing={menuPlanning.handleFinishEditing}
          onDeleteMenuItem={menuPlanning.handleDeleteMenuItem}
          onAddMenuItem={menuPlanning.handleAddMenuItem}
          onTempItemNameChange={menuPlanning.setTempItemName}
        />

        <RecipeSelector
          currentEditingItem={menuPlanning.currentEditingItem}
          searchQuery={menuPlanning.searchQuery}
          filteredRecipes={menuPlanning.filteredRecipes}
          loadingRecipes={menuPlanning.loadingRecipes}
          outingInfo={menuPlanning.outingInfo}
          onSearchQueryChange={menuPlanning.setSearchQuery}
          onAddMenuItemFromRecipe={menuPlanning.handleAddMenuItemFromRecipe}
        />

        <MenuItemEditor
          currentEditingItem={menuPlanning.currentEditingItem}
          generatingRecipe={recipeGeneration.generatingRecipe}
          outingInfo={menuPlanning.outingInfo}
          onGenerateRecipe={handleGenerateRecipe}
        />
      </DialogContent>

      <DialogActions sx={{ px: 3, py: 2 }}>
        <Button onClick={onClose} color="inherit">
          {UI_TEXT.dialog.cancel}
        </Button>
        <Button
          onClick={handleSave}
          variant="contained"
          disabled={!validateMealData(menuPlanning.menuItems, menuPlanning.outingInfo)}
        >
          {UI_TEXT.dialog.save}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default MenuPlanningDialog;