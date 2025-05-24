import React from 'react';
import {
  Box,
  Typography,
  CircularProgress
} from '@mui/material';
import { type ShoppingItem } from '../../../API';
import { groupItemsByCategory } from '../utils/shoppingUtils';
import CategoryGroup from './CategoryGroup';

interface ItemsListProps {
  items: ShoppingItem[];
  loading: boolean;
  saveLoading: boolean;
  onToggleCheck: (item: ShoppingItem) => void;
  onDeleteItem: (itemId: string) => void;
}

const ItemsList: React.FC<ItemsListProps> = ({
  items,
  loading,
  saveLoading,
  onToggleCheck,
  onDeleteItem
}) => {
  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', my: 3 }}>
        <CircularProgress />
      </Box>
    );
  }

  const itemsByCategory = groupItemsByCategory(items);

  if (Object.keys(itemsByCategory).length === 0) {
    return (
      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center',
        height: '100%',
        p: 3
      }}>
        <Typography color="textSecondary" align="center">
          アイテムがありません。<br />
          新しいアイテムを追加してください。
        </Typography>
      </Box>
    );
  }

  return (
    <>
      {Object.entries(itemsByCategory).map(([category, categoryItems]) => (
        <CategoryGroup
          key={category}
          category={category}
          items={categoryItems}
          saveLoading={saveLoading}
          onToggleCheck={onToggleCheck}
          onDeleteItem={onDeleteItem}
        />
      ))}
    </>
  );
};

export default ItemsList;
