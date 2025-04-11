import React, { useState, useEffect, ChangeEvent } from 'react';
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
  InputAdornment,
  Typography,
  Tabs,
  Tab,
  Divider,
  List,
  ListItem,
  ListItemText,
  Paper,
  Autocomplete,
  Chip as MuiChip
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import DragIndicatorIcon from '@mui/icons-material/DragIndicator';
import ImageIcon from '@mui/icons-material/Image';
import PhotoCameraIcon from '@mui/icons-material/PhotoCamera';

// タブパネルのプロパティ
interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

// タブパネルコンポーネント
const TabPanel = (props: TabPanelProps) => {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`recipe-tabpanel-${index}`}
      aria-labelledby={`recipe-tab-${index}`}
      {...other}
      style={{ paddingTop: '16px' }}
    >
      {value === index && <>{children}</>}
    </div>
  );
};

// 材料の型定義
interface Ingredient {
  id: string;
  name: string;
  amount: string;
  unit: string;
}

// 調理手順の型定義
interface Step {
  id: string;
  description: string;
}

// カテゴリの選択肢
const CATEGORY_OPTIONS = [
  { value: 'main', label: 'メイン料理' },
  { value: 'side', label: '副菜' },
  { value: 'soup', label: 'スープ・汁物' },
  { value: 'salad', label: 'サラダ' },
  { value: 'rice', label: 'ご飯もの' },
  { value: 'noodle', label: '麺類' },
  { value: 'dessert', label: 'デザート' },
  { value: 'breakfast', label: '朝食' },
  { value: 'other', label: 'その他' }
];

// 分量の単位選択肢
const UNIT_OPTIONS = [
  { value: '', label: '個数・その他' },
  { value: 'g', label: 'g（グラム）' },
  { value: 'ml', label: 'ml（ミリリットル）' },
  { value: 'tbsp', label: '大さじ' },
  { value: 'tsp', label: '小さじ' },
  { value: 'cup', label: 'カップ' }
];

// 既存のタグ一覧（実際の実装ではデータベースから取得したり、アプリ状態から取得したりします）
const EXISTING_TAGS = [
  '和食', 'イタリアン', '中華', 'サラダ', 'スープ', '肉料理', '魚料理', 
  'デザート', 'ベジタリアン', '朝食', 'ヘルシー', '定番', '簡単', 
  '時短', 'おもてなし', '作り置き', 'お弁当'
];

// ダミー画像URL
const DUMMY_IMAGE_URL = 'data:image/svg+xml;charset=UTF-8,%3Csvg xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22 width%3D%22320%22 height%3D%22180%22 viewBox%3D%220 0 320 180%22 fill%3D%22%23e0e0e0%22%3E%3Crect width%3D%22320%22 height%3D%22180%22%2F%3E%3C%2Fsvg%3E';

interface RecipeFormDialogProps {
  open: boolean;
  onClose: () => void;
  onSave: (recipe: any) => void;
  editRecipe?: any; // 編集する既存レシピデータ（編集時のみ）
}

