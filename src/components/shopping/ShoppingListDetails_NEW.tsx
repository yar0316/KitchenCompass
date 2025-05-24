import React, { useEffect } from 'react';
import { Box, Divider } from '@mui/material';
import { type ShoppingList } from '../../API';
import { formatDueDate } from './utils/shoppingUtils';
import { useShoppingItems } from './hooks/useShoppingItems';
import { useProgressTracking } from './hooks/useProgressTracking';
import { useShoppingListEdit } from './hooks/useShoppingListEdit';
import ShoppingHeader from './components/ShoppingHeader';
import AddItemForm from './components/AddItemForm';
import ItemsList from './components/ItemsList';

interface ShoppingListDetailsProps {
  list: ShoppingList;
  onUpdate?: () => void;
}

const ShoppingListDetails: React.FC<ShoppingListDetailsProps> = ({ list, onUpdate }) => {
  const { id, name, description, dueDate, isCompleted } = list;
  
  // カスタムフック
  const {
    items,
    loading,
    error,
    saveLoading,
    formData,
    setFormData,
    handleAddItem,
    toggleItemCheck,
    deleteItem,
    setError
  } = useShoppingItems(id);

  const { completedItems, progress } = useProgressTracking(id, items, isCompleted, onUpdate);

  const {
    isEditing,
    saveLoading: editSaveLoading,
    editFormData,
    expandedState,
    handleEditFormChange,
    toggleDetails,
    toggleAddItemForm,
    toggleEditMode,
    updateFormData
  } = useShoppingListEdit(id, name, description, onUpdate);

  // リスト情報変更時にフォームデータを更新
  useEffect(() => {
    updateFormData(name, description);
  }, [name, description, updateFormData]);

  // 日付のフォーマット
  const formattedDate = formatDueDate(dueDate);

  // フォーム変更ハンドラー
  const handleFormChange = (field: keyof typeof formData, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // 編集モード切り替えのエラーハンドリング
  const handleToggleEdit = async () => {
    try {
      await toggleEditMode();
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'リスト情報の更新に失敗しました。');
    }
  };

  const currentSaveLoading = saveLoading || editSaveLoading;

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <ShoppingHeader
        name={name}
        description={description}
        formattedDate={formattedDate}
        isCompleted={isCompleted}
        completedItems={completedItems}
        totalItems={items.length}
        progress={progress}
        error={error}
        isEditing={isEditing}
        saveLoading={currentSaveLoading}
        editFormData={editFormData}
        expandedState={expandedState}
        onEditFormChange={handleEditFormChange}
        onToggleEdit={handleToggleEdit}
        onToggleDetails={toggleDetails}
      />
      
      <Divider />
      
      <AddItemForm
        isExpanded={expandedState.isAddItemExpanded}
        formData={formData}
        saveLoading={currentSaveLoading}
        onToggleExpand={toggleAddItemForm}
        onFormChange={handleFormChange}
        onAddItem={handleAddItem}
      />
      
      {/* アイテムリスト - 最大限のスペースを確保 */}
      <Box sx={{ flex: 1, overflow: 'auto', mt: 1 }}>
        <ItemsList
          items={items}
          loading={loading}
          saveLoading={currentSaveLoading}
          onToggleCheck={toggleItemCheck}
          onDeleteItem={deleteItem}
        />
      </Box>
    </Box>
  );
};

export default ShoppingListDetails;
