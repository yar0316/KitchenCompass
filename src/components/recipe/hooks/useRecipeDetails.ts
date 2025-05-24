import { useState } from 'react';

/**
 * レシピ詳細で使用する状態管理フック
 */
export const useRecipeDetails = () => {
  const [isFavorite, setIsFavorite] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [activeSection, setActiveSection] = useState<'ingredients' | 'steps'>('ingredients');

  const handleToggleFavorite = () => {
    setIsFavorite(!isFavorite);
  };

  const handleOpenDeleteDialog = () => {
    setDeleteDialogOpen(true);
  };

  const handleCloseDeleteDialog = () => {
    setDeleteDialogOpen(false);
  };

  const handleOpenEditDialog = () => {
    setEditDialogOpen(true);
  };

  const handleCloseEditDialog = () => {
    setEditDialogOpen(false);
  };

  const handleSectionChange = (section: 'ingredients' | 'steps') => {
    setActiveSection(section);
  };

  return {
    // 状態
    isFavorite,
    deleteDialogOpen,
    editDialogOpen,
    activeSection,
    
    // アクション
    handleToggleFavorite,
    handleOpenDeleteDialog,
    handleCloseDeleteDialog,
    handleOpenEditDialog,
    handleCloseEditDialog,
    handleSectionChange
  };
};
