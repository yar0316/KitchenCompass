import React, { useState } from 'react';
import {
  Box,
  Typography,
  Paper,
  Button,
  Chip,
  Divider,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  Grid,
  Card,
  CardContent,
  CardMedia,
  List,
  ListItem,
  ListItemText,
  Avatar,
  Alert
} from '@mui/material';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import ShareIcon from '@mui/icons-material/Share';
import LocalDiningIcon from '@mui/icons-material/LocalDining';
import EventNoteIcon from '@mui/icons-material/EventNote';
import PersonIcon from '@mui/icons-material/Person';
import CloseIcon from '@mui/icons-material/Close';
import RecipeFormDialog from './RecipeFormDialog';

// グレーのダミー画像URL（実際のデプロイ時には差し替える）
const DUMMY_IMAGE_URL = 'data:image/svg+xml;charset=UTF-8,%3Csvg xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22 width%3D%22320%22 height%3D%22180%22 viewBox%3D%220 0 320 180%22 fill%3D%22%23e0e0e0%22%3E%3Crect width%3D%22320%22 height%3D%22180%22%2F%3E%3C%2Fsvg%3E';

// カテゴリに対応するラベル
const CATEGORY_LABELS: Record<string, string> = {
  main: 'メイン料理',
  side: '副菜',
  soup: 'スープ・汁物',
  salad: 'サラダ',
  rice: 'ご飯もの',
  noodle: '麺類',
  dessert: 'デザート',
  breakfast: '朝食',
  other: 'その他'
};

interface RecipeDetailsProps {
  recipe?: {
    id: string;
    name: string;
    description: string;
    imageUrl: string;
    cookingTime: number;
    prepTime?: number;
    servings?: number;
    category?: string;
    tags: string[];
    createdAt: string;
    ingredients?: Array<{ id: string; name: string; amount: string; unit: string }>;
    steps?: Array<{ id: string; description: string }>;
  } | null;
  open?: boolean; // ダイアログとして表示するかどうか
  onClose?: () => void; // ダイアログを閉じる関数
  onDelete?: (id: string) => void;
  onUpdate?: (updatedRecipe: any) => void;
}

