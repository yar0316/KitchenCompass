import React, { useState, useEffect, useRef } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Box,
  Typography,
  FormControlLabel,
  Switch,
  Collapse,
  Alert,
  CircularProgress,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
  Divider,
  ClickAwayListener
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import SearchIcon from '@mui/icons-material/Search';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import RestaurantIcon from '@mui/icons-material/Restaurant';
import BreakfastDiningIcon from '@mui/icons-material/BreakfastDining';
import LunchDiningIcon from '@mui/icons-material/LunchDining';
import DinnerDiningIcon from '@mui/icons-material/DinnerDining';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import CheckIcon from '@mui/icons-material/Check';
import { generateClient } from 'aws-amplify/api';
import { Schema } from '../../../amplify/data/resource';
import { MealData, MenuItemData } from './types/Menu.types';

const client = generateClient<Schema>();

// MenuItem は MenuItemData として統一
type MenuItem = MenuItemData;

interface MenuPlanningDialogProps {
  open: boolean;
  onClose: () => void;
  onSave: (mealData: MealData) => void;
  date: Date | null;
  mealType: 'breakfast' | 'lunch' | 'dinner' | null;
  editingMeal: MealData | null;
}

interface OutingInfo {
  isOuting: boolean;
  restaurantName: string;
  notes: string;
}

