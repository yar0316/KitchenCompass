import { useState, useMemo } from 'react';
import { ViewUnit, MealData, MenuItemData, SnackbarState } from '../types/Menu.types';
import { dateUtils } from '../utils/dateUtils';
import { menuUtils } from '../utils/menuUtils';

interface DialogMealData {
  name: string;
  menuItems: MenuItemData[];
  isOuting?: boolean;
  restaurantName?: string;
  notes?: string;
  recipeId?: string | null;
}

interface UseMenuPageStateProps {
  menuPlans: any;
  handleSaveMeal: (date: Date, mealType: string, mealData: MealData) => Promise<void>;
  fetchMenus: () => Promise<void>;
}

export const useMenuPageState = ({ menuPlans, handleSaveMeal, fetchMenus }: UseMenuPageStateProps) => {
  // UI状態
  const [viewUnit, setViewUnit] = useState<ViewUnit>('week');
  const [viewStartDate, setViewStartDate] = useState<Date>(new Date());
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedMealType, setSelectedMealType] = useState<'breakfast' | 'lunch' | 'dinner' | null>(null);
  const [editingMeal, setEditingMeal] = useState<MenuItemData | null>(null);
  const [snackbar, setSnackbar] = useState<SnackbarState>({
    open: false,
    message: '',
    severity: 'success'
  });
  
  // テンプレート関連の状態
  const [isTemplateDialogOpen, setIsTemplateDialogOpen] = useState(false);
  const [selectedTemplateId, setSelectedTemplateId] = useState<string | null>(null);
  const [templateDialogTab, setTemplateDialogTab] = useState(0);
  const [newTemplateName, setNewTemplateName] = useState('');
  const [newTemplateDescription, setNewTemplateDescription] = useState('');
  
  // レシピ詳細ダイアログの状態
  const [isRecipeDialogOpen, setIsRecipeDialogOpen] = useState(false);
  const [selectedRecipeId, setSelectedRecipeId] = useState<string | null>(null);

  // データ読み込み状態
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // 表示する日データをフィルタリング
  const filteredDays = useMemo(() => {
    // 全期間のデータを統合
    const allDays = [
      ...(menuPlans.previousWeek?.days || []),
      ...(menuPlans.currentWeek?.days || []),
      ...(menuPlans.nextWeek?.days || [])
    ].sort((a, b) => a.date.getTime() - b.date.getTime());
    
    if (!allDays.length) return [];
    
    switch (viewUnit) {
      case 'day':
        return allDays.filter(day => 
          dateUtils.isSameDay(day.date, viewStartDate)
        );
      case 'threeDay': {
        const startIndex = allDays.findIndex(day => 
          dateUtils.isSameDay(day.date, viewStartDate)
        );
        
        if (startIndex === -1) return allDays.slice(0, 3);
        
        let threeStartIndex = startIndex - 1;
        
        if (startIndex === 0) {
          threeStartIndex = 0;
        } else if (startIndex === allDays.length - 1) {
          threeStartIndex = Math.max(0, allDays.length - 3);
        } else {
          threeStartIndex = Math.max(0, Math.min(startIndex - 1, allDays.length - 3));
        }
        
        return allDays.slice(threeStartIndex, threeStartIndex + 3);
      }
      case 'week': {
        const startIndex = allDays.findIndex(day => 
          dateUtils.isSameDay(day.date, dateUtils.getStartOfWeek(viewStartDate))
        );
        
        if (startIndex === -1) return allDays.slice(0, 7);
        
        return allDays.slice(startIndex, startIndex + 7);
      }
      default:
        return allDays;
    }
  }, [menuPlans, viewUnit, viewStartDate]);

  // 基準日のリセット（今日ボタンクリック時）
  const handleResetToToday = async () => {
    const today = new Date();
    
    // 表示開始日を今日にリセット
    setViewStartDate(today);
    
    // 現在の週に今日が含まれているか確認
    const currentWeekHasToday = menuPlans.currentWeek.days.some((day: any) => 
      dateUtils.isSameDay(day.date, today)
    );
    
    if (!currentWeekHasToday) {
      try {
        setIsLoading(true);
        // 現在の週のデータを再取得
        await fetchMenus();
      } catch (error) {
        console.error('今週の献立データ取得エラー:', error);
        setSnackbar({
          open: true,
          message: '今週の献立データの取得に失敗しました',
          severity: 'error'
        });
      } finally {
        setIsLoading(false);
      }
    }
  };

  // 献立編集ダイアログを開く
  const handleOpenDialog = (
    date: Date,
    mealType: 'breakfast' | 'lunch' | 'dinner',
    existingMeal: MealData | null = null
  ) => {
    setSelectedDate(date);
    setSelectedMealType(mealType);
    
    // MealDataからMenuItemDataに変換
    let menuItemData: MenuItemData | null = null;
    if (existingMeal) {
      menuItemData = menuUtils.convertMealToMenuItem(existingMeal);
    }
    
    setEditingMeal(menuItemData);
    setIsDialogOpen(true);
  };

  // 献立保存処理のラッパー
  const handleSaveMealWrapper = async (dialogMealData: DialogMealData) => {
    if (!selectedDate || !selectedMealType) return;
    
    try {
      // MenuPlanningDialogから受け取ったデータをMealData型に変換
      const mealData: MealData = {
        id: `${selectedDate.toISOString()}-${selectedMealType}`,
        type: selectedMealType,
        name: dialogMealData.name || '',
        recipeId: dialogMealData.recipeId || null,
        menuItems: dialogMealData.menuItems || [],
        mealType: selectedMealType,
        isOuting: dialogMealData.isOuting || false,
        isOutside: dialogMealData.isOuting || false,
        restaurantName: dialogMealData.restaurantName || '',
        notes: dialogMealData.notes || ''
      };
      
      await handleSaveMeal(selectedDate, selectedMealType, mealData);
      
      setSnackbar({
        open: true,
        message: '献立を保存しました',
        severity: 'success'
      });
      
      setIsDialogOpen(false);
    } catch (error) {
      console.error('献立保存エラー:', error);
      setSnackbar({
        open: true,
        message: '献立の保存に失敗しました',
        severity: 'error'
      });
    }
  };

  // レシピ詳細ダイアログを開く
  const handleOpenRecipeDialog = (recipeId: string) => {
    setSelectedRecipeId(recipeId);
    setIsRecipeDialogOpen(true);
  };

  // レシピ詳細ダイアログを閉じる
  const handleCloseRecipeDialog = () => {
    setIsRecipeDialogOpen(false);
  };

  // スナックバーを閉じる
  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  // テンプレートダイアログを開く
  const handleOpenTemplateDialog = () => {
    setIsTemplateDialogOpen(true);
  };

  // 表示単位変更
  const handleViewUnitChange = (newViewUnit: ViewUnit) => {
    setViewUnit(newViewUnit);
    
    // 表示単位に応じて基準日を調整
    switch (newViewUnit) {
      case 'day':
        // 日単位: 現在の基準日をそのまま使用
        break;
      case 'threeDay':
        // 3日単位: 現在の基準日を中央に配置するよう調整
        break;
      case 'week':
        // 週単位: 現在の基準日を含む週の開始日に調整
        setViewStartDate(dateUtils.getStartOfWeek(viewStartDate));
        break;
    }
    
    setSnackbar({
      open: true,
      message: `表示単位を${newViewUnit === 'day' ? '日' : newViewUnit === 'threeDay' ? '3日' : '週間'}に変更しました`,
      severity: 'success'
    });
  };

  return {
    // UI状態
    viewUnit,
    viewStartDate,
    isDialogOpen,
    selectedDate,
    selectedMealType,
    editingMeal,
    snackbar,
    isTemplateDialogOpen,
    selectedTemplateId,
    templateDialogTab,
    newTemplateName,
    newTemplateDescription,
    isRecipeDialogOpen,
    selectedRecipeId,
    isLoading,
    filteredDays,
    
    // 状態更新関数
    setViewUnit,
    setViewStartDate,
    setIsDialogOpen,
    setSelectedDate,
    setSelectedMealType,
    setEditingMeal,
    setSnackbar,
    setIsTemplateDialogOpen,
    setSelectedTemplateId,
    setTemplateDialogTab,
    setNewTemplateName,
    setNewTemplateDescription,
    setIsRecipeDialogOpen,
    setSelectedRecipeId,
    setIsLoading,
    
    // ハンドラー関数
    handleResetToToday,
    handleOpenDialog,
    handleSaveMealWrapper,
    handleOpenRecipeDialog,
    handleCloseRecipeDialog,
    handleCloseSnackbar,
    handleOpenTemplateDialog,
    handleViewUnitChange,
  };
};
