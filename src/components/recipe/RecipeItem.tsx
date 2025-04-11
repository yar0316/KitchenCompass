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

interface RecipeItemProps {
  recipe: {
    id: string;
    name: string;
    description: string;
    imageUrl: string;
    cookingTime: number;
    difficulty: string;
    tags: string[];
    rating: number;
  };
  onClick: () => void;
}

const RecipeItem: React.FC<RecipeItemProps> = ({ recipe, onClick }) => {
  const { name, description, imageUrl, cookingTime, difficulty, tags, rating } = recipe;
  
  return (
    <Card 
      elevation={2}
      sx={{ 
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        transition: 'transform 0.2s, box-shadow 0.2s',
        '&:hover': {
          transform: 'translateY(-4px)',
          boxShadow: 6,
        }
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
          image={imageUrl}
          alt={name}
          sx={{
            objectFit: 'cover'
          }}
        />
        
        <CardContent sx={{ p: 2, flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
          {/* レシピ名 */}
          <Typography gutterBottom variant="h6" component="h2" sx={{ mb: 0.5, lineHeight: 1.3 }}>
            {name}
          </Typography>
          
          {/* 評価 */}
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
            <Rating value={rating} precision={0.5} size="small" readOnly />
            <Typography variant="body2" color="text.secondary" sx={{ ml: 0.5 }}>
              {rating?.toFixed(1)}
            </Typography>
          </Box>
          
          {/* 説明文 */}
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
              flexGrow: 1
            }}
          >
            {description}
          </Typography>
          
          {/* 調理時間と難易度 */}
          <Box sx={{ 
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            mt: 'auto'
          }}>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <AccessTimeIcon fontSize="small" color="action" sx={{ mr: 0.5 }} />
              <Typography variant="body2" color="text.secondary">
                {cookingTime}分
              </Typography>
            </Box>
            
            <Chip 
              label={DIFFICULTY_LABELS[difficulty]} 
              color={DIFFICULTY_COLORS[difficulty] as "success" | "primary" | "error"}
              size="small"
            />
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