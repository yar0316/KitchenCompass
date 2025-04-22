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
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Autocomplete,
  Divider,
  IconButton,
  FormControlLabel,
  Switch,
  Collapse,
  Alert,
  CircularProgress,
  Chip,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  Fab,
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

// モックデータ：レシピのサンプル
const MOCK_RECIPES = [
  { id: '1', name: 'トマトとモッツァレラのカプレーゼ', cookingTime: 10 },
  { id: '2', name: '基本の肉じゃが', cookingTime: 40 },
  { id: '3', name: 'アボカドとエビのサラダ', cookingTime: 15 },
  { id: '4', name: '手作りピザ', cookingTime: 60 },
  { id: '5', name: '鶏肉の照り焼き', cookingTime: 25 }
];

interface MenuItem {
  id: string;
  name: string;
  recipeId: string | null;
}

interface MenuPlanningDialogProps {
  open: boolean;
  onClose: () => void;
  onSave: (mealData: any) => void;
  date: Date | null;
  mealType: 'breakfast' | 'lunch' | 'dinner' | null;
  editingMeal: any | null;
}

// 外食用のカテゴリ
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
}) => {
  // 複数のメニュー項目を管理するための状態
  const [menuItems, setMenuItems] = useState<MenuItem[]>([
    { id: `menu-${Date.now()}`, name: '', recipeId: null }
  ]);
  const [currentEditingItem, setCurrentEditingItem] = useState<MenuItem | null>(null);
  const [editingItemId, setEditingItemId] = useState<string | null>(null);
  const [tempItemName, setTempItemName] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);
  
  // 各メニュー入力用の状態
  const [selectedRecipe, setSelectedRecipe] = useState<{ id: string; name: string } | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredRecipes, setFilteredRecipes] = useState(MOCK_RECIPES);
  
  // レシピの自動生成関連
  const [generatingRecipe, setGeneratingRecipe] = useState(false);
  
  // 外食情報
  const [outingInfo, setOutingInfo] = useState<OutingInfo>({
    isOuting: false,
    restaurantName: '',
    notes: ''
  });
  
  // メニューアイテム追加
  const handleAddMenuItem = () => {
    const newItem = { 
      id: `menu-${Date.now()}`, 
      name: '', 
      recipeId: null 
    };
    
    setMenuItems([...menuItems, newItem]);
    setCurrentEditingItem(newItem);
    setSelectedRecipe(null);
    
    // 追加したらすぐに編集状態にする
    setEditingItemId(newItem.id);
    setTempItemName('');
    setTimeout(() => {
      if (inputRef.current) {
        inputRef.current.focus();
      }
    }, 100);
  };

  // レシピから新しいメニューアイテムを追加
  const handleAddMenuItemFromRecipe = (recipe: { id: string; name: string }) => {
    if (!recipe) return;
    
    // 新しいメニューアイテムを作成
    const newItem = {
      id: `menu-${Date.now()}`,
      name: recipe.name,
      recipeId: recipe.id
    };
    
    // メニューアイテムリストに追加
    const updatedItems = [...menuItems, newItem];
    setMenuItems(updatedItems);
    
    // 新しく追加したアイテムを現在の編集項目に設定
    setCurrentEditingItem(newItem);
    setSelectedRecipe(recipe);
  };
  
  // メニューアイテム削除
  const handleDeleteMenuItem = (itemId: string) => {
    if (menuItems.length <= 1) {
      // 最後の一つは削除しない
      return;
    }
    
    const updatedItems = menuItems.filter(item => item.id !== itemId);
    setMenuItems(updatedItems);
    
    if (currentEditingItem && currentEditingItem.id === itemId) {
      setCurrentEditingItem(updatedItems[0] || null);
      
      // 選択した項目の情報をフォームにセット
      if (updatedItems[0]) {
        const recipe = updatedItems[0].recipeId 
          ? MOCK_RECIPES.find(r => r.id === updatedItems[0].recipeId) || null
          : null;
        setSelectedRecipe(recipe);
      }
    }
    
    // 編集中のアイテムが削除された場合
    if (editingItemId === itemId) {
      setEditingItemId(null);
    }
  };
  
  // メニューアイテム選択
  const handleSelectMenuItem = (item: MenuItem) => {
    setCurrentEditingItem(item);
    
    // 選択した項目の情報をフォームにセット
    if (item.recipeId) {
      const recipe = MOCK_RECIPES.find(r => r.id === item.recipeId);
      setSelectedRecipe(recipe || null);
    } else {
      setSelectedRecipe(null);
    }
  };
  
  // インライン編集開始
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
  
  // インライン編集終了と保存
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

  // 日付フォーマット（年月日）
  const formatFullDate = (date: Date | null) => {
    if (!date) return '';
    return `${date.getFullYear()}年${date.getMonth() + 1}月${date.getDate()}日`;
  };

  // 食事タイプのラベルとアイコンを取得
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

  // レシピの自動生成をシミュレート
  const handleGenerateRecipe = (itemName: string) => {
    if (!currentEditingItem) return;
    
    setGeneratingRecipe(true);
    
    // APIリクエストの代わりに2秒後に結果を返す模擬処理
    setTimeout(() => {
      // ダミーのレシピデータ（実際のAPIレスポンスをシミュレート）
      const generatedRecipe = {
        id: `generated-${Date.now()}`,
        name: `${itemName}のレシピ`,
        cookingTime: Math.floor(Math.random() * 30) + 10, // 10-40分
        ingredients: ['材料1', '材料2', '材料3'],
        steps: ['手順1', '手順2', '手順3']
      };
      
      // 生成されたレシピを使って新しいメニューアイテムを追加
      handleAddMenuItemFromRecipe({
        id: generatedRecipe.id,
        name: generatedRecipe.name
      });
      
      setGeneratingRecipe(false);
    }, 2000);
  };
  
  // 現在編集中のメニューアイテムの更新（レシピ選択）
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

  // ダイアログが開かれた時に初期値を設定
  useEffect(() => {
    if (open && editingMeal) {
      // 既存の献立編集の場合
      if (editingMeal.menuItems && Array.isArray(editingMeal.menuItems) && editingMeal.menuItems.length > 0) {
        // 複数メニュー対応済みの場合
        setMenuItems(editingMeal.menuItems);
        setCurrentEditingItem(editingMeal.menuItems[0]);
        
        // 最初のアイテムの情報をフォームにセット
        const firstItem = editingMeal.menuItems[0];
        if (firstItem.recipeId) {
          const recipe = MOCK_RECIPES.find(r => r.id === firstItem.recipeId);
          setSelectedRecipe(recipe || null);
        } else {
          setSelectedRecipe(null);
        }
      } else {
        // 旧形式の場合は変換
        const initialItem = {
          id: `menu-${Date.now()}`,
          name: editingMeal.name || '',
          recipeId: editingMeal.recipeId || null
        };
        setMenuItems([initialItem]);
        setCurrentEditingItem(initialItem);
        
        if (editingMeal.recipeId) {
          const recipe = MOCK_RECIPES.find(r => r.id === editingMeal.recipeId);
          setSelectedRecipe(recipe || null);
        } else {
          setSelectedRecipe(null);
        }
      }
      
      // 外食情報があれば設定
      if (editingMeal.isOuting) {
        setOutingInfo({
          isOuting: true,
          restaurantName: editingMeal.restaurantName || '',
          notes: editingMeal.notes || ''
        });
      } else {
        setOutingInfo({
          isOuting: false,
          restaurantName: '',
          notes: ''
        });
      }
    } else {
      // 新規作成時はリセット
      const initialItem = { id: `menu-${Date.now()}`, name: '', recipeId: null };
      setMenuItems([initialItem]);
      setCurrentEditingItem(initialItem);
      setSelectedRecipe(null);
      setOutingInfo({
        isOuting: false,
        restaurantName: '',
        notes: ''
      });
      
      // 新規作成時は最初のアイテムをすぐに編集状態にする
      setEditingItemId(initialItem.id);
      setTempItemName('');
      setTimeout(() => {
        if (inputRef.current) {
          inputRef.current.focus();
        }
      }, 100);
    }
    
    setSearchQuery('');
    setFilteredRecipes(MOCK_RECIPES);
  }, [open, editingMeal]);

  // レシピ検索
  useEffect(() => {
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      const results = MOCK_RECIPES.filter(recipe =>
        recipe.name.toLowerCase().includes(query)
      );
      setFilteredRecipes(results);
    } else {
      setFilteredRecipes(MOCK_RECIPES); // 検索クエリが空の場合も全てのレシピを表示
    }
  }, [searchQuery]);

  // 保存ハンドラー
  const handleSave = () => {
    // 編集中の項目があれば保存してから処理
    if (editingItemId) {
      handleFinishEditing();
    }
    
    // 有効なメニューアイテムが必要
    const hasValidItems = menuItems.some(item => item.name.trim());
    if (!hasValidItems && !outingInfo.isOuting) return;
    
    // 空のメニューアイテムを除外
    const validMenuItems = menuItems.filter(item => item.name.trim());
    
    const mealData = {
      // 主要な名前（表示用）は最初のアイテム名を使用
      name: validMenuItems.length > 0 ? validMenuItems[0].name : '',
      // 複数メニュー項目
      menuItems: validMenuItems,
      // 外食情報も含める
      isOuting: outingInfo.isOuting,
      restaurantName: outingInfo.isOuting ? outingInfo.restaurantName : '',
      notes: outingInfo.isOuting ? outingInfo.notes : ''
    };
    
    onSave(mealData);
  };
  
  // 外食フラグ切り替え
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
        
        {/* 外食切り替え */}
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
              onChange={(e) => setOutingInfo({...outingInfo, restaurantName: e.target.value})}
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
              onChange={(e) => setOutingInfo({...outingInfo, notes: e.target.value})}
            />
          </Box>
        </Collapse>
        
        <Collapse in={!outingInfo.isOuting}>
          {/* メニューアイテムのリスト */}
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
            >
              {menuItems.map((item) => (
                <ListItem 
                  key={item.id}
                  button={editingItemId !== item.id}
                  selected={currentEditingItem?.id === item.id}
                  onClick={() => editingItemId !== item.id && handleSelectMenuItem(item)}
                  sx={{
                    borderBottom: menuItems.indexOf(item) < menuItems.length - 1 ? '1px solid' : 'none',
                    borderBottomColor: 'divider',
                    py: 1
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
          
          {/* レシピ選択セクション */}
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
                {filteredRecipes.length > 0 ? (
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
                          調理時間: {recipe.cookingTime}分
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