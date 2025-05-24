import React from 'react';
import { Link } from 'react-router-dom';
import {
  Box,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Toolbar,
  Divider,
  useTheme,
  useMediaQuery,
  Typography,
  Collapse
} from '@mui/material';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { mainNavigationItems, secondaryNavigationItems, NavigationItem } from './navigationConfig';

// サイドナビゲーションの幅
const DRAWER_WIDTH = 240;

interface SideNavProps {
  open: boolean;
  onClose: () => void;
  currentPath: string;
}

const SideNav: React.FC<SideNavProps> = ({ open, onClose, currentPath }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [expandedMenus, setExpandedMenus] = React.useState<Record<string, boolean>>({});
  
  // メニューの展開状態を切り替え
  const handleMenuToggle = (menuId: string) => {
    setExpandedMenus((prev) => ({
      ...prev,
      [menuId]: !prev[menuId]
    }));
  };

  // ナビゲーションアイテムのレンダリング
  const renderNavItems = (items: NavigationItem[]) => (
    <>
      {items.map((item) => {
        const isSelected = currentPath === item.path;
        const hasChildren = item.children && item.children.length > 0;
        const isExpanded = expandedMenus[item.id] || false;
          return (
          <React.Fragment key={item.id}>
            <ListItem disablePadding>
              <ListItemButton
                {...(!hasChildren && { component: Link, to: item.path })}
                selected={isSelected}
                onClick={hasChildren 
                  ? () => handleMenuToggle(item.id)
                  : isMobile ? onClose : undefined}
                sx={{
                  minHeight: 48,
                  px: 2.5,
                  borderRadius: 1,
                  mx: 1,
                  my: 0.5,
                  '&.Mui-selected': {
                    backgroundColor: (theme) => theme.palette.action.selected,
                    '&:hover': {
                      backgroundColor: (theme) => theme.palette.action.hover,
                    }
                  },
                  textDecoration: 'none', // リンクの下線を削除
                  color: 'inherit'
                }}
              >
                <ListItemIcon
                  sx={{
                    minWidth: 0,
                    mr: 2,
                    color: isSelected ? 'primary.main' : 'text.secondary',
                    justifyContent: 'center',
                  }}
                >
                  {<item.icon />}
                </ListItemIcon>
                <ListItemText 
                  primary={
                    <Typography 
                      variant="body2" 
                      sx={{ 
                        fontWeight: isSelected ? 600 : 400,
                        color: isSelected ? 'primary.main' : 'text.primary'
                      }}
                    >
                      {item.title}
                    </Typography>
                  } 
                />
                {hasChildren && (
                  isExpanded ? <ExpandLessIcon /> : <ExpandMoreIcon />
                )}
              </ListItemButton>
            </ListItem>
            
            {/* サブメニュー */}
            {hasChildren && (
              <Collapse in={isExpanded} timeout="auto" unmountOnExit>
                <List component="div" disablePadding>
                  {item.children?.map((child) => {
                    const isChildSelected = currentPath === child.path;
                    
                    return (
                      <ListItemButton
                        key={child.id}
                        component={Link}
                        to={child.path}
                        selected={isChildSelected}
                        onClick={isMobile ? onClose : undefined}
                        sx={{
                          pl: 4,
                          py: 0.5,
                          minHeight: 36,
                          borderRadius: 1,
                          mx: 1,
                          my: 0.25,
                          textDecoration: 'none', // リンクの下線を削除
                          color: 'inherit'
                        }}
                      >
                        <ListItemIcon
                          sx={{
                            minWidth: 0,
                            mr: 2,
                            fontSize: '1.2rem',
                            color: isChildSelected ? 'primary.main' : 'text.secondary',
                          }}
                        >
                          {<child.icon />}
                        </ListItemIcon>
                        <ListItemText 
                          primary={
                            <Typography 
                              variant="body2" 
                              sx={{ 
                                fontWeight: isChildSelected ? 600 : 400,
                                color: isChildSelected ? 'primary.main' : 'text.primary'
                              }}
                            >
                              {child.title}
                            </Typography>
                          } 
                        />
                      </ListItemButton>
                    );
                  })}
                </List>
              </Collapse>
            )}
          </React.Fragment>
        );
      })}
    </>
  );
  
  // ドロワーのコンテンツ
  const drawerContent = (
    <>
      <Toolbar />
      <Box sx={{ overflow: 'auto', px: 1, py: 2 }}>
        {/* メインメニュー */}
        <List>
          {renderNavItems(mainNavigationItems)}
        </List>
        
        <Divider sx={{ my: 1.5 }} />
        
        {/* セカンダリメニュー */}
        <List>
          {renderNavItems(secondaryNavigationItems)}
        </List>
      </Box>
    </>
  );
  
  return isMobile ? (
    // モバイル用一時的ドロワー
    <Drawer
      variant="temporary"
      open={open}
      onClose={onClose}
      ModalProps={{
        keepMounted: true, // モバイルでのパフォーマンス向上のため
      }}
      sx={{
        display: { xs: 'block', sm: 'none' },
        '& .MuiDrawer-paper': { boxSizing: 'border-box', width: DRAWER_WIDTH },
      }}
    >
      {drawerContent}
    </Drawer>
  ) : (
    // デスクトップ用固定ドロワー
    <Drawer
      variant="permanent"
      open
      sx={{
        display: { xs: 'none', sm: 'block' },
        width: DRAWER_WIDTH,
        flexShrink: 0,
        '& .MuiDrawer-paper': { 
          boxSizing: 'border-box', 
          width: DRAWER_WIDTH,
          borderRight: '1px solid',
          borderColor: 'divider'
        },
      }}
    >
      {drawerContent}
    </Drawer>
  );
};

export default SideNav;