import React from 'react';
import { 
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Box,
  Typography,
  IconButton,
  Tabs,
  Tab,
  Alert,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  Divider,
  TextField
} from '@mui/material';
import AssignmentIcon from '@mui/icons-material/Assignment';
import AssignmentTurnedInIcon from '@mui/icons-material/AssignmentTurnedIn';
import SaveIcon from '@mui/icons-material/Save';
import DeleteIcon from '@mui/icons-material/Delete';
import CloseIcon from '@mui/icons-material/Close';
import { Template } from './types/Menu.types';

interface MenuTemplateDialogProps {
  open: boolean;
  onClose: () => void;
  templateDialogTab: number;
  onTabChange: (event: React.SyntheticEvent, newValue: number) => void;
  templates: Template[];
  selectedTemplateId: string | null;
  onSelectTemplate: (templateId: string | null) => void;
  onApplyTemplate: () => void;
  onDeleteTemplate: (templateId: string, event: React.MouseEvent) => void;
  newTemplateName: string;
  onTemplateNameChange: (name: string) => void;
  newTemplateDescription: string;
  onTemplateDescriptionChange: (description: string) => void;
  onSaveNewTemplate: () => void;
}

/**
 * 献立テンプレートダイアログコンポーネント
 */
const MenuTemplateDialog: React.FC<MenuTemplateDialogProps> = ({
  open,
  onClose,
  templateDialogTab,
  onTabChange,
  templates,
  selectedTemplateId,
  onSelectTemplate,
  onApplyTemplate,
  onDeleteTemplate,
  newTemplateName,
  onTemplateNameChange,
  newTemplateDescription,
  onTemplateDescriptionChange,
  onSaveNewTemplate
}) => {
  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 2,
          overflow: 'hidden'
        }
      }}
    >
      <DialogTitle sx={{ 
        display: 'flex', 
        justifyContent: 'space-between',
        alignItems: 'center',
        mb: 0,
        py: 2
      }}>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <AssignmentIcon color="primary" sx={{ mr: 1 }} />
          <Typography variant="h6" component="span">
            献立テンプレート
          </Typography>
        </Box>
        <IconButton edge="end" onClick={onClose}>
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      
      <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Tabs
          value={templateDialogTab}
          onChange={onTabChange}
          variant="fullWidth"
        >
          <Tab label="テンプレートを適用" />
          <Tab label="現在の献立をテンプレートとして保存" />
        </Tabs>
      </Box>
      
      <DialogContent dividers>
        {templateDialogTab === 0 && (
          <>
            <Typography variant="body2" color="text.secondary" paragraph>
              既存のテンプレートを選択して、現在の週に適用できます。
            </Typography>
            
            {templates.length === 0 ? (
              <Alert severity="info" sx={{ mt: 2 }}>
                保存されたテンプレートはありません
              </Alert>
            ) : (
              <List sx={{ mt: 2 }}>
                {templates.map((template) => (
                  <React.Fragment key={template.id}>
                    <ListItem
                      component="div"
                      sx={{
                        borderRadius: 1,
                        mb: 1,
                        border: '1px solid',
                        borderColor: selectedTemplateId === template.id ? 'primary.main' : 'grey.300',
                        bgcolor: selectedTemplateId === template.id ? 'primary.50' : 'background.paper',
                        cursor: 'pointer',
                        '&:hover': {
                          bgcolor: selectedTemplateId === template.id ? 'primary.100' : 'grey.50',
                        }
                      }}
                      onClick={() => onSelectTemplate(
                        selectedTemplateId === template.id ? null : template.id
                      )}
                    >
                      <ListItemText
                        primary={template.name}
                        secondary={template.description}
                      />
                      <ListItemSecondaryAction>
                        <IconButton
                          edge="end"
                          onClick={(event) => onDeleteTemplate(template.id, event)}
                          size="small"
                        >
                          <DeleteIcon fontSize="small" />
                        </IconButton>
                      </ListItemSecondaryAction>
                    </ListItem>
                    <Divider sx={{ my: 1 }} />
                  </React.Fragment>
                ))}
              </List>
            )}
            
            {selectedTemplateId && (
              <Alert severity="warning" sx={{ mt: 2 }}>
                テンプレートの適用により、現在の献立が上書きされます。
              </Alert>
            )}
          </>
        )}
        
        {templateDialogTab === 1 && (
          <>
            <Typography variant="body2" color="text.secondary" paragraph>
              現在表示している週の献立をテンプレートとして保存できます。
            </Typography>
            
            <TextField
              margin="dense"
              label="テンプレート名"
              fullWidth
              variant="outlined"
              value={newTemplateName}
              onChange={(e) => onTemplateNameChange(e.target.value)}
              sx={{ mt: 2, mb: 2 }}
            />
            
            <TextField
              margin="dense"
              label="説明（任意）"
              fullWidth
              multiline
              rows={2}
              variant="outlined"
              value={newTemplateDescription}
              onChange={(e) => onTemplateDescriptionChange(e.target.value)}
            />
          </>
        )}
      </DialogContent>
      
      <DialogActions sx={{ px: 3, py: 2 }}>
        <Button onClick={onClose} color="inherit">
          キャンセル
        </Button>
        {templateDialogTab === 0 ? (
          <Button 
            onClick={onApplyTemplate} 
            variant="contained"
            disabled={!selectedTemplateId}
            startIcon={<AssignmentTurnedInIcon />}
          >
            適用
          </Button>
        ) : (
          <Button 
            onClick={onSaveNewTemplate} 
            variant="contained"
            disabled={!newTemplateName.trim()}
            startIcon={<SaveIcon />}
          >
            保存
          </Button>
        )}
      </DialogActions>
    </Dialog>
  );
};

export default MenuTemplateDialog;
