import React, { ChangeEvent } from 'react';
import {
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Box,
  InputAdornment,
  Typography,
  Button,
  IconButton,
  Autocomplete,
  Chip as MuiChip
} from '@mui/material';
import PhotoCameraIcon from '@mui/icons-material/PhotoCamera';
import CloseIcon from '@mui/icons-material/Close';
import { BasicInfoTabProps, CATEGORY_OPTIONS, EXISTING_TAGS } from '../types/RecipeFormTypes';

/**
 * レシピの基本情報入力タブ
 */
const BasicInfoTab: React.FC<BasicInfoTabProps> = ({
  formData,
  onFormDataChange,
  nameError,
  onNameErrorChange,
  isEditMode
}) => {
  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      onFormDataChange({ imageFile: file });
      const reader = new FileReader();
      reader.onload = (e) => {
        if (e.target?.result) {
          onFormDataChange({ imagePreview: e.target.result as string });
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveImage = () => {
    onFormDataChange({ imagePreview: null, imageFile: null });
  };

  return (
    <>
      <TextField
        label="レシピ名"
        fullWidth
        margin="normal"
        variant="outlined"
        required
        value={formData.name}
        onChange={(e) => {
          onFormDataChange({ name: e.target.value });
          if (e.target.value.trim()) onNameErrorChange(false);
        }}
        error={nameError}
        helperText={nameError ? 'レシピ名を入力してください' : ''}
        autoFocus={!isEditMode}
      />
      
      <TextField
        label="説明"
        fullWidth
        margin="normal"
        variant="outlined"
        multiline
        rows={3}
        value={formData.description}
        onChange={(e) => onFormDataChange({ description: e.target.value })}
        placeholder="このレシピの説明や特徴、ポイントなどを入力してください"
      />
      
      <Box sx={{ display: 'flex', gap: 2, mt: 2 }}>
        <FormControl fullWidth variant="outlined">
          <InputLabel id="category-label">カテゴリ</InputLabel>
          <Select
            labelId="category-label"
            value={formData.category}
            onChange={(e) => onFormDataChange({ category: e.target.value })}
            label="カテゴリ"
          >
            {CATEGORY_OPTIONS.map((option) => (
              <MenuItem key={option.value} value={option.value}>
                {option.label}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>
      
      <Box sx={{ display: 'flex', gap: 2, mt: 2 }}>
        <TextField
          label="下準備時間"
          type="number"
          InputProps={{
            endAdornment: <InputAdornment position="end">分</InputAdornment>,
          }}
          variant="outlined"
          fullWidth
          value={formData.prepTime}
          onChange={(e) => onFormDataChange({ prepTime: e.target.value })}
        />
        
        <TextField
          label="調理時間"
          type="number"
          InputProps={{
            endAdornment: <InputAdornment position="end">分</InputAdornment>,
          }}
          variant="outlined"
          fullWidth
          value={formData.cookingTime}
          onChange={(e) => onFormDataChange({ cookingTime: e.target.value })}
        />
        
        <TextField
          label="人数"
          type="number"
          InputProps={{
            endAdornment: <InputAdornment position="end">人前</InputAdornment>,
          }}
          variant="outlined"
          fullWidth
          value={formData.servings}
          onChange={(e) => onFormDataChange({ servings: e.target.value })}
        />
      </Box>
      
      <Box sx={{ mt: 3 }}>
        <Typography variant="subtitle1" gutterBottom>
          タグ
        </Typography>
        <Autocomplete          multiple
          options={EXISTING_TAGS}
          value={formData.tags}
          onChange={(_event, newValue) => onFormDataChange({ tags: newValue })}
          freeSolo
          renderTags={(value: string[], getTagProps) =>
            value.map((option: string, index: number) => (
              <MuiChip
                variant="outlined"
                label={option}
                {...getTagProps({ index })}
              />
            ))
          }
          renderInput={(params) => (
            <TextField
              {...params}
              variant="outlined"
              placeholder="タグを入力して選択してください"
            />
          )}
        />
      </Box>

      <Box sx={{ mt: 3 }}>
        <Typography variant="subtitle1" gutterBottom>
          画像
        </Typography>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Button
            variant="contained"
            component="label"
            startIcon={<PhotoCameraIcon />}
          >
            アップロード
            <input
              type="file"
              accept="image/*"
              hidden
              onChange={handleImageChange}
            />
          </Button>
          {formData.imagePreview && (
            <Box sx={{ position: 'relative', width: 120, height: 80 }}>
              <img
                src={formData.imagePreview}
                alt="プレビュー"
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                  borderRadius: 4,
                }}
              />
              <IconButton
                aria-label="remove"
                onClick={handleRemoveImage}
                sx={{
                  position: 'absolute',
                  top: 4,
                  right: 4,
                  backgroundColor: 'rgba(0, 0, 0, 0.5)',
                  color: 'white',
                  '&:hover': {
                    backgroundColor: 'rgba(0, 0, 0, 0.7)',
                  },
                }}
              >
                <CloseIcon />
              </IconButton>
            </Box>
          )}
        </Box>
      </Box>
    </>
  );
};

export default BasicInfoTab;
