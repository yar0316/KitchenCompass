import React from 'react';
import { 
  Typography, 
  Box, 
  Button,
  ToggleButtonGroup,
  ToggleButton,
  useTheme,
  useMediaQuery
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import ViewDayIcon from '@mui/icons-material/ViewDay';
import ViewWeekIcon from '@mui/icons-material/ViewWeek';
import ViewModuleIcon from '@mui/icons-material/ViewModule';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import AssignmentIcon from '@mui/icons-material/Assignment';
import { ViewUnit } from './types/Menu.types';

interface MenuPlanHeaderProps {
  viewUnit: ViewUnit;
  onViewUnitChange: (
    event: React.MouseEvent<HTMLElement>,
    newViewUnit: ViewUnit | null
  ) => void;
  onResetToToday: () => void;
  onOpenTemplateDialog: (tab: number) => void;
  isLoading: boolean;
}

/**
 * 献立計画ページのヘッダーコンポーネント
 */
const MenuPlanHeader: React.FC<MenuPlanHeaderProps> = ({
  viewUnit,
  onViewUnitChange,
  onResetToToday,
  onOpenTemplateDialog,
  isLoading
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  return (
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
          onChange={onViewUnitChange}
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
          onClick={onResetToToday}
          size={isMobile ? "small" : "medium"}
          disabled={isLoading}
        >
          今日
        </Button>

        <Button
          variant="outlined"
          color="primary"
          startIcon={<AssignmentIcon />}
          onClick={() => onOpenTemplateDialog(0)}
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
    </Box>
  );
};

export default MenuPlanHeader;
