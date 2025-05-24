import React from 'react';
import {
  Box,
  Typography
} from '@mui/material';
import PersonIcon from '@mui/icons-material/Person';

interface RecipeMetadataProps {
  createdAt: string;
  author?: string;
}

/**
 * レシピメタデータコンポーネント
 * 作成者と作成日を表示
 */
const RecipeMetadata: React.FC<RecipeMetadataProps> = ({ 
  createdAt, 
  author = 'ユーザー' 
}) => {
  // フォーマットされた日付
  const formattedDate = new Date(createdAt).toLocaleDateString('ja-JP', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  return (
    <Box sx={{ display: 'flex', alignItems: 'center', mt: 3, color: 'text.secondary' }}>
      <PersonIcon fontSize="small" sx={{ mr: 0.5 }} />
      <Typography variant="body2" sx={{ mr: 1 }}>
        作成者: {author}
      </Typography>
      <Typography variant="body2">
        {formattedDate}に作成
      </Typography>
    </Box>
  );
};

export default RecipeMetadata;
