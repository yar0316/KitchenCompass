import React from 'react';
import {
  Box,
  Typography,
  IconButton,
  Chip,
  Avatar
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import ShareIcon from '@mui/icons-material/Share';
import PersonIcon from '@mui/icons-material/Person';
import { RecipeHeaderProps, CATEGORY_LABELS } from '../types/RecipeDetailsTypes';

/**
 * レシピヘッダーコンポーネント
 * レシピのタイトル、画像、操作ボタンを表示
 */
const RecipeHeader: React.FC<RecipeHeaderProps> = ({
  recipe,
  onEdit,
  onDelete,
  onFavoriteToggle,
  isFavorite
}) => {
  return (
    <Box sx={{ position: 'relative', mb: 3 }}>
      {/* レシピ画像 */}
      <Box 
        sx={{ 
          width: '100%', 
          height: 300,
          backgroundImage: `url(${recipe.imageUrl})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          borderRadius: 2,
          position: 'relative',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          p: 2
        }}
      >
        {/* 上部のボタン群 */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <Box sx={{ display: 'flex', gap: 1 }}>
            {recipe.category && (
              <Chip 
                label={CATEGORY_LABELS[recipe.category] || recipe.category}
                size="small"
                sx={{ 
                  bgcolor: 'rgba(255, 255, 255, 0.9)',
                  color: 'text.primary'
                }}
              />
            )}
          </Box>
          
          <Box sx={{ display: 'flex', gap: 0.5 }}>
            <IconButton
              onClick={onFavoriteToggle}
              sx={{ 
                bgcolor: 'rgba(255, 255, 255, 0.9)',
                '&:hover': { bgcolor: 'rgba(255, 255, 255, 1)' },
                width: 40,
                height: 40
              }}
            >
              {isFavorite ? (
                <FavoriteIcon sx={{ color: 'red' }} />
              ) : (
                <FavoriteBorderIcon />
              )}
            </IconButton>
            
            <IconButton
              onClick={() => {/* シェア機能は将来実装 */}}
              sx={{ 
                bgcolor: 'rgba(255, 255, 255, 0.9)',
                '&:hover': { bgcolor: 'rgba(255, 255, 255, 1)' },
                width: 40,
                height: 40
              }}
            >
              <ShareIcon />
            </IconButton>
            
            <IconButton
              onClick={onEdit}
              sx={{ 
                bgcolor: 'rgba(255, 255, 255, 0.9)',
                '&:hover': { bgcolor: 'rgba(255, 255, 255, 1)' },
                width: 40,
                height: 40
              }}
            >
              <EditIcon />
            </IconButton>
            
            <IconButton
              onClick={onDelete}
              sx={{ 
                bgcolor: 'rgba(255, 255, 255, 0.9)',
                '&:hover': { bgcolor: 'rgba(255, 255, 255, 1)' },
                width: 40,
                height: 40
              }}
            >
              <DeleteIcon />
            </IconButton>
          </Box>
        </Box>

        {/* 下部のレシピタイトルと作成者情報 */}
        <Box>
          <Typography 
            variant="h4" 
            component="h1" 
            sx={{ 
              color: 'white',
              fontWeight: 'bold',
              textShadow: '2px 2px 4px rgba(0,0,0,0.7)',
              mb: 1
            }}
          >
            {recipe.name}
          </Typography>
          
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Avatar sx={{ width: 24, height: 24 }}>
              <PersonIcon sx={{ fontSize: 16 }} />
            </Avatar>
            <Typography 
              variant="body2" 
              sx={{ 
                color: 'white',
                textShadow: '1px 1px 2px rgba(0,0,0,0.7)'
              }}
            >
              作成日: {new Date(recipe.createdAt).toLocaleDateString('ja-JP')}
            </Typography>
          </Box>
        </Box>
      </Box>

      {/* レシピの説明 */}
      {recipe.description && (
        <Typography variant="body1" sx={{ mb: 2, color: 'text.secondary' }}>
          {recipe.description}
        </Typography>
      )}
    </Box>
  );
};

export default RecipeHeader;
