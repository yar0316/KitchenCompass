import React from 'react';
import {
  Box,
  Typography,
  TextField,
  Button,
  Divider,
  Collapse
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import AddIcon from '@mui/icons-material/Add';
import { MenuItem } from '../utils/menuPlanningUtils';
import { UI_TEXT, DIALOG_CONFIG } from '../constants/menuPlanningConstants';

interface RecipeSelectorProps {
  currentEditingItem: MenuItem | null;
  searchQuery: string;
  filteredRecipes: any[];
  loadingRecipes: boolean;
  outingInfo: { isOuting: boolean };
  onSearchQueryChange: (value: string) => void;
  onAddMenuItemFromRecipe: (recipe: { id: string; name: string }) => void;
}

const RecipeSelector: React.FC<RecipeSelectorProps> = ({
  currentEditingItem,
  searchQuery,
  filteredRecipes,
  loadingRecipes,
  outingInfo,
  onSearchQueryChange,
  onAddMenuItemFromRecipe
}) => {
  if (!currentEditingItem) return null;

  return (
    <Collapse in={!outingInfo.isOuting}>
      <Divider sx={{ my: 2 }} />

      <Box sx={{ mb: 3 }}>
        <Typography variant="subtitle2" gutterBottom>
          {UI_TEXT.recipe.searchLabel}
        </Typography>

        <TextField
          margin="dense"
          label={UI_TEXT.recipe.searchPlaceholder}
          fullWidth
          variant="outlined"
          value={searchQuery}
          onChange={(e) => onSearchQueryChange(e.target.value)}
          InputProps={{
            endAdornment: <SearchIcon color="action" />
          }}
          sx={{ mb: 2 }}
          disabled={outingInfo.isOuting}
        />

        <Box sx={{ maxHeight: DIALOG_CONFIG.maxRecipeListHeight, overflow: 'auto', mb: 2 }}>
          {loadingRecipes ? (
            <Typography variant="body2" color="text.secondary" align="center" sx={{ py: 2 }}>
              {UI_TEXT.recipe.loading}
            </Typography>
          ) : filteredRecipes.length > 0 ? (
            filteredRecipes.map((recipe) => (
              <Box
                key={recipe.id}
                sx={{
                  p: 1.5,
                  borderRadius: 1,
                  mb: 1,
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  cursor: 'pointer',
                  border: '1px solid',
                  borderColor: 'grey.300',
                  bgcolor: 'background.paper',
                  '&:hover': {
                    bgcolor: 'grey.50',
                  }
                }}
              >
                <Box>
                  <Typography variant="body1">{recipe.name}</Typography>
                  <Typography variant="caption" color="text.secondary">
                    {UI_TEXT.recipe.cookingTime}: {recipe.cookingTime}分
                  </Typography>
                </Box>
                <Button
                  variant="outlined"
                  size="small"
                  startIcon={<AddIcon />}
                  onClick={() => onAddMenuItemFromRecipe(recipe)}
                >
                  {UI_TEXT.recipe.add}
                </Button>
              </Box>
            ))
          ) : (
            <Typography variant="body2" color="text.secondary" align="center" sx={{ py: 2 }}>
              {UI_TEXT.recipe.notFound}
            </Typography>
          )}
        </Box>
      </Box>
    </Collapse>
  );
};

export default RecipeSelector;
