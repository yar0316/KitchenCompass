import React from 'react';
import {
  Typography,
  Card,
  CardContent,
  Divider,
  List,
  ListItem,
  ListItemText,
  Avatar
} from '@mui/material';
import EventNoteIcon from '@mui/icons-material/EventNote';
import { RecipeStepsProps } from '../types/RecipeDetailsTypes';

/**
 * レシピ調理手順セクションコンポーネント
 * 調理手順の一覧を表示
 */
const RecipeSteps: React.FC<RecipeStepsProps> = ({ steps }) => {
  return (
    <Card variant="outlined" sx={{ mb: 3 }}>
      <CardContent>
        <Typography variant="h6" component="h2" sx={{ mb: 2, display: 'flex', alignItems: 'center' }}>
          <EventNoteIcon sx={{ mr: 1 }} />
          作り方
        </Typography>
        
        <Divider sx={{ mb: 2 }} />
        
        <List sx={{ pt: 0 }}>
          {steps && steps.length > 0 ? (
            steps.map((step, index) => (
              <React.Fragment key={step.id || index}>
                <ListItem alignItems="flex-start" sx={{ py: 1.5 }}>
                  <Avatar 
                    sx={{ 
                      bgcolor: 'primary.main', 
                      width: 28, 
                      height: 28, 
                      fontSize: '0.875rem',
                      mr: 2,
                      mt: 0.5
                    }}
                  >
                    {index + 1}
                  </Avatar>
                  <ListItemText primary={step.description} />
                </ListItem>
                {index < steps.length - 1 && <Divider component="li" />}
              </React.Fragment>
            ))
          ) : (
            <Typography variant="body2" color="text.secondary" sx={{ py: 2, textAlign: 'center' }}>
              調理手順情報がありません
            </Typography>
          )}
        </List>
      </CardContent>
    </Card>
  );
};

export default RecipeSteps;
