import React from 'react';
import { Box } from '@mui/material';
import { useDroppable } from '@dnd-kit/core';
import { MealData } from '../types/Menu.types';

interface DroppableMealZoneProps {
  children: React.ReactNode;
  date: Date;
  mealType: 'breakfast' | 'lunch' | 'dinner';
  onMealClick: (date: Date, mealType: 'breakfast' | 'lunch' | 'dinner', existingMeal: MealData | null) => void;
}

/**
 * ドロップ可能なゾーンコンポーネント
 */
const DroppableMealZone: React.FC<DroppableMealZoneProps> = ({
  children,
  date,
  mealType,
  onMealClick,
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

    // まずは対応するメニュー項目があるかを検索
    // カード内の子要素からメニューデータを取得しようとする
    const cardElement = (e.currentTarget as HTMLElement).querySelector('.MuiCard-root');
    const mealComponent = cardElement ? cardElement.querySelector('[data-meal]') : null;
    
    let existingMeal: MealData | undefined;
    
    // コンポーネントからデータ属性経由でメニューデータを取得できるかを試みる
    if (mealComponent && mealComponent.getAttribute('data-meal')) {
      try {
        existingMeal = JSON.parse(mealComponent.getAttribute('data-meal') || '');
      } catch (error) {
        console.error('Failed to parse meal data:', error);
      }
    }
    
    // リアクトの子コンポーネントからプロパティを取得する試みは難しいので、
    // childrenの中から直接DraggableMealItemコンポーネントとそのpropsを取得するのは複雑
    // そのため、React.Children.mapなどを使わずに、実装を簡略化
    
    if (existingMeal) {
      // 既存のメニューデータがある場合はそれを使う
      onMealClick(date, mealType, existingMeal);
    } else {
      // 見つからない場合は空のメニューデータを生成
      const emptyMeal = {
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

export default DroppableMealZone;