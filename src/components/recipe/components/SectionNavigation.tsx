import React from 'react';
import {
  Box,
  Button
} from '@mui/material';

interface SectionNavigationProps {
  activeSection: 'ingredients' | 'steps';
  onSectionChange: (section: 'ingredients' | 'steps') => void;
}

/**
 * セクションナビゲーションコンポーネント
 * 材料・作り方のタブ切り替えを表示
 */
const SectionNavigation: React.FC<SectionNavigationProps> = ({
  activeSection,
  onSectionChange
}) => {
  return (
    <Box sx={{ display: 'flex', mb: 2 }}>
      <Button
        variant={activeSection === 'ingredients' ? 'contained' : 'text'}
        onClick={() => onSectionChange('ingredients')}
        sx={{ borderRadius: '8px 0 0 8px', flexGrow: 1 }}
      >
        材料
      </Button>
      <Button
        variant={activeSection === 'steps' ? 'contained' : 'text'}
        onClick={() => onSectionChange('steps')}
        sx={{ borderRadius: '0 8px 8px 0', flexGrow: 1 }}
      >
        作り方
      </Button>
    </Box>
  );
};

export default SectionNavigation;
