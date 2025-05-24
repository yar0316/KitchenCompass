import React from 'react';
import { Container, Box, Button } from '@mui/material';
import RecipeFormDialog from './RecipeFormDialog';
import RecipeDetails from './RecipeDetails';
import RecipePageHeader from './components/RecipePageHeader';
import RecipeSearchAndFilter from './components/RecipeSearchAndFilter';
import RecipeList from './components/RecipeList';
import { useRecipePage } from './hooks/useRecipePage';

const RecipePage: React.FC = () => {
  const {
    // State
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
    filteredRecipes,
    
    // Actions
    setSearchQuery,
    setSortOption,
    setTimeFilter,
    setIsDialogOpen,
    setSelectedRecipe,
    setPage,
    handleAddRecipe,
    handleUpdateRecipe,
    handleDeleteRecipe,
    handleSelectRecipe,
    handleClearFilters,
    handleTagToggle
  } = useRecipePage();

  return (
    <Container 
      maxWidth={false} 
      sx={{ 
        mt: 1, 
        mb: 4,
        px: { xs: 1, sm: 1.5, md: 2 }, 
        maxWidth: '100vw',
      }}
    >
      {!selectedRecipe && (
        <RecipePageHeader onAddRecipe={() => setIsDialogOpen(true)} />
      )}
      
      {!selectedRecipe && (
        <RecipeSearchAndFilter
          searchQuery={searchQuery}
          sortOption={sortOption}
          timeFilter={timeFilter}
          selectedTags={selectedTags}
          onSearchChange={setSearchQuery}
          onSortChange={setSortOption}
          onTimeFilterChange={setTimeFilter}
          onTagToggle={handleTagToggle}
        />
      )}

      {selectedRecipe ? (
        <Box sx={{ mb: 3 }}>
          <Button 
            variant="text"
            color="primary"
            onClick={() => setSelectedRecipe(null)}
          >
            ← 一覧に戻る
          </Button>
          
          <RecipeDetails 
            recipe={selectedRecipeDetails!}
            onDelete={handleDeleteRecipe}
            onUpdate={handleUpdateRecipe}
          />
        </Box>
      ) : (
        <RecipeList
          recipes={filteredRecipes}
          currentPageRecipes={currentPageRecipes}
          loading={loading}
          error={error}
          page={page}
          pageCount={pageCount}
          onRecipeSelect={handleSelectRecipe}
          onPageChange={setPage}
          onClearFilters={handleClearFilters}
        />
      )}
      
      {/* 新規レシピ作成ダイアログ */}
      <RecipeFormDialog
        open={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        onSave={handleAddRecipe}
      />
    </Container>
  );
};

export default RecipePage;