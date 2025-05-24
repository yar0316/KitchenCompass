import React from 'react';
import {
  Box,
  Button,
  IconButton
} from '@mui/material';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import ShareIcon from '@mui/icons-material/Share';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';

interface RecipeActionsProps {
  isFavorite: boolean;
  onFavoriteToggle: () => void;
  onEdit?: () => void;
  onDelete?: () => void;
  onShare?: () => void;
  showEditDelete?: boolean;
  variant?: 'buttons' | 'icons';
}

/**
 * レシピアクションコンポーネント
 * お気に入り、編集、削除、共有ボタンを表示
 */
const RecipeActions: React.FC<RecipeActionsProps> = ({
  isFavorite,
  onFavoriteToggle,
  onEdit,
  onDelete,
  onShare,
  showEditDelete = true,
  variant = 'buttons'
}) => {
  const handleShare = () => {
    if (onShare) {
      onShare();
    } else {
      console.log('Share recipe');
    }
  };

  if (variant === 'icons') {
    return (
      <Box sx={{ display: 'flex', gap: 1 }}>
        <IconButton 
          sx={{ color: 'white', bgcolor: 'rgba(0,0,0,0.2)' }}
          onClick={onFavoriteToggle}
        >
          {isFavorite ? <FavoriteIcon /> : <FavoriteBorderIcon />}
        </IconButton>
        <IconButton 
          sx={{ color: 'white', bgcolor: 'rgba(0,0,0,0.2)' }}
          onClick={handleShare}
        >
          <ShareIcon />
        </IconButton>
        {showEditDelete && onEdit && (
          <IconButton 
            sx={{ color: 'white', bgcolor: 'rgba(0,0,0,0.2)' }}
            onClick={onEdit}
          >
            <EditIcon />
          </IconButton>
        )}
        {showEditDelete && onDelete && (
          <IconButton 
            sx={{ color: 'white', bgcolor: 'rgba(0,0,0,0.2)' }}
            onClick={onDelete}
          >
            <DeleteIcon />
          </IconButton>
        )}
      </Box>
    );
  }

  return (
    <Box sx={{ display: 'flex', mb: 3, gap: 2 }}>
      <Button 
        variant="contained" 
        color={isFavorite ? "error" : "primary"}
        startIcon={isFavorite ? <FavoriteIcon /> : <FavoriteBorderIcon />}
        onClick={onFavoriteToggle}
      >
        {isFavorite ? 'お気に入り済み' : 'お気に入りに追加'}
      </Button>
      <Button 
        variant="outlined"
        startIcon={<ShareIcon />}
        onClick={handleShare}
      >
        共有
      </Button>
    </Box>
  );
};

export default RecipeActions;
