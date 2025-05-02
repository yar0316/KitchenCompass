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
  SelectChangeEvent,
  Alert,
  CircularProgress
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import SearchIcon from '@mui/icons-material/Search';
import SortIcon from '@mui/icons-material/Sort';
import FilterListIcon from '@mui/icons-material/FilterList';
import RecipeFormDialog from './RecipeFormDialog';
import RecipeItem from './RecipeItem';
import RecipeDetails from './RecipeDetails';
import { generateClient } from 'aws-amplify/api';
import { listRecipes } from '../../graphql/queries';
import { createRecipe, updateRecipe, deleteRecipe } from '../../graphql/mutations';
import { Recipe, CreateRecipeInput, UpdateRecipeInput, DeleteRecipeInput } from '../../API';
import { DUMMY_IMAGE_URL } from '../../mock/recipeData';

// APIクライアントの初期化
const client = generateClient();

// フィルターオプション
const FILTER_OPTIONS = {
  cookingTime: [
    { value: 'all', label: 'すべて' },
    { value: 'under15', label: '15分以内' },
    { value: 'under30', label: '30分以内' },
    { value: 'under60', label: '60分以内' },
    { value: 'over60', label: '60分以上' }
  ],
  tags: ['和食', 'イタリアン', '中華', 'サラダ', 'スープ', '肉料理', '魚料理', 'デザート', 'ベジタリアン', '朝食', 'ヘルシー', '定番']
};

// ソートオプション
const SORT_OPTIONS = [
  { value: 'newest', label: '新しい順' },
  { value: 'oldest', label: '古い順' },
  { value: 'name_asc', label: '名前昇順' },
  { value: 'name_desc', label: '名前降順' },
  { value: 'cooking_time', label: '調理時間が短い順' }
];

