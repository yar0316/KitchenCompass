import React from 'react';
import {
  Box,
  Typography,
  Paper,
  Chip
} from '@mui/material';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import LocalDiningIcon from '@mui/icons-material/LocalDining';
import { RecipeInfoProps } from '../types/RecipeDetailsTypes';

/**
 * レシピ基本情報コンポーネント
 * 調理時間、人数、タグなどの基本情報を表示
 */
const RecipeInfo: React.FC<RecipeInfoProps> = ({ recipe }) => {
  return (
    <Paper elevation={1} sx={{ p: 3, mb: 3 }}>
      <Typography variant="h6" sx={{ mb: 2, fontWeight: 'bold' }}>
        基本情報
      </Typography>
      
      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, mb: 2 }}>
        {/* 調理時間 */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <AccessTimeIcon color="action" />
          <Typography variant="body2" color="text.secondary">
            調理時間:
          </Typography>
          <Typography variant="body2" fontWeight="medium">
            {recipe.cookingTime}分
          </Typography>
        </Box>

        {/* 下準備時間 */}
        {recipe.prepTime && (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <AccessTimeIcon color="action" />
            <Typography variant="body2" color="text.secondary">
              下準備:
            </Typography>
            <Typography variant="body2" fontWeight="medium">
              {recipe.prepTime}分
            </Typography>
          </Box>
        )}

        {/* 人数 */}
        {recipe.servings && (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <LocalDiningIcon color="action" />
            <Typography variant="body2" color="text.secondary">
              人数:
            </Typography>
            <Typography variant="body2" fontWeight="medium">
              {recipe.servings}人分
            </Typography>
          </Box>
        )}
      </Box>

      {/* タグ */}
      {recipe.tags && recipe.tags.length > 0 && (
        <Box>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
            タグ:
          </Typography>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
            {recipe.tags.map((tag, index) => (
              <Chip
                key={index}
                label={tag}
                size="small"
                variant="outlined"
                sx={{ fontSize: '0.75rem' }}
              />
            ))}
          </Box>
        </Box>
      )}
    </Paper>
  );
};

export default RecipeInfo;
