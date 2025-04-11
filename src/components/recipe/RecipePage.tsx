import React, { useState, useEffect } from 'react';
import { 
  Container, 
  Typography, 
  Box, 
  Button, 
  Grid,
  TextField,
  InputAdornment,
  MenuItem,
  FormControl,
  Select,
  InputLabel,
  Divider,
  Pagination,
  SelectChangeEvent
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import SearchIcon from '@mui/icons-material/Search';
import SortIcon from '@mui/icons-material/Sort';
import FilterListIcon from '@mui/icons-material/FilterList';
import NewRecipeDialog from './NewRecipeDialog';
import RecipeItem from './RecipeItem';
import RecipeDetails from './RecipeDetails';

// モックデータ：レシピのサンプル
const MOCK_RECIPES = [
  {
    id: '1',
    name: 'トマトとモッツァレラのカプレーゼ',
    description: '新鮮なトマトとモッツァレラチーズのシンプルなイタリアンサラダ',
    imageUrl: 'https://source.unsplash.com/random/300x200/?caprese',
    cookingTime: 10,
    difficulty: 'easy',
    tags: ['イタリアン', 'サラダ', 'ベジタリアン'],
    rating: 4.5,
    createdAt: '2025-03-12T10:20:30Z'
  },
  {
    id: '2',
    name: '基本の肉じゃが',
    description: '日本の家庭料理の定番、ほっとする味わいの肉じゃが',
    imageUrl: 'https://source.unsplash.com/random/300x200/?stew',
    cookingTime: 40,
    difficulty: 'medium',
    tags: ['和食', '煮物', '定番'],
    rating: 4.8,
    createdAt: '2025-03-15T14:30:20Z'
  },
  {
    id: '3',
    name: 'アボカドとエビのサラダ',
    description: '新鮮なアボカドとプリプリのエビを使ったヘルシーサラダ',
    imageUrl: 'https://source.unsplash.com/random/300x200/?avocado',
    cookingTime: 15,
    difficulty: 'easy',
    tags: ['サラダ', 'ヘルシー', 'アボカド'],
    rating: 4.2,
    createdAt: '2025-03-18T09:15:45Z'
  },
  {
    id: '4',
    name: '手作りピザ',
    description: '自家製生地で作る本格ピザ。トッピングはお好みで',
    imageUrl: 'https://source.unsplash.com/random/300x200/?homemade-pizza',
    cookingTime: 60,
    difficulty: 'hard',
    tags: ['イタリアン', 'パーティー', '手作り'],
    rating: 4.7,
    createdAt: '2025-03-20T16:40:10Z'
  },
  {
    id: '5',
    name: '鶏肉の照り焼き',
    description: '甘辛いタレが絡んだ、ご飯が進む照り焼きチキン',
    imageUrl: 'https://source.unsplash.com/random/300x200/?teriyaki',
    cookingTime: 25,
    difficulty: 'medium',
    tags: ['和食', '鶏肉', '定番'],
    rating: 4.4,
    createdAt: '2025-03-22T11:25:30Z'
  }
];

// ソートオプション
const SORT_OPTIONS = [
  { value: 'newest', label: '新しい順' },
  { value: 'oldest', label: '古い順' },
  { value: 'name_asc', label: '名前（昇順）' },
  { value: 'name_desc', label: '名前（降順）' },
  { value: 'rating', label: '評価の高い順' },
  { value: 'cooking_time', label: '調理時間が短い順' }
];

// フィルターオプション
const FILTER_OPTIONS = {
  difficulty: [
    { value: 'all', label: 'すべて' },
    { value: 'easy', label: '簡単' },
    { value: 'medium', label: '普通' },
    { value: 'hard', label: '難しい' }
  ],
  cookingTime: [
    { value: 'all', label: 'すべて' },
    { value: 'under15', label: '15分以内' },
    { value: 'under30', label: '30分以内' },
    { value: 'under60', label: '60分以内' },
    { value: 'over60', label: '60分以上' }
  ],
  tags: ['和食', 'イタリアン', '中華', 'サラダ', 'スープ', '肉料理', '魚料理', 'デザート', 'ベジタリアン', '朝食', 'ヘルシー', '定番']
};

const RecipePage: React.FC = () => {
  // 状態
  const [recipes, setRecipes] = useState(MOCK_RECIPES);
  const [filteredRecipes, setFilteredRecipes] = useState(MOCK_RECIPES);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortOption, setSortOption] = useState('newest');
  const [difficultyFilter, setDifficultyFilter] = useState('all');
  const [timeFilter, setTimeFilter] = useState('all');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedRecipe, setSelectedRecipe] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const ITEMS_PER_PAGE = 8;
  
  // レシピをフィルタリングしてソートする
  useEffect(() => {
    let result = [...recipes];
    
    // 検索フィルター
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(recipe => 
        recipe.name.toLowerCase().includes(query) || 
        recipe.description.toLowerCase().includes(query) ||
        recipe.tags.some(tag => tag.toLowerCase().includes(query))
      );
    }
    
    // 難易度フィルター
    if (difficultyFilter !== 'all') {
      result = result.filter(recipe => recipe.difficulty === difficultyFilter);
    }
    
    // 調理時間フィルター
    if (timeFilter !== 'all') {
      switch (timeFilter) {
        case 'under15':
          result = result.filter(recipe => recipe.cookingTime <= 15);
          break;
        case 'under30':
          result = result.filter(recipe => recipe.cookingTime <= 30);
          break;
        case 'under60':
          result = result.filter(recipe => recipe.cookingTime <= 60);
          break;
        case 'over60':
          result = result.filter(recipe => recipe.cookingTime > 60);
          break;
      }
    }
    
    // タグフィルター
    if (selectedTags.length > 0) {
      result = result.filter(recipe => 
        selectedTags.some(tag => recipe.tags.includes(tag))
      );
    }
    
    // ソート
    result = sortRecipes(result, sortOption);
    
    setFilteredRecipes(result);
    setPage(1); // フィルター変更時は1ページ目に戻す
  }, [recipes, searchQuery, sortOption, difficultyFilter, timeFilter, selectedTags]);
  
  // レシピのソート
  const sortRecipes = (recipesToSort: typeof MOCK_RECIPES, option: string) => {
    switch (option) {
      case 'newest':
        return [...recipesToSort].sort((a, b) => 
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
      case 'oldest':
        return [...recipesToSort].sort((a, b) => 
          new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
        );
      case 'name_asc':
        return [...recipesToSort].sort((a, b) => a.name.localeCompare(b.name));
      case 'name_desc':
        return [...recipesToSort].sort((a, b) => b.name.localeCompare(a.name));
      case 'rating':
        return [...recipesToSort].sort((a, b) => b.rating - a.rating);
      case 'cooking_time':
        return [...recipesToSort].sort((a, b) => a.cookingTime - b.cookingTime);
      default:
        return recipesToSort;
    }
  };
  
  // 新しいレシピの追加
  const handleAddRecipe = (newRecipe: any) => {
    const newRecipeWithId = {
      ...newRecipe,
      id: Date.now().toString(),
      imageUrl: 'https://source.unsplash.com/random/300x200/?food',
      rating: 0,
      createdAt: new Date().toISOString()
    };
    
    setRecipes([...recipes, newRecipeWithId]);
    setSelectedRecipe(newRecipeWithId.id);
  };
  
  // レシピを選択
  const handleSelectRecipe = (id: string) => {
    setSelectedRecipe(id);
  };
  
  // レシピの削除
  const handleDeleteRecipe = (id: string) => {
    setRecipes(recipes.filter(recipe => recipe.id !== id));
    if (selectedRecipe === id) {
      setSelectedRecipe(null);
    }
  };
  
  // ソートオプション変更
  const handleSortChange = (e: SelectChangeEvent<string>) => {
    setSortOption(e.target.value);
  };
  
  // 難易度フィルター変更
  const handleDifficultyFilterChange = (e: SelectChangeEvent<string>) => {
    setDifficultyFilter(e.target.value);
  };
  
  // 時間フィルター変更
  const handleTimeFilterChange = (e: SelectChangeEvent<string>) => {
    setTimeFilter(e.target.value);
  };
  
  // タグの選択/解除
  const handleTagToggle = (tag: string) => {
    if (selectedTags.includes(tag)) {
      setSelectedTags(selectedTags.filter(t => t !== tag));
    } else {
      setSelectedTags([...selectedTags, tag]);
    }
  };
  
  // ページネーション
  const handleChangePage = (event: React.ChangeEvent<unknown>, value: number) => {
    setPage(value);
  };
  
  const pageCount = Math.ceil(filteredRecipes.length / ITEMS_PER_PAGE);
  const currentPageRecipes = filteredRecipes.slice(
    (page - 1) * ITEMS_PER_PAGE, 
    page * ITEMS_PER_PAGE
  );
  
  // 選択されたレシピの詳細
  const selectedRecipeDetails = selectedRecipe 
    ? recipes.find(recipe => recipe.id === selectedRecipe) 
    : null;
  
  return (
    <Container maxWidth="lg" sx={{ mt: 1, mb: 4 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h5" component="h1">
          レシピ
        </Typography>
        <Button
          variant="contained"
          color="primary"
          startIcon={<AddIcon />}
          onClick={() => setIsDialogOpen(true)}
        >
          新規レシピ
        </Button>
      </Box>
      
      {/* フィルター＆検索セクション */}
      <Box sx={{ mb: 3 }}>
        <Grid container spacing={2}>
          {/* 検索フィールド */}
          <Grid item xs={12} sm={6} md={6}>
            <TextField
              fullWidth
              placeholder="レシピを検索..."
              variant="outlined"
              size="small"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon color="action" />
                  </InputAdornment>
                )
              }}
            />
          </Grid>
          
          {/* ソートセレクト */}
          <Grid item xs={12} sm={6} md={3}>
            <FormControl fullWidth size="small">
              <InputLabel id="sort-label" sx={{ display: 'flex', alignItems: 'center' }}>
                <SortIcon sx={{ mr: 0.5, fontSize: '1.2rem' }} /> 並び順
              </InputLabel>
              <Select
                labelId="sort-label"
                value={sortOption}
                onChange={handleSortChange}
                label={<span><SortIcon /> 並び順</span>}
              >
                {SORT_OPTIONS.map((option) => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          
          {/* 難易度フィルター */}
          <Grid item xs={6} sm={6} md={1.5}>
            <FormControl fullWidth size="small">
              <InputLabel id="difficulty-filter-label">難易度</InputLabel>
              <Select
                labelId="difficulty-filter-label"
                value={difficultyFilter}
                onChange={handleDifficultyFilterChange}
                label="難易度"
              >
                {FILTER_OPTIONS.difficulty.map((option) => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          
          {/* 時間フィルター */}
          <Grid item xs={6} sm={6} md={1.5}>
            <FormControl fullWidth size="small">
              <InputLabel id="time-filter-label">調理時間</InputLabel>
              <Select
                labelId="time-filter-label"
                value={timeFilter}
                onChange={handleTimeFilterChange}
                label="調理時間"
              >
                {FILTER_OPTIONS.cookingTime.map((option) => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
        </Grid>
        
        {/* タグフィルター */}
        <Box sx={{ mt: 2, display: 'flex', flexWrap: 'wrap', gap: 1 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', mr: 1 }}>
            <FilterListIcon fontSize="small" sx={{ mr: 0.5 }} />
            <Typography variant="body2" color="text.secondary">タグ:</Typography>
          </Box>
          {FILTER_OPTIONS.tags.map((tag) => (
            <Button
              key={tag}
              variant={selectedTags.includes(tag) ? "contained" : "outlined"}
              color="primary"
              size="small"
              onClick={() => handleTagToggle(tag)}
              sx={{ 
                borderRadius: 4,
                py: 0.5,
                minWidth: 'auto',
                textTransform: 'none',
              }}
            >
              {tag}
            </Button>
          ))}
        </Box>
      </Box>
      
      {selectedRecipe ? (
        <Box sx={{ mb: 3 }}>
          <Button 
            variant="text"
            color="primary"
            onClick={() => setSelectedRecipe(null)}
          >
            ← 一覧に戻る
          </Button>
          
          <RecipeDetails 
            recipe={selectedRecipeDetails!}
            onDelete={handleDeleteRecipe}
          />
        </Box>
      ) : (
        <>
          {/* レシピ一覧 */}
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            {filteredRecipes.length} 件のレシピが見つかりました
          </Typography>
          
          <Grid container spacing={3}>
            {currentPageRecipes.length > 0 ? (
              currentPageRecipes.map((recipe) => (
                <Grid item key={recipe.id} xs={12} sm={6} md={4} lg={3}>
                  <RecipeItem 
                    recipe={recipe} 
                    onClick={() => handleSelectRecipe(recipe.id)} 
                  />
                </Grid>
              ))
            ) : (
              <Grid item xs={12}>
                <Box sx={{ 
                  py: 5,
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}>
                  <Typography variant="h6" color="text.secondary" gutterBottom>
                    レシピが見つかりません
                  </Typography>
                  <Typography color="text.secondary" align="center" sx={{ mb: 2 }}>
                    検索条件に合うレシピがありません。<br />
                    別のキーワードで検索するか、フィルターを変更してください。
                  </Typography>
                  <Button 
                    variant="outlined" 
                    onClick={() => {
                      setSearchQuery('');
                      setDifficultyFilter('all');
                      setTimeFilter('all');
                      setSelectedTags([]);
                    }}
                  >
                    フィルターをクリア
                  </Button>
                </Box>
              </Grid>
            )}
          </Grid>
          
          {/* ページネーション */}
          {pageCount > 1 && (
            <Box sx={{ 
              display: 'flex', 
              justifyContent: 'center',
              mt: 4
            }}>
              <Pagination 
                count={pageCount} 
                page={page} 
                onChange={handleChangePage}
                color="primary"
              />
            </Box>
          )}
        </>
      )}
      
      {/* 新規レシピ作成ダイアログ */}
      <NewRecipeDialog
        open={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        onSave={handleAddRecipe}
      />
    </Container>
  );
};

export default RecipePage;