const RecipePage: React.FC = () => {
  // 状態
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [filteredRecipes, setFilteredRecipes] = useState<Recipe[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortOption, setSortOption] = useState('newest');
  const [timeFilter, setTimeFilter] = useState('all');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedRecipe, setSelectedRecipe] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const ITEMS_PER_PAGE = 8;

  // レシピデータの取得
  useEffect(() => {
    fetchRecipes();
  }, []);
  
  // レシピデータの取得処理
  const fetchRecipes = async () => {
    setLoading(true);
    setError(null);
    
    try {
      // Amplify V6でのGraphQLクエリ呼び出し
      const response: any = await client.graphql({
        query: listRecipes
      });
      
      // DynamoDBから取得したレシピデータ
      const recipeData = response.data.listRecipes.items;
      
      // 各レシピのJSONデータをパース
      const processedRecipes = recipeData.map((recipe: Recipe) => {
        // レシピが有効なデータであることを確認
        if (!recipe) return null;
        
        try {
          // JSONデータのパース
          const ingredientsJson = recipe.ingredientsJson ? JSON.parse(recipe.ingredientsJson) : [];
          const instructionsJson = recipe.instructionsJson ? JSON.parse(recipe.instructionsJson) : [];
          
          // 処理されたレシピの返却
          return {
            ...recipe,
            // レシピに必要なプロパティのマッピング
            ingredients: ingredientsJson,
            steps: instructionsJson,
            // 表示用データ変換
            cookingTime: recipe.cookTime || 0,
            prepTime: recipe.prepTime || 0,
            tags: recipe.cuisine ? recipe.cuisine.split(',').map(tag => tag.trim()) : [],
            createdAt: recipe.createdAt || new Date().toISOString()
          };
        } catch (error) {
          console.error('レシピデータの解析エラー:', error);
          // エラーが発生しても他のレシピには影響しないよう、基本情報だけ設定したオブジェクトを返す
          return {
            ...recipe,
            ingredients: [],
            steps: [],
            cookingTime: recipe.cookTime || 0,
            prepTime: recipe.prepTime || 0,
            tags: recipe.cuisine ? recipe.cuisine.split(',').map(tag => tag.trim()) : [],
            createdAt: recipe.createdAt || new Date().toISOString()
          };
        }
      }).filter(Boolean) as Recipe[]; // 有効なレシピのみ残す
      
      setRecipes(processedRecipes);
      setLoading(false);
    } catch (err) {
      console.error('レシピデータ取得エラー:', err);
      setError('レシピの読み込み中にエラーが発生しました。');
      setLoading(false);
    }
  };
  
  // レシピをフィルタリングしてソートする
  useEffect(() => {
    let result = [...recipes];
    
    // 検索フィルター
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(recipe => 
        (recipe.name?.toLowerCase().includes(query) || false) || 
        (recipe.description?.toLowerCase().includes(query) || false) ||
        (recipe.tags?.some(tag => tag.toLowerCase().includes(query)) || false)
      );
    }
    
    // 調理時間フィルター
    if (timeFilter !== 'all') {
      switch (timeFilter) {
        case 'under15':
          result = result.filter(recipe => (recipe.cookTime || 0) <= 15);
          break;
        case 'under30':
          result = result.filter(recipe => (recipe.cookTime || 0) <= 30);
          break;
        case 'under60':
          result = result.filter(recipe => (recipe.cookTime || 0) <= 60);
          break;
        case 'over60':
          result = result.filter(recipe => (recipe.cookTime || 0) > 60);
          break;
      }
    }
    
    // タグフィルター
    if (selectedTags.length > 0) {
      result = result.filter(recipe => 
        recipe.tags?.some(tag => selectedTags.includes(tag)) || false
      );
    }
    
    // ソート
    result = sortRecipes(result, sortOption);
    
    setFilteredRecipes(result);
    setPage(1); // フィルター変更時は1ページ目に戻す
  }, [recipes, searchQuery, sortOption, timeFilter, selectedTags]);
  
  // レシピのソート
  const sortRecipes = (recipesToSort: Recipe[], option: string) => {
    switch (option) {
      case 'newest':
        return [...recipesToSort].sort((a, b) => 
          new Date((b.createdAt as string) || '').getTime() - new Date((a.createdAt as string) || '').getTime()
        );
      case 'oldest':
        return [...recipesToSort].sort((a, b) => 
          new Date((a.createdAt as string) || '').getTime() - new Date((b.createdAt as string) || '').getTime()
        );
      case 'name_asc':
        return [...recipesToSort].sort((a, b) => (a.name || '').localeCompare(b.name || ''));
      case 'name_desc':
        return [...recipesToSort].sort((a, b) => (b.name || '').localeCompare(a.name || ''));
      case 'cooking_time':
        return [...recipesToSort].sort((a, b) => (a.cookTime || 0) - (b.cookTime || 0));
      default:
        return recipesToSort;
    }
  };
  
  // 新しいレシピの追加
  const handleAddRecipe = async (newRecipe: any) => {
    try {
      // 材料と手順をJSON文字列に変換
      const ingredientsJson = JSON.stringify(newRecipe.ingredients || []);
      const instructionsJson = JSON.stringify(newRecipe.steps || []);
      
      // タグをカンマ区切り文字列に変換
      const cuisine = (newRecipe.tags || []).join(',');
      
      // Amplify形式のレシピ入力データを作成
      const createInput: CreateRecipeInput = {
        name: newRecipe.name,
        description: newRecipe.description || '',
        prepTime: newRecipe.prepTime || 0,
        cookTime: newRecipe.cookingTime || 0,
        servings: newRecipe.servings || 2,
        category: newRecipe.category || 'other',
        cuisine: cuisine,
        imageUrl: newRecipe.imageUrl || DUMMY_IMAGE_URL,
        ingredientsJson: ingredientsJson,
        instructionsJson: instructionsJson,
        createdBy: 'user', // 実際のユーザーIDに変更する必要があります
        favorite: false
      };
      
      // Amplify V6でのGraphQLミューテーション呼び出し
      const result: any = await client.graphql({
        query: createRecipe,
        variables: { input: createInput }
      });
      
      const createdRecipe = result.data.createRecipe;
      
      // 新しく作成されたレシピを表示用に変換
      const processedRecipe = {
        ...createdRecipe,
        ingredients: newRecipe.ingredients || [],
        steps: newRecipe.steps || [],
        cookingTime: createdRecipe.cookTime || 0,
        tags: createdRecipe.cuisine ? createdRecipe.cuisine.split(',').map((tag: string) => tag.trim()) : [],
      };
      
      // 既存のレシピリストに追加
      setRecipes([...recipes, processedRecipe]);
      setSelectedRecipe(createdRecipe.id);
    } catch (err) {
      console.error('レシピ作成エラー:', err);
      alert('レシピの保存中にエラーが発生しました。');
    }
  };
  
  // レシピの更新
  const handleUpdateRecipe = async (updatedRecipe: any) => {
    try {
      // 材料と手順をJSON文字列に変換
      const ingredientsJson = JSON.stringify(updatedRecipe.ingredients || []);
      const instructionsJson = JSON.stringify(updatedRecipe.steps || []);
      
      // タグをカンマ区切り文字列に変換
      const cuisine = (updatedRecipe.tags || []).join(',');
      
      // Amplify形式のレシピ更新データを作成
      const updateInput: UpdateRecipeInput = {
        id: updatedRecipe.id,
        name: updatedRecipe.name,
        description: updatedRecipe.description || '',
        prepTime: updatedRecipe.prepTime || 0,
        cookTime: updatedRecipe.cookingTime || 0,
        servings: updatedRecipe.servings || 2,
        category: updatedRecipe.category || 'other',
        cuisine: cuisine,
        imageUrl: updatedRecipe.imageUrl,
        ingredientsJson: ingredientsJson,
        instructionsJson: instructionsJson
      };
      
      // Amplify V6でのGraphQLミューテーション呼び出し
      const result: any = await client.graphql({
        query: updateRecipe,
        variables: { input: updateInput }
      });
      
      const updatedRecipeResult = result.data.updateRecipe;
      
      // 更新されたレシピを表示用に変換
      const processedRecipe = {
        ...updatedRecipeResult,
        ingredients: updatedRecipe.ingredients || [],
        steps: updatedRecipe.steps || [],
        cookingTime: updatedRecipeResult.cookTime || 0,
        tags: updatedRecipeResult.cuisine ? updatedRecipeResult.cuisine.split(',').map((tag: string) => tag.trim()) : [],
      };
      
      // レシピリストを更新
      setRecipes(recipes.map(recipe => 
        recipe.id === updatedRecipe.id ? processedRecipe : recipe
      ));
    } catch (err) {
      console.error('レシピ更新エラー:', err);
      alert('レシピの更新中にエラーが発生しました。');
    }
  };
  
  // レシピを選択
  const handleSelectRecipe = (id: string) => {
    setSelectedRecipe(id);
  };
  
  // レシピの削除
  const handleDeleteRecipe = async (id: string) => {
    try {
      const deleteInput: DeleteRecipeInput = { id };
      
      // Amplify V6でのGraphQLミューテーション呼び出し
      await client.graphql({
        query: deleteRecipe,
        variables: { input: deleteInput }
      });
      
      // レシピリストから削除
      setRecipes(recipes.filter(recipe => recipe.id !== id));
      
      // 選択中のレシピが削除された場合は選択を解除
      if (selectedRecipe === id) {
        setSelectedRecipe(null);
      }
    } catch (err) {
      console.error('レシピ削除エラー:', err);
      alert('レシピの削除中にエラーが発生しました。');
    }
  };
  
  // ソートオプション変更
  const handleSortChange = (e: SelectChangeEvent<string>) => {
    setSortOption(e.target.value);
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
    <Container 
      maxWidth={false} 
      sx={{ 
        mt: 1, 
        mb: 4,
        px: { xs: 1, sm: 1.5, md: 2 }, 
        maxWidth: '100vw',
      }}
    >
      {!selectedRecipe && (
        <Box sx={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center', 
          mb: 2,
          mx: 0.5, // ヘッダー部分のマージンを追加
          width: 'auto' // 幅を自動に設定
        }}>
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
      )}
      
      {!selectedRecipe && (
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
                  label="並び順"
                >
                  {SORT_OPTIONS.map((option) => (
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
      )}
      
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
            onUpdate={handleUpdateRecipe}
          />
        </Box>
      ) : (
        <>
          {/* エラーメッセージ */}
          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}
          
          {/* ローディング表示 */}
          {loading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
              <CircularProgress />
            </Box>
          ) : (
            <>
              {/* レシピ一覧 */}
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                {filteredRecipes.length} 件のレシピが見つかりました
              </Typography>
              
              <Grid 
                container 
                spacing={2} // スペーシングを少し広げる
                sx={{ 
                  justifyContent: 'flex-start',
                  mx: -1, // ネガティブマージンの調整
                }}
              >
                {currentPageRecipes.length > 0 ? (
                  currentPageRecipes.map((recipe) => (
                    <Grid 
                      item 
                      key={recipe.id} 
                      xs={12}     // モバイルでは1列
                      sm={6}      // 小型タブレットでは2列
                      md={4}      // タブレットでは3列
                      lg={3}      // 中画面では4列
                      xl={2.4}    // 大画面では5列
                      sx={{
                        display: 'flex',
                        justifyContent: 'center', // カードを中央に配置
                      }}
                    >
                      <Box 
                        sx={{ 
                          width: '100%', // 親要素の幅いっぱいに広げる
                          maxWidth: { 
                            xs: '100%', 
                            sm: '340px',  // sm（600px以上）では340px
                            md: '320px',  // md（900px以上）では280px
                            lg: '320px',  // lg（1200px以上）では300px
                            xl: '340px'   // xl（1536px以上）では290px
                          }, // 画面サイズごとに最大幅を調整
                        }}
                      >
                        <RecipeItem 
                          recipe={recipe} 
                          onClick={() => handleSelectRecipe(recipe.id)} 
                        />
                      </Box>
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
        </>
      )}
      
      {/* 新規レシピ作成ダイアログ */}
      <RecipeFormDialog
        open={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        onSave={handleAddRecipe}
      />
    </Container>
  );
};

export default RecipePage;