const MenuPlanningDialog: React.FC<MenuPlanningDialogProps> = ({
  open,
  onClose,
  onSave,
  date,
  mealType,
  editingMeal
}) => {  const [menuItems, setMenuItems] = useState<MenuItem[]>([
    { 
      id: `menu-${Date.now()}`, 
      name: '', 
      recipeId: null,
      mealType: 'breakfast',
      isOutside: false,
      outsideLocation: '',
      notes: ''
    }
  ]);
  const [currentEditingItem, setCurrentEditingItem] = useState<MenuItem | null>(null);
  const [editingItemId, setEditingItemId] = useState<string | null>(null);
  const [tempItemName, setTempItemName] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);
  // TODO: 将来的にレシピ選択機能を実装時に有効化
  // const [selectedRecipe, setSelectedRecipe] = useState<Schema['Recipe']['type'] | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [allRecipes, setAllRecipes] = useState<Schema['Recipe']['type'][]>([]);
  const [filteredRecipes, setFilteredRecipes] = useState<Schema['Recipe']['type'][]>([]);
  const [loadingRecipes, setLoadingRecipes] = useState(false);

  const [generatingRecipe, setGeneratingRecipe] = useState(false);

  const [outingInfo, setOutingInfo] = useState<OutingInfo>({
    isOuting: false,
    restaurantName: '',
    notes: ''
  });
  const handleAddMenuItem = () => {
    const newItem = {
      id: `menu-${Date.now()}`,
      name: '',
      recipeId: null,
      mealType: mealType || 'breakfast',
      isOutside: false,
      outsideLocation: '',
      notes: ''
    };
    setMenuItems([...menuItems, newItem]);
    setCurrentEditingItem(newItem);
    // setSelectedRecipe(null);

    setEditingItemId(newItem.id);
    setTempItemName('');
    setTimeout(() => {
      if (inputRef.current) {
        inputRef.current.focus();
      }
    }, 100);
  };
  const handleAddMenuItemFromRecipe = (recipe: { id: string; name: string }) => {
    if (!recipe) return;

    const newItem = {
      id: `menu-${Date.now()}`,
      name: recipe.name,
      recipeId: recipe.id,
      mealType: mealType || 'breakfast',
      isOutside: false,
      outsideLocation: '',
      notes: ''
    };

    const updatedItems = [...menuItems, newItem];
    setMenuItems(updatedItems);
    setCurrentEditingItem(newItem);
    // setSelectedRecipe(recipe);
  };

  const handleDeleteMenuItem = (itemId: string) => {
    if (menuItems.length <= 1) {
      return;
    }

    const updatedItems = menuItems.filter(item => item.id !== itemId);
    setMenuItems(updatedItems);    if (currentEditingItem && currentEditingItem.id === itemId) {
      setCurrentEditingItem(updatedItems[0] || null);

      // TODO: 将来的にレシピ選択機能を実装時に有効化
      /*
      if (updatedItems[0]) {
        const recipe = updatedItems[0].recipeId
          ? allRecipes.find(r => r.id === updatedItems[0].recipeId) || null
          : null;
        setSelectedRecipe(recipe);
      }
      */
    }

    if (editingItemId === itemId) {
      setEditingItemId(null);
    }
  };
  const handleSelectMenuItem = (item: MenuItem) => {
    setCurrentEditingItem(item);
    
    // TODO: 将来的にレシピ選択機能を実装時に有効化
    /*
    if (item.recipeId) {
      const recipe = allRecipes.find(r => r.id === item.recipeId);
      setSelectedRecipe(recipe || null);
    } else {
      setSelectedRecipe(null);
    }
    */
  };

  const handleStartEditing = (item: MenuItem) => {
    setEditingItemId(item.id);
    setTempItemName(item.name);
    setCurrentEditingItem(item);
    setTimeout(() => {
      if (inputRef.current) {
        inputRef.current.focus();
      }
    }, 100);
  };

  const handleFinishEditing = () => {
    if (editingItemId) {
      const updatedItems = menuItems.map(item => {
        if (item.id === editingItemId) {
          return {
            ...item,
            name: tempItemName.trim() || item.name,
          };
        }
        return item;
      });
      setMenuItems(updatedItems);
      setEditingItemId(null);
    }
  };

  const formatFullDate = (date: Date | null) => {
    if (!date) return '';
    return `${date.getFullYear()}年${date.getMonth() + 1}月${date.getDate()}日`;
  };

  const getMealTypeInfo = () => {
    switch (mealType) {
      case 'breakfast':
        return { label: '朝食', icon: <BreakfastDiningIcon color="primary" /> };
      case 'lunch':
        return { label: '昼食', icon: <LunchDiningIcon color="primary" /> };
      case 'dinner':
        return { label: '夕食', icon: <DinnerDiningIcon color="primary" /> };
      default:
        return { label: '', icon: null };
    }
  };

  const handleGenerateRecipe = (itemName: string) => {
    if (!currentEditingItem) return;

    setGeneratingRecipe(true);

    setTimeout(() => {
      const generatedRecipe = {
        id: `generated-${Date.now()}`,
        name: `${itemName}のレシピ`,
        cookingTime: Math.floor(Math.random() * 30) + 10,
        ingredients: ['材料1', '材料2', '材料3'],
        steps: ['手順1', '手順2', '手順3']
      };

      handleAddMenuItemFromRecipe({
        id: generatedRecipe.id,
        name: generatedRecipe.name
      });

      setGeneratingRecipe(false);
    }, 2000);
  };
  // TODO: 将来的にレシピとメニューアイテムの関連付け機能を実装時に有効化
  /*
  const handleUpdateMenuItemRecipe = (recipe: { id: string; name: string } | null) => {
    if (!currentEditingItem || !recipe) return;

    const updatedItems = menuItems.map(item => {
      if (item.id === currentEditingItem.id) {
        return {
          ...item,
          name: recipe.name,
          recipeId: recipe.id
        };
      }
      return item;
    });

    setMenuItems(updatedItems);
  };
  */

  useEffect(() => {
    if (open) {
      setLoadingRecipes(true);
      client.models.Recipe.list({})
        .then(res => {
          setAllRecipes(res.data || []);
          setFilteredRecipes(res.data || []);
        })
        .finally(() => setLoadingRecipes(false));
    }
  }, [open]);

  useEffect(() => {
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      const results = allRecipes.filter(recipe =>
        (recipe.name || '').toLowerCase().includes(query)
      );
      setFilteredRecipes(results);
    } else {
      setFilteredRecipes(allRecipes);
    }
  }, [searchQuery, allRecipes]);

  useEffect(() => {
    if (open && editingMeal) {
      if (editingMeal.menuItems && Array.isArray(editingMeal.menuItems) && editingMeal.menuItems.length > 0) {        setMenuItems(editingMeal.menuItems);
        setCurrentEditingItem(editingMeal.menuItems[0]);
        
        // TODO: 将来的にレシピ選択機能を実装時に有効化
        /*
        const firstItem = editingMeal.menuItems[0];
        if (firstItem.recipeId) {
          const recipe = allRecipes.find(r => r.id === firstItem.recipeId);
          setSelectedRecipe(recipe || null);
        } else {
          setSelectedRecipe(null);
        }
        */
      } else {        const initialItem = {
          id: `menu-${Date.now()}`,
          name: editingMeal.name || '',
          recipeId: editingMeal.recipeId || null,
          mealType: mealType || 'breakfast',
          isOutside: false,
          outsideLocation: '',
          notes: ''
        };
        setMenuItems([initialItem]);
        setCurrentEditingItem(initialItem);
        
        // TODO: 将来的にレシピ選択機能を実装時に有効化
        /*
        if (editingMeal.recipeId) {
          const recipe = allRecipes.find(r => r.id === editingMeal.recipeId);
          setSelectedRecipe(recipe || null);
        } else {
          setSelectedRecipe(null);
        }
        */
      }      if (editingMeal.isOuting) {
        setOutingInfo({
          isOuting: true,
          restaurantName: editingMeal.restaurantName || '',
          notes: ''
        });
      } else {
        setOutingInfo({
          isOuting: false,
          restaurantName: '',
          notes: ''
        });
      }} else {
      const initialItem = { 
        id: `menu-${Date.now()}`, 
        name: '', 
        recipeId: null,
        mealType: mealType || 'breakfast',
        isOutside: false,
        outsideLocation: '',
        notes: ''
      };
      setMenuItems([initialItem]);
      setCurrentEditingItem(initialItem);
      // TODO: 将来的にレシピ選択機能を実装時に有効化
      // setSelectedRecipe(null);
      setOutingInfo({
        isOuting: false,
        restaurantName: '',
        notes: ''
      });

      setEditingItemId(initialItem.id);
      setTempItemName('');
      setTimeout(() => {
        if (inputRef.current) {
          inputRef.current.focus();
        }
      }, 100);
    }    setSearchQuery('');
    setFilteredRecipes(allRecipes);
  }, [open, editingMeal, allRecipes, mealType]);

  const handleSave = () => {
    if (editingItemId) {
      handleFinishEditing();
    }

    const hasValidItems = menuItems.some(item => item.name.trim());
    if (!hasValidItems && !outingInfo.isOuting) return;

    const validMenuItems = menuItems.filter(item => item.name.trim());    const mealData = {
      id: editingMeal?.id || `meal-${Date.now()}`,
      name: validMenuItems.length > 0 ? validMenuItems[0].name : '',
      type: mealType || 'breakfast',
      menuItems: validMenuItems,
      isOuting: outingInfo.isOuting,
      restaurantName: outingInfo.isOuting ? outingInfo.restaurantName : '',
      notes: outingInfo.isOuting ? outingInfo.notes : '',
      mealType: mealType || 'breakfast'
    };

    onSave(mealData);
  };

  const handleOutingToggle = (event: React.ChangeEvent<HTMLInputElement>) => {
    setOutingInfo({
      ...outingInfo,
      isOuting: event.target.checked
    });
  };

  const mealTypeInfo = getMealTypeInfo();
  const dialogTitle = editingMeal ? '献立の編集' : '献立の追加';

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 2,
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

        <Box sx={{ mb: 3 }}>
          <FormControlLabel
            control={
              <Switch
                checked={outingInfo.isOuting}
                onChange={handleOutingToggle}
                color="primary"
              />
            }
            label={
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <RestaurantIcon sx={{ mr: 0.5 }} />
                <Typography>外食</Typography>
              </Box>
            }
          />
        </Box>

        <Collapse in={outingInfo.isOuting}>
          <Box sx={{ mb: 3 }}>
            <TextField
              margin="dense"
              label="店舗名"
              fullWidth
              variant="outlined"
              value={outingInfo.restaurantName}
              onChange={(e) => setOutingInfo({ ...outingInfo, restaurantName: e.target.value })}
              sx={{ mb: 2 }}
            />

            <TextField
              margin="dense"
              label="メモ"
              fullWidth
              multiline
              rows={2}
              variant="outlined"
              value={outingInfo.notes}
              onChange={(e) => setOutingInfo({ ...outingInfo, notes: e.target.value })}
            />
          </Box>
        </Collapse>

        <Collapse in={!outingInfo.isOuting}>
          <Box sx={{ mb: 2 }}>
            <Typography variant="subtitle2" gutterBottom>
              メニュー
            </Typography>

            <List
              sx={{
                bgcolor: 'background.paper',
                border: '1px solid',
                borderColor: 'divider',
                borderRadius: 1
              }}
            >              {menuItems.map((item) => (
                <ListItem
                  key={item.id}
                  onClick={() => editingItemId !== item.id && handleSelectMenuItem(item)}
                  sx={{
                    borderBottom: menuItems.indexOf(item) < menuItems.length - 1 ? '1px solid' : 'none',
                    borderBottomColor: 'divider',
                    py: 1,
                    cursor: editingItemId !== item.id ? 'pointer' : 'default',
                    backgroundColor: currentEditingItem?.id === item.id ? 'action.selected' : 'transparent'
                  }}
                >
                  {editingItemId === item.id ? (
                    <ClickAwayListener onClickAway={handleFinishEditing}>
                      <TextField
                        autoFocus
                        fullWidth
                        variant="standard"
                        value={tempItemName}
                        onChange={(e) => setTempItemName(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            handleFinishEditing();
                          }
                        }}
                        inputRef={inputRef}
                        placeholder="メニュー名を入力"
                        InputProps={{
                          endAdornment: (
                            <IconButton size="small" onClick={handleFinishEditing}>
                              <CheckIcon fontSize="small" />
                            </IconButton>
                          )
                        }}
                        sx={{ my: -0.5 }}
                      />
                    </ClickAwayListener>
                  ) : (
                    <>
                      <ListItemText
                        primary={item.name || '(未入力)'}
                        primaryTypographyProps={{
                          color: item.name ? 'text.primary' : 'text.secondary',
                          fontStyle: item.name ? 'normal' : 'italic'
                        }}
                        secondary={item.recipeId ? 'レシピあり' : undefined}
                        onClick={() => !item.name && handleStartEditing(item)}
                      />
                      <ListItemSecondaryAction>
                        {!item.name && (
                          <IconButton
                            edge="end"
                            size="small"
                            onClick={() => handleStartEditing(item)}
                            sx={{ mr: 1 }}
                          >
                            <EditIcon fontSize="small" />
                          </IconButton>
                        )}
                        {menuItems.length > 1 && (
                          <IconButton
                            edge="end"
                            size="small"
                            onClick={() => handleDeleteMenuItem(item.id)}
                            sx={{ color: 'error.light' }}
                          >
                            <DeleteIcon fontSize="small" />
                          </IconButton>
                        )}
                      </ListItemSecondaryAction>
                    </>
                  )}
                </ListItem>
              ))}
            </List>

            <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 1 }}>
              <Button
                color="primary"
                startIcon={<AddIcon />}
                onClick={handleAddMenuItem}
                size="small"
              >
                メニューを追加
              </Button>
            </Box>
          </Box>

          <Divider sx={{ my: 2 }} />

          {currentEditingItem && (
            <Box sx={{ mb: 3 }}>
              <Typography variant="subtitle2" gutterBottom>
                レシピからメニューを追加
              </Typography>

              <TextField
                margin="dense"
                label="レシピを検索"
                fullWidth
                variant="outlined"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                InputProps={{
                  endAdornment: <SearchIcon color="action" />
                }}
                sx={{ mb: 2 }}
                disabled={outingInfo.isOuting}
              />

              <Box sx={{ maxHeight: 300, overflow: 'auto', mb: 2 }}>
                {loadingRecipes ? (
                  <Typography variant="body2" color="text.secondary" align="center" sx={{ py: 2 }}>
                    読み込み中...
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
                        <Typography variant="body1">{recipe.name}</Typography>                        <Typography variant="caption" color="text.secondary">
                          調理時間: {recipe.cookTime}分
                        </Typography>
                      </Box>
                      <Button
                        variant="outlined"
                        size="small"
                        startIcon={<AddIcon />}
                        onClick={() => handleAddMenuItemFromRecipe(recipe)}
                      >
                        追加
                      </Button>
                    </Box>
                  ))
                ) : (
                  <Typography variant="body2" color="text.secondary" align="center" sx={{ py: 2 }}>
                    レシピが見つかりません
                  </Typography>
                )}
              </Box>

              {currentEditingItem.name && !currentEditingItem.recipeId && (
                <Box sx={{ mt: 2 }}>
                  <Alert
                    severity="info"
                    action={
                      <Button
                        color="inherit"
                        size="small"
                        onClick={() => handleGenerateRecipe(currentEditingItem.name)}
                        disabled={generatingRecipe}
                        startIcon={generatingRecipe ? <CircularProgress size={16} /> : <AutoAwesomeIcon />}
                      >
                        {generatingRecipe ? '作成中...' : 'レシピ作成'}
                      </Button>
                    }
                  >
                    「{currentEditingItem.name}」のレシピを自動で作成しますか？
                  </Alert>
                </Box>
              )}
            </Box>
          )}
        </Collapse>
      </DialogContent>

      <DialogActions sx={{ px: 3, py: 2 }}>
        <Button onClick={onClose} color="inherit">
          キャンセル
        </Button>
        <Button
          onClick={handleSave}
          variant="contained"
          disabled={
            outingInfo.isOuting ?
              !outingInfo.restaurantName.trim() :
              !menuItems.some(item => item.name.trim())
          }
        >
          保存
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default MenuPlanningDialog;