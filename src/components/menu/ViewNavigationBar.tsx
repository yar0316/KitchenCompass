import React from 'react';
import { 
  Box, 
  Typography,
  IconButton,
  Divider
} from '@mui/material';
import NavigateBeforeIcon from '@mui/icons-material/NavigateBefore';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import { ViewUnit } from './types/Menu.types';
import { dateUtils } from './utils/dateUtils';

interface ViewNavigationBarProps {
  viewUnit: ViewUnit;
  viewStartDate: Date;
  onPrevious: () => void;
  onNext: () => void;
  isLoading: boolean;
}

/**
 * 献立計画ページのナビゲーションバーコンポーネント
 */
const ViewNavigationBar: React.FC<ViewNavigationBarProps> = ({
  viewUnit,
  viewStartDate,
  onPrevious,
  onNext,
  isLoading
}) => {
  const getDisplayText = () => {
    if (viewUnit === 'week') {
      const weekStart = dateUtils.getStartOfWeek(viewStartDate);
      const weekEnd = dateUtils.addDays(weekStart, 6);
      return `${weekStart.getMonth() + 1}月${weekStart.getDate()}日 - ${weekEnd.getMonth() + 1}月${weekEnd.getDate()}日`;
    } else if (viewUnit === 'threeDay') {
      return `${viewStartDate.getMonth() + 1}月${viewStartDate.getDate()}日から3日間`;
    } else {
      return `${viewStartDate.getMonth() + 1}月${viewStartDate.getDate()}日`;
    }
  };

  return (
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
          onClick={onPrevious}
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
          {getDisplayText()}
        </Typography>
        
        <IconButton
          color="primary"
          onClick={onNext}
          disabled={isLoading}
          size="medium"
        >
          <NavigateNextIcon />
        </IconButton>
      </Box>
      <Divider />
    </>
  );
};

export default ViewNavigationBar;
