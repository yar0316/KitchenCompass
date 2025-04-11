import React from 'react';
import {
  Card,
  CardActionArea,
  CardContent,
  CardMedia,
  Typography,
  Box,
  Chip,
  Rating
} from '@mui/material';
import AccessTimeIcon from '@mui/icons-material/AccessTime';

// グレーのダミー画像URL（実際のデプロイ時には差し替える）
const DUMMY_IMAGE_URL = 'data:image/svg+xml;charset=UTF-8,%3Csvg xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22 width%3D%22320%22 height%3D%22180%22 viewBox%3D%220 0 320 180%22 fill%3D%22%23e0e0e0%22%3E%3Crect width%3D%22320%22 height%3D%22180%22%2F%3E%3C%2Fsvg%3E';

interface RecipeItemProps {
  recipe: {
    id: string;
    name: string;
    description: string;
    imageUrl: string;
    cookingTime: number;
    tags: string[];
    rating: number;
  };
  onClick: () => void;
}

const RecipeItem: React.FC<RecipeItemProps> = ({ recipe, onClick }) => {
  const { name, description, imageUrl, cookingTime, tags, rating } = recipe;
  
  return (
    <Card 
      elevation={2}
      sx={{ 
        height: 320, // 高さは固定
        width: '100%', // 親要素の幅いっぱいに広げる
        display: 'flex',
        flexDirection: 'column',
        transition: 'transform 0.2s, box-shadow 0.2s',
        '&:hover': {
          transform: 'translateY(-4px)',
          boxShadow: 6,
        },
        // 最小幅と最大幅の制限を削除して親要素に合わせる
      }}
    >
      <CardActionArea 
        onClick={onClick}
        sx={{ 
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'stretch'
        }}
      >
        <CardMedia
          component="img"
          height="160"
          // ダミー画像を使用
          image={DUMMY_IMAGE_URL}
          alt={name}
          sx={{
            objectFit: 'cover'
          }}
        />
        
        <CardContent sx={{ 
          p: 2, 
          flexGrow: 1, 
          display: 'flex', 
          flexDirection: 'column',
          height: 180 // 内容部分の高さを固定
        }}>
          {/* レシピ名 - 高さ固定 */}
          <Typography 
            gutterBottom 
            variant="h6" 
            component="h2" 
            sx={{ 
              mb: 0.5, 
              lineHeight: 1.3,
              height: 50, // タイトルの高さを固定
              overflow: 'hidden',
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical',
            }}
          >
            {name}
          </Typography>
          
          {/* 評価 */}
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
            <Rating value={rating} precision={0.5} size="small" readOnly />
            <Typography variant="body2" color="text.secondary" sx={{ ml: 0.5 }}>
              {rating?.toFixed(1)}
            </Typography>
          </Box>
          
          {/* 説明文 - 高さ固定 */}
          <Typography 
            variant="body2" 
            color="text.secondary"
            sx={{
              mb: 1.5,
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical',
              lineHeight: 1.3,
              height: 40, // 説明文の高さを固定
            }}
          >
            {description}
          </Typography>
          
          {/* 調理時間（難易度を削除） */}
          <Box sx={{ 
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'flex-start', // 左寄せに変更
            mt: 'auto'
          }}>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <AccessTimeIcon fontSize="small" color="action" sx={{ mr: 0.5 }} />
              <Typography variant="body2" color="text.secondary">
                {cookingTime}分
              </Typography>
            </Box>
          </Box>
          
          {/* タグ（最初の1つだけ表示） */}
          {tags && tags.length > 0 && (
            <Box sx={{ mt: 1 }}>
              <Chip 
                label={tags[0]}
                size="small"
                variant="outlined"
                sx={{ borderRadius: 1 }}
              />
              {tags.length > 1 && (
                <Typography 
                  variant="caption" 
                  color="text.secondary"
                  sx={{ ml: 1 }}
                >
                  +{tags.length - 1}
                </Typography>
              )}
            </Box>
          )}
        </CardContent>
      </CardActionArea>
    </Card>
  );
};

export default RecipeItem;