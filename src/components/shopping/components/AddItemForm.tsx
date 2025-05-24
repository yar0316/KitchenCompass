import React from 'react';
import {
  Box,
  TextField,
  Button,
  Paper,
  Collapse,
  CircularProgress,
  MenuItem
} from '@mui/material';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import { ShoppingFormData } from '../utils/shoppingUtils';
import { ITEM_CATEGORIES, ITEM_UNITS } from '../constants/shoppingConstants';

interface AddItemFormProps {
  isExpanded: boolean;
  formData: ShoppingFormData;
  saveLoading: boolean;
  onToggleExpand: () => void;
  onFormChange: (field: keyof ShoppingFormData, value: string) => void;
  onAddItem: () => void;
}

const AddItemForm: React.FC<AddItemFormProps> = ({
  isExpanded,
  formData,
  saveLoading,
  onToggleExpand,
  onFormChange,
  onAddItem
}) => {
  return (
    <>
      {/* アイテム追加ボタン */}
      <Button
        variant="text"
        color="primary"
        startIcon={isExpanded ? <ExpandLessIcon /> : <AddCircleIcon />}
        onClick={onToggleExpand}
        sx={{ my: 1, justifyContent: 'flex-start' }}
      >
        {isExpanded ? 'フォームを閉じる' : 'アイテムを追加'}
      </Button>
      
      {/* 新規アイテム追加フォーム（折りたたみ可能） */}
      <Collapse in={isExpanded}>
        <Paper elevation={0} sx={{ p: 2, mb: 2, bgcolor: 'background.default' }}>
          <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, gap: 1 }}>
            <TextField
              size="small"
              placeholder="商品名"
              value={formData.newItemName}
              onChange={(e) => onFormChange('newItemName', e.target.value)}
              sx={{ flex: 2 }}
              disabled={saveLoading}
            />
            
            <TextField
              size="small"
              placeholder="数量"
              type="number"
              inputProps={{ min: "0", step: "0.1" }}
              value={formData.newItemAmount}
              onChange={(e) => onFormChange('newItemAmount', e.target.value)}
              sx={{ flex: 1, minWidth: { xs: '100%', sm: '100px' } }}
              disabled={saveLoading}
            />
            
            <TextField
              size="small"
              select
              value={formData.newItemUnit}
              onChange={(e) => onFormChange('newItemUnit', e.target.value)}
              sx={{ flex: 1, minWidth: { xs: '100%', sm: '100px' } }}
              disabled={saveLoading}
            >
              {ITEM_UNITS.map((unit) => (
                <MenuItem key={unit} value={unit}>
                  {unit}
                </MenuItem>
              ))}
            </TextField>
          </Box>
          
          <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, gap: 1, mt: 1 }}>
            <TextField
              size="small"
              select
              label="カテゴリー"
              value={formData.newItemCategory}
              onChange={(e) => onFormChange('newItemCategory', e.target.value)}
              sx={{ flex: 1 }}
              disabled={saveLoading}
            >
              {ITEM_CATEGORIES.map((category) => (
                <MenuItem key={category} value={category}>
                  {category}
                </MenuItem>
              ))}
            </TextField>
            
            <TextField
              size="small"
              placeholder="メモ（オプション）"
              value={formData.newItemNotes}
              onChange={(e) => onFormChange('newItemNotes', e.target.value)}
              sx={{ flex: 2 }}
              disabled={saveLoading}
            />
            
            <Button
              variant="contained"
              color="primary"
              startIcon={saveLoading ? <CircularProgress size={20} /> : <AddCircleIcon />}
              onClick={onAddItem}
              disabled={!formData.newItemName.trim() || saveLoading}
              sx={{ height: { sm: 40 } }}
            >
              {saveLoading ? '追加中...' : '追加'}
            </Button>
          </Box>
        </Paper>
      </Collapse>
    </>
  );
};

export default AddItemForm;
