import React, { useState, useEffect } from 'react';
import { 
  Container, 
  Typography, 
  Box, 
  Button, 
  Paper,
  Divider,
  IconButton,
  useTheme,
  useMediaQuery,
  Collapse
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import ShoppingListItem from './ShoppingListItem';
import NewShoppingListDialog from './NewShoppingListDialog';
import ShoppingListDetails from './ShoppingListDetails';

// モックデータ：買い物リストのサンプル
const MOCK_SHOPPING_LISTS = [
  {
    id: '1',
    name: '今週の買い物リスト',
    description: '週末に買い出し予定',
    dueDate: new Date('2025-04-13').toISOString(),
    isCompleted: false,
    itemCount: 12,
    completedCount: 3
  },
  {
    id: '2',
    name: '誕生日パーティー用',
    description: '来週の誕生日パーティー用の材料',
    dueDate: new Date('2025-04-18').toISOString(),
    isCompleted: false,
    itemCount: 8,
    completedCount: 0
  },
  {
    id: '3',
    name: '日用品',
    description: '洗剤など定期的に買うもの',
    dueDate: null,
    isCompleted: true,
    itemCount: 5,
    completedCount: 5
  }
];

const ShoppingListPage: React.FC = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  
  // 状態
  const [shoppingLists, setShoppingLists] = useState(MOCK_SHOPPING_LISTS);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedList, setSelectedList] = useState<string | null>(null);
  const [isListsExpanded, setIsListsExpanded] = useState(!isMobile); // モバイルでは折りたたまれた状態、PCでは展開された状態
  
  // 初期ロード時および買い物リストの変更時に最新のリストを選択
  useEffect(() => {
    if (shoppingLists.length > 0 && !selectedList) {
      // 日付の降順でソートし、最新のリストを選択
      const sortedLists = [...shoppingLists].sort((a, b) => {
        const dateA = a.id ? parseInt(a.id) : 0;
        const dateB = b.id ? parseInt(b.id) : 0;
        return dateB - dateA; // 降順（新しい順）
      });
      setSelectedList(sortedLists[0].id);
    }
  }, [shoppingLists, selectedList]);
  
  // 新しい買い物リストの追加
  const handleAddShoppingList = (newList: any) => {
    const newListWithId = {
      ...newList,
      id: Date.now().toString(),
      itemCount: 0,
      completedCount: 0
    };
    setShoppingLists([...shoppingLists, newListWithId]);
    setSelectedList(newListWithId.id); // 新しいリストを自動選択
    setIsDialogOpen(false);
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
  const handleDeleteList = (id: string) => {
    setShoppingLists(shoppingLists.filter(list => list.id !== id));
    if (selectedList === id) {
      setSelectedList(null);
    }
  };
  
  // 選択された買い物リストの詳細を取得
  const selectedListDetails = selectedList 
    ? shoppingLists.find(list => list.id === selectedList) 
    : null;
    
  // リストを作成日の降順（新しい順）でソート
  const sortedLists = [...shoppingLists].sort((a, b) => {
    const dateA = a.id ? parseInt(a.id) : 0;
    const dateB = b.id ? parseInt(b.id) : 0;
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
            overflow: 'hidden', // overflowをhiddenに変更
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
              {shoppingLists.length === 0 ? (
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
                      list={list}
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