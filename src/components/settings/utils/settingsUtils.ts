// 設定関連ユーティリティ

export interface SnackbarState {
  open: boolean;
  message: string;
  severity: 'success' | 'info' | 'warning' | 'error';
}

export interface Settings {
  darkMode: boolean;
  fontSize: string;
  language: string;
  notifications: boolean;
  emailNotifications: boolean;
  pushNotifications: boolean;
  autoUpdate: boolean;
  recipePortionSize: number;
  dataSync: boolean;
  privacy: {
    shareRecipes: boolean;
    publicProfile: boolean;
  };
}

export const getInitialSettings = (): Settings => ({
  darkMode: false,
  fontSize: 'medium',
  language: 'ja',
  notifications: true,
  emailNotifications: true,
  pushNotifications: true,
  autoUpdate: true,
  recipePortionSize: 2,
  dataSync: true,
  privacy: {
    shareRecipes: true,
    publicProfile: false
  }
});

export const createSnackbarMessage = (setting: string, value: boolean | string | number): string => {
  if (typeof value === 'boolean') {
    return `${setting}設定を${value ? 'オン' : 'オフ'}にしました`;
  }
  return `${setting}設定を「${value}」に変更しました`;
};

export const getDialogContent = (type: 'clearData' | 'deleteAccount'): {
  title: string;
  content: string;
  buttonText: string;
} => {
  switch (type) {
    case 'clearData':
      return {
        title: 'キャッシュデータをクリア',
        content: 'すべてのローカルキャッシュデータがクリアされます。この操作は元に戻せません。',
        buttonText: 'クリアする'
      };
    case 'deleteAccount':
      return {
        title: 'アカウント削除',
        content: 'アカウントを削除すると、すべてのデータが完全に削除されます。この操作は元に戻せません。',
        buttonText: '削除する'
      };
    default:
      throw new Error(`Unknown dialog type: ${type}`);
  }
};
