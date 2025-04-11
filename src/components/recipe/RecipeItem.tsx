import React from 'react';
import { 
  Card, 
  CardContent, 
  CardMedia, 
  Typography, 
  CardActionArea,
  Box,
  Chip,
} from '@mui/material';
import AccessTimeIcon from '@mui/icons-material/AccessTime';

interface RecipeItemProps {
  recipe: {
    id: string;
    name: string;
    description: string;
    imageUrl: string;
    cookingTime: number;
    tags: string[];
  };
  onClick: () => void;
}

const RecipeItem: React.FC<RecipeItemProps> = ({ recipe, onClick }) => {
  const { name, description, imageUrl, cookingTime, tags } = recipe;
  
  // 説明文を短く切り詰める
  const shortDescription = description.length > 60
    ? `${description.substring(0, 60)}...`
    : description;
  
  return (
    <Card 
      sx={{ 
        width: '100%',
        height: '100%',
        display: 'flex', 
        flexDirection: 'column',
        overflow: 'hidden',
        borderRadius: 2,
        boxShadow: 2,
        transition: 'transform 0.2s, box-shadow 0.3s',
        '&:hover': {
          transform: 'translateY(-4px)',
          boxShadow: 4,
        },
      }}
    >
      <CardActionArea 
        onClick={onClick}
        sx={{ 
          flexGrow: 1, 
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'stretch',
          height: '100%'
        }}
      >
        <CardMedia
          component="img"
          height="160"
          image={imageUrl}
          alt={name}
          sx={{ objectFit: 'cover' }}
        />
        <CardContent 
          sx={{ 
            flexGrow: 1, 
            display: 'flex', 
            flexDirection: 'column',
            p: 2
          }}
        >
          <Typography 
            gutterBottom 
            variant="h6" 
            component="div" 
            sx={{ 
              mb: 1, 
              fontWeight: 500,
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical',
              lineHeight: 1.3,
              height: '2.6em'
            }}
          >
            {name}
          </Typography>
          
          <Typography 
            variant="body2" 
            color="text.secondary"
            sx={{
              mb: 1.5,
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical',
              flexGrow: 1
            }}
          >
            {shortDescription}
          </Typography>
          
          <Box sx={{ 
            display: 'flex', 
            justifyContent: 'space-between',
            alignItems: 'center',
            mt: 'auto'
          }}>
            <Box 
              sx={{ 
                display: 'flex',
                alignItems: 'center',
                color: 'text.secondary'
              }}
            >
              <AccessTimeIcon fontSize="small" sx={{ mr: 0.5 }} />
              <Typography variant="body2">{cookingTime}分</Typography>
            </Box>
            
            {tags && tags.length > 0 && (
              <Chip
                label={tags[0]}
                size="small"
                sx={{ 
                  height: 24,
                  fontSize: '0.75rem',
                  backgroundColor: 'primary.light',
                  color: 'primary.contrastText'
                }}
              />
            )}
          </Box>
        </CardContent>
      </CardActionArea>
    </Card>
  );
};

export default RecipeItem;