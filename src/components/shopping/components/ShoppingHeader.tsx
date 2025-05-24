import React from 'react';
import {
  Box,
  Typography,
  TextField,
  Button,
  Chip,
  Alert,
  Collapse,
  LinearProgress
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import EventIcon from '@mui/icons-material/Event';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import { EditFormData, ExpandedState } from '../utils/shoppingUtils';

interface ShoppingHeaderProps {
  name: string;
  description?: string | null;
  formattedDate: string | null;
  isCompleted: boolean | null | undefined;
  completedItems: number;
  totalItems: number;
  progress: number;
  error: string | null;
  isEditing: boolean;
  saveLoading: boolean;
  editFormData: EditFormData;
  expandedState: ExpandedState;
  onEditFormChange: (field: keyof EditFormData, value: string) => void;
  onToggleEdit: () => void;
  onToggleDetails: () => void;
}

const ShoppingHeader: React.FC<ShoppingHeaderProps> = ({
  name,
  description,
  formattedDate,
  isCompleted,
  completedItems,
  totalItems,
  progress,
  error,
  isEditing,
  saveLoading,
  editFormData,
  expandedState,
  onEditFormChange,
  onToggleEdit,
  onToggleDetails
}) => {
  return (
    <Box sx={{ mb: 1 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        {isEditing ? (
          <TextField
            value={editFormData.editName}
            onChange={(e) => onEditFormChange('editName', e.target.value)}
            fullWidth
            variant="outlined"
            size="small"
            sx={{ mr: 2 }}
            disabled={saveLoading}
          />
        ) : (
          <Typography variant="h5" component="h2">
            {name}
          </Typography>
        )}
        
        <Box sx={{ display: 'flex', gap: 1 }}>
          <Button
            startIcon={expandedState.isDetailsExpanded ? <ExpandLessIcon /> : <ExpandMoreIcon />}
            onClick={onToggleDetails}
            color="inherit"
            size="small"
          >
            詳細
          </Button>
          
          <Button
            startIcon={isEditing ? null : <EditIcon />}
            onClick={onToggleEdit}
            color={isEditing ? 'primary' : 'inherit'}
            variant={isEditing ? 'contained' : 'text'}
            size="small"
            disabled={saveLoading}
          >
            {isEditing ? (saveLoading ? '保存中...' : '保存') : '編集'}
          </Button>
        </Box>
      </Box>
      
      {/* エラーメッセージ表示 */}
      {error && (
        <Alert severity="error" sx={{ mt: 1, mb: 1 }}>
          {error}
        </Alert>
      )}
      
      {/* 詳細情報（折りたたみ可能） */}
      <Collapse in={expandedState.isDetailsExpanded}>
        <Box sx={{ mt: 1, mb: 1, px: 1, py: 1, bgcolor: 'background.paper', borderRadius: 1 }}>
          {isEditing ? (
            <TextField
              value={editFormData.editDescription}
              onChange={(e) => onEditFormChange('editDescription', e.target.value)}
              fullWidth
              placeholder="説明を入力..."
              variant="outlined"
              size="small"
              multiline
              rows={2}
              sx={{ mb: 1 }}
              disabled={saveLoading}
            />
          ) : description ? (
            <Typography variant="body2" color="textSecondary" sx={{ mb: 1 }}>
              {description}
            </Typography>
          ) : (
            <Typography variant="body2" color="textSecondary" sx={{ mb: 1, fontStyle: 'italic' }}>
              説明はありません
            </Typography>
          )}
          
          <Box sx={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: 1 }}>
            {formattedDate && (
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <EventIcon fontSize="small" color="action" sx={{ mr: 0.5 }} />
                <Typography variant="body2" color="textSecondary">
                  {formattedDate}
                </Typography>
              </Box>
            )}
            
            <Chip 
              label={isCompleted ? '完了' : '進行中'} 
              size="small"
              color={isCompleted ? 'success' : 'primary'}
              variant={isCompleted ? 'filled' : 'outlined'}
            />
          </Box>
        </Box>
      </Collapse>
      
      {/* 進捗バー - 常に表示 */}
      <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
        <Box sx={{ flex: 1, mr: 1 }}>
          <LinearProgress 
            variant="determinate" 
            value={progress} 
            color={isCompleted ? 'success' : 'primary'}
            sx={{ height: 8, borderRadius: 4 }}
          />
        </Box>
        <Typography variant="body2" color="textSecondary">
          {completedItems}/{totalItems}
        </Typography>
      </Box>
    </Box>
  );
};

export default ShoppingHeader;