const RecipeDetails: React.FC<RecipeDetailsProps> = ({ 
  recipe, 
  open = false,
  onClose,
  onDelete, 
  onUpdate 
}) => {
  // recipeがnullまたはundefinedの場合、エラーメッセージを表示
  if (!recipe) {
    if (open && onClose) {
      return (
        <Dialog
          open={open}
          onClose={onClose}
          maxWidth="sm"
          fullWidth
        >
          <DialogTitle>
            エラー
            <IconButton
              aria-label="close"
              onClick={onClose}
              sx={{
                position: 'absolute',
                right: 8,
                top: 8,
              }}
            >
              <CloseIcon />
            </IconButton>
          </DialogTitle>
          <DialogContent>
            <Alert severity="error" sx={{ mt: 2 }}>
              レシピデータが見つかりません。
            </Alert>
          </DialogContent>
          <DialogActions>
            <Button onClick={onClose}>閉じる</Button>
          </DialogActions>
        </Dialog>
      );
    }
    
    return (
      <Box sx={{ mt: 2 }}>
        <Alert severity="error">
          レシピデータが見つかりません。
        </Alert>
      </Box>
    );
  }
  
  const { id, name, description, imageUrl, cookingTime, tags } = recipe;
  
  // 状態
  const [isFavorite, setIsFavorite] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  
  // タブセクションの状態
  const [activeSection, setActiveSection] = useState<'ingredients' | 'steps'>('ingredients');

  // レシピ更新処理
  const handleUpdateRecipe = (updatedRecipe: any) => {
    if (onUpdate) {
      // 既存のデータと更新データをマージ
      const mergedRecipe = {
        ...recipe,
        ...updatedRecipe,
        imageUrl: recipe.imageUrl, // 画像URLは既存のものを保持
      };
      onUpdate(mergedRecipe);
    }
    setEditDialogOpen(false);
  };

  // お気に入りの切り替え
  const handleToggleFavorite = () => {
    setIsFavorite(!isFavorite);
  };
  
  // レシピの削除
  const handleDelete = () => {
    if (onDelete) {
      onDelete(id);
    }
    setDeleteDialogOpen(false);
  };
  
  // フォーマットされた日付
  const formattedDate = new Date(recipe.createdAt).toLocaleDateString('ja-JP', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  // ダイアログとして表示する場合
  if (open) {
    return (
      <Dialog
        open={open}
        onClose={onClose}
        maxWidth="md"
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
          p: 0,
          m: 0,
          position: 'absolute',
          right: 0,
          zIndex: 2,
        }}>
          <IconButton 
            edge="end" 
            onClick={onClose}
            sx={{ 
              color: 'white', 
              backgroundColor: 'rgba(0,0,0,0.2)',
              m: 1
            }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        
        <DialogContent sx={{ p: 0 }}>
          {/* ヘッダー部分 */}
          <Box 
            sx={{ 
              position: 'relative',
              height: { xs: 200, md: 300 },
              bgcolor: 'grey.100'
            }}
          >
            {/* レシピ画像 */}
            <Box
              component="img"
              src={imageUrl || DUMMY_IMAGE_URL}
              alt={name}
              sx={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
              }}
            />
            
            {/* オーバーレイとアクションボタン */}
            <Box
              sx={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                background: 'linear-gradient(to bottom, rgba(0,0,0,0.1) 0%, rgba(0,0,0,0.6) 100%)',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                p: 3,
              }}
            >
              {/* 上部アクション */}
              <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                {onUpdate && (
                  <IconButton 
                    sx={{ color: 'white', bgcolor: 'rgba(0,0,0,0.2)', mr: 1 }}
                    onClick={() => setEditDialogOpen(true)}
                  >
                    <EditIcon />
                  </IconButton>
                )}
                {onDelete && (
                  <IconButton 
                    sx={{ color: 'white', bgcolor: 'rgba(0,0,0,0.2)' }}
                    onClick={() => setDeleteDialogOpen(true)}
                  >
                    <DeleteIcon />
                  </IconButton>
                )}
              </Box>
              
              {/* タイトルと基本情報 */}
              <Box>
                <Typography variant="h4" component="h1" sx={{ color: 'white', fontWeight: 'bold', mb: 1 }}>
                  {name}
                </Typography>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 1 }}>
                  {tags.map((tag, index) => (
                    <Chip 
                      key={index}
                      label={tag}
                      size="small"
                      sx={{ 
                        bgcolor: 'rgba(255,255,255,0.9)', 
                        color: 'text.primary',
                        fontWeight: 500
                      }}
                    />
                  ))}
                </Box>
                
                <Box sx={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: 2 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <AccessTimeIcon fontSize="small" sx={{ color: 'white', mr: 0.5 }} />
                    <Typography variant="body2" sx={{ color: 'white' }}>
                      {cookingTime}分
                    </Typography>
                  </Box>
                </Box>
              </Box>
            </Box>
          </Box>
          
          {/* コンテンツ部分 */}
          <Box sx={{ p: 3 }}>
            {/* 説明文 */}
            <Typography variant="body1" sx={{ mb: 3 }}>
              {description}
            </Typography>
            
            {/* アクションボタン */}
            <Box sx={{ display: 'flex', mb: 3, gap: 2 }}>
              <Button 
                variant="contained" 
                color={isFavorite ? "error" : "primary"}
                startIcon={isFavorite ? <FavoriteIcon /> : <FavoriteBorderIcon />}
                onClick={handleToggleFavorite}
              >
                {isFavorite ? 'お気に入り済み' : 'お気に入りに追加'}
              </Button>
              <Button 
                variant="outlined"
                startIcon={<ShareIcon />}
                onClick={() => console.log('Share recipe')}
              >
                共有
              </Button>
            </Box>
            
            {/* セクションナビゲーション */}
            <Box sx={{ display: 'flex', mb: 2 }}>
              <Button
                variant={activeSection === 'ingredients' ? 'contained' : 'text'}
                onClick={() => setActiveSection('ingredients')}
                sx={{ borderRadius: '8px 0 0 8px', flexGrow: 1 }}
              >
                材料
              </Button>
              <Button
                variant={activeSection === 'steps' ? 'contained' : 'text'}
                onClick={() => setActiveSection('steps')}
                sx={{ borderRadius: '0 8px 8px 0', flexGrow: 1 }}
              >
                作り方
              </Button>
            </Box>
            
            {/* 材料セクション */}
            {activeSection === 'ingredients' && (
              <Card variant="outlined" sx={{ mb: 3 }}>
                <CardContent>
                  <Typography variant="h6" component="h2" sx={{ mb: 2, display: 'flex', alignItems: 'center' }}>
                    <LocalDiningIcon sx={{ mr: 1 }} />
                    材料
                    <Typography variant="body2" color="text.secondary" sx={{ ml: 2 }}>
                      {recipe.servings || 2}人前
                    </Typography>
                  </Typography>
                  
                  <Divider sx={{ mb: 2 }} />
                  
                  <List sx={{ pt: 0 }}>
                    {recipe.ingredients && recipe.ingredients.length > 0 ? (
                      recipe.ingredients.map((ingredient, index) => (
                        <React.Fragment key={ingredient.id || index}>
                          <ListItem sx={{ py: 1 }}>
                            <ListItemText 
                              primary={ingredient.name} 
                              sx={{ flex: '1 1 70%' }}
                            />
                            <Typography variant="body2" color="text.secondary" sx={{ flex: '1 1 30%', textAlign: 'right' }}>
                              {ingredient.amount} {ingredient.unit}
                            </Typography>
                          </ListItem>
                          {index < (recipe.ingredients?.length || 0) - 1 && <Divider component="li" />}
                        </React.Fragment>
                      ))
                    ) : (
                      <Typography variant="body2" color="text.secondary" sx={{ py: 2, textAlign: 'center' }}>
                        材料情報がありません
                      </Typography>
                    )}
                  </List>
                </CardContent>
              </Card>
            )}
            
            {/* 手順セクション */}
            {activeSection === 'steps' && (
              <Card variant="outlined" sx={{ mb: 3 }}>
                <CardContent>
                  <Typography variant="h6" component="h2" sx={{ mb: 2, display: 'flex', alignItems: 'center' }}>
                    <EventNoteIcon sx={{ mr: 1 }} />
                    作り方
                  </Typography>
                  
                  <Divider sx={{ mb: 2 }} />
                  
                  <List sx={{ pt: 0 }}>
                    {recipe.steps && recipe.steps.length > 0 ? (
                      recipe.steps.map((step, index) => (
                        <React.Fragment key={step.id || index}>
                          <ListItem alignItems="flex-start" sx={{ py: 1.5 }}>
                            <Avatar 
                              sx={{ 
                                bgcolor: 'primary.main', 
                                width: 28, 
                                height: 28, 
                                fontSize: '0.875rem',
                                mr: 2,
                                mt: 0.5
                              }}
                            >
                              {index + 1}
                            </Avatar>
                            <ListItemText primary={step.description} />
                          </ListItem>
                          {index < (recipe.steps?.length || 0) - 1 && <Divider component="li" />}
                        </React.Fragment>
                      ))
                    ) : (
                      <Typography variant="body2" color="text.secondary" sx={{ py: 2, textAlign: 'center' }}>
                        調理手順情報がありません
                      </Typography>
                    )}
                  </List>
                </CardContent>
              </Card>
            )}
            
            {/* 作成情報 */}
            <Box sx={{ display: 'flex', alignItems: 'center', mt: 3, color: 'text.secondary' }}>
              <PersonIcon fontSize="small" sx={{ mr: 0.5 }} />
              <Typography variant="body2" sx={{ mr: 1 }}>
                作成者: ユーザー
              </Typography>
              <Typography variant="body2">
                {formattedDate}に作成
              </Typography>
            </Box>
          </Box>
        </DialogContent>
        
        {/* 削除確認ダイアログ */}
        <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)}>
          <DialogTitle>レシピの削除</DialogTitle>
          <DialogContent>
            <Typography>
              「{name}」を削除してもよろしいですか？この操作は元に戻せません。
            </Typography>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setDeleteDialogOpen(false)}>キャンセル</Button>
            <Button onClick={handleDelete} color="error" variant="contained">
              削除する
            </Button>
          </DialogActions>
        </Dialog>

        {/* 編集ダイアログ */}
        <RecipeFormDialog
          open={editDialogOpen}
          onClose={() => setEditDialogOpen(false)}
          onSave={handleUpdateRecipe}
          editRecipe={recipe}
        />
      </Dialog>
    );
  }
  
  // 通常のコンポーネントとして表示する場合
  return (
    <Box sx={{ mt: 2 }}>
      <Paper elevation={0} sx={{ overflow: 'hidden', borderRadius: 2 }}>
        {/* ヘッダー部分 */}
        <Box 
          sx={{ 
            position: 'relative',
            height: { xs: 200, md: 300 },
            bgcolor: 'grey.100'
          }}
        >
          {/* レシピ画像 */}
          <Box
            component="img"
            src={imageUrl || DUMMY_IMAGE_URL}
            alt={name}
            sx={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
            }}
          />
          
          {/* オーバーレイとアクションボタン */}
          <Box
            sx={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: 'linear-gradient(to bottom, rgba(0,0,0,0.1) 0%, rgba(0,0,0,0.6) 100%)',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              p: 3,
            }}
          >
            {/* 上部アクション */}
            <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
              <IconButton 
                sx={{ color: 'white', bgcolor: 'rgba(0,0,0,0.2)', mr: 1 }}
                onClick={() => setEditDialogOpen(true)}
              >
                <EditIcon />
              </IconButton>
              <IconButton 
                sx={{ color: 'white', bgcolor: 'rgba(0,0,0,0.2)' }}
                onClick={() => setDeleteDialogOpen(true)}
              >
                <DeleteIcon />
              </IconButton>
            </Box>
            
            {/* タイトルと基本情報 */}
            <Box>
              <Typography variant="h4" component="h1" sx={{ color: 'white', fontWeight: 'bold', mb: 1 }}>
                {name}
              </Typography>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 1 }}>
                {tags.map((tag, index) => (
                  <Chip 
                    key={index}
                    label={tag}
                    size="small"
                    sx={{ 
                      bgcolor: 'rgba(255,255,255,0.9)', 
                      color: 'text.primary',
                      fontWeight: 500
                    }}
                  />
                ))}
              </Box>
              
              <Box sx={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: 2 }}>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <AccessTimeIcon fontSize="small" sx={{ color: 'white', mr: 0.5 }} />
                  <Typography variant="body2" sx={{ color: 'white' }}>
                    {cookingTime}分
                  </Typography>
                </Box>
              </Box>
            </Box>
          </Box>
        </Box>
        
        {/* コンテンツ部分 */}
        <Box sx={{ p: 3 }}>
          {/* 説明文 */}
          <Typography variant="body1" sx={{ mb: 3 }}>
            {description}
          </Typography>
          
          {/* アクションボタン */}
          <Box sx={{ display: 'flex', mb: 3, gap: 2 }}>
            <Button 
              variant="contained" 
              color={isFavorite ? "error" : "primary"}
              startIcon={isFavorite ? <FavoriteIcon /> : <FavoriteBorderIcon />}
              onClick={handleToggleFavorite}
            >
              {isFavorite ? 'お気に入り済み' : 'お気に入りに追加'}
            </Button>
            <Button 
              variant="outlined"
              startIcon={<ShareIcon />}
              onClick={() => console.log('Share recipe')}
            >
              共有
            </Button>
          </Box>
          
          {/* セクションナビゲーション */}
          <Box sx={{ display: 'flex', mb: 2 }}>
            <Button
              variant={activeSection === 'ingredients' ? 'contained' : 'text'}
              onClick={() => setActiveSection('ingredients')}
              sx={{ borderRadius: '8px 0 0 8px', flexGrow: 1 }}
            >
              材料
            </Button>
            <Button
              variant={activeSection === 'steps' ? 'contained' : 'text'}
              onClick={() => setActiveSection('steps')}
              sx={{ borderRadius: '0 8px 8px 0', flexGrow: 1 }}
            >
              作り方
            </Button>
          </Box>
          
          {/* 材料セクション */}
          {activeSection === 'ingredients' && (
            <Card variant="outlined" sx={{ mb: 3 }}>
              <CardContent>
                <Typography variant="h6" component="h2" sx={{ mb: 2, display: 'flex', alignItems: 'center' }}>
                  <LocalDiningIcon sx={{ mr: 1 }} />
                  材料
                  <Typography variant="body2" color="text.secondary" sx={{ ml: 2 }}>
                    {recipe.servings || 2}人前
                  </Typography>
                </Typography>
                
                <Divider sx={{ mb: 2 }} />
                
                <List sx={{ pt: 0 }}>
                  {recipe.ingredients && recipe.ingredients.length > 0 ? (
                    recipe.ingredients.map((ingredient, index) => (
                      <React.Fragment key={ingredient.id || index}>
                        <ListItem sx={{ py: 1 }}>
                          <ListItemText 
                            primary={ingredient.name} 
                            sx={{ flex: '1 1 70%' }}
                          />
                          <Typography variant="body2" color="text.secondary" sx={{ flex: '1 1 30%', textAlign: 'right' }}>
                            {ingredient.amount} {ingredient.unit}
                          </Typography>
                        </ListItem>
                        {index < (recipe.ingredients?.length || 0) - 1 && <Divider component="li" />}
                      </React.Fragment>
                    ))
                  ) : (
                    <Typography variant="body2" color="text.secondary" sx={{ py: 2, textAlign: 'center' }}>
                      材料情報がありません
                    </Typography>
                  )}
                </List>
              </CardContent>
            </Card>
          )}
          
          {/* 手順セクション */}
          {activeSection === 'steps' && (
            <Card variant="outlined" sx={{ mb: 3 }}>
              <CardContent>
                <Typography variant="h6" component="h2" sx={{ mb: 2, display: 'flex', alignItems: 'center' }}>
                  <EventNoteIcon sx={{ mr: 1 }} />
                  作り方
                </Typography>
                
                <Divider sx={{ mb: 2 }} />
                
                <List sx={{ pt: 0 }}>
                  {recipe.steps && recipe.steps.length > 0 ? (
                    recipe.steps.map((step, index) => (
                      <React.Fragment key={step.id || index}>
                        <ListItem alignItems="flex-start" sx={{ py: 1.5 }}>
                          <Avatar 
                            sx={{ 
                              bgcolor: 'primary.main', 
                              width: 28, 
                              height: 28, 
                              fontSize: '0.875rem',
                              mr: 2,
                              mt: 0.5
                            }}
                          >
                            {index + 1}
                          </Avatar>
                          <ListItemText primary={step.description} />
                        </ListItem>
                        {index < (recipe.steps?.length || 0) - 1 && <Divider component="li" />}
                      </React.Fragment>
                    ))
                  ) : (
                    <Typography variant="body2" color="text.secondary" sx={{ py: 2, textAlign: 'center' }}>
                      調理手順情報がありません
                    </Typography>
                  )}
                </List>
              </CardContent>
            </Card>
          )}
          
          {/* 作成情報 */}
          <Box sx={{ display: 'flex', alignItems: 'center', mt: 3, color: 'text.secondary' }}>
            <PersonIcon fontSize="small" sx={{ mr: 0.5 }} />
            <Typography variant="body2" sx={{ mr: 1 }}>
              作成者: ユーザー
            </Typography>
            <Typography variant="body2">
              {formattedDate}に作成
            </Typography>
          </Box>
        </Box>
      </Paper>
      
      {/* 削除確認ダイアログ */}
      <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)}>
        <DialogTitle>レシピの削除</DialogTitle>
        <DialogContent>
          <Typography>
            「{name}」を削除してもよろしいですか？この操作は元に戻せません。
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)}>キャンセル</Button>
          <Button onClick={handleDelete} color="error" variant="contained">
            削除する
          </Button>
        </DialogActions>
      </Dialog>

      {/* 編集ダイアログ */}
      <RecipeFormDialog
        open={editDialogOpen}
        onClose={() => setEditDialogOpen(false)}
        onSave={handleUpdateRecipe}
        editRecipe={recipe}
      />
    </Box>
  );
};

export default RecipeDetails;