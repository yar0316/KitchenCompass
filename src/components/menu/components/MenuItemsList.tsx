import React from 'react';
import {
  Box,
  Typography,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
  TextField,
  Button,
  ClickAwayListener,
  Collapse
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import CheckIcon from '@mui/icons-material/Check';
import { MenuItem } from '../utils/menuPlanningUtils';
import { UI_TEXT } from '../constants/menuPlanningConstants';

interface MenuItemsListProps {
  menuItems: MenuItem[];
  currentEditingItem: MenuItem | null;
  editingItemId: string | null;
  tempItemName: string;
  outingInfo: { isOuting: boolean };
  inputRef: React.RefObject<HTMLInputElement | null>;
  onSelectMenuItem: (item: MenuItem) => void;
  onStartEditing: (item: MenuItem) => void;
  onFinishEditing: () => void;
  onDeleteMenuItem: (itemId: string) => void;
  onAddMenuItem: () => void;
  onTempItemNameChange: (value: string) => void;
}

const MenuItemsList: React.FC<MenuItemsListProps> = ({
  menuItems,
  currentEditingItem,
  editingItemId,
  tempItemName,
  outingInfo,
  inputRef,
  onSelectMenuItem,
  onStartEditing,
  onFinishEditing,
  onDeleteMenuItem,
  onAddMenuItem,
  onTempItemNameChange
}) => {
  return (
    <Collapse in={!outingInfo.isOuting}>
      <Box sx={{ mb: 2 }}>
        <Typography variant="subtitle2" gutterBottom>
          {UI_TEXT.menu.label}
        </Typography>

        <List
          sx={{
            bgcolor: 'background.paper',
            border: '1px solid',
            borderColor: 'divider',
            borderRadius: 1
          }}
        >
          {menuItems.map((item) => (            <ListItem
              key={item.id}
              disablePadding
              sx={{
                borderBottom: menuItems.indexOf(item) < menuItems.length - 1 ? '1px solid' : 'none',
                borderBottomColor: 'divider'
              }}
            >              {editingItemId === item.id ? (
                <ClickAwayListener onClickAway={onFinishEditing}>
                  <TextField
                    autoFocus
                    fullWidth
                    variant="standard"
                    value={tempItemName}
                    onChange={(e) => onTempItemNameChange(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        onFinishEditing();
                      }
                    }}
                    inputRef={inputRef}
                    placeholder={UI_TEXT.menu.placeholder}
                    InputProps={{
                      endAdornment: (
                        <IconButton size="small" onClick={onFinishEditing}>
                          <CheckIcon fontSize="small" />
                        </IconButton>
                      )
                    }}
                    sx={{ my: -0.5 }}
                  />
                </ClickAwayListener>
              ) : (
                <ListItemButton
                  selected={currentEditingItem?.id === item.id}
                  onClick={() => onSelectMenuItem(item)}
                  sx={{ py: 1 }}
                >
                  <ListItemText
                    primary={item.name || UI_TEXT.menu.notEntered}
                    primaryTypographyProps={{
                      color: item.name ? 'text.primary' : 'text.secondary',
                      fontStyle: item.name ? 'normal' : 'italic'
                    }}
                    secondary={item.recipeId ? UI_TEXT.menu.hasRecipe : undefined}
                    onClick={() => !item.name && onStartEditing(item)}
                  />
                  <ListItemSecondaryAction>
                    {!item.name && (
                      <IconButton
                        edge="end"
                        size="small"
                        onClick={() => onStartEditing(item)}
                        sx={{ mr: 1 }}
                      >
                        <EditIcon fontSize="small" />
                      </IconButton>
                    )}
                    {menuItems.length > 1 && (
                      <IconButton
                        edge="end"
                        size="small"
                        onClick={() => onDeleteMenuItem(item.id)}
                        sx={{ color: 'error.light' }}
                      >
                        <DeleteIcon fontSize="small" />
                      </IconButton>
                    )}
                  </ListItemSecondaryAction>
                </ListItemButton>
              )}
            </ListItem>
          ))}
        </List>

        <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 1 }}>
          <Button
            color="primary"
            startIcon={<AddIcon />}
            onClick={onAddMenuItem}
            size="small"
          >
            {UI_TEXT.menu.add}
          </Button>
        </Box>
      </Box>
    </Collapse>
  );
};

export default MenuItemsList;
