/**
 * デフォルトユーザー設定の定義
 * UserProfileの個別フィールドに直接マッピングされる設定項目
 */
export interface UserSettings {
  // 通知設定
  notifications: boolean;
  emailNotifications: boolean;
  pushNotifications: boolean;
  
  // 表示設定  
  darkMode: boolean;
  
  // 機能設定
  autoUpdate: boolean;
  recipePortionSize: number;
  dataSync: boolean;
}

/**
 * デフォルトユーザー設定値
 * DynamoDBのデフォルト値と一致させる
 */
export const DEFAULT_SETTINGS: UserSettings = {
  // 通知設定 - デフォルトはすべて有効
  notifications: true,
  emailNotifications: true,
  pushNotifications: true,
  
  // 表示設定 - デフォルトは標準
  darkMode: false,
  
  // 機能設定 - デフォルトは便利機能を有効
  autoUpdate: true,
  recipePortionSize: 2,
  dataSync: true,
};

/**
 * デフォルトUserProfileの作成用データ
 * 設定項目はDynamoDBのデフォルト値を使用するため、preferencesフィールドは削除
 */
export const createDefaultUserProfile = (userId: string) => ({
  id: userId,
  email: '',
  name: '',
  // 設定項目はDynamoDBのデフォルト値を使用
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
});
