import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { handler } from './handler'

// AWS SDK のモック
const mockScanCommand = vi.fn()
const mockPutCommand = vi.fn()
const mockSend = vi.fn()

vi.mock('@aws-sdk/client-dynamodb', () => ({
  DynamoDBClient: vi.fn(() => ({}))
}))

vi.mock('@aws-sdk/lib-dynamodb', () => ({
  DynamoDBDocumentClient: {
    from: vi.fn(() => ({
      send: mockSend
    }))
  },
  ScanCommand: vi.fn((params) => {
    mockScanCommand(params)
    return { params }
  }),
  PutCommand: vi.fn((params) => {
    mockPutCommand(params)
    return { params }
  })
}))

describe('shopping-list-notification handler', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    
    // 環境変数をモック
    process.env.AMPLIFY_DATA_SHOPPINGLIST_TABLE_NAME = 'ShoppingList-test'
    process.env.AMPLIFY_DATA_NOTIFICATIONMESSAGE_TABLE_NAME = 'NotificationMessage-test'
    
    // 固定の日付をモック（テストの一貫性のため）
    vi.useFakeTimers()
    vi.setSystemTime(new Date('2024-01-15T10:00:00Z'))
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('当日の買い物リストが存在しない場合、適切なレスポンスを返す', async () => {
    // DynamoDB Scanの結果をモック（買い物リストなし）
    mockSend.mockResolvedValueOnce({
      Items: []
    })

    const event = { notificationType: 'shopping-list' }
    const result = await handler(event)

    expect(result.statusCode).toBe(200)
    expect(JSON.parse(result.body)).toBe('No shopping lists for today')
    
    // Scanが正しいパラメータで呼ばれることを確認
    expect(mockScanCommand).toHaveBeenCalledWith({
      TableName: 'ShoppingList-test',
      FilterExpression: 'begins_with(dueDate, :date) AND isCompleted = :completed',
      ExpressionAttributeValues: {
        ':date': '2024-01-15',
        ':completed': false
      }
    })
  })

  it('1つの買い物リストがある場合、適切な通知を作成する', async () => {
    const mockShoppingList = {
      id: 'list-1',
      name: '週末の買い物',
      dueDate: '2024-01-15T09:00:00Z',
      owner: 'user-123',
      isCompleted: false
    }

    // DynamoDB Scanの結果をモック
    mockSend
      .mockResolvedValueOnce({
        Items: [mockShoppingList]
      })
      .mockResolvedValueOnce({}) // PutCommandの結果

    const event = { notificationType: 'shopping-list' }
    const result = await handler(event)

    expect(result.statusCode).toBe(200)
    const responseBody = JSON.parse(result.body)
    expect(responseBody.message).toBe('Notifications sent to 1 users')
    expect(responseBody.totalLists).toBe(1)

    // 通知が正しく作成されることを確認
    expect(mockPutCommand).toHaveBeenCalledWith({
      TableName: 'NotificationMessage-test',
      Item: expect.objectContaining({
        message: '今日は「週末の買い物」の買い物予定があります！',
        type: 'shopping-list',
        isRead: false,
        relatedItemId: 'list-1',
        navigateTo: '/shopping',
        owner: 'user-123'
      })
    })
  })

  it('複数の買い物リストがある場合、件数とリスト名を含む通知を作成する', async () => {
    const mockShoppingLists = [
      {
        id: 'list-1',
        name: '日用品',
        dueDate: '2024-01-15T09:00:00Z',
        owner: 'user-123',
        isCompleted: false
      },
      {
        id: 'list-2',
        name: '食材',
        dueDate: '2024-01-15T10:00:00Z',
        owner: 'user-123',
        isCompleted: false
      }
    ]

    mockSend
      .mockResolvedValueOnce({
        Items: mockShoppingLists
      })
      .mockResolvedValueOnce({}) // PutCommandの結果

    const event = { notificationType: 'shopping-list' }
    const result = await handler(event)

    expect(result.statusCode).toBe(200)

    // 通知メッセージが複数リストの場合の形式になることを確認
    expect(mockPutCommand).toHaveBeenCalledWith({
      TableName: 'NotificationMessage-test',
      Item: expect.objectContaining({
        message: '今日は 2 件の買い物予定があります：日用品、食材',
        type: 'shopping-list',
        owner: 'user-123'
      })
    })
  })

  it('異なるユーザーの買い物リストに対して個別の通知を作成する', async () => {
    const mockShoppingLists = [
      {
        id: 'list-1',
        name: 'ユーザー1の買い物',
        dueDate: '2024-01-15T09:00:00Z',
        owner: 'user-1',
        isCompleted: false
      },
      {
        id: 'list-2',
        name: 'ユーザー2の買い物',
        dueDate: '2024-01-15T10:00:00Z',
        owner: 'user-2',
        isCompleted: false
      }
    ]

    mockSend
      .mockResolvedValueOnce({
        Items: mockShoppingLists
      })
      .mockResolvedValueOnce({}) // 1つ目のPutCommand
      .mockResolvedValueOnce({}) // 2つ目のPutCommand

    const event = { notificationType: 'shopping-list' }
    const result = await handler(event)

    expect(result.statusCode).toBe(200)
    const responseBody = JSON.parse(result.body)
    expect(responseBody.message).toBe('Notifications sent to 2 users')

    // 2つの通知が作成されることを確認
    expect(mockPutCommand).toHaveBeenCalledTimes(2)
    
    // 1つ目の通知
    expect(mockPutCommand).toHaveBeenNthCalledWith(1, {
      TableName: 'NotificationMessage-test',
      Item: expect.objectContaining({
        message: '今日は「ユーザー1の買い物」の買い物予定があります！',
        owner: 'user-1'
      })
    })

    // 2つ目の通知
    expect(mockPutCommand).toHaveBeenNthCalledWith(2, {
      TableName: 'NotificationMessage-test',
      Item: expect.objectContaining({
        message: '今日は「ユーザー2の買い物」の買い物予定があります！',
        owner: 'user-2'
      })
    })
  })

  it('環境変数が設定されていない場合、エラーを返す', async () => {
    delete process.env.AMPLIFY_DATA_SHOPPINGLIST_TABLE_NAME

    const event = { notificationType: 'shopping-list' }
    const result = await handler(event)

    expect(result.statusCode).toBe(500)
    expect(JSON.parse(result.body)).toEqual({
      error: 'Internal server error'
    })
  })

  it('DynamoDBエラーが発生した場合、適切にハンドリングする', async () => {
    // DynamoDB Scanでエラーをモック
    mockSend.mockRejectedValueOnce(new Error('DynamoDB connection failed'))

    const event = { notificationType: 'shopping-list' }
    const result = await handler(event)

    expect(result.statusCode).toBe(500)
    expect(JSON.parse(result.body)).toEqual({
      error: 'Internal server error'
    })
  })

  it('通知の有効期限が正しく設定される', async () => {
    const mockShoppingList = {
      id: 'list-1',
      name: 'テスト買い物',
      dueDate: '2024-01-15T09:00:00Z',
      owner: 'user-123',
      isCompleted: false
    }

    mockSend
      .mockResolvedValueOnce({
        Items: [mockShoppingList]
      })
      .mockResolvedValueOnce({})

    const event = { notificationType: 'shopping-list' }
    await handler(event)

    // 7日後の日付を計算
    const expectedExpireDate = new Date('2024-01-22T10:00:00.000Z').toISOString()

    expect(mockPutCommand).toHaveBeenCalledWith({
      TableName: 'NotificationMessage-test',
      Item: expect.objectContaining({
        expireAt: expectedExpireDate
      })
    })
  })

  it('通知IDが一意であることを確認', async () => {
    const mockShoppingList = {
      id: 'list-1',
      name: 'テスト買い物',
      dueDate: '2024-01-15T09:00:00Z',
      owner: 'user-123',
      isCompleted: false
    }

    mockSend
      .mockResolvedValueOnce({
        Items: [mockShoppingList]
      })
      .mockResolvedValueOnce({})

    const event = { notificationType: 'shopping-list' }
    await handler(event)

    const putCallArgs = mockPutCommand.mock.calls[0][0]
    const notificationId = putCallArgs.Item.id

    // IDが文字列で、適切な形式であることを確認
    expect(typeof notificationId).toBe('string')
    expect(notificationId).toMatch(/^notification-\d+-[a-z0-9]+$/)
  })
})