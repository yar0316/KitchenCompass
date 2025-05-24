import React from 'react';
import { 
  Box, 
  Typography, 
  Card, 
  Chip
} from '@mui/material';
import BreakfastDiningIcon from '@mui/icons-material/BreakfastDining';
import LunchDiningIcon from '@mui/icons-material/LunchDining';
import DinnerDiningIcon from '@mui/icons-material/DinnerDining';
import RestaurantIcon from '@mui/icons-material/Restaurant';
import AddIcon from '@mui/icons-material/Add';
import { useSortable } from '@dnd-kit/sortable';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { MealData, MenuItemData } from '../types/Menu.types';
import MenuItemCard from './MenuItemCard';

interface DraggableMealItemProps {
  meal: MealData;
  date: Date;
  onMealClick: (date: Date, mealType: 'breakfast' | 'lunch' | 'dinner', existingMeal: MealData | null) => void;
  onRecipeClick?: (recipeId: string) => void;
}

/**
 * ドラッグ可能な献立アイテムコンポーネント
 */
const DraggableMealItem: React.FC<DraggableMealItemProps> = ({ 
  meal, 
  date, 
  onMealClick,
  onRecipeClick
}) => {
  // ユニークなID（日付 + タイプ + ID）
  const itemId = `${date.toISOString()}-${meal.type}-${meal.id}`;
  
  // DnD-kitのソート機能を使用
  const {
    setNodeRef,
    transform,
    transition,
    isDragging
  } = useSortable({
    id: itemId,
    data: {
      type: 'meal',
      meal,
      date,
      mealType: meal.type
    }
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.4 : 1,
    zIndex: isDragging ? 100 : 1,
  };

  // 食事タイプに対応するアイコンを取得
  const getMealIcon = (mealType: string) => {
    switch (mealType) {
      case 'breakfast':
        return <BreakfastDiningIcon fontSize="small" />;
      case 'lunch':
        return <LunchDiningIcon fontSize="small" />;
      case 'dinner':
        return <DinnerDiningIcon fontSize="small" />;
      default:
        return null;
    }
  };
  
  // 食事タイプのラベルを取得
  const getMealLabel = (mealType: string) => {
    switch (mealType) {
      case 'breakfast':
        return '朝食';
      case 'lunch':
        return '昼食';
      case 'dinner':
        return '夕食';
      default:
        return '';
    }
  };

  // 複数のメニューアイテムがあるかどうかをチェック
  const hasMultipleItems = meal.menuItems && meal.menuItems.length > 1;
  
  // メニューアイテムのリストを取得（新形式と旧形式の両方に対応）
  const getMenuItems = () => {
    if (meal.menuItems && meal.menuItems.length > 0) {
      // 新形式: menuItemsプロパティを使用
      return meal.menuItems;
    } else if (meal.name) {
      // 旧形式: 単一アイテムのみの場合
      return [{
        id: meal.id,
        name: meal.name,
        recipeId: meal.recipeId
      }];
    }
    // 空の場合
    return [];
  };
  
  const menuItems = getMenuItems();
  const isEmpty = menuItems.length === 0;
  const isOuting = meal.isOuting;

  // 個別のメニューアイテムのIDリストを生成（ドラッグ＆ドロップ用）
  const menuItemIds = menuItems.map((item) => 
    `item-${date.toISOString()}-${meal.type}-${item.id}`
  );

  // メニューアイテムクリック時の処理
  const handleItemClick = (item: MenuItemData) => {
    if (item.recipeId && onRecipeClick) {
      onRecipeClick(item.recipeId);
    } else {
      onMealClick(date, meal.type, meal);
    }
  };

  // カード全体のクリックハンドラ（献立追加や編集用）
  const handleCardClick = () => {
    onMealClick(date, meal.type, meal);
  };

  return (
    <Card 
      ref={setNodeRef}
      variant="outlined"
      sx={{ 
        mb: 1, 
        minHeight: 50,
        bgcolor: isEmpty ? 'grey.50' : (isOuting ? 'orange.50' : 'background.paper'),
        boxShadow: isDragging ? 2 : 'none',
        border: '1px solid',
        borderColor: isEmpty ? 'grey.200' : 
                   isOuting ? 'orange.200' : 
                   (isDragging ? 'primary.main' : 'grey.300'),
        '&:hover': {
          borderColor: 'primary.main',
        },
        position: 'relative', // ドラッグハンドルの配置のため追加
        ...style
      }}
    >
      <Box 
        sx={{ p: 1 }}
        onClick={handleCardClick} // クリックで編集ダイアログを開く
      >
        <Box sx={{ 
          width: '100%',
          display: 'flex', 
          alignItems: 'center',
          mb: isEmpty ? 0 : 0.5
        }}>
          <Box sx={{ 
            color: 'text.secondary', 
            display: 'flex',
            alignItems: 'center',
            fontSize: '0.7rem',
            mr: 'auto'
          }}>
            {isOuting ? <RestaurantIcon fontSize="small" /> : getMealIcon(meal.type)}
            <Typography 
              variant="caption" 
              sx={{ ml: 0.5 }}
            >
              {getMealLabel(meal.type)}
            </Typography>
          </Box>
          
          {hasMultipleItems && !isEmpty && (
            <Chip 
              label={`${menuItems.length}品`} 
              size="small" 
              color="secondary" 
              variant="outlined"
              sx={{ 
                height: 20, 
                fontSize: '0.625rem',
                mr: 0.5,
                '& .MuiChip-label': { px: 0.5 }
              }} 
            />
          )}
          
          {!isEmpty && menuItems.some(item => item.recipeId) && (
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
        </Box>
        
        {!isEmpty ? (
          <Box sx={{ width: '100%' }}>
            {/* 外食の場合 */}
            {isOuting ? (
              <Typography 
                variant="body2" 
                sx={{ 
                  width: '100%',
                  fontWeight: 500,
                  color: 'warning.dark',
                  display: 'flex',
                  alignItems: 'center',
                  fontSize: '0.875rem'
                }}
              >
                {meal.restaurantName || '外食'}
              </Typography>
            ) : (
              // 通常の献立表示（カード形式）
              hasMultipleItems ? (
                <Box sx={{ mt: 0.5 }}>
                  <SortableContext items={menuItemIds} strategy={verticalListSortingStrategy}>
                    {menuItems.map((item) => (
                      <MenuItemCard
                        key={item.id}
                        item={item}
                        date={date}
                        mealType={meal.type}
                        onItemClick={() => handleItemClick(item)}
                      />
                    ))}
                  </SortableContext>
                  
                  {/* 5つ以上の場合は省略表示 */}
                  {menuItems.length > 4 && (
                    <Box
                      sx={{
                        mt: 0.5,
                        p: 0.5,
                        textAlign: 'center',
                        borderTop: '1px dashed',
                        borderColor: 'divider'
                      }}
                    >
                      <Typography
                        variant="caption"
                        color="text.secondary"
                        sx={{ fontStyle: 'italic' }}
                      >
                        他{menuItems.length - 4}品...
                      </Typography>
                    </Box>
                  )}
                </Box>
              ) : (
                // 単一アイテムの場合もカード表示
                <Box sx={{ mt: 0.5 }}>
                  <SortableContext items={menuItemIds} strategy={verticalListSortingStrategy}>
                    <MenuItemCard
                      item={menuItems[0]}
                      date={date}
                      mealType={meal.type}
                      onItemClick={() => handleItemClick(menuItems[0])}
                    />
                  </SortableContext>
                </Box>
              )
            )}
          </Box>
        ) : (
          <Box
            sx={{ 
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              width: '100%',
              height: 50,
              cursor: 'pointer'
            }}
          >
            <Typography 
              variant="body2" 
              color="text.secondary"
              sx={{
                display: 'flex',
                alignItems: 'center'
              }}
            >
              <AddIcon sx={{ mr: 0.5, fontSize: '1rem' }} />
              メニューを追加
            </Typography>
          </Box>
        )}
      </Box>
    </Card>
  );
};

export default DraggableMealItem;