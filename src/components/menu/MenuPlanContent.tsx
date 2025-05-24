import React from 'react';
import { 
  Paper,
  Box,
  Typography,
  Button,
  CircularProgress
} from '@mui/material';
import WeeklyMenuPlan from './WeeklyMenuPlan';
import ViewNavigationBar from './ViewNavigationBar';
import { ViewUnit, DayData, MealData } from './types/Menu.types';

interface MenuPlanContentProps {
  viewUnit: ViewUnit;
  viewStartDate: Date;
  filteredDays: DayData[];
  isLoading: boolean;
  onPrevious: () => void;
  onNext: () => void;  onMealClick: (
    date: Date,
    mealType: 'breakfast' | 'lunch' | 'dinner',
    existingMeal: MealData | null
  ) => void;
  onMoveMeal: (meal: MealData, fromDate: Date, toDate: Date, toType: 'breakfast' | 'lunch' | 'dinner') => void;
  onRecipeClick: (recipeId: string) => void;
  onRefresh: () => void;
}

/**
 * 献立計画メインコンテンツコンポーネント
 */
const MenuPlanContent: React.FC<MenuPlanContentProps> = ({
  viewUnit,
  viewStartDate,
  filteredDays,
  isLoading,
  onPrevious,
  onNext,
  onMealClick,
  onMoveMeal,
  onRecipeClick,
  onRefresh
}) => {
  return (
    <Paper sx={{ mb: 3, borderRadius: 2 }}>
      <ViewNavigationBar
        viewUnit={viewUnit}
        viewStartDate={viewStartDate}
        onPrevious={onPrevious}
        onNext={onNext}
        isLoading={isLoading}
      />
      
      {isLoading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
          <CircularProgress />
        </Box>
      ) : filteredDays.length > 0 ? (
        <WeeklyMenuPlan 
          weekData={{
            id: 'current-view',
            startDate: filteredDays[0]?.date || new Date(),
            days: filteredDays
          }}
          onMealClick={onMealClick}
          viewUnit={viewUnit}
          onMoveMeal={onMoveMeal}
          onRecipeClick={onRecipeClick}
        />
      ) : (
        <Box sx={{ p: 4, textAlign: 'center' }}>
          <Typography variant="body1" color="text.secondary">
            献立データがありません
          </Typography>
          <Button 
            variant="contained" 
            color="primary" 
            sx={{ mt: 2 }}
            onClick={onRefresh}
          >
            データを再読み込み
          </Button>
        </Box>
      )}
    </Paper>
  );
};

export default MenuPlanContent;
