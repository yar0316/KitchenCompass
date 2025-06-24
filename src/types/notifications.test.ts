import { describe, it, expect } from 'vitest'
import type { 
  NotificationMessage, 
  NotificationFilters, 
  CreateNotificationInput,
  UpdateNotificationInput 
} from './notifications'

describe('通知関連の型定義', () => {
  it('NotificationMessage型が正しく定義されている', () => {
    const notification: NotificationMessage = {
      id: 'test-id',
      message: 'テストメッセージ',
      type: 'shopping-list',
      isRead: false,
      relatedItemId: 'related-id',
      navigateTo: '/shopping',
      expireAt: '2024-01-22T00:00:00Z',
      owner: 'user-123',
      createdAt: '2024-01-15T00:00:00Z',
      updatedAt: '2024-01-15T00:00:00Z'
    }

    expect(notification.id).toBe('test-id')
    expect(notification.type).toBe('shopping-list')
    expect(notification.isRead).toBe(false)
  })

  it('通知タイプが適切に制限されている', () => {
    // TypeScriptの型チェックをテスト
    const shoppingNotification: NotificationMessage['type'] = 'shopping-list'
    const menuNotification: NotificationMessage['type'] = 'menu'
    const reminderNotification: NotificationMessage['type'] = 'reminder'

    expect(shoppingNotification).toBe('shopping-list')
    expect(menuNotification).toBe('menu')
    expect(reminderNotification).toBe('reminder')
  })

  it('NotificationFilters型が正しく動作する', () => {
    const filters: NotificationFilters = {
      type: 'shopping-list',
      isRead: false,
      startDate: '2024-01-01',
      endDate: '2024-01-31'
    }

    expect(filters.type).toBe('shopping-list')
    expect(filters.isRead).toBe(false)
  })

  it('CreateNotificationInput型で必須フィールドが適切に設定されている', () => {
    const createInput: CreateNotificationInput = {
      message: '新しい通知',
      type: 'shopping-list'
    }

    expect(createInput.message).toBe('新しい通知')
    expect(createInput.type).toBe('shopping-list')

    // オプションフィールドも追加可能
    const fullCreateInput: CreateNotificationInput = {
      ...createInput,
      relatedItemId: 'item-123',
      navigateTo: '/shopping',
      expireAt: '2024-01-22T00:00:00Z'
    }

    expect(fullCreateInput.relatedItemId).toBe('item-123')
  })

  it('UpdateNotificationInput型で部分更新が可能', () => {
    const updateInput: UpdateNotificationInput = {
      id: 'notification-123',
      isRead: true
    }

    expect(updateInput.id).toBe('notification-123')
    expect(updateInput.isRead).toBe(true)

    // メッセージのみ更新
    const messageUpdate: UpdateNotificationInput = {
      id: 'notification-123',
      message: '更新されたメッセージ'
    }

    expect(messageUpdate.message).toBe('更新されたメッセージ')
  })

  it('オプションフィールドが未定義でも問題ない', () => {
    const minimalNotification: NotificationMessage = {
      id: 'minimal-id',
      message: 'ミニマルな通知',
      type: 'menu',
      isRead: false,
      owner: 'user-123',
      createdAt: '2024-01-15T00:00:00Z',
      updatedAt: '2024-01-15T00:00:00Z'
    }

    expect(minimalNotification.relatedItemId).toBeUndefined()
    expect(minimalNotification.navigateTo).toBeUndefined()
    expect(minimalNotification.expireAt).toBeUndefined()
  })
})