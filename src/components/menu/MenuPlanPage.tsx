import React, { useState, useMemo, useEffect } from 'react';
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
  Tab,
  CircularProgress
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
import CloseIcon from '@mui/icons-material/Close';
import NavigateBeforeIcon from '@mui/icons-material/NavigateBefore';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';

import WeeklyMenuPlan from './WeeklyMenuPlan';
import MenuPlanningDialog from './MenuPlanningDialog';
import RecipeDetails from '../recipe/RecipeDetails';
import { useMenuData } from './hooks/useMenuData';
import { dateUtils } from './utils/dateUtils';
import { menuUtils } from './utils/menuUtils';
import { 
  ViewUnit, 
  MealData, 
  MenuItemData, 
  SnackbarState, 
  Template
} from './types/Menu.types';

/**
 * 献立計画のメインページコンポーネント
 */
const MenuPlanPage: React.FC = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  // カスタムフックから献立データと操作関数を取得
  const { 
    menuPlans, 
    templates,
    setTemplates,
    fetchMenus,
    handleSaveMeal,
    handleMoveMeal,
    applyTemplate
  } = useMenuData();

  // UI状態
  const [viewUnit, setViewUnit] = useState<ViewUnit>('week');
  const [viewStartDate, setViewStartDate] = useState<Date>(new Date());
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);  const [selectedMealType, setSelectedMealType] = useState<'breakfast' | 'lunch' | 'dinner' | null>(null);
  const [editingMeal, setEditingMeal] = useState<MealData | null>(null);
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
  const [isLoading, setIsLoading] = useState<boolean>(false);  // 表示する日データをフィルタリング
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
      case 'week':
      default: {
        // 週表示の場合、viewStartDateを含む週の開始日から7日分を生成
        const weekStart = dateUtils.getStartOfWeek(viewStartDate);
        const weekDays = dateUtils.generateWeekDays(weekStart);
          // 既存データがある場合はそれを使用、なければ空のデータを生成
        return weekDays.map(date => {
          const existingDay = allDays.find(day => dateUtils.isSameDay(day.date, date));
          if (existingDay) {
            return existingDay;
          }
          // 既存データがない場合は空のデータを生成
          return {
            id: `day-${date.toISOString().split('T')[0]}`,
            date,
            meals: []
          };
        });
      }
    }
  }, [menuPlans, viewUnit, viewStartDate]);// 表示単位（日・3日・週）の変更ハンドラー
  const handleViewUnitChange = (
    _event: React.MouseEvent<HTMLElement>,
    newViewUnit: ViewUnit | null,
  ) => {
    if (newViewUnit !== null) {
      setViewUnit(newViewUnit);
        if (newViewUnit !== 'week') {
        const today = new Date();
        // 全期間のデータを統合
        const allDays = [
          ...(menuPlans.previousWeek?.days || []),
          ...(menuPlans.currentWeek?.days || []),
          ...(menuPlans.nextWeek?.days || [])
        ].sort((a, b) => a.date.getTime() - b.date.getTime());
        
        if (allDays.length > 0) {
          // 当日のデータがあるかを確認
          const todayIndex = allDays.findIndex(day => 
            dateUtils.isSameDay(day.date, today)
          );
          
          if (todayIndex !== -1) {
            // 当日のデータがある場合は当日を設定
            setViewStartDate(allDays[todayIndex].date);
          } else {
            // 当日のデータがない場合は、当日以降で最も近い日を探す
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
      }
    }
  };  // 前の期間に移動
  const handlePrevious = () => {
    if (filteredDays.length === 0) return;
    
    // 現在表示している期間の最小日付を取得
    const minDate = filteredDays.reduce((earliest, day) => 
      day.date < earliest ? day.date : earliest, 
      filteredDays[0].date
    );
    
    let newStartDate: Date;
    
    switch (viewUnit) {
      case 'day':
        // 日単位: 前日に移動
        newStartDate = dateUtils.addDays(minDate, -1);
        break;
      case 'threeDay':
        // 3日単位: 3日前に移動
        newStartDate = dateUtils.addDays(minDate, -3);
        break;
      case 'week':
        // 週単位: 前の週に移動
        newStartDate = dateUtils.addDays(dateUtils.getStartOfWeek(minDate), -7);
        break;
      default:
        return;
    }
    
    setViewStartDate(newStartDate);
    
    setSnackbar({
      open: true,
      message: '前の期間に移動しました',
      severity: 'success'
    });
  };

  // 次の期間に移動
  const handleNext = () => {
    if (filteredDays.length === 0) return;
    
    // 現在表示している期間の最大日付を取得
    const maxDate = filteredDays.reduce((latest, day) => 
      day.date > latest ? day.date : latest, 
      filteredDays[0].date
    );
    
    let newStartDate: Date;
    
    switch (viewUnit) {
      case 'day':
        // 日単位: 翌日に移動
        newStartDate = dateUtils.addDays(maxDate, 1);
        break;
      case 'threeDay':
        // 3日単位: 1日後に移動（次の3日間を表示）
        newStartDate = dateUtils.addDays(maxDate, 1);
        break;
      case 'week':
        // 週単位: 次の週に移動
        newStartDate = dateUtils.addDays(dateUtils.getStartOfWeek(maxDate), 7);
        break;
      default:
        return;
    }
    
    setViewStartDate(newStartDate);
    
    setSnackbar({
      open: true,
      message: '次の期間に移動しました',
      severity: 'success'
    });
  };  // 基準日のリセット（今日ボタンクリック時）
  const handleResetToToday = async () => {
    const today = new Date();
    
    // 表示開始日を今日にリセット
    setViewStartDate(today);
    
    // 現在の週に今日が含まれているか確認
    const currentWeekHasToday = menuPlans.currentWeek.days.some(day => 
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
  };  // 献立保存処理のラッパー
  const handleSaveMealWrapper = async (mealData: MealData) => {
    if (!selectedDate || !selectedMealType) return;
    
    try {
      await handleSaveMeal(selectedDate, selectedMealType, mealData);
      setIsDialogOpen(false);
      setSnackbar({ open: true, message: '献立を保存しました', severity: 'success' });
    } catch (e) {
      console.error('[handleSaveMealWrapper] error:', e);
      setSnackbar({ open: true, message: '献立の保存に失敗しました', severity: 'error' });
    }
  };

  // スナックバーを閉じる
  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  // テンプレートダイアログを開く
  const handleOpenTemplateDialog = (tab: number = 0) => {
    setTemplateDialogTab(tab);
    setSelectedTemplateId(null);
    setNewTemplateName('');
    setNewTemplateDescription('');
    setIsTemplateDialogOpen(true);
  };
  // テンプレートを適用
  const handleApplyTemplate = () => {
    if (!selectedTemplateId) return;
    
    const success = applyTemplate(selectedTemplateId);
    
    if (success) {
      const template = templates.find(t => t.id === selectedTemplateId);
      
      setSnackbar({
        open: true,
        message: `テンプレート「${template?.name || 'テンプレート'}」を適用しました`,
        severity: 'success'
      });
    } else {
      setSnackbar({
        open: true,
        message: 'テンプレートの適用に失敗しました',
        severity: 'error'
      });
    }
    
    setIsTemplateDialogOpen(false);
  };
  // 新しいテンプレートを保存
  const handleSaveNewTemplate = () => {
    if (!newTemplateName.trim()) return;
    
    const currentWeekData = menuPlans.currentWeek;
      const newTemplate: Template = {
      id: `template-${Date.now()}`,
      name: newTemplateName,
      description: newTemplateDescription,
      days: currentWeekData.days.map(day => ({
        id: day.id,
        date: day.date,
        meals: day.meals.map(meal => ({
          id: meal.id,
          type: meal.type,
          name: meal.name,
          recipeId: meal.recipeId,
          mealType: meal.mealType,
          menuItems: meal.menuItems || []
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

  // テンプレートを削除
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

  // レシピ詳細ダイアログを開く
  const handleOpenRecipeDialog = (recipeId: string) => {
    setSelectedRecipeId(recipeId);
    setIsRecipeDialogOpen(true);
  };

  // レシピ詳細ダイアログを閉じる
  const handleCloseRecipeDialog = () => {
    setIsRecipeDialogOpen(false);
  };
  // 初期データの読み込み - 現在の週のみ取得
  useEffect(() => {
    const loadInitialData = async () => {
      try {
        setIsLoading(true);
        await fetchMenus();
      } catch (error) {
        console.error('初期データ読み込みエラー:', error);
        setSnackbar({
          open: true,
          message: '献立データの読み込みに失敗しました',
          severity: 'error'
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    loadInitialData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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
            onClick={handleResetToToday}
            size={isMobile ? "small" : "medium"}
            disabled={isLoading}
          >
            今日
          </Button>

          <Button
            variant="outlined"
            color="primary"
            startIcon={<AssignmentIcon />}
            onClick={() => handleOpenTemplateDialog(0)}
            size={isMobile ? "small" : "medium"}
            disabled={isLoading}
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
      </Box>      <Paper sx={{ mb: 3, borderRadius: 2 }}>
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
            <IconButton
              color="primary"
              onClick={handlePrevious}
              disabled={isLoading}
              size="medium"
            >
              <NavigateBeforeIcon />
            </IconButton>

            <Typography 
              variant="subtitle1" 
              component="div"
              sx={{ fontWeight: 'medium' }}
            >
              {(() => {
                if (viewUnit === 'week') {
                  const weekStart = dateUtils.getStartOfWeek(viewStartDate);
                  const weekEnd = dateUtils.addDays(weekStart, 6);
                  return `${weekStart.getMonth() + 1}月${weekStart.getDate()}日 - ${weekEnd.getMonth() + 1}月${weekEnd.getDate()}日`;
                } else if (viewUnit === 'threeDay') {
                  return `${viewStartDate.getMonth() + 1}月${viewStartDate.getDate()}日から3日間`;
                } else {
                  return `${viewStartDate.getMonth() + 1}月${viewStartDate.getDate()}日`;
                }
              })()}
            </Typography>
            
            <IconButton
              color="primary"
              onClick={handleNext}
              disabled={isLoading}
              size="medium"
            >
              <NavigateNextIcon />
            </IconButton>
          </Box>
          <Divider />
        </>
        
        {isLoading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
            <CircularProgress />
          </Box>        ) : filteredDays.length > 0 ? (
          <WeeklyMenuPlan 
            weekData={{
              id: 'current-view',
              startDate: filteredDays[0]?.date || new Date(),
              days: filteredDays
            }}
            onMealClick={handleOpenDialog}
            viewUnit={viewUnit}
            onMoveMeal={handleMoveMeal}
            onRecipeClick={handleOpenRecipeDialog}
          />
        ) : (
          <Box sx={{ p: 4, textAlign: 'center' }}>
            <Typography variant="body1" color="text.secondary">
              献立データがありません
            </Typography>            <Button 
              variant="contained" 
              color="primary" 
              sx={{ mt: 2 }} 
              onClick={() => fetchMenus()}
            >
              データを再読み込み
            </Button>
          </Box>
        )}
      </Paper>

      <MenuPlanningDialog 
        open={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        onSave={handleSaveMealWrapper}
        date={selectedDate}
        mealType={selectedMealType}
        editingMeal={editingMeal}
      />
      
      {selectedRecipeId && (
        <RecipeDetails 
          open={isRecipeDialogOpen} 
          onClose={handleCloseRecipeDialog}
          recipe={{ 
            id: selectedRecipeId,
            name: "読み込み中...",
            description: "",
            imageUrl: "",
            cookingTime: 0,
            tags: [],
            createdAt: new Date().toISOString()
          }}
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
        
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>          <Tabs
            value={templateDialogTab}
            onChange={(_e, newValue) => setTemplateDialogTab(newValue)}
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
                    <React.Fragment key={template.id}>                      <ListItem
                        component="div"
                        sx={{
                          borderRadius: 1,
                          mb: 1,
                          border: '1px solid',
                          borderColor: selectedTemplateId === template.id ? 'primary.main' : 'grey.300',
                          bgcolor: selectedTemplateId === template.id ? 'primary.50' : 'background.paper',
                          cursor: 'pointer',
                          '&:hover': {
                            bgcolor: selectedTemplateId === template.id ? 'primary.100' : 'grey.50',
                          }
                        }}
                        onClick={() => setSelectedTemplateId(
                          selectedTemplateId === template.id ? null : template.id
                        )}
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