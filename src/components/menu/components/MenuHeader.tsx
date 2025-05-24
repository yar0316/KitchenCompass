import React from 'react';
import { ViewUnit } from '../types/Menu.types';
import MenuPlanHeader from '../MenuPlanHeader';

interface MenuHeaderProps {
  viewUnit: ViewUnit;
  onViewUnitChange: (event: React.MouseEvent<HTMLElement>, newViewUnit: ViewUnit | null) => void;
  onResetToToday: () => Promise<void>;
  onOpenTemplateDialog: (tab?: number) => void;
  isLoading: boolean;
}

/**
 * メニュープランのヘッダー部分
 */
const MenuHeader: React.FC<MenuHeaderProps> = ({
  viewUnit,
  onViewUnitChange,
  onResetToToday,
  onOpenTemplateDialog,
  isLoading
}) => {
  return (
    <MenuPlanHeader
      viewUnit={viewUnit}
      onViewUnitChange={onViewUnitChange}
      onResetToToday={onResetToToday}
      onOpenTemplateDialog={onOpenTemplateDialog}
      isLoading={isLoading}
    />
  );
};

export default MenuHeader;
