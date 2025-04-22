import React from 'react';
import { 
  Card, 
  Typography, 
  Box, 
  CardActionArea,
  Chip
} from '@mui/material';
import RestaurantMenuIcon from '@mui/icons-material/RestaurantMenu';
import DragIndicatorIcon from '@mui/icons-material/DragIndicator';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

interface MenuItem {
  id: string;
  name: string;
  recipeId: string | null;
}

interface MenuItemCardProps {
  item: MenuItem;
  date: Date;
  mealType: 'breakfast' | 'lunch' | 'dinner';
  index: number;
  onItemClick?: (item: MenuItem) => void;
  setMenuItemRef?: (ref: HTMLElement | null, id: string) => void;
}

const MenuItemCard: React.FC<MenuItemCardProps> = ({
  item,
  date,
  mealType,
  index,
  onItemClick,
  setMenuItemRef
}) => {
  // ユニークなID（日付 + タイプ + アイテムID）
  const itemId = `item-${date.toISOString()}-${mealType}-${item.id}`;
  
  // DnD-kitのソート機能を使用
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging
  } = useSortable({
    id: itemId,
    data: {
      type: 'menuItem',
      item,
      date,
      mealType,
      index,
      itemId
    }
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.6 : 1,
    zIndex: isDragging ? 5 : 1,
  };

  // 参照を親コンポーネントに渡す（オプション）
  const handleRefSet = (node: HTMLElement | null) => {
    setNodeRef(node);
    if (setMenuItemRef) {
      setMenuItemRef(node, itemId);
    }
  };

  // クリックハンドラ
  const handleClick = () => {
    if (onItemClick) {
      onItemClick(item);
    }
  };

  // デバッグ用：プロパティの確認
  React.useEffect(() => {
    if (process.env.NODE_ENV === 'development') {
      console.debug(`MenuItemCard rendered: ${itemId}`, {
        item,
        date: date.toISOString(),
        mealType
      });
    }
  }, [item, date, mealType, itemId]);

  return (
    <Card
      ref={handleRefSet}
      variant="outlined"
      sx={{
        mb: 0.5,
        display: 'flex',
        borderRadius: 1,
        border: '1px solid',
        borderColor: isDragging ? 'primary.main' : 'divider',
        backgroundColor: isDragging ? 'primary.50' : 'background.paper',
        boxShadow: isDragging ? 2 : 0,
        '&:hover': {
          borderColor: 'primary.light',
          backgroundColor: 'action.hover',
        },
        ...style
      }}
      {...attributes}
    >
      <Box
        {...listeners}
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          px: 0.5,
          cursor: 'grab',
          color: 'text.secondary',
          '&:hover': {
            color: 'primary.main'
          }
        }}
      >
        <DragIndicatorIcon fontSize="small" />
      </Box>
      
      <CardActionArea
        onClick={handleClick}
        sx={{
          py: 0.5,
          px: 1,
          display: 'flex',
          justifyContent: 'flex-start',
          alignItems: 'center',
          flex: 1
        }}
      >
        <Typography
          variant="body2"
          sx={{
            fontSize: '0.8rem',
            lineHeight: 1.2,
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
            flex: 1
          }}
        >
          {item.name}
        </Typography>
        
        {item.recipeId && (
          <Chip
            icon={<RestaurantMenuIcon fontSize="small" />}
            label="レシピ"
            size="small"
            variant="outlined"
            color="primary"
            sx={{
              ml: 0.5,
              height: 20,
              fontSize: '0.625rem',
              '& .MuiChip-label': { px: 0.5 }
            }}
          />
        )}
      </CardActionArea>
    </Card>
  );
};

export default MenuItemCard;
