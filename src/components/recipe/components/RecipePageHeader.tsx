import React from 'react';
import { Box, Typography, Button } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import { RecipePageHeaderProps } from '../types/RecipePageTypes';

const RecipePageHeader: React.FC<RecipePageHeaderProps> = ({
  onAddRecipe
}) => {
  return (
    <Box sx={{ 
      display: 'flex', 
      justifyContent: 'space-between', 
      alignItems: 'center', 
      mb: 2,
      mx: 0.5,
      width: 'auto'
    }}>
      <Typography variant="h5" component="h1">
        レシピ
      </Typography>
      <Button
        variant="contained"
        color="primary"
        startIcon={<AddIcon />}
        onClick={onAddRecipe}
      >
        新規レシピ
      </Button>
    </Box>
  );
};

export default RecipePageHeader;
