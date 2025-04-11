import React from 'react';
import { 
  Box, 
  Grid, 
  Typography, 
  Paper, 
  Card, 
  CardActionArea,
  Chip,
  Divider,
  IconButton,
  List,
  ListItem
} from '@mui/material';
import BreakfastDiningIcon from '@mui/icons-material/BreakfastDining';
import LunchDiningIcon from '@mui/icons-material/LunchDining';
import DinnerDiningIcon from '@mui/icons-material/DinnerDining';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import EditIcon from '@mui/icons-material/Edit';
import AddIcon from '@mui/icons-material/Add';
import RestaurantIcon from '@mui/icons-material/Restaurant';
import { 
  DndContext, 
  closestCenter, 
  PointerSensor,
  useSensor, 
  useSensors, 
  DragEndEvent,
  DragStartEvent,
  DragOverEvent 
} from '@dnd-kit/core';
import {
  SortableContext,
  arrayMove,
  verticalListSortingStrategy,
  useSortable
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

interface MenuItem {
  id: string;
  name: string;
  recipeId: string | null;
}

interface MealData {
  id: string;
  name: string;
  type: 'breakfast' | 'lunch' | 'dinner';
  recipeId: string | null;
  menuItems?: MenuItem[];
  isOuting?: boolean;
  restaurantName?: string;
  notes?: string;
}

interface DayData {
  date: Date;
  meals: MealData[];
}

interface WeekData {
  id: string;
  startDate: Date;
  days: DayData[];
}

interface WeeklyMenuPlanProps {
  weekData: WeekData;
  onMealClick: (date: Date, mealType: 'breakfast' | 'lunch' | 'dinner', existingMeal?: MealData) => void;
  viewUnit: 'day' | 'threeDay' | 'week';
  onNext?: () => void;
  onPrevious?: () => void;
  onMoveMeal?: (meal: MealData, fromDate: Date, toDate: Date, toType: 'breakfast' | 'lunch' | 'dinner') => void;
}

// ドラッグ可能な献立アイテムコンポーネント
const DraggableMealItem = ({ 
  meal, 
  date, 
  onMealClick 
}: { 
  meal: MealData; 
  date: Date; 
  onMealClick: (date: Date, mealType: 'breakfast' | 'lunch' | 'dinner', existingMeal?: MealData) => void;
}) => {
  // ユニークなID（日付 + タイプ + ID）
  const itemId = `${date.toISOString()}-${meal.type}-${meal.id}`;
  
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
      type: 'meal',
      meal,
      date
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
        ...style
      }}
      {...attributes}
      {...listeners}
    >
      <CardActionArea
        onClick={() => onMealClick(date, meal.type, meal)}
        sx={{ 
          p: 1,
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'flex-start',
          justifyContent: 'center',
        }}
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
              // 通常の献立表示（複数アイテムまたは単一アイテム）
              hasMultipleItems ? (
                <List dense disablePadding sx={{ width: '100%', py: 0 }}>
                  {menuItems.slice(0, 2).map((item, index) => (
                    <ListItem 
                      key={item.id} 
                      disablePadding 
                      disableGutters
                      sx={{ py: 0 }}
                    >
                      <Typography 
                        variant="body2" 
                        sx={{ 
                          width: '100%',
                          lineHeight: 1.2,
                          fontSize: '0.8rem',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          whiteSpace: 'nowrap',
                          pointerEvents: 'none', // クリックイベントが二重に発生しないようにする
                        }}
                      >
                        {item.name}
                      </Typography>
                    </ListItem>
                  ))}
                  {menuItems.length > 2 && (
                    <Typography 
                      variant="caption" 
                      color="text.secondary" 
                      sx={{ 
                        fontStyle: 'italic',
                        pointerEvents: 'none'
                      }}
                    >
                      他{menuItems.length - 2}品...
                    </Typography>
                  )}
                </List>
              ) : (
                <Typography 
                  variant="body2" 
                  sx={{ 
                    width: '100%',
                    lineHeight: 1.3,
                    fontSize: '0.875rem',
                    display: '-webkit-box',
                    overflow: 'hidden',
                    WebkitBoxOrient: 'vertical',
                    WebkitLineClamp: 2,
                    pointerEvents: 'none', // クリックイベントが二重に発生しないようにする
                  }}
                >
                  {menuItems[0]?.name || ''}
                </Typography>
              )
            )}
          </Box>
        ) : (
          <Box sx={{ 
            display: 'flex',
            alignItems: 'center',
            color: 'text.secondary',
            width: '100%',
            justifyContent: 'center',
            pointerEvents: 'none', // クリックイベントが二重に発生しないようにする
          }}>
            <AddIcon fontSize="small" sx={{ mr: 0.5 }} />
            <Typography variant="body2">追加</Typography>
          </Box>
        )}
      </CardActionArea>
    </Card>
  );
};

