import React from 'react';
import {
  Box,
  Typography,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Checkbox,
  IconButton
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import { green } from '@mui/material/colors';
import { type ShoppingItem } from '../../../API';

interface CategoryGroupProps {
  category: string;
  items: ShoppingItem[];
  saveLoading: boolean;
  onToggleCheck: (item: ShoppingItem) => void;
  onDeleteItem: (itemId: string) => void;
}

const CategoryGroup: React.FC<CategoryGroupProps> = ({
  category,
  items,
  saveLoading,
  onToggleCheck,
  onDeleteItem
}) => {
  return (
    <Box sx={{ mb: 2 }}>
      <Typography
        variant="subtitle2"
        component="h3"
        sx={{ 
          px: 2, 
          pb: 0.5, 
          borderBottom: 1, 
          borderColor: 'divider',
          color: 'text.secondary'
        }}
      >
        {category}
      </Typography>
      
      <List dense disablePadding>
        {items.map((item) => (
          <ListItem
            key={item.id}
            secondaryAction={
              <IconButton 
                edge="end" 
                aria-label="delete"
                onClick={() => onDeleteItem(item.id)}
                size="small"
                disabled={saveLoading}
              >
                <DeleteIcon fontSize="small" />
              </IconButton>
            }
            sx={{
              borderBottom: '1px solid',
              borderColor: 'divider',
              opacity: item.isChecked ? 0.6 : 1,
              '&:hover': {
                bgcolor: 'action.hover'
              }
            }}
          >
            <ListItemIcon sx={{ minWidth: 32 }}>
              <Checkbox
                edge="start"
                checked={item.isChecked || false}
                onChange={() => onToggleCheck(item)}
                size="small"
                sx={{
                  '&.Mui-checked': {
                    color: green[600]
                  }
                }}
                disabled={saveLoading}
              />
            </ListItemIcon>
            
            <ListItemText
              primary={
                <Typography
                  variant="body2"
                  component="span"
                  sx={{
                    textDecoration: item.isChecked ? 'line-through' : 'none',
                    fontWeight: item.isChecked ? 'normal' : 'medium'
                  }}
                >
                  {item.name}
                </Typography>
              }
              secondary={
                <>
                  <Box component="span" sx={{ mr: 1 }}>
                    {item.amount} {item.unit}
                  </Box>
                  {item.notes && (
                    <Typography
                      component="span"
                      variant="caption"
                      color="text.secondary"
                      sx={{ fontStyle: 'italic' }}
                    >
                      {item.notes}
                    </Typography>
                  )}
                </>
              }
            />
          </ListItem>
        ))}
      </List>
    </Box>
  );
};

export default CategoryGroup;
