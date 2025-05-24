import React from 'react';
import {
  Box,
  FormControlLabel,
  Switch,
  TextField,
  Typography,
  Collapse
} from '@mui/material';
import RestaurantIcon from '@mui/icons-material/Restaurant';
import { OutingInfo } from '../utils/menuPlanningUtils';
import { UI_TEXT } from '../constants/menuPlanningConstants';

interface OutingFormProps {
  outingInfo: OutingInfo;
  onOutingToggle: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onOutingInfoChange: (field: keyof OutingInfo, value: string) => void;
}

const OutingForm: React.FC<OutingFormProps> = ({
  outingInfo,
  onOutingToggle,
  onOutingInfoChange
}) => {
  return (
    <>
      <Box sx={{ mb: 3 }}>
        <FormControlLabel
          control={
            <Switch
              checked={outingInfo.isOuting}
              onChange={onOutingToggle}
              color="primary"
            />
          }
          label={
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <RestaurantIcon sx={{ mr: 0.5 }} />
              <Typography>{UI_TEXT.outing.label}</Typography>
            </Box>
          }
        />
      </Box>

      <Collapse in={outingInfo.isOuting}>
        <Box sx={{ mb: 3 }}>
          <TextField
            margin="dense"
            label={UI_TEXT.outing.restaurantName}
            fullWidth
            variant="outlined"
            value={outingInfo.restaurantName}
            onChange={(e) => onOutingInfoChange('restaurantName', e.target.value)}
            sx={{ mb: 2 }}
          />

          <TextField
            margin="dense"
            label={UI_TEXT.outing.notes}
            fullWidth
            multiline
            rows={2}
            variant="outlined"
            value={outingInfo.notes}
            onChange={(e) => onOutingInfoChange('notes', e.target.value)}
          />
        </Box>
      </Collapse>
    </>
  );
};

export default OutingForm;
