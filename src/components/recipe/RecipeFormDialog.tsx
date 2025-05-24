import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  IconButton,
  Tabs,
  Tab
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { RecipeFormDialogProps } from './types/RecipeFormTypes';
import { useRecipeForm } from './hooks/useRecipeForm';
import TabPanel from './components/TabPanel';
import BasicInfoTab from './components/BasicInfoTab';
import IngredientsTab from './components/IngredientsTab';
import StepsTab from './components/StepsTab';

/**
 * レシピフォームダイアログ
 * 
 * レシピの新規作成・編集を行うダイアログコンポーネント
 * 基本情報、材料、手順の3つのタブに分けて表示
 */
const RecipeFormDialog: React.FC<RecipeFormDialogProps> = ({ 
  open, 
  onClose, 
  onSave,
  editRecipe
}) => {  const {
    formData,
    updateFormData,
    tabValue,
    setTabValue,
    nameError,
    setNameError,
    isEditMode,
    resetForm,
    handleSave
  } = useRecipeForm(editRecipe);

  // ダイアログを閉じる
  const handleClose = () => {
    resetForm();
    onClose();
  };
  // タブ切り替え
  const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  // 保存ボタンクリック
  const handleSaveClick = () => {
    handleSave(onSave, onClose);
  };

  return (
    <Dialog 
      open={open} 
      onClose={handleClose}
      fullWidth
      maxWidth="md"
      scroll="paper"
    >
      <DialogTitle>
        {isEditMode ? 'レシピを編集' : '新規レシピ'}
        <IconButton
          aria-label="close"
          onClick={handleClose}
          sx={{
            position: 'absolute',
            right: 8,
            top: 8,
          }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      
      <Tabs
        value={tabValue}
        onChange={handleTabChange}
        variant="fullWidth"
        sx={{ borderBottom: 1, borderColor: 'divider', px: 2 }}
      >
        <Tab label="基本情報" />
        <Tab label="材料" />
        <Tab label="手順" />
      </Tabs>
      
      <DialogContent sx={{ pt: 2 }}>
        <TabPanel value={tabValue} index={0}>
          <BasicInfoTab
            formData={formData}
            onFormDataChange={updateFormData}
            nameError={nameError}
            onNameErrorChange={setNameError}
            isEditMode={isEditMode}
          />
        </TabPanel>

        <TabPanel value={tabValue} index={1}>
          <IngredientsTab
            ingredients={formData.ingredients}
            onIngredientsChange={(ingredients) => updateFormData({ ingredients })}
            servings={formData.servings}
          />
        </TabPanel>

        <TabPanel value={tabValue} index={2}>
          <StepsTab
            steps={formData.steps}
            onStepsChange={(steps) => updateFormData({ steps })}
          />
        </TabPanel>
      </DialogContent>
      
      <DialogActions sx={{ px: 3, pb: 3 }}>
        <Button onClick={handleClose}>キャンセル</Button>
        <Button 
          onClick={handleSaveClick} 
          variant="contained"
          color="primary"
          disabled={!formData.name.trim()}
        >
          {isEditMode ? '更新' : '保存'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default RecipeFormDialog;