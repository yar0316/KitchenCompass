import React, { useState } from 'react';
import {
  Box,
  Typography,
  Divider,
  TextField,
  Button,
  Checkbox,
  IconButton,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Chip,
  FormControlLabel,
  MenuItem,
  InputAdornment,
  Paper,
  LinearProgress,
  Collapse
} from '@mui/material';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import EventIcon from '@mui/icons-material/Event';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import { format } from 'date-fns';
import { ja } from 'date-fns/locale';
import { green } from '@mui/material/colors';

// モックデータ：買い物アイテムのサンプル
const MOCK_SHOPPING_ITEMS = [
  { 
    id: '1',
    name: 'にんじん',
    amount: 3,
    unit: '本',
    category: '野菜',
    isChecked: true,
    notes: '新鮮なもの'
  },
  { 
    id: '2',
    name: '豚肉（ロース）',
    amount: 300,
    unit: 'g',
    category: '肉類',
    isChecked: false,
    notes: ''
  },
  { 
    id: '3',
    name: '醤油',
    amount: 1,
    unit: '本',
    category: '調味料',
    isChecked: false,
    notes: '減塩タイプ'
  },
  { 
    id: '4',
    name: 'じゃがいも',
    amount: 5,
    unit: '個',
    category: '野菜',
    isChecked: true,
    notes: ''
  },
  { 
    id: '5',
    name: '牛乳',
    amount: 1,
    unit: 'L',
    category: '乳製品',
    isChecked: false,
    notes: ''
  }
];

// アイテムカテゴリーの選択肢
const ITEM_CATEGORIES = [
  '野菜', '肉類', '魚介類', '乳製品', '調味料', '穀物', '飲料', '冷凍食品', '加工食品', '日用品', 'その他'
];

// アイテムの単位選択肢
const ITEM_UNITS = [
  'g', 'kg', 'ml', 'L', '個', '本', '袋', '箱', 'パック', '缶', '束', '尾', '切れ', '杯', 'その他'
];

interface ShoppingListDetailsProps {
  list: {
    id: string;
    name: string;
    description?: string;
    dueDate: string | null;
    isCompleted: boolean;
  };
}

