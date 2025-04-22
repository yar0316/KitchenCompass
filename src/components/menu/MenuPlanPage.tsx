import React, { useState, useMemo } from 'react';
import { 
  Container, 
  Typography, 
  Box, 
  Button,
  Paper,
  Divider,
  ToggleButtonGroup,
  ToggleButton,
  useTheme,
  useMediaQuery,
  Snackbar,
  Alert,
  Menu,
  MenuItem,
  ListItemIcon,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
  Tabs,
  Tab
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import ViewDayIcon from '@mui/icons-material/ViewDay';
import ViewWeekIcon from '@mui/icons-material/ViewWeek';
import ViewModuleIcon from '@mui/icons-material/ViewModule';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import AssignmentIcon from '@mui/icons-material/Assignment';
import AssignmentTurnedInIcon from '@mui/icons-material/AssignmentTurnedIn';
import SaveIcon from '@mui/icons-material/Save';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import CloseIcon from '@mui/icons-material/Close';
import WeeklyMenuPlan from './WeeklyMenuPlan';
import MenuPlanningDialog from './MenuPlanningDialog';
import RecipeDetails from '../recipe/RecipeDetails'; // レシピ詳細コンポーネントをインポート
import { MOCK_RECIPES } from '../../mock/recipeData';

// 表示単位の型定義
type ViewUnit = 'day' | 'threeDay' | 'week';

// モックデータ：献立計画のサンプル
const MOCK_MENU_PLANS = {
  currentWeek: {
    id: 'week-1',
    startDate: new Date(2025, 3, 7),
    days: [
      {
        date: new Date(2025, 3, 7),
        meals: [
          { id: 'b1', name: 'トースト＆目玉焼き', type: 'breakfast', recipeId: null },
          { id: 'l1', name: '海老アボカドサラダ', type: 'lunch', recipeId: '3' },
          { id: 'd1', name: '肉じゃが', type: 'dinner', recipeId: '2' }
        ]
      },
      {
        date: new Date(2025, 3, 8),
        meals: [
          { id: 'b2', name: 'シリアル', type: 'breakfast', recipeId: null },
          { id: 'l2', name: '鶏の照り焼き丼', type: 'lunch', recipeId: '5' },
          { id: 'd2', name: 'カプレーゼサラダ', type: 'dinner', recipeId: '1' }
        ]
      },
      {
        date: new Date(2025, 3, 9),
        meals: [
          { id: 'b3', name: 'バナナ＆ヨーグルト', type: 'breakfast', recipeId: null },
          { id: 'l3', name: '外食', type: 'lunch', recipeId: null },
          { id: 'd3', name: '手作りピザ', type: 'dinner', recipeId: '4' }
        ]
      },
      {
        date: new Date(2025, 3, 10),
        meals: [
          { id: 'b4', name: 'おにぎり', type: 'breakfast', recipeId: null },
          { id: 'l4', name: 'サンドイッチ', type: 'lunch', recipeId: null },
          { id: 'd4', name: 'ステーキ', type: 'dinner', recipeId: null }
        ]
      },
      {
        date: new Date(2025, 3, 11),
        meals: [
          { id: 'b5', name: 'パン＆サラダ', type: 'breakfast', recipeId: null },
          { id: 'l5', name: 'ラーメン', type: 'lunch', recipeId: null },
          { id: 'd5', name: 'カレーライス', type: 'dinner', recipeId: null }
        ]
      },
      {
        date: new Date(2025, 3, 12),
        meals: [
          { id: 'b6', name: 'フレンチトースト', type: 'breakfast', recipeId: null },
          { id: 'l6', name: '冷やし中華', type: 'lunch', recipeId: null },
          { id: 'd6', name: 'ハンバーグ', type: 'dinner', recipeId: null }
        ]
      },
      {
        date: new Date(2025, 3, 13),
        meals: [
          { id: 'b7', name: 'パンケーキ', type: 'breakfast', recipeId: null },
          { id: 'l7', name: 'オムライス', type: 'lunch', recipeId: null },
          { id: 'd7', name: '寿司', type: 'dinner', recipeId: null }
        ]
      }
    ]
  },
  nextWeek: {
    id: 'week-2',
    startDate: new Date(2025, 3, 14),
    days: Array(7).fill(null).map((_, index) => ({
      date: new Date(2025, 3, 14 + index),
      meals: [
        { id: `nb${index+1}`, name: '', type: 'breakfast', recipeId: null },
        { id: `nl${index+1}`, name: '', type: 'lunch', recipeId: null },
        { id: `nd${index+1}`, name: '', type: 'dinner', recipeId: null }
      ]
    }))
  }
};

// モックデータ：献立テンプレート
const MOCK_TEMPLATES = [
  {
    id: 'template-1',
    name: '基本の一週間',
    description: '基本的な献立プラン',
    days: [
      {
        meals: [
          { type: 'breakfast', name: 'トースト＆卵', recipeId: null },
          { type: 'lunch', name: 'サラダと雑炊', recipeId: null },
          { type: 'dinner', name: 'チキンステーキ', recipeId: null }
        ]
      },
      {
        meals: [
          { type: 'breakfast', name: 'シリアル', recipeId: null },
          { type: 'lunch', name: '野菜スープ', recipeId: null },
          { type: 'dinner', name: '鮭の塩焼き', recipeId: null }
        ]
      }
    ]
  },
  {
    id: 'template-2',
    name: 'ダイエット週間',
    description: '低カロリーの献立プラン',
    days: [
      {
        meals: [
          { type: 'breakfast', name: 'グリーンスムージー', recipeId: null },
          { type: 'lunch', name: 'ささみサラダ', recipeId: null },
          { type: 'dinner', name: '豆腐ステーキ', recipeId: null }
        ]
      }
    ]
  }
];

const MenuPlanPage: React.FC = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  
  const [menuPlans, setMenuPlans] = useState(MOCK_MENU_PLANS);
  const [activeWeek, setActiveWeek] = useState<'currentWeek' | 'nextWeek'>('currentWeek');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedMealType, setSelectedMealType] = useState<'breakfast' | 'lunch' | 'dinner' | null>(null);
  const [editingMeal, setEditingMeal] = useState<any | null>(null);
  const [viewUnit, setViewUnit] = useState<ViewUnit>('week');
  const [viewStartDate, setViewStartDate] = useState<Date>(new Date());
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success' as 'success' | 'info' | 'warning' | 'error'
  });
  const [templates, setTemplates] = useState(MOCK_TEMPLATES);
  const [isTemplateDialogOpen, setIsTemplateDialogOpen] = useState(false);
  const [selectedTemplateId, setSelectedTemplateId] = useState<string | null>(null);
  const [templateDialogTab, setTemplateDialogTab] = useState(0);
  const [newTemplateName, setNewTemplateName] = useState('');
  const [newTemplateDescription, setNewTemplateDescription] = useState('');
  const [isRecipeDialogOpen, setIsRecipeDialogOpen] = useState(false);
  const [selectedRecipeId, setSelectedRecipeId] = useState<string | null>(null);

  const filteredDays = useMemo(() => {
    const allDays = menuPlans[activeWeek].days;
    const today = new Date();
    
    // 表示単位が変更された場合、現在日付に最も近い日付を開始日として設定
    if (viewUnit !== 'week') {
      const closestDayIndex = allDays.findIndex(day => 
        day.date.getTime() >= today.getTime()
      );
      
      if (closestDayIndex !== -1 && viewStartDate.getTime() === today.getTime()) {
        setViewStartDate(allDays[closestDayIndex].date);
      }
    }
    
    switch (viewUnit) {
      case 'day':
        return allDays.filter(day => 
          day.date.toDateString() === viewStartDate.toDateString()
        );
      case 'threeDay':
        const startIndex = allDays.findIndex(day => 
          day.date.toDateString() === viewStartDate.toDateString()
        );
        
        if (startIndex === -1) return allDays.slice(0, 3);
        
        // 選択された日付を含む3日分を表示するように変更
        // 選択日を中心にして前日・当日・翌日を表示する
        let threeStartIndex = startIndex - 1;
        
        // 選択日が週の初め（インデックス0）の場合は、当日から3日分
        if (startIndex === 0) {
          threeStartIndex = 0;
        }
        // 選択日が週の終わり（最後のインデックス）の場合は、終わりの3日分
        else if (startIndex === allDays.length - 1) {
          threeStartIndex = Math.max(0, allDays.length - 3);
        }
        // それ以外の場合は、選択日を中心に表示
        else {
          threeStartIndex = Math.max(0, Math.min(startIndex - 1, allDays.length - 3));
        }
        
        return allDays.slice(threeStartIndex, threeStartIndex + 3);
      case 'week':
      default:
        return allDays;
    }
  }, [menuPlans, activeWeek, viewUnit, viewStartDate]);

  const handleViewUnitChange = (
    event: React.MouseEvent<HTMLElement>,
    newViewUnit: ViewUnit | null,
  ) => {
    if (newViewUnit !== null) {
      setViewUnit(newViewUnit);
      
      if (newViewUnit !== 'week') {
        const today = new Date();
        const allDays = menuPlans[activeWeek].days;
        const closestDayIndex = allDays.findIndex(day => 
          day.date.getTime() >= today.getTime()
        );
        
        if (closestDayIndex !== -1) {
          setViewStartDate(allDays[closestDayIndex].date);
        } else {
          setViewStartDate(allDays[0].date);
        }
      }
    }
  };

  const handlePrevious = () => {
    const allDays = menuPlans[activeWeek].days;
    const currentIndex = allDays.findIndex(day => 
      day.date.toDateString() === viewStartDate.toDateString()
    );
    
    // 現在の表示単位に合わせたステップ数を設定
    const step = viewUnit === 'threeDay' ? 3 : 1;
    
    // 現在の週の最初に達した場合
    if (currentIndex - step < 0) {
      // 現在の週から前の週に切り替える場合
      if (activeWeek === 'nextWeek') {
        setActiveWeek('currentWeek');
        const currentWeekDays = menuPlans.currentWeek.days;
        // 前の週の表示単位に応じた最後の日付から表示
        const lastPossibleIndex = Math.max(0, currentWeekDays.length - (viewUnit === 'threeDay' ? 3 : 1));
        setViewStartDate(currentWeekDays[lastPossibleIndex].date);
      } else {
        // 現在の週の最初の日付に設定
        setViewStartDate(allDays[0].date);
      }
      return;
    }
    
    // ステップ数分前に移動
    const prevIndex = currentIndex - step;
    setViewStartDate(allDays[prevIndex].date);
  };

  const handleNext = () => {
    const allDays = menuPlans[activeWeek].days;
    const currentIndex = allDays.findIndex(day => 
      day.date.toDateString() === viewStartDate.toDateString()
    );
    
    // 現在の表示単位に合わせたステップ数を設定
    const step = viewUnit === 'threeDay' ? 3 : 1;
    
    // 現在の週の最後に達した場合
    if (currentIndex + step >= allDays.length) {
      // 現在の週から次の週に切り替える場合
      if (activeWeek === 'currentWeek') {
        setActiveWeek('nextWeek');
        // 次の週の最初の日付から表示
        setViewStartDate(menuPlans.nextWeek.days[0].date);
      } else {
        // 現在の週の最後の日付に設定（表示単位に応じて調整）
        const lastPossibleIndex = Math.max(0, allDays.length - (viewUnit === 'threeDay' ? 3 : 1));
        setViewStartDate(allDays[lastPossibleIndex].date);
      }
      return;
    }
    
    // ステップ数分次に移動
    const nextIndex = currentIndex + step;
    setViewStartDate(allDays[nextIndex].date);
  };

  const handleOpenDialog = (date: Date, mealType: 'breakfast' | 'lunch' | 'dinner', existingMeal: any = null) => {
    setSelectedDate(date);
    setSelectedMealType(mealType);
    
    // 既存のメニューデータがない場合は、日付と食事タイプから検索する
    let mealData = existingMeal;
    
    if (!mealData || !mealData.name) {
      // カレンダーから対応する日付のデータを探す
      const weekKey = findWeekKeyByDate(date);
      
      if (weekKey) {
        const dayIndex = menuPlans[weekKey].days.findIndex(
          day => isSameDay(day.date, date)
        );
        
        if (dayIndex !== -1) {
          // 該当する日付が見つかった場合、指定された食事タイプのデータを取得
          const mealIndex = menuPlans[weekKey].days[dayIndex].meals.findIndex(
            meal => meal.type === mealType
          );
          
          if (mealIndex !== -1) {
            // 既存のメニューデータが見つかった場合
            mealData = menuPlans[weekKey].days[dayIndex].meals[mealIndex];
            
            // menuItemsがない場合は、旧形式からの変換
            if (!mealData.menuItems && mealData.name) {
              mealData = {
                ...mealData,
                menuItems: [{
                  id: mealData.id || `menu-${Date.now()}`,
                  name: mealData.name,
                  recipeId: mealData.recipeId
                }]
              };
            }
          }
        }
      }
    }
    
    setEditingMeal(mealData);
    setIsDialogOpen(true);
  };

  const handleSaveMeal = (mealData: any) => {
    if (!selectedDate || !selectedMealType) return;

    const weekKey = activeWeek;
    const updatedWeek = { ...menuPlans[weekKey] };
    
    const dayIndex = updatedWeek.days.findIndex(
      day => day.date.toDateString() === selectedDate.toDateString()
    );
    
    if (dayIndex === -1) return;
    
    const mealIndex = updatedWeek.days[dayIndex].meals.findIndex(
      meal => meal.type === selectedMealType
    );
    
    if (mealIndex === -1) {
      updatedWeek.days[dayIndex].meals.push({
        id: `meal-${Date.now()}`,
        type: selectedMealType,
        ...mealData
      });
    } else {
      updatedWeek.days[dayIndex].meals[mealIndex] = {
        ...updatedWeek.days[dayIndex].meals[mealIndex],
        ...mealData
      };
    }
    
    setMenuPlans({
      ...menuPlans,
      [weekKey]: updatedWeek
    });
    
    setIsDialogOpen(false);
  };

  const handleShowToday = () => {
    const today = new Date();
    
    const currentWeekContainsToday = menuPlans.currentWeek.days.some(
      day => day.date.toDateString() === today.toDateString()
    );
    
    const weekKey = currentWeekContainsToday ? 'currentWeek' : 'nextWeek';
    setActiveWeek(weekKey);
    
    const allDays = menuPlans[weekKey].days;
    const todayIndex = allDays.findIndex(
      day => day.date.toDateString() === today.toDateString()
    );
    
    if (todayIndex !== -1) {
      setViewStartDate(allDays[todayIndex].date);
    } else {
      const closestDayIndex = allDays.findIndex(
        day => day.date.getTime() >= today.getTime()
      );
      
      if (closestDayIndex !== -1) {
        setViewStartDate(allDays[closestDayIndex].date);
      } else {
        setViewStartDate(allDays[0].date);
      }
    }
  };

  const handleMoveMeal = (meal: MealData, fromDate: Date, toDate: Date, toType: 'breakfast' | 'lunch' | 'dinner') => {
    console.log('Handle move meal:', { meal, fromDate, toDate, toType });
    
    // 現在のアクティブな週を特定
    const weekKey = activeWeek;
    
    // コピー作成
    const updatedMenuPlans = { ...menuPlans };
    const updatedWeekData = { ...updatedMenuPlans[weekKey] };
    
    // 移動元の日付と移動先の日付を見つける
    const sourceDayIndex = updatedWeekData.days.findIndex(
      day => isSameDay(day.date, fromDate)
    );
    
    const targetDayIndex = updatedWeekData.days.findIndex(
      day => isSameDay(day.date, toDate)
    );
    
    if (sourceDayIndex === -1 || targetDayIndex === -1) {
      console.error('Source or target day not found', { sourceDayIndex, targetDayIndex, fromDate, toDate });
      return;
    }
    
    // 移動元のメニューを見つける
    const sourceDay = updatedWeekData.days[sourceDayIndex];
    const sourceMealIndex = sourceDay.meals.findIndex(m => m.type === meal.type);
    
    // 移動先のメニューを見つける
    const targetDay = updatedWeekData.days[targetDayIndex];
    const targetMealIndex = targetDay.meals.findIndex(m => m.type === toType);
    
    // 移動元と移動先のメニュー情報
    const sourceMeal = sourceMealIndex !== -1 ? sourceDay.meals[sourceMealIndex] : null;
    const targetMeal = targetMealIndex !== -1 ? targetDay.meals[targetMealIndex] : null;
    
    console.log('Source meal structure:', sourceMeal);
    console.log('Target meal structure:', targetMeal);
    
    if (!sourceMeal) {
      console.error('Source meal not found');
      return;
    }
    
    // メニューアイテムを検索して取得
    let itemToMove: any | null = null;
    
    if (sourceMeal.menuItems && sourceMeal.menuItems.length > 0) {
      // idでアイテムを検索
      itemToMove = sourceMeal.menuItems.find(item => 
        item.id === meal.id || 
        (meal.item && item.id === meal.item.id)
      ) || null;
      
      // idが一致しない場合は名前で検索 (互換性のため)
      if (!itemToMove) {
        itemToMove = sourceMeal.menuItems.find(item => 
          item.name === meal.name ||
          (meal.item && item.name === meal.item.name)
        ) || null;
      }
      
      console.log('Item to move found in menuItems:', itemToMove);
    } else if (sourceMeal.name === meal.name || (meal.item && sourceMeal.name === meal.item.name)) {
      // 単一アイテムの場合
      itemToMove = {
        id: sourceMeal.id,
        name: sourceMeal.name,
        recipeId: sourceMeal.recipeId
      };
      console.log('Item to move is a single meal item:', itemToMove);
    }
    
    if (!itemToMove) {
      // DnD-kitの構造から直接取得を試みる
      if (meal.item) {
        itemToMove = meal.item;
        console.log('Item to move extracted from DnD data structure:', itemToMove);
      } else {
        console.error('Menu item to move not found');
        return;
      }
    }
    
    console.log('Item to move final:', itemToMove);
    
    // 移動するアイテムの情報を使って新しいメニューアイテムを作成
    const newMealItem = {
      id: itemToMove.id || `menu-item-${Date.now()}`,
      name: itemToMove.name,
      type: toType,
      recipeId: itemToMove.recipeId
    };
    
    // 移動元からアイテムを削除（複数アイテムの場合のみ）
    if (sourceMeal.menuItems && sourceMeal.menuItems.length > 1) {
      // 重要: 他のアイテムは保持したまま、移動するアイテムだけを削除
      const itemIdToRemove = itemToMove.id;
      const remainingItems = sourceMeal.menuItems.filter(item => item.id !== itemIdToRemove);
      
      sourceDay.meals[sourceMealIndex] = {
        ...sourceMeal,
        menuItems: remainingItems
      };
      
      console.log('Remaining items in source after removal:', remainingItems);
    } else if (sourceMeal.menuItems && sourceMeal.menuItems.length === 1) {
      // 最後のアイテムなら空の献立にする
      sourceDay.meals[sourceMealIndex] = {
        id: sourceMeal.id,
        name: '',
        type: sourceMeal.type,
        recipeId: null
      };
      console.log('Last item removed, source meal is now empty');
    } else {
      // 移動元が単一アイテムで他に何もない場合は空の献立にする
      sourceDay.meals[sourceMealIndex] = {
        id: sourceMeal.id,
        name: '',
        type: sourceMeal.type,
        recipeId: null
      };
      console.log('Single item source is now empty');
    }
    
    // 移動先の処理
    if (targetMeal) {
      // 移動先に既に献立が存在する場合
      if (targetMeal.name && targetMeal.name.length > 0) {
        console.log('Target already has a meal');
        
        // 移動先が既にmenuItemsを持っている場合
        if (targetMeal.menuItems && targetMeal.menuItems.length > 0) {
          // 既存のmenuItemsに新しいアイテムを追加
          console.log('Adding to existing menuItems');
          
          targetDay.meals[targetMealIndex].menuItems = [
            ...targetMeal.menuItems,
            {
              id: newMealItem.id,
              name: newMealItem.name,
              recipeId: newMealItem.recipeId
            }
          ];
          console.log('Added single menu item to target with existing menuItems');
        } else {
          // 移動先がmenuItemsを持っていない場合、新しく作成
          console.log('Creating new menuItems structure');
          
          // 既存のアイテムをmenuItemsに変換
          const existingItem = {
            id: targetMeal.id,
            name: targetMeal.name,
            recipeId: targetMeal.recipeId
          };
          
          // 既存のアイテムと新しいアイテムをmenuItemsとして設定
          const newMenuItem = {
            id: newMealItem.id,
            name: newMealItem.name,
            recipeId: newMealItem.recipeId
          };
          
          targetDay.meals[targetMealIndex] = {
            ...targetMeal,
            menuItems: [existingItem, newMenuItem]
          };
          console.log('Created new menuItems structure with existing item and new item');
        }
      } else {
        // 移動先が空の場合は単純に置き換え
        console.log('Target is empty, replacing');
        targetDay.meals[targetMealIndex] = newMealItem;
      }
    } else {
      // 移動先に献立がない場合は新規追加
      console.log('No target meal, creating new');
      targetDay.meals.push(newMealItem);
    }
    
    // 更新した週データをメインの状態に戻す
    updatedMenuPlans[weekKey] = updatedWeekData;
    
    // 状態を更新
    setMenuPlans(updatedMenuPlans);
    console.log('Menu plans updated successfully');
  };

  const isSameDay = (date1: Date, date2: Date): boolean => {
    if (!date1 || !date2) return false;
    
    try {
      return (
        date1.getFullYear() === date2.getFullYear() &&
        date1.getMonth() === date2.getMonth() &&
        date1.getDate() === date2.getDate()
      );
    } catch (error) {
      console.error('Error comparing dates:', error, { date1, date2 });
      return false;
    }
  };

  const findWeekKeyByDate = (date: Date): 'currentWeek' | 'nextWeek' | null => {
    const inCurrentWeek = menuPlans.currentWeek.days.some(
      day => day.date.toDateString() === date.toDateString()
    );
    
    if (inCurrentWeek) return 'currentWeek';
    
    const inNextWeek = menuPlans.nextWeek.days.some(
      day => day.date.toDateString() === date.toDateString()
    );
    
    if (inNextWeek) return 'nextWeek';
    
    return null;
  };

  const getFormattedDate = (date: Date): string => {
    return `${date.getMonth() + 1}/${date.getDate()}`;
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  const handleOpenTemplateDialog = (tab: number = 0) => {
    setTemplateDialogTab(tab);
    setSelectedTemplateId(null);
    setNewTemplateName('');
    setNewTemplateDescription('');
    setIsTemplateDialogOpen(true);
  };

  const handleApplyTemplate = () => {
    if (!selectedTemplateId) return;
    
    const template = templates.find(t => t.id === selectedTemplateId);
    if (!template) return;
    
    const updatedWeek = { ...menuPlans[activeWeek] };
    
    template.days.forEach((templateDay, index) => {
      if (index < updatedWeek.days.length) {
        templateDay.meals.forEach(templateMeal => {
          const mealIndex = updatedWeek.days[index].meals.findIndex(
            meal => meal.type === templateMeal.type
          );
          
          if (mealIndex !== -1) {
            updatedWeek.days[index].meals[mealIndex] = {
              ...updatedWeek.days[index].meals[mealIndex],
              name: templateMeal.name,
              recipeId: templateMeal.recipeId
            };
          } else {
            updatedWeek.days[index].meals.push({
              id: `meal-${Date.now()}-${index}-${templateMeal.type}`,
              ...templateMeal
            });
          }
        });
      }
    });
    
    setMenuPlans({
      ...menuPlans,
      [activeWeek]: updatedWeek
    });
    
    setSnackbar({
      open: true,
      message: `テンプレート「${template.name}」を適用しました`,
      severity: 'success'
    });
    
    setIsTemplateDialogOpen(false);
  };

  const handleSaveNewTemplate = () => {
    if (!newTemplateName.trim()) return;
    
    const currentWeekData = menuPlans[activeWeek];
    
    const newTemplate = {
      id: `template-${Date.now()}`,
      name: newTemplateName,
      description: newTemplateDescription,
      days: currentWeekData.days.map(day => ({
        meals: day.meals.map(meal => ({
          type: meal.type,
          name: meal.name,
          recipeId: meal.recipeId
        }))
      }))
    };
    
    setTemplates([...templates, newTemplate]);
    
    setSnackbar({
      open: true,
      message: 'テンプレートを保存しました',
      severity: 'success'
    });
    
    setNewTemplateName('');
    setNewTemplateDescription('');
    setIsTemplateDialogOpen(false);
  };

  const handleDeleteTemplate = (templateId: string, event: React.MouseEvent) => {
    event.stopPropagation();
    const updatedTemplates = templates.filter(t => t.id !== templateId);
    setTemplates(updatedTemplates);
    
    if (selectedTemplateId === templateId) {
      setSelectedTemplateId(null);
    }
    
    setSnackbar({
      open: true,
      message: 'テンプレートを削除しました',
      severity: 'info'
    });
  };

  const handleOpenRecipeDialog = (recipeId: string) => {
    setSelectedRecipeId(recipeId);
    setIsRecipeDialogOpen(true);
  };

  const handleCloseRecipeDialog = () => {
    setIsRecipeDialogOpen(false);
  };

  return (
    <Container 
      maxWidth={false} 
      sx={{ 
        mt: 1, 
        mb: 4,
        px: { xs: 1, sm: 1.5, md: 2 }, 
      }}
    >
      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        mb: 2,
        mx: 0.5,
        flexDirection: { xs: 'column', sm: 'row' },
        gap: { xs: 1, sm: 0 }
      }}>
        <Typography variant="h5" component="h1">
          献立カレンダー
        </Typography>
        
        <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', justifyContent: 'flex-end' }}>
          <ToggleButtonGroup
            value={viewUnit}
            exclusive
            onChange={handleViewUnitChange}
            aria-label="表示単位"
            size={isMobile ? "small" : "medium"}
          >
            <ToggleButton value="day" aria-label="日単位">
              <ViewDayIcon fontSize="small" />
              <Typography variant="body2" sx={{ ml: { xs: 0, sm: 0.5 }, display: { xs: 'none', sm: 'block' } }}>
                日単位
              </Typography>
            </ToggleButton>
            <ToggleButton value="threeDay" aria-label="3日単位">
              <ViewModuleIcon fontSize="small" />
              <Typography variant="body2" sx={{ ml: { xs: 0, sm: 0.5 }, display: { xs: 'none', sm: 'block' } }}>
                3日単位
              </Typography>
            </ToggleButton>
            <ToggleButton value="week" aria-label="週単位">
              <ViewWeekIcon fontSize="small" />
              <Typography variant="body2" sx={{ ml: { xs: 0, sm: 0.5 }, display: { xs: 'none', sm: 'block' } }}>
                週単位
              </Typography>
            </ToggleButton>
          </ToggleButtonGroup>

          <Button
            variant="outlined"
            color="primary"
            startIcon={<CalendarTodayIcon />}
            onClick={handleShowToday}
            size={isMobile ? "small" : "medium"}
          >
            今日
          </Button>

          <Button
            variant="outlined"
            color="primary"
            startIcon={<AssignmentIcon />}
            onClick={() => handleOpenTemplateDialog(0)}
            size={isMobile ? "small" : "medium"}
          >
            テンプレート
          </Button>

          <Button
            variant="contained"
            color="primary"
            startIcon={<AddIcon />}
            disabled
            size={isMobile ? "small" : "medium"}
          >
            まとめて登録
          </Button>
        </Box>
      </Box>

      <Paper sx={{ mb: 3, borderRadius: 2 }}>
        {viewUnit === 'week' && (
          <>
            <Box sx={{ 
              display: 'flex', 
              justifyContent: 'space-between', 
              alignItems: 'center', 
              px: 2, 
              py: 1.5,
              borderBottom: 1, 
              borderColor: 'divider' 
            }}>
              <Button
                color="primary"
                disabled={activeWeek === 'currentWeek'}
                onClick={() => setActiveWeek('currentWeek')}
                sx={{ fontWeight: activeWeek === 'currentWeek' ? 'bold' : 'normal' }}
              >
                今週
              </Button>
              <Button
                color="primary"
                disabled={activeWeek === 'nextWeek'}
                onClick={() => setActiveWeek('nextWeek')}
                sx={{ fontWeight: activeWeek === 'nextWeek' ? 'bold' : 'normal' }}
              >
                来週
              </Button>
            </Box>
            <Divider />
          </>
        )}
        
        <WeeklyMenuPlan 
          weekData={{
            ...menuPlans[activeWeek],
            days: filteredDays
          }}
          onMealClick={handleOpenDialog}
          viewUnit={viewUnit}
          onNext={viewUnit !== 'week' ? handleNext : undefined}
          onPrevious={viewUnit !== 'week' ? handlePrevious : undefined}
          onMoveMeal={handleMoveMeal}
          onRecipeClick={handleOpenRecipeDialog}
        />
      </Paper>

      <MenuPlanningDialog 
        open={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        onSave={handleSaveMeal}
        date={selectedDate}
        mealType={selectedMealType}
        editingMeal={editingMeal}
      />
      
      {/* レシピ詳細ダイアログ */}
      {selectedRecipeId && (
        <RecipeDetails 
          open={isRecipeDialogOpen} 
          onClose={handleCloseRecipeDialog}
          recipeId={selectedRecipeId}
        />
      )}
      
      <Dialog
        open={isTemplateDialogOpen}
        onClose={() => setIsTemplateDialogOpen(false)}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 2,
            overflow: 'hidden'
          }
        }}
      >
        <DialogTitle sx={{ 
          display: 'flex', 
          justifyContent: 'space-between',
          alignItems: 'center',
          mb: 0,
          py: 2
        }}>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <AssignmentIcon color="primary" sx={{ mr: 1 }} />
            <Typography variant="h6" component="span">
              献立テンプレート
            </Typography>
          </Box>
          <IconButton edge="end" onClick={() => setIsTemplateDialogOpen(false)}>
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tabs
            value={templateDialogTab}
            onChange={(e, newValue) => setTemplateDialogTab(newValue)}
            variant="fullWidth"
          >
            <Tab label="テンプレートを適用" />
            <Tab label="現在の献立をテンプレートとして保存" />
          </Tabs>
        </Box>
        
        <DialogContent dividers>
          {templateDialogTab === 0 && (
            <>
              <Typography variant="body2" color="text.secondary" paragraph>
                既存のテンプレートを選択して、現在の週に適用できます。
              </Typography>
              
              {templates.length === 0 ? (
                <Alert severity="info" sx={{ mt: 2 }}>
                  保存されたテンプレートはありません
                </Alert>
              ) : (
                <List sx={{ mt: 2 }}>
                  {templates.map((template) => (
                    <React.Fragment key={template.id}>
                      <ListItem
                        button
                        selected={selectedTemplateId === template.id}
                        onClick={() => setSelectedTemplateId(
                          selectedTemplateId === template.id ? null : template.id
                        )}
                        sx={{
                          borderRadius: 1,
                          mb: 1,
                          border: '1px solid',
                          borderColor: selectedTemplateId === template.id ? 'primary.main' : 'grey.300',
                          bgcolor: selectedTemplateId === template.id ? 'primary.50' : 'background.paper',
                        }}
                      >
                        <ListItemText
                          primary={template.name}
                          secondary={template.description}
                        />
                        <ListItemSecondaryAction>
                          <IconButton
                            edge="end"
                            onClick={(event) => handleDeleteTemplate(template.id, event)}
                            size="small"
                          >
                            <DeleteIcon fontSize="small" />
                          </IconButton>
                        </ListItemSecondaryAction>
                      </ListItem>
                      <Divider sx={{ my: 1 }} />
                    </React.Fragment>
                  ))}
                </List>
              )}
              
              {selectedTemplateId && (
                <Alert severity="warning" sx={{ mt: 2 }}>
                  テンプレートの適用により、現在の献立が上書きされます。
                </Alert>
              )}
            </>
          )}
          
          {templateDialogTab === 1 && (
            <>
              <Typography variant="body2" color="text.secondary" paragraph>
                現在表示している週の献立をテンプレートとして保存できます。
              </Typography>
              
              <TextField
                margin="dense"
                label="テンプレート名"
                fullWidth
                variant="outlined"
                value={newTemplateName}
                onChange={(e) => setNewTemplateName(e.target.value)}
                sx={{ mt: 2, mb: 2 }}
              />
              
              <TextField
                margin="dense"
                label="説明（任意）"
                fullWidth
                multiline
                rows={2}
                variant="outlined"
                value={newTemplateDescription}
                onChange={(e) => setNewTemplateDescription(e.target.value)}
              />
            </>
          )}
        </DialogContent>
        
        <DialogActions sx={{ px: 3, py: 2 }}>
          <Button onClick={() => setIsTemplateDialogOpen(false)} color="inherit">
            キャンセル
          </Button>
          {templateDialogTab === 0 ? (
            <Button 
              onClick={handleApplyTemplate} 
              variant="contained"
              disabled={!selectedTemplateId}
              startIcon={<AssignmentTurnedInIcon />}
            >
              適用
            </Button>
          ) : (
            <Button 
              onClick={handleSaveNewTemplate} 
              variant="contained"
              disabled={!newTemplateName.trim()}
              startIcon={<SaveIcon />}
            >
              保存
            </Button>
          )}
        </DialogActions>
      </Dialog>
      
      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert 
          onClose={handleCloseSnackbar} 
          severity={snackbar.severity}
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default MenuPlanPage;