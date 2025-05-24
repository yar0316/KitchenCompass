import React, { useState } from 'react';
import {
  Box,
  Container,
  Paper,
  CircularProgress
} from '@mui/material';
import { useMenuData } from './hooks/useMenuData';
import WeeklyMenuPlan from './WeeklyMenuPlan';
import { ViewUnit, Template } from './types/Menu.types';
import MenuHeader from './components/MenuHeader';
import ViewUnitSelector from './components/ViewUnitSelector';
import TemplateSelector from './components/TemplateSelector';

interface MenuPageProps {
  className?: string;
}

/**
 * 献立計画のメインページコンポーネント
 */
const MenuPlanPage: React.FC<MenuPageProps> = ({ className }) => {
  const {
    loading,
    menuPlans,
    handleMoveMeal
  } = useMenuData();  // 基本的な状態管理
  const [viewUnit, setViewUnit] = useState<ViewUnit>('week');
  const [templates] = useState<Template[]>([]); // TODO: 実際のテンプレートデータを取得
  // 献立項目クリック時の処理
  const handleMealClick = (date: Date, mealType: 'breakfast' | 'lunch' | 'dinner') => {
    console.log('Meal clicked:', date, mealType);
    // TODO: ダイアログを開く処理を実装
  };

  // レシピクリック時の処理
  const handleRecipeClick = (recipeId: string) => {
    console.log('Recipe clicked:', recipeId);
    // TODO: レシピ詳細を開く処理を実装
  };
  // ビューユニット変更処理
  const handleViewUnitChange = (newViewUnit: ViewUnit) => {
    setViewUnit(newViewUnit);
  };

  // ヘッダーでの古いビューユニット変更処理（互換性のため）
  const handleViewUnitChangeEvent = (_event: React.MouseEvent<HTMLElement>, newViewUnit: ViewUnit | null) => {
    if (newViewUnit) {
      setViewUnit(newViewUnit);
    }
  };
  // 今日に戻る処理（非同期版）
  const handleResetToToday = async () => {
    // TODO: 今日の日付にリセットする処理を実装
    console.log('Reset to today');
  };

  // テンプレートダイアログ開く処理
  const handleOpenTemplateDialog = (tab?: number) => {
    console.log('Template dialog opened:', tab);
    // TODO: テンプレートダイアログを開く処理を実装
  };

  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
          <CircularProgress />
        </Box>
      </Container>
    );
  }  return (
    <Container maxWidth="lg" className={className} sx={{ mt: 4, mb: 4 }}>
      <Paper sx={{ p: 3 }}>        {/* ヘッダー */}
        <MenuHeader
          viewUnit={viewUnit}
          onViewUnitChange={handleViewUnitChangeEvent}
          onResetToToday={handleResetToToday}
          onOpenTemplateDialog={handleOpenTemplateDialog}
          isLoading={loading}
        />
          {/* 表示単位セレクター */}
        <Box sx={{ mb: 3 }}>
          <ViewUnitSelector
            viewUnit={viewUnit}
            onViewUnitChange={handleViewUnitChange}
            isLoading={loading}
          />
        </Box>
        
        {/* テンプレートセレクター */}
        <Box sx={{ mb: 3 }}>
          <TemplateSelector
            templates={templates}
            onOpenTemplateDialog={handleOpenTemplateDialog}
            isLoading={loading}
          />
        </Box>
        
        {/* 献立表示エリア */}
        <WeeklyMenuPlan
          weekData={menuPlans.currentWeek}
          onMealClick={handleMealClick}
          onRecipeClick={handleRecipeClick}
          viewUnit={viewUnit}
          onMoveMeal={handleMoveMeal}
        />
      </Paper>
    </Container>
  );
};

export default MenuPlanPage;