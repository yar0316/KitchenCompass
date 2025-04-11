// ナビゲーションメニュー項目の設定
import DashboardIcon from '@mui/icons-material/Dashboard';
import RestaurantMenuIcon from '@mui/icons-material/RestaurantMenu';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import PersonIcon from '@mui/icons-material/Person';
import SettingsIcon from '@mui/icons-material/Settings';

export interface NavigationItem {
  id: string;
  title: string;
  path: string;
  icon: React.ElementType;
  children?: NavigationItem[];
}

// メインナビゲーションアイテム
export const mainNavigationItems: NavigationItem[] = [
  {
    id: 'dashboard',
    title: 'ダッシュボード',
    path: '/',
    icon: DashboardIcon
  },
  {
    id: 'recipes',
    title: 'レシピ',
    path: '/recipes',
    icon: RestaurantMenuIcon
  },
  {
    id: 'menu-plans',
    title: '献立',
    path: '/menus',
    icon: CalendarMonthIcon
  },
  {
    id: 'shopping-lists',
    title: '買い物リスト',
    path: '/shopping',
    icon: ShoppingCartIcon
  }
];

// セカンダリナビゲーションアイテム（設定など）
export const secondaryNavigationItems: NavigationItem[] = [
  {
    id: 'profile',
    title: 'プロフィール',
    path: '/profile',
    icon: PersonIcon
  },
  {
    id: 'settings',
    title: '設定',
    path: '/settings',
    icon: SettingsIcon
  }
];