import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Box,
  IconButton,
  InputAdornment
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

// レシピデータの型定義
interface Recipe {
  name: string;
  description?: string;
  cookingTime: number;
  difficulty: 'easy' | 'medium' | 'hard';
  tags: string[];
}

interface NewRecipeDialogProps {
  open: boolean;
  onClose: () => void;
  onSave: (recipe: Recipe) => void;
}

// 難易度の選択肢
const DIFFICULTY_OPTIONS = [
  { value: 'easy', label: '簡単' },
  { value: 'medium', label: '普通' },
  { value: 'hard', label: '難しい' }
];

const NewRecipeDialog: React.FC<NewRecipeDialogProps> = ({ open, onClose, onSave }) => {
  // フォーム状態
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [cookingTime, setCookingTime] = useState('30');
  const [difficulty, setDifficulty] = useState<'easy' | 'medium' | 'hard'>('medium');
  const [tagInput, setTagInput] = useState('');
  const [tags, setTags] = useState<string[]>([]);
  
  // バリデーション状態
  const [nameError, setNameError] = useState(false);
  
  // フォームのリセット
  const resetForm = () => {
    setName('');
    setDescription('');
    setCookingTime('30');
    setDifficulty('medium');
    setTagInput('');
    setTags([]);
    setNameError(false);
  };
  
  // ダイアログを閉じる
  const handleClose = () => {
    resetForm();
    onClose();
  };
  
  // タグの追加
  const handleAddTag = () => {
    const trimmedTag = tagInput.trim();
    if (trimmedTag && !tags.includes(trimmedTag)) {
      setTags([...tags, trimmedTag]);
      setTagInput('');
    }
  };
  
  // タグの削除
  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter(tag => tag !== tagToRemove));
  };
  
  // 保存処理
  const handleSave = () => {
    // 名前は必須
    if (!name.trim()) {
      setNameError(true);
      return;
    }
    
    const newRecipe = {
      name: name.trim(),
      description: description.trim(),
      cookingTime: parseInt(cookingTime) || 30,
      difficulty,
      tags
    };
    
    onSave(newRecipe);
    handleClose();
  };
  
  return (
    <Dialog 
      open={open} 
      onClose={handleClose}
      fullWidth
      maxWidth="sm"
    >
      <DialogTitle>
        新規レシピ
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
      
      <DialogContent sx={{ pt: 2 }}>
        <TextField
          label="レシピ名"
          fullWidth
          margin="normal"
          variant="outlined"
          required
          value={name}
          onChange={(e) => {
            setName(e.target.value);
            if (e.target.value.trim()) setNameError(false);
          }}
          error={nameError}
          helperText={nameError ? 'レシピ名を入力してください' : ''}
          autoFocus
        />
        
        <TextField
          label="説明"
          fullWidth
          margin="normal"
          variant="outlined"
          multiline
          rows={2}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
        
        <Box sx={{ display: 'flex', gap: 2, mt: 2 }}>
          <TextField
            label="調理時間"
            type="number"
            InputProps={{
              endAdornment: <InputAdornment position="end">分</InputAdornment>,
            }}
            variant="outlined"
            value={cookingTime}
            onChange={(e) => setCookingTime(e.target.value)}
            sx={{ width: '50%' }}
          />
          
          <FormControl variant="outlined" sx={{ width: '50%' }}>
            <InputLabel id="difficulty-label">難易度</InputLabel>
            <Select
              labelId="difficulty-label"
              value={difficulty}
              onChange={(e) => setDifficulty(e.target.value as 'easy' | 'medium' | 'hard')}
              label="難易度"
            >
              {DIFFICULTY_OPTIONS.map((option) => (
                <MenuItem key={option.value} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>
        
        <Box sx={{ mt: 2 }}>
          <TextField
            label="タグ"
            fullWidth
            variant="outlined"
            placeholder="タグを入力してEnterキーを押す"
            value={tagInput}
            onChange={(e) => setTagInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                handleAddTag();
              }
            }}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <Button 
                    variant="text" 
                    onClick={handleAddTag}
                    disabled={!tagInput.trim()}
                  >
                    追加
                  </Button>
                </InputAdornment>
              )
            }}
          />
          
          {tags.length > 0 && (
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mt: 1 }}>
              {tags.map((tag, index) => (
                <Box key={index}>
                  <Button
                    variant="outlined"
                    size="small"
                    endIcon={<CloseIcon fontSize="small" />}
                    onClick={() => handleRemoveTag(tag)}
                    sx={{ borderRadius: 4 }}
                  >
                    {tag}
                  </Button>
                </Box>
              ))}
            </Box>
          )}
        </Box>
      </DialogContent>
      
      <DialogActions sx={{ px: 3, pb: 3 }}>
        <Button onClick={handleClose}>キャンセル</Button>
        <Button 
          onClick={handleSave} 
          variant="contained"
          color="primary"
          disabled={!name.trim()}
        >
          保存
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default NewRecipeDialog;