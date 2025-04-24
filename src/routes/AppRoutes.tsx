import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import RecipePage from '../components/recipe/RecipePage';
import ShoppingListPage from '../components/shopping/ShoppingListPage';
import DashboardPage from '../components/dashboard/DashboardPage';
import MenuPlanPage from '../components/menu/MenuPlanPage';
import ProfilePage from '../components/profile/ProfilePage';
import SettingsPage from '../components/settings/SettingsPage';

/**
 * アプリケーションのルーティング設定
 * 各パスに対応するコンポーネントをマッピング
 */
const AppRoutes: React.FC = () => {
  return (
    <Routes>
      {/* ダッシュボード */}
      <Route path="/" element={<DashboardPage />} />
      
      {/* レシピ管理 */}
      <Route path="/recipes" element={<RecipePage />} />
      
      {/* 献立管理 */}
      <Route path="/menus" element={<MenuPlanPage />} />
      
      {/* 買い物リスト */}
      <Route path="/shopping" element={<ShoppingListPage />} />
      
      {/* プロフィール */}
      <Route path="/profile" element={<ProfilePage />} />
      
      {/* 設定 */}
      <Route path="/settings" element={<SettingsPage />} />
      
      {/* 存在しないパスの場合はホームにリダイレクト */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

export default AppRoutes;