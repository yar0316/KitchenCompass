import React from 'react';
import { Button } from '@mui/material';
import { Template } from '../types/Menu.types';

interface TemplateSelectorProps {
  templates: Template[];
  onOpenTemplateDialog: () => void;
  isLoading?: boolean;
}

/**
 * テンプレート選択コンポーネント
 */
const TemplateSelector: React.FC<TemplateSelectorProps> = ({
  onOpenTemplateDialog,
  isLoading = false
}) => {
  return (
    <Button
      variant="outlined"
      onClick={onOpenTemplateDialog}
      disabled={isLoading}
      sx={{
        minWidth: 'auto',
        px: 2,
        py: 0.75,
        fontSize: '0.875rem',
        borderRadius: '8px',
        '&:hover': {
          borderColor: 'primary.main',
          backgroundColor: 'primary.main',
          color: 'white',
        }
      }}
    >
      テンプレート
    </Button>
  );
};

export default TemplateSelector;
