// 通知関連の型定義

export interface NotificationMessage {
  id: string;
  message: string;
  type: 'shopping-list' | 'menu' | 'reminder';
  isRead: boolean;
  relatedItemId?: string;
  navigateTo?: string;
  expireAt?: string;
  owner: string;
  createdAt: string;
  updatedAt: string;
}

export interface NotificationFilters {
  type?: string;
  isRead?: boolean;
  startDate?: string;
  endDate?: string;
}

export interface CreateNotificationInput {
  message: string;
  type: string;
  relatedItemId?: string;
  navigateTo?: string;
  expireAt?: string;
}

export interface UpdateNotificationInput {
  id: string;
  isRead?: boolean;
  message?: string;
}