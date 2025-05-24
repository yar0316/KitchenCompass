import React from 'react';
import {
  Typography,
  Card,
  CardContent,
  Divider,
  List,
  ListItem,
  ListItemText
} from '@mui/material';
import LocalDiningIcon from '@mui/icons-material/LocalDining';
import { RecipeIngredientsProps } from '../types/RecipeDetailsTypes';

/**
 * レシピ材料セクションコンポーネント
 * 材料の一覧を表示
 */
const RecipeIngredients: React.FC<RecipeIngredientsProps> = ({ 
  ingredients, 
  servings 
}) => {
  return (
    <Card variant="outlined" sx={{ mb: 3 }}>
      <CardContent>
        <Typography variant="h6" component="h2" sx={{ mb: 2, display: 'flex', alignItems: 'center' }}>
          <LocalDiningIcon sx={{ mr: 1 }} />
          材料
          <Typography variant="body2" color="text.secondary" sx={{ ml: 2 }}>
            {servings || 2}人前
          </Typography>
        </Typography>
        
        <Divider sx={{ mb: 2 }} />
        
        <List sx={{ pt: 0 }}>
          {ingredients && ingredients.length > 0 ? (
            ingredients.map((ingredient, index) => (
              <React.Fragment key={ingredient.id || index}>
                <ListItem sx={{ py: 1 }}>
                  <ListItemText 
                    primary={ingredient.name} 
                    sx={{ flex: '1 1 70%' }}
                  />
                  <Typography variant="body2" color="text.secondary" sx={{ flex: '1 1 30%', textAlign: 'right' }}>
                    {ingredient.amount} {ingredient.unit}
                  </Typography>
                </ListItem>
                {index < ingredients.length - 1 && <Divider component="li" />}
              </React.Fragment>
            ))
          ) : (
            <Typography variant="body2" color="text.secondary" sx={{ py: 2, textAlign: 'center' }}>
              材料情報がありません
            </Typography>
          )}
        </List>
      </CardContent>
    </Card>
  );
};

export default RecipeIngredients;
