import React from 'react';
import { ToggleButton, ToggleButtonGroup } from '@mui/material';
import { ViewUnit } from '../types/Menu.types';

interface ViewUnitSelectorProps {
  viewUnit: ViewUnit;
  onViewUnitChange: (newViewUnit: ViewUnit) => void;
  isLoading?: boolean;
}

/**
 * 表示単位選択コンポーネント
 */
const ViewUnitSelector: React.FC<ViewUnitSelectorProps> = ({
  viewUnit,
  onViewUnitChange,
  isLoading = false
}) => {
  const handleViewUnitChange = (
    _event: React.MouseEvent<HTMLElement>,
    newViewUnit: ViewUnit | null
  ) => {
    if (newViewUnit !== null) {
      onViewUnitChange(newViewUnit);
    }
  };

  return (
    <ToggleButtonGroup
      value={viewUnit}
      exclusive
      onChange={handleViewUnitChange}
      aria-label="view unit"
      disabled={isLoading}
      sx={{
        '& .MuiToggleButton-root': {
          px: 2,
          py: 0.75,
          fontSize: '0.875rem',
          borderRadius: '8px',
          '&.Mui-selected': {
            backgroundColor: 'primary.main',
            color: 'white',
            '&:hover': {
              backgroundColor: 'primary.dark',
            }
          }
        }
      }}
    >
      <ToggleButton value="day" aria-label="day view">
        1日
      </ToggleButton>
      <ToggleButton value="threeDay" aria-label="three day view">
        3日
      </ToggleButton>
      <ToggleButton value="week" aria-label="week view">
        週間
      </ToggleButton>
    </ToggleButtonGroup>
  );
};

export default ViewUnitSelector;