const RecipeFormDialog: React.FC<RecipeFormDialogProps> = ({ 
  open, 
  onClose, 
  onSave,
  editRecipe
}) => {
  // タブ状態
  const [tabValue, setTabValue] = useState(0);

  // 基本情報フォーム状態
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [cookingTime, setCookingTime] = useState('30');
  const [prepTime, setPrepTime] = useState('10');
  const [servings, setServings] = useState('2');
  const [category, setCategory] = useState('main');
  const [tags, setTags] = useState<string[]>([]);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  
  // 材料フォーム状態
  const [ingredients, setIngredients] = useState<Ingredient[]>([]);
  const [currentIngredient, setCurrentIngredient] = useState({
    name: '',
    amount: '',
    unit: ''
  });
  const [editingIngredientId, setEditingIngredientId] = useState<string | null>(null);

  // 調理手順フォーム状態
  const [steps, setSteps] = useState<Step[]>([]);
  const [currentStep, setCurrentStep] = useState('');
  const [editingStepId, setEditingStepId] = useState<string | null>(null);

  // バリデーション状態
  const [nameError, setNameError] = useState(false);
  
  // 編集モード判定
  const isEditMode = !!editRecipe;

  // 編集時のデータロード
  useEffect(() => {
    if (editRecipe) {
      // 基本情報のセット
      setName(editRecipe.name || '');
      setDescription(editRecipe.description || '');
      setCookingTime(String(editRecipe.cookingTime || 30));
      setPrepTime(String(editRecipe.prepTime || 10));
      setServings(String(editRecipe.servings || 2));
      setCategory(editRecipe.category || 'main');
      setTags(editRecipe.tags || []);
      
      // 画像があれば設定
      if (editRecipe.imageUrl) {
        setImagePreview(editRecipe.imageUrl);
      }
      
      // 材料のセット (既存レシピに材料があれば)
      if (editRecipe.ingredients && Array.isArray(editRecipe.ingredients)) {
        setIngredients(editRecipe.ingredients);
      }
      
      // 調理手順のセット (既存レシピに手順があれば)
      if (editRecipe.steps && Array.isArray(editRecipe.steps)) {
        setSteps(editRecipe.steps);
      }
    }
  }, [editRecipe]);

  // フォームのリセット
  const resetForm = () => {
    setName('');
    setDescription('');
    setCookingTime('30');
    setPrepTime('10');
    setServings('2');
    setCategory('main');
    setTags([]);
    setImagePreview(null);
    setImageFile(null);
    setIngredients([]);
    setCurrentIngredient({ name: '', amount: '', unit: '' });
    setEditingIngredientId(null);
    setSteps([]);
    setCurrentStep('');
    setEditingStepId(null);
    setNameError(false);
    setTabValue(0);
  };
  
  // ダイアログを閉じる
  const handleClose = () => {
    resetForm();
    onClose();
  };
  
  // タブ切り替え
  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  // タグの削除
  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter(tag => tag !== tagToRemove));
  };

  // 材料の追加
  const handleAddIngredient = () => {
    const { name, amount, unit } = currentIngredient;
    if (name.trim()) {
      if (editingIngredientId) {
        // 既存の材料を更新
        setIngredients(ingredients.map(ing => 
          ing.id === editingIngredientId 
            ? { ...ing, name, amount, unit }
            : ing
        ));
        setEditingIngredientId(null);
      } else {
        // 新しい材料を追加
        const newIngredient: Ingredient = {
          id: Date.now().toString(),
          name: name.trim(),
          amount: amount.trim(),
          unit
        };
        setIngredients([...ingredients, newIngredient]);
      }
      // 入力フォームをリセット
      setCurrentIngredient({ name: '', amount: '', unit: '' });
    }
  };

  // 材料の編集
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

  // 材料の削除
  const handleRemoveIngredient = (id: string) => {
    setIngredients(ingredients.filter(ing => ing.id !== id));
    if (editingIngredientId === id) {
      setCurrentIngredient({ name: '', amount: '', unit: '' });
      setEditingIngredientId(null);
    }
  };

  // 手順の追加
  const handleAddStep = () => {
    if (currentStep.trim()) {
      if (editingStepId) {
        // 既存の手順を更新
        setSteps(steps.map(step => 
          step.id === editingStepId 
            ? { ...step, description: currentStep.trim() }
            : step
        ));
        setEditingStepId(null);
      } else {
        // 新しい手順を追加
        const newStep: Step = {
          id: Date.now().toString(),
          description: currentStep.trim()
        };
        setSteps([...steps, newStep]);
      }
      // 入力フォームをリセット
      setCurrentStep('');
    }
  };

  // 手順の編集
  const handleEditStep = (id: string) => {
    const step = steps.find(s => s.id === id);
    if (step) {
      setCurrentStep(step.description);
      setEditingStepId(id);
    }
  };

  // 手順の削除
  const handleRemoveStep = (id: string) => {
    setSteps(steps.filter(step => step.id !== id));
    if (editingStepId === id) {
      setCurrentStep('');
      setEditingStepId(null);
    }
  };

  // 画像アップロード処理
  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        if (e.target?.result) {
          setImagePreview(e.target.result as string);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  // 画像削除
  const handleRemoveImage = () => {
    setImagePreview(null);
    setImageFile(null);
  };
  
  // 保存処理
  const handleSave = () => {
    // 名前は必須
    if (!name.trim()) {
      setNameError(true);
      return;
    }
    
    const recipe = {
      ...(editRecipe ? { id: editRecipe.id } : {}), // 編集時は既存IDを保持
      name: name.trim(),
      description: description.trim(),
      cookingTime: parseInt(cookingTime) || 30,
      prepTime: parseInt(prepTime) || 10,
      servings: parseInt(servings) || 2,
      category,
      tags,
      ingredients,
      steps,
      imageUrl: imagePreview || DUMMY_IMAGE_URL, // 画像プレビューがあればそれを使用、なければダミー画像
      imageFile // 将来的なアップロード処理のために保持
    };
    
    onSave(recipe);
    handleClose();
  };
  
  return (
    <Dialog 
      open={open} 
      onClose={handleClose}
      fullWidth
      maxWidth="md" // ダイアログサイズを大きく
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
            autoFocus={!isEditMode}
          />
          
          <TextField
            label="説明"
            fullWidth
            margin="normal"
            variant="outlined"
            multiline
            rows={3}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="このレシピの説明や特徴、ポイントなどを入力してください"
          />
          
          <Box sx={{ display: 'flex', gap: 2, mt: 2 }}>
            <FormControl fullWidth variant="outlined">
              <InputLabel id="category-label">カテゴリ</InputLabel>
              <Select
                labelId="category-label"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
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
              value={prepTime}
              onChange={(e) => setPrepTime(e.target.value)}
            />
            
            <TextField
              label="調理時間"
              type="number"
              InputProps={{
                endAdornment: <InputAdornment position="end">分</InputAdornment>,
              }}
              variant="outlined"
              fullWidth
              value={cookingTime}
              onChange={(e) => setCookingTime(e.target.value)}
            />
            
            <TextField
              label="人数"
              type="number"
              InputProps={{
                endAdornment: <InputAdornment position="end">人前</InputAdornment>,
              }}
              variant="outlined"
              fullWidth
              value={servings}
              onChange={(e) => setServings(e.target.value)}
            />
          </Box>
          
          <Box sx={{ mt: 3 }}>
            <Typography variant="subtitle1" gutterBottom>
              タグ
            </Typography>
            <Autocomplete
              multiple
              options={EXISTING_TAGS}
              value={tags}
              onChange={(event, newValue) => setTags(newValue)}
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
              {imagePreview && (
                <Box sx={{ position: 'relative', width: 120, height: 80 }}>
                  <img
                    src={imagePreview}
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
        </TabPanel>

        {/* 材料タブ */}
        <TabPanel value={tabValue} index={1}>
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
        </TabPanel>

        {/* 手順タブ */}
        <TabPanel value={tabValue} index={2}>
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
        </TabPanel>
      </DialogContent>
      
      <DialogActions sx={{ px: 3, pb: 3 }}>
        <Button onClick={handleClose}>キャンセル</Button>
        <Button 
          onClick={handleSave} 
          variant="contained"
          color="primary"
          disabled={!name.trim()}
        >
          {isEditMode ? '更新' : '保存'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default RecipeFormDialog;