import React from 'react';
import { Box, Typography, Card } from '@mui/material';
import { Active } from '@dnd-kit/core';

interface DragOverlayContentProps {
  active: Active | null;
}

/**
 * ドラッグ中アイテムのプレビュー用コンポーネント
 */
const DragOverlayContent: React.FC<DragOverlayContentProps> = ({ active }) => {
  if (!active) return null;
  
  const { id, data } = active;
  const isMenuItem = id.toString().startsWith('item-');
  
  if (isMenuItem && data.current) {
    const { item } = data.current;
    return (
      <Card
        variant="outlined"
        sx={{
          width: '200px',
          backgroundColor: 'primary.50',
          borderColor: 'primary.main',
          boxShadow: 3,
          opacity: 0.9
        }}
      >
        <Box sx={{ p: 1 }}>
          <Typography variant="body2">{item.name}</Typography>
        </Box>
      </Card>
    );
  }
  
  return null;
};

export default DragOverlayContent;