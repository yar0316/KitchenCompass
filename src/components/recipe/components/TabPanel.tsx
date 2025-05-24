import React from 'react';
import { TabPanelProps } from '../types/RecipeFormTypes';

/**
 * タブパネルコンポーネント
 */
const TabPanel: React.FC<TabPanelProps> = ({ children, value, index, ...other }) => {
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`recipe-tabpanel-${index}`}
      aria-labelledby={`recipe-tab-${index}`}
      {...other}
      style={{ paddingTop: '16px' }}
    >
      {value === index && <>{children}</>}
    </div>
  );
};

export default TabPanel;