const ShoppingListDetails: React.FC<ShoppingListDetailsProps> = ({ list }) => {
  const { name, description, dueDate, isCompleted } = list;
  
  // 状態
  const [items, setItems] = useState(MOCK_SHOPPING_ITEMS);
  const [newItemName, setNewItemName] = useState('');
  const [newItemAmount, setNewItemAmount] = useState<string>('');
  const [newItemUnit, setNewItemUnit] = useState('個');
  const [newItemCategory, setNewItemCategory] = useState('その他');
  const [newItemNotes, setNewItemNotes] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState(name);
  const [editDescription, setEditDescription] = useState(description || '');
  
  // 新しい状態: 折りたたみ管理用
  const [isDetailsExpanded, setIsDetailsExpanded] = useState(false);
  const [isAddItemExpanded, setIsAddItemExpanded] = useState(false);
  
  // 日付のフォーマット
  const formattedDate = dueDate 
    ? format(new Date(dueDate), 'yyyy年M月d日(E)', { locale: ja }) 
    : null;
  
  // 進捗の計算
  const completedItems = items.filter(item => item.isChecked).length;
  const progress = items.length > 0 ? (completedItems / items.length) * 100 : 0;
  
  // 新しいアイテムを追加
  const handleAddItem = () => {
    if (!newItemName.trim()) return;
    
    const newItem = {
      id: Date.now().toString(),
      name: newItemName.trim(),
      amount: parseFloat(newItemAmount) || 1,
      unit: newItemUnit,
      category: newItemCategory,
      isChecked: false,
      notes: newItemNotes.trim()
    };
    
    setItems([...items, newItem]);
    setNewItemName('');
    setNewItemAmount('');
    setNewItemNotes('');
  };
  
  // アイテムのチェック状態を切り替え
  const toggleItemCheck = (id: string) => {
    setItems(items.map(item => 
      item.id === id 
        ? { ...item, isChecked: !item.isChecked } 
        : item
    ));
  };
  
  // アイテムの削除
  const deleteItem = (id: string) => {
    setItems(items.filter(item => item.id !== id));
  };
  
  // 編集モードの切り替え
  const toggleEditMode = () => {
    if (isEditing) {
      // 編集を保存する処理がここに入る
      // 実際のアプリでは、ここでバックエンドに更新をリクエスト
      console.log('リストを更新:', { name: editName, description: editDescription });
    } else {
      setEditName(name);
      setEditDescription(description || '');
    }
    setIsEditing(!isEditing);
  };
  
  // カテゴリーでアイテムをグループ化
  const itemsByCategory: Record<string, typeof items> = {};
  items.forEach(item => {
    if (!itemsByCategory[item.category]) {
      itemsByCategory[item.category] = [];
    }
    itemsByCategory[item.category].push(item);
  });
  
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      {/* ヘッダー部分 */}
      <Box sx={{ mb: 1 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          {isEditing ? (
            <TextField
              value={editName}
              onChange={(e) => setEditName(e.target.value)}
              fullWidth
              variant="outlined"
              size="small"
              sx={{ mr: 2 }}
            />
          ) : (
            <Typography variant="h5" component="h2">
              {name}
            </Typography>
          )}
          
          <Box sx={{ display: 'flex', gap: 1 }}>
            <Button
              startIcon={isDetailsExpanded ? <ExpandLessIcon /> : <ExpandMoreIcon />}
              onClick={() => setIsDetailsExpanded(!isDetailsExpanded)}
              color="inherit"
              size="small"
            >
              詳細
            </Button>
            
            <Button
              startIcon={isEditing ? null : <EditIcon />}
              onClick={toggleEditMode}
              color={isEditing ? 'primary' : 'inherit'}
              variant={isEditing ? 'contained' : 'text'}
              size="small"
            >
              {isEditing ? '保存' : '編集'}
            </Button>
          </Box>
        </Box>
        
        {/* 詳細情報（折りたたみ可能） */}
        <Collapse in={isDetailsExpanded}>
          <Box sx={{ mt: 1, mb: 1, px: 1, py: 1, bgcolor: 'background.paper', borderRadius: 1 }}>
            {isEditing ? (
              <TextField
                value={editDescription}
                onChange={(e) => setEditDescription(e.target.value)}
                fullWidth
                placeholder="説明を入力..."
                variant="outlined"
                size="small"
                multiline
                rows={2}
                sx={{ mb: 1 }}
              />
            ) : description ? (
              <Typography variant="body2" color="textSecondary" sx={{ mb: 1 }}>
                {description}
              </Typography>
            ) : (
              <Typography variant="body2" color="textSecondary" sx={{ mb: 1, fontStyle: 'italic' }}>
                説明はありません
              </Typography>
            )}
            
            <Box sx={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: 1 }}>
              {formattedDate && (
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <EventIcon fontSize="small" color="action" sx={{ mr: 0.5 }} />
                  <Typography variant="body2" color="textSecondary">
                    {formattedDate}
                  </Typography>
                </Box>
              )}
              
              <Chip 
                label={isCompleted ? '完了' : '進行中'} 
                size="small"
                color={isCompleted ? 'success' : 'primary'}
                variant={isCompleted ? 'filled' : 'outlined'}
              />
            </Box>
          </Box>
        </Collapse>
        
        {/* 進捗バー - 常に表示 */}
        <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
          <Box sx={{ flex: 1, mr: 1 }}>
            <LinearProgress 
              variant="determinate" 
              value={progress} 
              color={isCompleted ? 'success' : 'primary'}
              sx={{ height: 8, borderRadius: 4 }}
            />
          </Box>
          <Typography variant="body2" color="textSecondary">
            {completedItems}/{items.length}
          </Typography>
        </Box>
      </Box>
      
      <Divider />
      
      {/* アイテム追加ボタン */}
      <Button
        variant="text"
        color="primary"
        startIcon={isAddItemExpanded ? <ExpandLessIcon /> : <AddCircleIcon />}
        onClick={() => setIsAddItemExpanded(!isAddItemExpanded)}
        sx={{ my: 1, justifyContent: 'flex-start' }}
      >
        {isAddItemExpanded ? 'フォームを閉じる' : 'アイテムを追加'}
      </Button>
      
      {/* 新規アイテム追加フォーム（折りたたみ可能） */}
      <Collapse in={isAddItemExpanded}>
        <Paper elevation={0} sx={{ p: 2, mb: 2, bgcolor: 'background.default' }}>
          <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, gap: 1 }}>
            <TextField
              size="small"
              placeholder="商品名"
              value={newItemName}
              onChange={(e) => setNewItemName(e.target.value)}
              sx={{ flex: 2 }}
            />
            
            <TextField
              size="small"
              placeholder="数量"
              type="number"
              inputProps={{ min: "0", step: "0.1" }}
              value={newItemAmount}
              onChange={(e) => setNewItemAmount(e.target.value)}
              sx={{ flex: 1, minWidth: { xs: '100%', sm: '100px' } }}
            />
            
            <TextField
              size="small"
              select
              value={newItemUnit}
              onChange={(e) => setNewItemUnit(e.target.value)}
              sx={{ flex: 1, minWidth: { xs: '100%', sm: '100px' } }}
            >
              {ITEM_UNITS.map((unit) => (
                <MenuItem key={unit} value={unit}>
                  {unit}
                </MenuItem>
              ))}
            </TextField>
          </Box>
          
          <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, gap: 1, mt: 1 }}>
            <TextField
              size="small"
              select
              label="カテゴリー"
              value={newItemCategory}
              onChange={(e) => setNewItemCategory(e.target.value)}
              sx={{ flex: 1 }}
            >
              {ITEM_CATEGORIES.map((category) => (
                <MenuItem key={category} value={category}>
                  {category}
                </MenuItem>
              ))}
            </TextField>
            
            <TextField
              size="small"
              placeholder="メモ（オプション）"
              value={newItemNotes}
              onChange={(e) => setNewItemNotes(e.target.value)}
              sx={{ flex: 2 }}
            />
            
            <Button
              variant="contained"
              color="primary"
              startIcon={<AddCircleIcon />}
              onClick={handleAddItem}
              disabled={!newItemName.trim()}
              sx={{ height: { sm: 40 } }}
            >
              追加
            </Button>
          </Box>
        </Paper>
      </Collapse>
      
      {/* アイテムリスト - 最大限のスペースを確保 */}
      <Box sx={{ flex: 1, overflow: 'auto', mt: 1 }}>
        {Object.keys(itemsByCategory).length === 0 ? (
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
        ) : (
          Object.entries(itemsByCategory).map(([category, categoryItems]) => (
            <Box key={category} sx={{ mb: 2 }}>
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
                {categoryItems.map((item) => (
                  <ListItem
                    key={item.id}
                    secondaryAction={
                      <IconButton 
                        edge="end" 
                        aria-label="delete"
                        onClick={() => deleteItem(item.id)}
                        size="small"
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
                        checked={item.isChecked}
                        onChange={() => toggleItemCheck(item.id)}
                        size="small"
                        sx={{
                          '&.Mui-checked': {
                            color: green[600]
                          }
                        }}
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
          ))
        )}
      </Box>
    </Box>
  );
};

export default ShoppingListDetails;