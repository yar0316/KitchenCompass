import React, { useState } from 'react';
import {
  TextField,
  Button,
  Box,
  Typography,
  Paper,
  List,
  ListItem,
  ListItemText,
  IconButton,
  Divider
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import DragIndicatorIcon from '@mui/icons-material/DragIndicator';
import { StepsTabProps, Step } from '../types/RecipeFormTypes';

/**
 * 調理手順入力タブ
 */
const StepsTab: React.FC<StepsTabProps> = ({
  steps,
  onStepsChange
}) => {
  const [currentStep, setCurrentStep] = useState('');
  const [editingStepId, setEditingStepId] = useState<string | null>(null);

  const handleAddStep = () => {
    if (currentStep.trim()) {
      if (editingStepId) {
        // 既存の手順を更新
        const updatedSteps = steps.map(step => 
          step.id === editingStepId 
            ? { ...step, description: currentStep.trim() }
            : step
        );
        onStepsChange(updatedSteps);
        setEditingStepId(null);
      } else {
        // 新しい手順を追加
        const newStep: Step = {
          id: Date.now().toString(),
          description: currentStep.trim()
        };
        onStepsChange([...steps, newStep]);
      }
      // 入力フォームをリセット
      setCurrentStep('');
    }
  };

  const handleEditStep = (id: string) => {
    const step = steps.find(s => s.id === id);
    if (step) {
      setCurrentStep(step.description);
      setEditingStepId(id);
    }
  };

  const handleRemoveStep = (id: string) => {
    const updatedSteps = steps.filter(step => step.id !== id);
    onStepsChange(updatedSteps);
    if (editingStepId === id) {
      setCurrentStep('');
      setEditingStepId(null);
    }
  };

  return (
    <Box sx={{ mb: 3 }}>
      <Typography variant="subtitle1" gutterBottom>
        調理手順
      </Typography>
      
      <Box sx={{ display: 'flex', gap: 2, mb: 2, alignItems: 'flex-start' }}>
        <TextField
          label="手順を入力"
          value={currentStep}
          onChange={(e) => setCurrentStep(e.target.value)}
          variant="outlined"
          fullWidth
          multiline
          rows={2}
          placeholder="調理手順を詳しく入力してください"
        />
        
        <Button
          variant="contained"
          color="primary"
          onClick={handleAddStep}
          disabled={!currentStep.trim()}
          startIcon={editingStepId ? <EditIcon /> : <AddIcon />}
          sx={{ mt: 1 }}
        >
          {editingStepId ? '更新' : '追加'}
        </Button>
      </Box>
      
      {steps.length > 0 ? (
        <Paper variant="outlined" sx={{ mt: 2 }}>
          <List>
            {steps.map((step, index) => (
              <React.Fragment key={step.id}>
                {index > 0 && <Divider component="li" />}
                <ListItem
                  alignItems="flex-start"
                  secondaryAction={
                    <Box>
                      <IconButton
                        edge="end"
                        aria-label="edit"
                        onClick={() => handleEditStep(step.id)}
                        size="small"
                      >
                        <EditIcon fontSize="small" />
                      </IconButton>
                      <IconButton
                        edge="end"
                        aria-label="delete"
                        onClick={() => handleRemoveStep(step.id)}
                        size="small"
                      >
                        <DeleteIcon fontSize="small" />
                      </IconButton>
                    </Box>
                  }
                >
                  <DragIndicatorIcon sx={{ color: 'text.secondary', mr: 1 }} />
                  <ListItemText 
                    primary={`手順 ${index + 1}`}
                    secondary={step.description}
                  />
                </ListItem>
              </React.Fragment>
            ))}
          </List>
        </Paper>
      ) : (
        <Typography variant="body2" color="text.secondary" sx={{ mt: 2, textAlign: 'center' }}>
          手順が登録されていません。上のフォームから追加してください
        </Typography>
      )}
    </Box>
  );
};

export default StepsTab;