// メインのWeeklyMenuPlanコンポーネント
const WeeklyMenuPlan: React.FC<WeeklyMenuPlanProps> = ({ 
  weekData, 
  onMealClick,
  viewUnit,
  onNext,
  onPrevious,
  onMoveMeal
}) => {
  // ドラッグ操作のセンサーを定義（ポインター操作のみ）
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        // ドラッグ開始の移動距離を設定（ピクセル単位）
        distance: 8,
      }
    })
  );
  
  // 月日の表示形式
  const formatDate = (date: Date) => {
    return `${date.getMonth() + 1}/${date.getDate()}`;
  };
  
  // 今日の日付かどうかをチェック
  const isToday = (date: Date) => {
    const today = new Date();
    return date.getDate() === today.getDate() && 
           date.getMonth() === today.getMonth() && 
           date.getFullYear() === today.getFullYear();
  };

  // ドラッグ終了時のハンドラー
  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    
    if (!over || active.id === over.id) return;

    // ドラッグしているアイテムの情報を取得
    const activeId = active.id as string;
    const [activeDateStr, activeType] = activeId.split('-');
    const activeDate = new Date(activeDateStr);
    const activeMealType = activeType as 'breakfast' | 'lunch' | 'dinner';
    const activeMeal = (active.data.current as any).meal;
    
    // ドロップ先の情報を取得
    const overId = over.id as string;
    const [overDateStr, overType] = overId.split('-');
    const overDate = new Date(overDateStr);
    const overMealType = overType as 'breakfast' | 'lunch' | 'dinner';
    
    // 移動処理をトリガー
    if (onMoveMeal) {
      onMoveMeal(activeMeal, activeDate, overDate, overMealType);
    }
  };
  
  // 表示単位に応じたタイトル表示
  const renderUnitTitle = () => {
    if (weekData.days.length === 0) return null;
    
    if (viewUnit === 'day') {
      const day = weekData.days[0]; // 1日表示の場合は最初（唯一）の日
      return (
        <Typography variant="h6" align="center" sx={{ mb: 1 }}>
          {`${day.date.getFullYear()}年${day.date.getMonth() + 1}月${day.date.getDate()}日`}
        </Typography>
      );
    } else if (viewUnit === 'threeDay') {
      const startDay = weekData.days[0];
      const endDay = weekData.days[weekData.days.length - 1];
      return (
        <Typography variant="h6" align="center" sx={{ mb: 1 }}>
          {`${startDay.date.getMonth() + 1}月${startDay.date.getDate()}日 - ${endDay.date.getMonth() + 1}月${endDay.date.getDate()}日`}
        </Typography>
      );
    }
    // 週表示の場合はタイトル不要
    return null;
  };

  // ドラッグ可能な献立リスト
  const renderDraggableMeals = () => {
    // 全ての献立アイテムのID生成（ドラッグ＆ドロップ用）
    const allMealIds = weekData.days.flatMap(day => 
      ['breakfast', 'lunch', 'dinner'].map(mealType => 
        `${day.date.toISOString()}-${mealType}`
      )
    );

    // 表示単位に応じてグリッドの幅を設定
    const getGridWidth = () => {
      switch (viewUnit) {
        case 'day':
          return 12; // 1日表示の場合は画面幅いっぱい
        case 'threeDay':
          return 4; // 3日表示の場合は1/3ずつ
        case 'week':
          // 均等分割をより正確に - 7日の場合は12/7で均等に
          return weekData.days.length > 0 ? 12 / weekData.days.length : 12/7;
        default:
          return 12 / weekData.days.length;
      }
    };

    return (
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <SortableContext items={allMealIds} strategy={verticalListSortingStrategy}>
          <Grid 
            container 
            spacing={0.5} /* spacingを縮小 */
            sx={{ 
              mt: 0.5, 
              height: '100%', 
              width: '100%',
              flexWrap: 'nowrap' /* 重要：折り返しを防止 */
            }}
          >
            {weekData.days.map((day, dayIndex) => (
              <Grid 
                item 
                xs={getGridWidth()} 
                key={`day-${dayIndex}`} 
                sx={{ 
                  height: '100%', 
                  display: 'flex',
                  width: `${100 / weekData.days.length}%`,
                  maxWidth: `${100 / weekData.days.length}%`,
                  px: 0.25 /* 内側の余白を調整 */
                }}
              >
                <Paper
                  elevation={0}
                  sx={{
                    p: { xs: 0.5, sm: 0.75, md: 1 }, /* レスポンシブパディング */
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
                    minWidth: 0 /* 重要：flexアイテムが縮小できるようにする */
                  }}
                >
                  {/* 日付表示を追加 */}
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
                  
                  {/* 朝食・昼食・夕食のカード */}
                  <Box sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                    {['breakfast', 'lunch', 'dinner'].map((mealType) => {
                      const mealTypeTyped = mealType as 'breakfast' | 'lunch' | 'dinner';
                      const meal = day.meals.find(m => m.type === mealTypeTyped) || {
                        id: `empty-${day.date.toISOString()}-${mealType}`,
                        name: '',
                        type: mealTypeTyped,
                        recipeId: null
                      };
                      
                      return (
                        <DraggableMealItem
                          key={`meal-${mealType}`}
                          meal={meal}
                          date={day.date}
                          onMealClick={onMealClick}
                        />
                      );
                    })}
                  </Box>
                </Paper>
              </Grid>
            ))}
          </Grid>
        </SortableContext>
      </DndContext>
    );
  };
  
  return (
    <Box sx={{ 
      p: 2, 
      height: '100%', 
      display: 'flex', 
      flexDirection: 'column' 
    }}>
      {/* カルーセル形式のナビゲーション（週ビュー以外のときに表示） */}
      {(viewUnit !== 'week' && (onNext || onPrevious)) && (
        <Box sx={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center', 
          mb: 1.5 
        }}>
          <IconButton 
            onClick={onPrevious} 
            disabled={!onPrevious}
            color="primary"
            sx={{ border: '1px solid', borderColor: 'divider' }}
          >
            <ArrowBackIcon />
          </IconButton>
          
          {renderUnitTitle()}
          
          <IconButton 
            onClick={onNext}
            disabled={!onNext}
            color="primary"
            sx={{ border: '1px solid', borderColor: 'divider' }}
          >
            <ArrowForwardIcon />
          </IconButton>
        </Box>
      )}
      
      {/* ドラッグ可能な献立表示 */}
      <Box sx={{ flexGrow: 1, overflow: 'auto', height: '100%' }}>
        {renderDraggableMeals()}
      </Box>
    </Box>
  );
};

export default WeeklyMenuPlan;