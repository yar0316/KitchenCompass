import React from 'react';
import { 
  Box, 
  Paper, 
  Typography, 
  IconButton,
  Chip,
  alpha
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EventIcon from '@mui/icons-material/Event';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { green, grey } from '@mui/material/colors';
import { format } from 'date-fns';
import { ja } from 'date-fns/locale';

interface ShoppingListItemProps {
  list: {
    id: string;
    name: string;
    description?: string;
    dueDate: string | null;
    isCompleted: boolean;
    itemCount: number;
    completedCount: number;
  };
  isSelected: boolean;
  onSelect: () => void;
  onDelete: () => void;
}

const ShoppingListItem: React.FC<ShoppingListItemProps> = ({ 
  list, 
  isSelected, 
  onSelect, 
  onDelete 
}) => {
  const { name, description, dueDate, isCompleted, itemCount, completedCount } = list;
  
  // 日付のフォーマット
  const formattedDate = dueDate 
    ? format(new Date(dueDate), 'M月d日(E)', { locale: ja }) 
    : null;
    
  // 進捗率の計算
  const progress = itemCount > 0 ? Math.round((completedCount / itemCount) * 100) : 0;
  
  return (
    <Paper
      elevation={isSelected ? 3 : 1}
      sx={{
        p: 1.5,
        cursor: 'pointer',
        bgcolor: isSelected ? (theme) => alpha(theme.palette.primary.main, 0.08) : 'background.paper',
        '&:hover': {
          bgcolor: (theme) => isSelected 
            ? alpha(theme.palette.primary.main, 0.12) 
            : alpha(theme.palette.primary.main, 0.04)
        },
        borderLeft: isSelected ? 4 : 0,
        borderColor: 'primary.main',
        borderLeftStyle: 'solid',
        transition: 'all 0.2s',
        position: 'relative',
        opacity: isCompleted ? 0.7 : 1,
      }}
      onClick={onSelect}
    >
      <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
        <Box sx={{ flex: 1, pr: 1 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Typography 
              variant="subtitle1" 
              component="h3" 
              sx={{ 
                fontWeight: 'medium',
                textDecoration: isCompleted ? 'line-through' : 'none',
              }}
            >
              {name}
            </Typography>
            {isCompleted && (
              <CheckCircleIcon fontSize="small" sx={{ color: green[500] }} />
            )}
          </Box>
          
          {description && (
            <Typography 
              variant="body2" 
              color="textSecondary" 
              sx={{ 
                mt: 0.5,
                display: '-webkit-box',
                WebkitBoxOrient: 'vertical',
                WebkitLineClamp: 1,
                overflow: 'hidden',
                textOverflow: 'ellipsis'
              }}
            >
              {description}
            </Typography>
          )}
          
          <Box sx={{ display: 'flex', alignItems: 'center', mt: 1, gap: 1 }}>
            {formattedDate && (
              <Chip
                icon={<EventIcon fontSize="small" />}
                label={formattedDate}
                size="small"
                variant="outlined"
                color="primary"
                sx={{ height: 24 }}
              />
            )}
            
            <Chip
              label={`${completedCount}/${itemCount}項目`}
              size="small"
              sx={{ 
                height: 24,
                bgcolor: isCompleted 
                  ? green[100] 
                  : grey[100],
                color: isCompleted 
                  ? green[800] 
                  : grey[800],
              }}
            />
          </Box>
        </Box>
        
        <IconButton 
          size="small" 
          color="error" 
          onClick={(e) => {
            e.stopPropagation();
            onDelete();
          }}
          sx={{ 
            opacity: 0.6,
            '&:hover': {
              opacity: 1
            }
          }}
        >
          <DeleteIcon fontSize="small" />
        </IconButton>
      </Box>
      
      {/* 進捗バー */}
      <Box
        sx={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          height: 3,
          width: `${progress}%`,
          bgcolor: isCompleted ? green[500] : 'primary.main',
          transition: 'width 0.3s ease-in-out',
        }}
      />
    </Paper>
  );
};

export default ShoppingListItem;