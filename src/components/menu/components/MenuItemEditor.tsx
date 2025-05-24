import React from 'react';
import {
  Box,
  Alert,
  Button,
  CircularProgress,
  Collapse
} from '@mui/material';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import { MenuItem } from '../utils/menuPlanningUtils';
import { UI_TEXT } from '../constants/menuPlanningConstants';

interface MenuItemEditorProps {
  currentEditingItem: MenuItem | null;
  generatingRecipe: boolean;
  outingInfo: { isOuting: boolean };
  onGenerateRecipe: (itemName: string) => void;
}

const MenuItemEditor: React.FC<MenuItemEditorProps> = ({
  currentEditingItem,
  generatingRecipe,
  outingInfo,
  onGenerateRecipe
}) => {
  if (!currentEditingItem || outingInfo.isOuting) return null;

  const shouldShowGenerateOption = currentEditingItem.name && !currentEditingItem.recipeId;

  return (
    <Collapse in={!outingInfo.isOuting}>
      {shouldShowGenerateOption && (
        <Box sx={{ mt: 2 }}>
          <Alert
            severity="info"
            action={
              <Button
                color="inherit"
                size="small"
                onClick={() => onGenerateRecipe(currentEditingItem.name)}
                disabled={generatingRecipe}
                startIcon={generatingRecipe ? <CircularProgress size={16} /> : <AutoAwesomeIcon />}
              >
                {generatingRecipe ? UI_TEXT.recipe.generating : UI_TEXT.recipe.generate}
              </Button>
            }
          >
            「{currentEditingItem.name}」{UI_TEXT.recipe.generatePrompt}
          </Alert>
        </Box>
      )}
    </Collapse>
  );
};

export default MenuItemEditor;
