import { useState } from 'react';
import { generateClient } from 'aws-amplify/api';
import { Schema } from '../../../../amplify/data/resource';
import { 
  EditFormData, 
  ExpandedState, 
  initializeEditFormData 
} from '../utils/shoppingUtils';

const client = generateClient<Schema>();

export const useShoppingListEdit = (
  id: string | undefined,
  name: string,
  description?: string | null,
  onUpdate?: () => void
) => {
  const [isEditing, setIsEditing] = useState(false);
  const [saveLoading, setSaveLoading] = useState(false);
  const [editFormData, setEditFormData] = useState<EditFormData>(
    initializeEditFormData(name, description)
  );
  const [expandedState, setExpandedState] = useState<ExpandedState>({
    isDetailsExpanded: false,
    isAddItemExpanded: false
  });

  // 編集フォームデータの更新
  const handleEditFormChange = (field: keyof EditFormData, value: string) => {
    setEditFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // 展開状態の切り替え
  const toggleDetails = () => {
    setExpandedState(prev => ({
      ...prev,
      isDetailsExpanded: !prev.isDetailsExpanded
    }));
  };

  const toggleAddItemForm = () => {
    setExpandedState(prev => ({
      ...prev,
      isAddItemExpanded: !prev.isAddItemExpanded
    }));
  };

  // 編集モードの切り替え
  const toggleEditMode = async () => {
    if (!id) return;

    if (isEditing) {
      // 編集内容を保存
      try {
        setSaveLoading(true);
        await client.models.ShoppingList.update({
          id,
          name: editFormData.editName.trim(),
          description: editFormData.editDescription.trim() || undefined
        });
        
        // 親コンポーネントに変更を通知
        if (onUpdate) {
          onUpdate();
        }
        
        setIsEditing(false);
      } catch (err) {
        console.error('リストの更新中にエラーが発生しました:', err);
        throw new Error('リスト情報の更新に失敗しました。');
      } finally {
        setSaveLoading(false);
      }
    } else {
      setEditFormData(initializeEditFormData(name, description));
      setIsEditing(true);
    }
  };

  // props変更時のフォームデータ更新
  const updateFormData = (newName: string, newDescription?: string | null) => {
    setEditFormData(initializeEditFormData(newName, newDescription));
  };

  return {
    isEditing,
    saveLoading,
    editFormData,
    expandedState,
    handleEditFormChange,
    toggleDetails,
    toggleAddItemForm,
    toggleEditMode,
    updateFormData
  };
};
