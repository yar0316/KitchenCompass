import React from 'react';
import { 
  Card, 
  Typography, 
  CardActionArea,
  Chip
} from '@mui/material';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { MenuItemData } from '../types/Menu.types';

interface MenuItemCardProps {
  item: MenuItemData;
  date: Date;
  mealType: 'breakfast' | 'lunch' | 'dinner';
  onItemClick: () => void;
}

/**
 * 個別のメニューアイテムを表示するカードコンポーネント
 */
const MenuItemCard: React.FC<MenuItemCardProps> = ({ 
  item, 
  date, 
  mealType, 
  onItemClick 
}) => {
  // ユニークなID生成（日付+食事タイプ+アイテムID）
  const itemId = `item-${date.toISOString()}-${mealType}-${item.id}`;
  
  // DnD-kitのドラッグ機能を使用
  const {
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
      isMenuItem: true  // これがメニューアイテム単体であることを明示
    }
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.4 : 1,
    zIndex: isDragging ? 100 : 1,
  };

  // クリック時の処理を制御
  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation(); // イベントの伝搬を止める
    onItemClick();
  };

  return (
    <Card
      ref={setNodeRef}
      variant="outlined"
      sx={{
        mb: 0.5,
        display: 'flex',
        bgcolor: 'background.paper',
        position: 'relative',
        border: '1px solid',
        borderColor: isDragging ? 'primary.main' : 'divider',
        ...style,
        cursor: 'grab', // ドラッグ可能であることを示すカーソル
      }}
    >
      <CardActionArea 
        onClick={handleClick}
        sx={{ 
          display: 'flex', 
          alignItems: 'center',
          justifyContent: 'space-between',
          width: '100%',
          p: 0.75,
          px: 1.5
        }}
      >
        <Typography 
          variant="body2" 
          sx={{ 
            fontWeight: item.recipeId ? 500 : 400,
            mr: 1
          }}
        >
          {item.name}
        </Typography>
        
        {item.recipeId && (
          <Chip 
            label="レシピ" 
            size="small" 
            color="primary" 
            variant="outlined"
            sx={{ 
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