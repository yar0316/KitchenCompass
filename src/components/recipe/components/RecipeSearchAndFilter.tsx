import React from 'react';
import {
  Box,
  TextField,
  InputAdornment,
  MenuItem,
  FormControl,
  Select,
  InputLabel,
  Button,
  Typography,
  SelectChangeEvent
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import SortIcon from '@mui/icons-material/Sort';
import FilterListIcon from '@mui/icons-material/FilterList';
import { 
  RecipeSearchAndFilterProps,
  FILTER_OPTIONS,
  SORT_OPTIONS
} from '../types/RecipePageTypes';

const RecipeSearchAndFilter: React.FC<RecipeSearchAndFilterProps> = ({
  searchQuery,
  sortOption,
  timeFilter,
  selectedTags,
  onSearchChange,
  onSortChange,
  onTimeFilterChange,
  onTagToggle
}) => {
  const handleSortChange = (e: SelectChangeEvent<string>) => {
    onSortChange(e.target.value);
  };

  const handleTimeFilterChange = (e: SelectChangeEvent<string>) => {
    onTimeFilterChange(e.target.value);
  };
  return (
    <Box sx={{ mb: 3 }}>
      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
        {/* 検索フィールド */}
        <Box sx={{ width: { xs: '100%', sm: 'calc(50% - 8px)', md: 'calc(50% - 8px)' } }}>
          <TextField
            fullWidth
            placeholder="レシピを検索..."
            variant="outlined"
            size="small"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon color="action" />
                </InputAdornment>
              )
            }}          />
        </Box>
        
        {/* ソートセレクト */}
        <Box sx={{ width: { xs: '100%', sm: 'calc(50% - 8px)', md: 'calc(25% - 12px)' } }}>
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
        </Box>
        
        {/* 時間フィルター */}
        <Box sx={{ width: { xs: 'calc(50% - 8px)', sm: 'calc(50% - 8px)', md: 'calc(12.5% - 12px)' } }}>
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
              ))}            </Select>
          </FormControl>
        </Box>
      </Box>
      
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
            onClick={() => onTagToggle(tag)}
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
  );
};

export default RecipeSearchAndFilter;
