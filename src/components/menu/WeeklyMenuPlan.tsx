import React, { useState } from 'react';
import { 
  Box, 
  Grid, 
  Typography, 
  Paper, 
  Card,
  Chip
} from '@mui/material';
import BreakfastDiningIcon from '@mui/icons-material/BreakfastDining';
import LunchDiningIcon from '@mui/icons-material/LunchDining';
import DinnerDiningIcon from '@mui/icons-material/DinnerDining';
import RestaurantIcon from '@mui/icons-material/Restaurant';
import AddIcon from '@mui/icons-material/Add';
import { 
  DndContext, 
  closestCenter, 
  PointerSensor,
  useSensor, 
  useSensors, 
  DragEndEvent,
  DragOverlay,
  DragStartEvent,
  Active,
  useDroppable
} from '@dnd-kit/core';
import {
  SortableContext,
  verticalListSortingStrategy,
  useSortable
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { format } from 'date-fns';
import { ja } from 'date-fns/locale';
import { MealData, WeekData, ViewUnit, MenuItemData } from './types/Menu.types';

interface WeeklyMenuPlanProps {
  weekData: WeekData;
  onMealClick: (date: Date, mealType: 'breakfast' | 'lunch' | 'dinner', existingMeal?: MealData | null) => void;
  onRecipeClick?: (recipeId: string) => void;  // レシピIDを受け取って詳細を表示するための関数
  viewUnit: ViewUnit;
  onMoveMeal: (meal: MealData, fromDate: Date, toDate: Date, toType: 'breakfast' | 'lunch' | 'dinner', specificItemId?: string) => Promise<void>;
}

// ドラッグ中アイテムのプレビュー用コンポーネント
const DragOverlayContent = ({ active }: { active: Active | null }) => {
  if (!active) return null;
  
  const { id, data } = active;
  const isMenuItem = id.toString().startsWith('item-');
  
  if (isMenuItem && data.current) {
    const { item } = data.current;
    return (
      <Card
        variant="outlined"
        sx={{
          width: '200px',
          backgroundColor: 'primary.50',
          borderColor: 'primary.main',
          boxShadow: 3,
          opacity: 0.9
        }}
      >
        <Box sx={{ p: 1 }}>
          <Typography variant="body2">{item.name}</Typography>
        </Box>
      </Card>
    );
  }
  
  return null;
};

import MenuItemCard from './MenuItemCard';

// ドラッグ可能な献立アイテムコンポーネント
const DraggableMealItem = ({ 
  meal, 
  date, 
  onMealClick,
  onRecipeClick
}: { 
  meal: MealData; 
  date: Date; 
  onMealClick: (date: Date, mealType: 'breakfast' | 'lunch' | 'dinner', existingMeal?: MealData | null) => void;
  onRecipeClick?: (recipeId: string) => void;
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
  const getMenuItems = (): MenuItemData[] => {
    if (meal.menuItems && meal.menuItems.length > 0) {
      // 新形式: menuItemsプロパティを使用
      return meal.menuItems;
    } else if (meal.name) {
      // 旧形式: 単一アイテムのみの場合
      return [{
        id: meal.id,
        name: meal.name,
        recipeId: meal.recipeId,
        mealType: meal.type,
        isOutside: false,
        outsideLocation: '',
        notes: ''
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
                <Box sx={{ mt: 0.5 }}>                  <SortableContext items={menuItemIds} strategy={verticalListSortingStrategy}>
                    {menuItems.map((item, index) => (
                      <MenuItemCard
                        key={item.id}
                        item={item}
                        date={date}
                        mealType={meal.type}
                        index={index}
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
                  )}                </Box>
              ) : (
                // 単一アイテムの場合もカード表示
                <Box sx={{ mt: 0.5 }}>
                  <SortableContext items={menuItemIds} strategy={verticalListSortingStrategy}>
                    <MenuItemCard
                      item={menuItems[0]}
                      date={date}
                      mealType={meal.type}
                      index={0}
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

// ドロップ可能なゾーン
const DroppableMealZone = ({
  children,
  date,
  mealType,
  existingMeal,
  onMealClick,
}: {
  children: React.ReactNode;
  date: Date;
  mealType: 'breakfast' | 'lunch' | 'dinner';
  existingMeal?: MealData | null;
  onMealClick: (date: Date, mealType: 'breakfast' | 'lunch' | 'dinner', existingMeal?: MealData | null) => void;
}) => {
  const { isOver, setNodeRef } = useDroppable({
    id: `drop-${date.toISOString()}-${mealType}`,
    data: {
      date,
      mealType
    }
  });

  // 空の領域をクリックしたときのハンドラ
  const handleZoneClick = (e: React.MouseEvent) => {
    // カード内のクリックイベントが伝播してきた場合は処理しない
    if ((e.target as HTMLElement).closest('.MuiCardActionArea-root')) {
      return;
    }

    // 既存の献立データがある場合はそれを使用、ない場合は空のデータを生成
    if (existingMeal && existingMeal.menuItems && existingMeal.menuItems.length > 0) {
      // 既存のメニューデータがある場合はそれを使う
      onMealClick(date, mealType, existingMeal);
    } else {
      // 見つからない場合は空のメニューデータを生成
      const emptyMeal: MealData = {
        id: `empty-${date.toISOString()}-${mealType}`,
        name: '',
        type: mealType,
        recipeId: null,
        menuItems: [],
        mealType: mealType
      };
      onMealClick(date, mealType, emptyMeal);
    }
  };

  return (
    <Box 
      ref={setNodeRef} 
      sx={{
        flexGrow: 1,
        position: 'relative',
        bgcolor: isOver ? 'primary.50' : 'transparent',
        borderRadius: 1,
        transition: 'background-color 0.2s',
        cursor: 'pointer' // クリック可能を示す
      }}
      onClick={handleZoneClick} // クリックハンドラを追加
    >
      {children}
    </Box>
  );
};

// メインのWeeklyMenuPlanコンポーネント
const WeeklyMenuPlan: React.FC<WeeklyMenuPlanProps> = ({ 
  weekData, 
  onMealClick,
  onRecipeClick,
  viewUnit: _viewUnit,
  onMoveMeal
}) => {
  // ドラッグしているアイテムの状態
  const [activeItem, setActiveItem] = useState<Active | null>(null);
    // viewUnitは将来的な機能拡張で使用予定（現在は一時的に参照のみ）
  if (_viewUnit) {
    // 将来的にはviewUnitに応じて表示を変更する予定
  }
  
  // ドラッグ操作のセンサーを定義（ポインター操作のみ）
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        // ドラッグ開始の判定距離を小さくして反応を良くする（1pxに設定）
        distance: 1,
      }
    })
  );
  
  // 月日と曜日の表示形式
  const formatDate = (date: Date) => {
    return format(date, 'M/d(E)', { locale: ja });
  };
  
  // 今日の日付かどうかをチェック
  const isToday = (date: Date) => {
    const today = new Date();
    return date.getDate() === today.getDate() && 
           date.getMonth() === today.getMonth() && 
           date.getFullYear() === today.getFullYear();
  };

  // ドラッグ開始時のハンドラー
  const handleDragStart = (event: DragStartEvent) => {
    setActiveItem(event.active);
  };
  // ドラッグ終了時のハンドラー
  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveItem(null);
    
    if (!over) {
      return;
    }
    
    if (active.id === over.id) {
      return;
    }

    try {
      // ドラッグしたアイテムのデータを取得
      const activeData = active.data.current as { 
        item?: MenuItemData; 
        meal?: MealData; 
        date?: Date; 
        mealType?: 'breakfast' | 'lunch' | 'dinner';
        [key: string]: unknown;
      };
      if (!activeData) {
        return;
      }
      
      // ドロップ先のデータを取得
      const overData = over.data.current as { 
        date?: Date; 
        mealType?: 'breakfast' | 'lunch' | 'dinner'; 
        meal?: MealData;
        [key: string]: unknown;
      };
      if (!overData) {
        return;
      }
      
      // メニューアイテムか食事枠全体かを判断
      const isMenuItem = typeof active.id === 'string' && active.id.toString().includes('item-');
      const isActiveAMeal = activeData.meal || activeData.mealType;
      
      // ドロップ先の情報を収集
      let targetDate: Date | null = null;
      let targetType: 'breakfast' | 'lunch' | 'dinner' | null = null;
      
      // ドロップ先から情報を抽出
      if (overData.date) {
        targetDate = overData.date;
      }
      
      if (overData.mealType) {
        // ドロップ先にmealTypeがある場合
        targetType = overData.mealType;
      } else if (overData.meal && overData.meal.type) {
        // ドロップ先にmeal.typeがある場合
        targetType = overData.meal.type;
      } else if (typeof over.id === 'string') {
        // IDから食事タイプを抽出する試み
        const overId = over.id.toString();
        if (overId.includes('drop-') && overId.includes('-breakfast')) {
          targetType = 'breakfast';
        } else if (overId.includes('drop-') && overId.includes('-lunch')) {
          targetType = 'lunch';
        } else if (overId.includes('drop-') && overId.includes('-dinner')) {
          targetType = 'dinner';
        }
        
        // ドロップゾーンIDから日付を抽出
        // 形式: drop-ISO日付-食事タイプ
        if (overId.includes('drop-')) {
          const parts = overId.split('-');
          if (parts.length >= 3) {
            // ISO日付部分を取得
            const dateStr = parts[1];

            try {
              targetDate = new Date(dateStr);
            } catch {
              // 日付のパースに失敗した場合は何もしない
            }
          }
        }
      }
      
      // 必要なデータがすべて揃っているか確認
      if (!targetDate || !targetType) {
        return;
            }      
      // 移動元の情報を収集
      let sourceDate: Date | null = null;
      let sourceType: 'breakfast' | 'lunch' | 'dinner' | null = null;
      let mealToMove: MealData | null = null;
      let specificItemId: string | undefined = undefined; // 特定のアイテムID

      if (isMenuItem && activeData.item) {        
        // メニューアイテムの場合
        const { item, date, mealType } = activeData;
        
        // 型ガード: undefinedチェック
        if (!date || !mealType || !item) {
          return;
        }
        
        sourceDate = date;
        sourceType = mealType;

        mealToMove = {
          id: item.id,
          name: item.name,
          type: mealType,
          recipeId: item.recipeId,
          menuItems: [{
            id: item.id,
            name: item.name,
            recipeId: item.recipeId,
            mealType: mealType,
            isOutside: false,
            outsideLocation: '',
            notes: ''
          }],
          mealType: mealType
        };
        
        // 特定のアイテムIDを記録
        specificItemId = item.id;
      } else if (isActiveAMeal) {        
        // 食事枠全体の場合
        const date = activeData.date;
        const mealType = activeData.meal ? activeData.meal.type : activeData.mealType;
        
        // 型ガード: undefinedチェック
        if (!date || !mealType) {
          return;
        }
        
        sourceDate = date;
        sourceType = mealType;
        mealToMove = activeData.meal || {
          id: `meal-${Date.now()}`,
          name: '',
          type: mealType,
          recipeId: null,
          menuItems: [],
          mealType: mealType
        };
      } else {
        return;
      }
      
      // 移動元の情報が揃っているか確認
      if (!sourceDate || !sourceType || !mealToMove) {
        return;
      }
        // 親コンポーネントのコールバックを呼び出す前の最終確認
      if (!onMoveMeal) {
        return;
      }

      // 親コンポーネントのコールバックを呼び出し（非同期）
      await onMoveMeal(mealToMove, sourceDate, targetDate, targetType, specificItemId);
    } catch (error) {
      console.error('[handleDragEnd] ドラッグ&ドロップ処理でエラーが発生:', error);
    }
  };

  // DnD-kitコンテキストの作成
  const renderDraggableMeals = () => {
    // 全ての献立アイテムのID生成（ドラッグ＆ドロップ用）
    const allMealIds = weekData.days.flatMap(day => 
      ['breakfast', 'lunch', 'dinner'].map(mealType => 
        `${day.date.toISOString()}-${mealType}`
      )    );

    return (
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
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
          >            {weekData.days.map((day, dayIndex) => (
              <Box
                key={`day-${dayIndex}`} 
                sx={{ 
                  height: '100%', 
                  display: 'flex',
                  width: `${100 / weekData.days.length}%`,
                  maxWidth: `${100 / weekData.days.length}%`,
                  px: 0.25
                }}
              >
                <Paper
                  elevation={0}
                  sx={{
                    p: { xs: 0.5, sm: 0.75, md: 1 },
                    height: '100%',
                    width: '100%',
                    borderRadius: 1,
                    border: isToday(day.date) ? 2 : 0,
                    borderColor: 'primary.main',
                    bgcolor: isToday(day.date) ? 'primary.50' : 'background.paper',
                    display: 'flex',
                    flexDirection: 'column',
                    flex: 1,
                    boxSizing: 'border-box',
                    overflow: 'hidden',
                    minWidth: 0
                  }}
                >
                  {/* 日付表示 */}
                  <Typography 
                    variant="subtitle2" 
                    align="center"
                    sx={{
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
                      const mealTypeTyped = mealType as 'breakfast' | 'lunch' | 'dinner';                      const meal = day.meals.find(m => m.type === mealTypeTyped) || {
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
                          existingMeal={meal}
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
                </Paper>                </Box>
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