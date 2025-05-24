import React from 'react';
import {
  Box,
  Typography,
  Button,
  Alert,
  CircularProgress,
  Pagination
} from '@mui/material';
import RecipeItem from '../RecipeItem';
import { RecipeListProps } from '../types/RecipePageTypes';

const RecipeList: React.FC<RecipeListProps> = ({
  recipes,
  currentPageRecipes,
  loading,
  error,
  page,
  pageCount,
  onRecipeSelect,
  onPageChange,
  onClearFilters
}) => {
  const handleChangePage = (_event: React.ChangeEvent<unknown>, value: number) => {
    onPageChange(value);
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Alert severity="error" sx={{ mb: 2 }}>
        {error}
      </Alert>
    );
  }

  return (
    <>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
        {recipes.length} 件のレシピが見つかりました
      </Typography>
        <Box 
        sx={{ 
          display: 'flex',
          flexWrap: 'wrap',
          gap: 2,
          justifyContent: 'flex-start',
          mx: -1,
        }}
      >
        {currentPageRecipes.length > 0 ? (
          currentPageRecipes.map((recipe) => (
            <Box 
              key={recipe.id}
              sx={{
                width: {
                  xs: '100%',
                  sm: 'calc(50% - 8px)',
                  md: 'calc(33.333% - 10.667px)',
                  lg: 'calc(25% - 12px)',
                  xl: 'calc(20% - 12.8px)'
                },
                display: 'flex',
                justifyContent: 'center',
              }}
            >
              <Box 
                sx={{ 
                  width: '100%',
                  maxWidth: { 
                    xs: '100%', 
                    sm: '340px',
                    md: '320px',
                    lg: '320px',
                    xl: '340px'
                  },
                }}
              >                <RecipeItem 
                  recipe={recipe} 
                  onClick={() => onRecipeSelect(recipe.id)} 
                />
              </Box>
            </Box>
          ))
        ) : (
          <Box sx={{ width: '100%' }}>
            <Box sx={{ 
              py: 5,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
            }}>
              <Typography variant="h6" color="text.secondary" gutterBottom>
                レシピが見つかりません
              </Typography>
              <Typography color="text.secondary" align="center" sx={{ mb: 2 }}>
                検索条件に合うレシピがありません。<br />
                別のキーワードで検索するか、フィルターを変更してください。
              </Typography>              <Button 
                variant="outlined" 
                onClick={onClearFilters}
              >
                フィルターをクリア
              </Button>
            </Box>
          </Box>
        )}
      </Box>
      
      {/* ページネーション */}
      {pageCount > 1 && (
        <Box sx={{ 
          display: 'flex', 
          justifyContent: 'center',
          mt: 4
        }}>
          <Pagination 
            count={pageCount} 
            page={page} 
            onChange={handleChangePage}
            color="primary"
          />
        </Box>
      )}
    </>
  );
};

export default RecipeList;
