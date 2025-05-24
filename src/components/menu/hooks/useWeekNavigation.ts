import { DayData, ViewUnit, SnackbarState } from '../types/Menu.types';
import { dateUtils } from '../utils/dateUtils';

interface WeekNavigationLogic {
  handlePrevious: () => void;
  handleNext: () => void;
}

interface UseWeekNavigationProps {
  filteredDays: DayData[];
  viewUnit: ViewUnit;
  setViewStartDate: (date: Date) => void;
  setSnackbar: (snackbar: SnackbarState) => void;
}

/**
 * 週間ナビゲーション機能を管理するカスタムフック
 */
export const useWeekNavigation = ({
  filteredDays,
  viewUnit,
  setViewStartDate,
  setSnackbar
}: UseWeekNavigationProps): WeekNavigationLogic => {
  
  // 前の期間に移動
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
  };

  return {
    handlePrevious,
    handleNext
  };
};
