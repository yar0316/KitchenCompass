import React, { useState, useEffect } from 'react';
import { 
  Container, 
  Typography, 
  Box, 
  Button, 
  Paper,
  Divider,
  useTheme,
  useMediaQuery,
  Collapse,
  CircularProgress,
  Alert
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import ShoppingListItem from './ShoppingListItem';
import NewShoppingListDialog from './NewShoppingListDialog';
import ShoppingListDetails from './ShoppingListDetails';
import { generateClient } from 'aws-amplify/api';
import { getCurrentUser } from 'aws-amplify/auth';
import { Schema } from '../../../amplify/data/resource';
import { type ShoppingList } from '../../API';

// Amplify APIクライアントを生成
const client = generateClient<Schema>();

const ShoppingListPage: React.FC = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  
  // 状態
  const [shoppingLists, setShoppingLists] = useState<ShoppingList[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedList, setSelectedList] = useState<string | null>(null);
  const [isListsExpanded, setIsListsExpanded] = useState(!isMobile); // モバイルでは折りたたまれた状態、PCでは展開された状態
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // 買い物リストデータの取得
  const fetchShoppingLists = async () => {
    setLoading(true);
    try {
      const result = await client.models.ShoppingList.list();
      setShoppingLists(result.data);
      setError(null);
    } catch (err) {
      console.error('買い物リストの取得中にエラーが発生しました:', err);
      setError('買い物リストの読み込みに失敗しました。');
    } finally {
      setLoading(false);
    }
  };
  
  // コンポーネントのマウント時に買い物リストを取得
  useEffect(() => {
    fetchShoppingLists();
  }, []);
  
  // 初期ロード時および買い物リストの変更時に最新のリストを選択
  useEffect(() => {
    if (shoppingLists.length > 0 && !selectedList) {
      // 作成日の降順でソートし、最新のリストを選択
      const sortedLists = [...shoppingLists].sort((a, b) => {
        const dateA = new Date(a.createdAt || '').getTime();
        const dateB = new Date(b.createdAt || '').getTime();
        return dateB - dateA; // 降順（新しい順）
      });
      setSelectedList(sortedLists[0].id);
    }
  }, [shoppingLists, selectedList]);
  // 新しい買い物リストの追加
  const handleAddShoppingList = async (newList: { name: string; description?: string; dueDate?: string }) => {
    try {
      // 認証されたユーザー情報を取得
      const currentUser = await getCurrentUser();
      const userId = currentUser.userId;
      
      // APIを使用して新しいShoppingListを作成
      const result = await client.models.ShoppingList.create({
        name: newList.name,
        description: newList.description || undefined,
        dueDate: newList.dueDate || undefined,
        isCompleted: false,
        owner: userId
      });
      
      // 作成した新しいリストを状態に追加
      if (result.data) {
        setShoppingLists([...shoppingLists, result.data]);
        setSelectedList(result.data.id); // 新しいリストを自動選択
      }
      setIsDialogOpen(false);
    } catch (err) {
      console.error('買い物リストの作成中にエラーが発生しました:', err);
      setError('買い物リストの作成に失敗しました。');
    }
  };
  
  // 買い物リストの選択
  const handleSelectList = (id: string) => {
    setSelectedList(id);
    // モバイルでリストを選択したらリスト一覧を自動的に折りたたむ
    if (isMobile) {
      setIsListsExpanded(false);
    }
  };
  
  // 買い物リストの削除
  const handleDeleteList = async (id: string) => {
    try {
      await client.models.ShoppingList.delete({
        id
      });
      
      // 状態から削除したリストを除去
      setShoppingLists(shoppingLists.filter(list => list.id !== id));
      
      if (selectedList === id) {
        setSelectedList(null);
      }
    } catch (err) {
      console.error('買い物リストの削除中にエラーが発生しました:', err);
      setError('買い物リストの削除に失敗しました。');
    }
  };
  
  // 選択された買い物リストの詳細を取得
  const selectedListDetails = selectedList 
    ? shoppingLists.find(list => list.id === selectedList) 
    : null;
    
  // リストを作成日の降順（新しい順）でソート
  const sortedLists = [...shoppingLists].sort((a, b) => {
    const dateA = new Date(a.createdAt || '').getTime();
    const dateB = new Date(b.createdAt || '').getTime();
    return dateB - dateA; // 降順（新しい順）
  });
  
  return (
    <Container maxWidth="lg" sx={{ mt: 1, mb: 4 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h5" component="h1">
          買い物リスト
        </Typography>
        <Button
          variant="contained"
          color="primary"
          startIcon={<AddIcon />}
          onClick={() => setIsDialogOpen(true)}
        >
          新規リスト
        </Button>
      </Box>
      
      {/* エラーメッセージ表示 */}
      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}
      
      <Box sx={{ 
        display: 'flex', 
        flexDirection: isMobile ? 'column' : 'row',
        gap: 2
      }}>
        {/* 買い物リスト一覧 */}
        <Paper 
          elevation={2} 
          sx={{ 
            flex: isMobile ? '1 1 auto' : '0 0 300px',
            height: isMobile ? 'auto' : '70vh',
            overflow: 'hidden',
            p: 2
          }}
        >
          <Box sx={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center',
            mb: 1
          }}>
            <Typography variant="h6" component="h2">
              マイリスト
            </Typography>
            <Button
              size="small"
              color="inherit"
              onClick={() => setIsListsExpanded(!isListsExpanded)}
              startIcon={isListsExpanded ? <ExpandLessIcon /> : <ExpandMoreIcon />}
            >
              {isListsExpanded ? '折りたたむ' : '展開する'}
            </Button>
          </Box>
          <Divider sx={{ mb: 2 }} />
          
          <Collapse in={isListsExpanded}>
            <Box sx={{ 
              height: isMobile ? 'auto' : 'calc(70vh - 80px)', // ヘッダー分の高さを引く
              overflow: 'auto',
              pb: 1
            }}>
              {loading ? (
                <Box sx={{ display: 'flex', justifyContent: 'center', my: 3 }}>
                  <CircularProgress size={30} />
                </Box>
              ) : shoppingLists.length === 0 ? (
                <Typography color="textSecondary" align="center" sx={{ mt: 2 }}>
                  買い物リストがありません
                </Typography>
              ) : (
                <Box sx={{ 
                  display: 'flex', 
                  flexDirection: 'column',
                  gap: 1 
                }}>
                  {sortedLists.map(list => (
                    <ShoppingListItem 
                      key={list.id}
                      list={{
                        id: list.id,
                        name: list.name,
                        description: list.description || '',
                        dueDate: list.dueDate || null,
                        isCompleted: list.isCompleted || false,
                        itemCount: list.items?.items?.length || 0,
                        completedCount: list.items?.items?.filter(item => item?.isChecked)?.length || 0
                      }}
                      isSelected={selectedList === list.id}
                      onSelect={() => handleSelectList(list.id)}
                      onDelete={() => handleDeleteList(list.id)}
                    />
                  ))}
                </Box>
              )}
            </Box>
          </Collapse>

          {/* 折りたたまれたときの要約表示 */}
          {!isListsExpanded && selectedList && (
            <Box sx={{ 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'space-between',
              py: 1 
            }}>
              <Typography variant="body2" color="text.secondary">
                選択中: {shoppingLists.find(list => list.id === selectedList)?.name}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                ({shoppingLists.length} リスト)
              </Typography>
            </Box>
          )}
        </Paper>
        
        {/* 買い物リスト詳細 */}
        <Paper 
          elevation={2} 
          sx={{ 
            flex: 1,
            height: isMobile ? 'auto' : '70vh',
            p: 2,
            display: 'flex',
            flexDirection: 'column'
          }}
        >
          {selectedList ? (
            <ShoppingListDetails 
              list={selectedListDetails!} 
              onUpdate={fetchShoppingLists}
            />
          ) : (
            <Box sx={{ 
              display: 'flex', 
              flexDirection: 'column', 
              alignItems: 'center', 
              justifyContent: 'center',
              height: '100%' 
            }}>
              <Typography variant="h6" color="textSecondary">
                リストを選択してください
              </Typography>
              <Typography color="textSecondary" sx={{ mt: 1 }}>
                または新しいリストを作成します
              </Typography>
              <Button
                variant="outlined"
                color="primary"
                startIcon={<AddIcon />}
                onClick={() => setIsDialogOpen(true)}
                sx={{ mt: 2 }}
              >
                新規リスト
              </Button>
            </Box>
          )}
        </Paper>
      </Box>
      
      {/* 新規買い物リスト作成ダイアログ */}
      <NewShoppingListDialog
        open={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        onSave={handleAddShoppingList}
      />
    </Container>
  );
};

export default ShoppingListPage;