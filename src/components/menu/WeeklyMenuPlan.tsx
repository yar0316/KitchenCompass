import React from 'react';
import { 
  Box, 
  Grid, 
  Typography, 
  Paper
} from '@mui/material';
import { 
  DndContext, 
  closestCenter, 
  DragOverlay
} from '@dnd-kit/core';
import {
  SortableContext,
  verticalListSortingStrategy
} from '@dnd-kit/sortable';
import { MealData, WeekData, ViewUnit } from './types/Menu.types';
import { useDragAndDrop } from './hooks/useDragAndDrop';
import { formatDate, isToday, generateAllMealIds } from './utils/dragDropUtils';
import DragOverlayContent from './components/DragOverlayContent';
import DraggableMealItem from './components/DraggableMealItem';
import DroppableMealZone from './components/DroppableMealZone';

interface WeeklyMenuPlanProps {
  weekData: WeekData;
  onMealClick: (date: Date, mealType: 'breakfast' | 'lunch' | 'dinner', existingMeal: MealData | null) => void;
  onRecipeClick?: (recipeId: string) => void;  // レシピIDを受け取って詳細を表示するための関数
  viewUnit: ViewUnit;
  onMoveMeal: (meal: MealData, fromDate: Date, toDate: Date, toType: 'breakfast' | 'lunch' | 'dinner') => void;
}

/**
 * 週単位の献立表示メインコンポーネント
 */
const WeeklyMenuPlan: React.FC<WeeklyMenuPlanProps> = ({ 
  weekData, 
  onMealClick,
  onRecipeClick,
  viewUnit: _viewUnit,
  onMoveMeal
}) => {
  // ドラッグ&ドロップ機能を管理
  const { sensors, activeItem, handleDragStart, handleDragEnd } = useDragAndDrop();
  
  // viewUnitは将来的な機能拡張で使用予定（現在は一時的に参照のみ）
  if (_viewUnit) {
    // 将来的にはviewUnitに応じて表示を変更する予定
  }

  // DnD-kitコンテキストの作成
  const renderDraggableMeals = () => {
    // 全ての献立アイテムのID生成（ドラッグ＆ドロップ用）
    const allMealIds = generateAllMealIds(weekData.days);

    return (
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragStart={handleDragStart}
        onDragEnd={(event) => handleDragEnd(event, onMoveMeal)}
      >
        <SortableContext items={allMealIds} strategy={verticalListSortingStrategy}>
          <Grid 
            container 
            spacing={0.5}
            sx={{ 
              mt: 0.5, 
              height: '100%', 
              width: '100%',
              flexWrap: 'nowrap'
            }}
          >
            {weekData.days.map((day, dayIndex) => (
              <Box
                key={`day-${dayIndex}`} 
                sx={{ 
                  height: '100%', 
                  width: `calc(100% / 7)`,
                  minWidth: 0
                }}
              >
                <Paper 
                  elevation={1}
                  sx={{ 
                    height: '100%', 
                    width: '100%',
                    p: 0.5,
                    display: 'flex',
                    flexDirection: 'column',
                    border: '1px solid',
                    borderColor: isToday(day.date) ? 'primary.main' : 'divider'
                  }}
                >
                  {/* 日付ヘッダー */}
                  <Typography 
                    variant="subtitle2" 
                    sx={{ 
                      textAlign: 'center',
                      fontWeight: 'bold',
                      mb: 1,
                      pb: 1,
                      borderBottom: '1px solid',
                      borderColor: 'divider',
                      color: isToday(day.date) ? 'primary.main' : 'text.primary'
                    }}
                  >
                    {formatDate(day.date)}
                  </Typography>
                  
                  {/* 各食事タイプのカード */}
                  <Box sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                    {['breakfast', 'lunch', 'dinner'].map((mealType) => {
                      const mealTypeTyped = mealType as 'breakfast' | 'lunch' | 'dinner';
                      const meal = day.meals.find(m => m.type === mealTypeTyped) || {
                        id: `empty-${day.date.toISOString()}-${mealType}`,
                        name: '',
                        type: mealTypeTyped,
                        recipeId: null,
                        menuItems: [],
                        mealType: mealTypeTyped
                      };
                      
                      return (
                        <DroppableMealZone 
                          key={`meal-container-${mealType}`}
                          date={day.date}
                          mealType={mealTypeTyped}
                          onMealClick={onMealClick}
                        >
                          <DraggableMealItem
                            key={`meal-${mealType}`}
                            meal={meal}
                            date={day.date}
                            onMealClick={onMealClick}
                            onRecipeClick={onRecipeClick}
                          />
                        </DroppableMealZone>
                      );
                    })}
                  </Box>
                </Paper>
              </Box>
            ))}
          </Grid>
        </SortableContext>
        
        {/* ドラッグアイテムのオーバーレイ */}
        <DragOverlay>
          <DragOverlayContent active={activeItem} />
        </DragOverlay>
      </DndContext>
    );
  };

  return (
    <Box sx={{ height: '100%', width: '100%', display: 'flex', flexDirection: 'column' }}>
      {/* 献立表示 */}
      <Box sx={{ flexGrow: 1, overflow: 'hidden' }}>
        {weekData.days.length === 0 ? (
          // days配列が空の場合、ローディング表示
          <Box sx={{ 
            display: 'flex', 
            justifyContent: 'center', 
            alignItems: 'center', 
            height: '100%' 
          }}>
            <Typography variant="body1" color="text.secondary">
              データを読み込み中...
            </Typography>
          </Box>
        ) : (
          // データがある場合は通常表示
          renderDraggableMeals()
        )}
      </Box>
    </Box>
  );
};

export default WeeklyMenuPlan;