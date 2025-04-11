import React, { useState } from 'react';
import {
  Box,
  Typography,
  Paper,
  Button,
  Chip,
  Divider,
  Rating,
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
  Avatar
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

// 難易度に対応するラベル
const DIFFICULTY_LABELS: Record<string, string> = {
  easy: '簡単',
  medium: '普通',
  hard: '難しい'
};

// 難易度に対応する色
const DIFFICULTY_COLORS: Record<string, string> = {
  easy: 'success',
  medium: 'primary',
  hard: 'error'
};

// モック用の材料データ
const MOCK_INGREDIENTS = [
  { name: '牛肉（薄切り）', amount: '200g' },
  { name: 'じゃがいも', amount: '2個' },
  { name: 'にんじん', amount: '1本' },
  { name: '玉ねぎ', amount: '1個' },
  { name: 'しらたき', amount: '1袋' },
  { name: '醤油', amount: '大さじ3' },
  { name: '砂糖', amount: '大さじ2' },
  { name: 'みりん', amount: '大さじ2' },
  { name: '酒', amount: '大さじ1' },
  { name: 'サラダ油', amount: '適量' },
  { name: '水', amount: '300ml' }
];

// モック用の手順データ
const MOCK_STEPS = [
  'じゃがいも、にんじん、玉ねぎを一口大に切ります。しらたきは食べやすい長さに切ります。',
  'フライパンに油を熱し、牛肉を炒めます。色が変わったら野菜を加えて炒めます。',
  '水を加え、アクを取りながら中火で10分程度煮ます。',
  '醤油、砂糖、みりん、酒を加えて味付けし、さらに15分程度煮込みます。',
  '味が染み込んだら完成です。お好みで刻みねぎを散らしてお召し上がりください。'
];

interface RecipeDetailsProps {
  recipe: {
    id: string;
    name: string;
    description: string;
    imageUrl: string;
    cookingTime: number;
    difficulty: string;
    tags: string[];
    rating: number;
    createdAt: string;
  };
  onDelete: (id: string) => void;
}

const RecipeDetails: React.FC<RecipeDetailsProps> = ({ recipe, onDelete }) => {
  const { id, name, description, imageUrl, cookingTime, difficulty, tags, rating } = recipe;
  
  // 状態
  const [isFavorite, setIsFavorite] = useState(false);
  const [userRating, setUserRating] = useState<number | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  
  // タブセクションの状態
  const [activeSection, setActiveSection] = useState<'ingredients' | 'steps'>('ingredients');
  
  // お気に入りの切り替え
  const handleToggleFavorite = () => {
    setIsFavorite(!isFavorite);
  };
  
  // レシピの削除
  const handleDelete = () => {
    onDelete(id);
    setDeleteDialogOpen(false);
  };
  
  // フォーマットされた日付
  const formattedDate = new Date(recipe.createdAt).toLocaleDateString('ja-JP', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
  
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
            src={imageUrl}
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
                onClick={() => console.log('Edit recipe')}
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
                
                <Chip 
                  label={DIFFICULTY_LABELS[difficulty]} 
                  color={DIFFICULTY_COLORS[difficulty] as "success" | "primary" | "error"}
                  size="small"
                  sx={{ height: 24 }}
                />
                
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <Rating value={rating} precision={0.5} size="small" readOnly />
                  <Typography variant="body2" sx={{ ml: 0.5, color: 'white' }}>
                    {rating.toFixed(1)}
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
                    2人前
                  </Typography>
                </Typography>
                
                <Divider sx={{ mb: 2 }} />
                
                <List sx={{ pt: 0 }}>
                  {MOCK_INGREDIENTS.map((ingredient, index) => (
                    <React.Fragment key={index}>
                      <ListItem sx={{ py: 1 }}>
                        <ListItemText 
                          primary={ingredient.name} 
                          sx={{ flex: '1 1 70%' }}
                        />
                        <Typography variant="body2" color="text.secondary" sx={{ flex: '1 1 30%', textAlign: 'right' }}>
                          {ingredient.amount}
                        </Typography>
                      </ListItem>
                      {index < MOCK_INGREDIENTS.length - 1 && <Divider component="li" />}
                    </React.Fragment>
                  ))}
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
                  {MOCK_STEPS.map((step, index) => (
                    <React.Fragment key={index}>
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
                        <ListItemText primary={step} />
                      </ListItem>
                      {index < MOCK_STEPS.length - 1 && <Divider component="li" />}
                    </React.Fragment>
                  ))}
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
          
          {/* ユーザー評価セクション */}
          <Box sx={{ mt: 3 }}>
            <Typography variant="subtitle1" gutterBottom>
              このレシピを評価する
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <Rating
                name="user-rating"
                value={userRating}
                precision={0.5}
                onChange={(event, newValue) => {
                  setUserRating(newValue);
                }}
                size="large"
              />
              {userRating !== null && (
                <Typography variant="body2" sx={{ ml: 1 }}>
                  {userRating}
                </Typography>
              )}
            </Box>
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
    </Box>
  );
};

export default RecipeDetails;