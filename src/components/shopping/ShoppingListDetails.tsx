import React, { useState, useEffect } from 'react';
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
  Collapse,
  CircularProgress,
  Alert
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
import { generateClient } from 'aws-amplify/api';
import { Schema } from '../../amplify/data/resource';
import { type ShoppingList, type ShoppingItem } from '../../API';

// アイテムカテゴリーの選択肢
const ITEM_CATEGORIES = [
  '野菜', '肉類', '魚介類', '乳製品', '調味料', '穀物', '飲料', '冷凍食品', '加工食品', '日用品', 'その他'
];

// アイテムの単位選択肢
const ITEM_UNITS = [
  'g', 'kg', 'ml', 'L', '個', '本', '袋', '箱', 'パック', '缶', '束', '尾', '切れ', '杯', 'その他'
];

// Amplify APIクライアントを生成
const client = generateClient<Schema>();

interface ShoppingListDetailsProps {
  list: ShoppingList;
  onUpdate?: () => void;
}

const ShoppingListDetails: React.FC<ShoppingListDetailsProps> = ({ list, onUpdate }) => {
  const { id, name, description, dueDate, isCompleted } = list;
  
  // 状態
  const [items, setItems] = useState<ShoppingItem[]>([]);
  const [newItemName, setNewItemName] = useState('');
  const [newItemAmount, setNewItemAmount] = useState<string>('');
  const [newItemUnit, setNewItemUnit] = useState('個');
  const [newItemCategory, setNewItemCategory] = useState('その他');
  const [newItemNotes, setNewItemNotes] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState(name);
  const [editDescription, setEditDescription] = useState(description || '');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [saveLoading, setSaveLoading] = useState(false);
  
  // 新しい状態: 折りたたみ管理用
  const [isDetailsExpanded, setIsDetailsExpanded] = useState(false);
  const [isAddItemExpanded, setIsAddItemExpanded] = useState(false);
  
  // 買い物アイテムの取得
  const fetchShoppingItems = async () => {
    if (!id) return;
    
    setLoading(true);
    try {
      // リストのIDに基づいてアイテム一覧を取得
      const result = await client.models.ShoppingItem.list({
        filter: {
          shoppingListId: {
            eq: id
          }
        }
      });
      setItems(result.data);
      setError(null);
    } catch (err) {
      console.error('買い物アイテムの取得中にエラーが発生しました:', err);
      setError('アイテムの読み込みに失敗しました。');
    } finally {
      setLoading(false);
    }
  };
  
  // リストIDが変更されたらアイテムを再取得
  useEffect(() => {
    fetchShoppingItems();
    
    // リスト情報も更新
    setEditName(name);
    setEditDescription(description || '');
  }, [id, name, description]);

  // 日付のフォーマット
  const formattedDate = dueDate 
    ? format(new Date(dueDate), 'yyyy年M月d日(E)', { locale: ja }) 
    : null;
  
  // 進捗の計算
  const completedItems = items.filter(item => item.isChecked).length;
  const progress = items.length > 0 ? (completedItems / items.length) * 100 : 0;
  
  // 新しいアイテムを追加
  const handleAddItem = async () => {
    if (!newItemName.trim() || !id) return;
    
    setSaveLoading(true);
    try {
      const result = await client.models.ShoppingItem.create({
        name: newItemName.trim(),
        amount: parseFloat(newItemAmount) || 1,
        unit: newItemUnit,
        category: newItemCategory,
        isChecked: false,
        notes: newItemNotes.trim() || undefined,
        shoppingListId: id
      });
      
      if (result.data) {
        setItems([...items, result.data]);
      }
      
      setNewItemName('');
      setNewItemAmount('');
      setNewItemNotes('');
      setError(null);
    } catch (err) {
      console.error('アイテムの追加中にエラーが発生しました:', err);
      setError('アイテムの追加に失敗しました。');
    } finally {
      setSaveLoading(false);
    }
  };
  
  // アイテムのチェック状態を切り替え
  const toggleItemCheck = async (item: ShoppingItem) => {
    try {
      const result = await client.models.ShoppingItem.update({
        id: item.id,
        isChecked: !item.isChecked
      });
      
      if (result.data) {
        setItems(items.map(i => 
          i.id === item.id ? result.data : i
        ));
      }
      
      // リスト全体が完了か確認して必要なら更新
      const updatedItems = items.map(i => 
        i.id === item.id ? { ...i, isChecked: !i.isChecked } : i
      );
      
      const allCompleted = updatedItems.length > 0 && updatedItems.every(i => i.isChecked);
      
      // リスト全体の完了状態が変わる場合、リスト自体も更新
      if (allCompleted !== isCompleted) {
        await client.models.ShoppingList.update({
          id,
          isCompleted: allCompleted
        });
        
        // 親コンポーネントに変更を通知
        if (onUpdate) {
          onUpdate();
        }
      }
    } catch (err) {
      console.error('アイテム状態の更新中にエラーが発生しました:', err);
      setError('アイテム状態の更新に失敗しました。');
    }
  };
  
  // アイテムの削除
  const deleteItem = async (itemId: string) => {
    try {
      await client.models.ShoppingItem.delete({
        id: itemId
      });
      
      setItems(items.filter(item => item.id !== itemId));
    } catch (err) {
      console.error('アイテムの削除中にエラーが発生しました:', err);
      setError('アイテムの削除に失敗しました。');
    }
  };
  
  // 編集モードの切り替え
  const toggleEditMode = async () => {
    if (isEditing) {
      // 編集内容を保存
      try {
        setSaveLoading(true);
        const result = await client.models.ShoppingList.update({
          id,
          name: editName.trim(),
          description: editDescription.trim() || undefined
        });
        
        // 親コンポーネントに変更を通知
        if (onUpdate) {
          onUpdate();
        }
        
        setIsEditing(false);
        setError(null);
      } catch (err) {
        console.error('リストの更新中にエラーが発生しました:', err);
        setError('リスト情報の更新に失敗しました。');
      } finally {
        setSaveLoading(false);
      }
    } else {
      setEditName(name);
      setEditDescription(description || '');
      setIsEditing(true);
    }
  };
  
  // カテゴリーでアイテムをグループ化
  const itemsByCategory: Record<string, ShoppingItem[]> = {};
  items.forEach(item => {
    const category = item.category || 'その他';
    if (!itemsByCategory[category]) {
      itemsByCategory[category] = [];
    }
    itemsByCategory[category].push(item);
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
              disabled={saveLoading}
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
              disabled={saveLoading}
            >
              {isEditing ? (saveLoading ? '保存中...' : '保存') : '編集'}
            </Button>
          </Box>
        </Box>
        
        {/* エラーメッセージ表示 */}
        {error && (
          <Alert severity="error" sx={{ mt: 1, mb: 1 }}>
            {error}
          </Alert>
        )}
        
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
                disabled={saveLoading}
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
              disabled={saveLoading}
            />
            
            <TextField
              size="small"
              placeholder="数量"
              type="number"
              inputProps={{ min: "0", step: "0.1" }}
              value={newItemAmount}
              onChange={(e) => setNewItemAmount(e.target.value)}
              sx={{ flex: 1, minWidth: { xs: '100%', sm: '100px' } }}
              disabled={saveLoading}
            />
            
            <TextField
              size="small"
              select
              value={newItemUnit}
              onChange={(e) => setNewItemUnit(e.target.value)}
              sx={{ flex: 1, minWidth: { xs: '100%', sm: '100px' } }}
              disabled={saveLoading}
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
              disabled={saveLoading}
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
              disabled={saveLoading}
            />
            
            <Button
              variant="contained"
              color="primary"
              startIcon={saveLoading ? <CircularProgress size={20} /> : <AddCircleIcon />}
              onClick={handleAddItem}
              disabled={!newItemName.trim() || saveLoading}
              sx={{ height: { sm: 40 } }}
            >
              {saveLoading ? '追加中...' : '追加'}
            </Button>
          </Box>
        </Paper>
      </Collapse>
      
      {/* アイテムリスト - 最大限のスペースを確保 */}
      <Box sx={{ flex: 1, overflow: 'auto', mt: 1 }}>
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', my: 3 }}>
            <CircularProgress />
          </Box>
        ) : Object.keys(itemsByCategory).length === 0 ? (
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
                        onChange={() => toggleItemCheck(item)}
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
          ))
        )}
      </Box>
    </Box>
  );
};

export default ShoppingListDetails;