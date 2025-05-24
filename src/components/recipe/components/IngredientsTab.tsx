import React, { useState } from 'react';
import {
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
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
import { IngredientsTabProps, Ingredient, UNIT_OPTIONS } from '../types/RecipeFormTypes';

/**
 * 材料入力タブ
 */
const IngredientsTab: React.FC<IngredientsTabProps> = ({
  ingredients,
  onIngredientsChange,
  servings
}) => {
  const [currentIngredient, setCurrentIngredient] = useState({
    name: '',
    amount: '',
    unit: ''
  });
  const [editingIngredientId, setEditingIngredientId] = useState<string | null>(null);

  const handleAddIngredient = () => {
    const { name, amount, unit } = currentIngredient;
    if (name.trim()) {
      if (editingIngredientId) {
        // 既存の材料を更新
        const updatedIngredients = ingredients.map(ing => 
          ing.id === editingIngredientId 
            ? { ...ing, name, amount, unit }
            : ing
        );
        onIngredientsChange(updatedIngredients);
        setEditingIngredientId(null);
      } else {
        // 新しい材料を追加
        const newIngredient: Ingredient = {
          id: Date.now().toString(),
          name: name.trim(),
          amount: amount.trim(),
          unit
        };
        onIngredientsChange([...ingredients, newIngredient]);
      }
      // 入力フォームをリセット
      setCurrentIngredient({ name: '', amount: '', unit: '' });
    }
  };

  const handleEditIngredient = (id: string) => {
    const ingredient = ingredients.find(ing => ing.id === id);
    if (ingredient) {
      setCurrentIngredient({
        name: ingredient.name,
        amount: ingredient.amount,
        unit: ingredient.unit
      });
      setEditingIngredientId(id);
    }
  };

  const handleRemoveIngredient = (id: string) => {
    const updatedIngredients = ingredients.filter(ing => ing.id !== id);
    onIngredientsChange(updatedIngredients);
    if (editingIngredientId === id) {
      setCurrentIngredient({ name: '', amount: '', unit: '' });
      setEditingIngredientId(null);
    }
  };

  return (
    <Box sx={{ mb: 3 }}>
      <Typography variant="subtitle1" gutterBottom>
        材料（{servings}人前）
      </Typography>
      
      <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
        <TextField
          label="材料名"
          value={currentIngredient.name}
          onChange={(e) => setCurrentIngredient({ ...currentIngredient, name: e.target.value })}
          variant="outlined"
          fullWidth
        />
        
        <TextField
          label="分量"
          value={currentIngredient.amount}
          onChange={(e) => setCurrentIngredient({ ...currentIngredient, amount: e.target.value })}
          variant="outlined"
          sx={{ width: '25%' }}
        />
        
        <FormControl variant="outlined" sx={{ width: '30%' }}>
          <InputLabel id="unit-label">単位</InputLabel>
          <Select
            labelId="unit-label"
            value={currentIngredient.unit}
            onChange={(e) => setCurrentIngredient({ ...currentIngredient, unit: e.target.value })}
            label="単位"
          >
            {UNIT_OPTIONS.map((option) => (
              <MenuItem key={option.value} value={option.value}>
                {option.label}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        
        <Button
          variant="contained"
          color="primary"
          onClick={handleAddIngredient}
          disabled={!currentIngredient.name.trim()}
          startIcon={editingIngredientId ? <EditIcon /> : <AddIcon />}
        >
          {editingIngredientId ? '更新' : '追加'}
        </Button>
      </Box>
      
      {ingredients.length > 0 ? (
        <Paper variant="outlined" sx={{ mt: 2 }}>
          <List dense disablePadding>
            {ingredients.map((ingredient, index) => (
              <React.Fragment key={ingredient.id}>
                {index > 0 && <Divider component="li" />}
                <ListItem
                  secondaryAction={
                    <Box>
                      <IconButton
                        edge="end"
                        aria-label="edit"
                        onClick={() => handleEditIngredient(ingredient.id)}
                        size="small"
                      >
                        <EditIcon fontSize="small" />
                      </IconButton>
                      <IconButton
                        edge="end"
                        aria-label="delete"
                        onClick={() => handleRemoveIngredient(ingredient.id)}
                        size="small"
                      >
                        <DeleteIcon fontSize="small" />
                      </IconButton>
                    </Box>
                  }
                >
                  <DragIndicatorIcon sx={{ color: 'text.secondary', mr: 1 }} />
                  <ListItemText 
                    primary={ingredient.name} 
                    secondary={
                      ingredient.amount + 
                      (ingredient.unit ? ' ' + ingredient.unit : '')
                    } 
                  />
                </ListItem>
              </React.Fragment>
            ))}
          </List>
        </Paper>
      ) : (
        <Typography variant="body2" color="text.secondary" sx={{ mt: 2, textAlign: 'center' }}>
          材料が登録されていません。上のフォームから追加してください
        </Typography>
      )}
    </Box>
  );
};

export default IngredientsTab;
