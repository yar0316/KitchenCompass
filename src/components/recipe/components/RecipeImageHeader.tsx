import React from 'react';
import {
  Box,
  Typography,
  Chip,
  IconButton
} from '@mui/material';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import CloseIcon from '@mui/icons-material/Close';
import { RecipeDetailsData } from '../types/RecipeDetailsTypes';
import { DUMMY_IMAGE_URL } from '../../../mock/recipeData';
import RecipeActions from './RecipeActions';

interface RecipeImageHeaderProps {
  recipe: RecipeDetailsData;
  isDialog?: boolean;
  onClose?: () => void;
  isFavorite: boolean;
  onFavoriteToggle: () => void;
  onEdit?: () => void;
  onDelete?: () => void;
}

/**
 * レシピ画像ヘッダーコンポーネント
 * 画像、タイトル、基本情報のオーバーレイを表示
 */
const RecipeImageHeader: React.FC<RecipeImageHeaderProps> = ({
  recipe,
  isDialog = false,
  onClose,
  isFavorite,
  onFavoriteToggle,
  onEdit,
  onDelete
}) => {
  const { name, imageUrl, cookingTime, tags } = recipe;

  return (
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
        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
          <Box />
          <Box sx={{ display: 'flex', gap: 1 }}>
            {isDialog && onClose && (
              <IconButton 
                edge="end" 
                onClick={onClose}
                sx={{ 
                  color: 'white', 
                  backgroundColor: 'rgba(0,0,0,0.2)'
                }}
              >
                <CloseIcon />
              </IconButton>
            )}
            <RecipeActions
              variant="icons"
              isFavorite={isFavorite}
              onFavoriteToggle={onFavoriteToggle}
              onEdit={onEdit}
              onDelete={onDelete}
            />
          </Box>
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
  );
};

export default RecipeImageHeader;
