import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'
import { ThemeProvider, createTheme } from '@mui/material/styles'
import NotificationCenter from './NotificationCenter'

// AWS Amplify のモック
vi.mock('aws-amplify/api', () => ({
  generateClient: vi.fn(() => ({
    graphql: vi.fn()
  }))
}))

vi.mock('aws-amplify/auth', () => ({
  getCurrentUser: vi.fn()
}))

const mockClient = {
  graphql: vi.fn()
}

const mockGetCurrentUser = vi.fn()

// React Router のモック
const mockNavigate = vi.fn()
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom')
  return {
    ...actual,
    useNavigate: () => mockNavigate
  }
})

const theme = createTheme()

const TestWrapper = ({ children }: { children: React.ReactNode }) => (
  <BrowserRouter>
    <ThemeProvider theme={theme}>
      {children}
    </ThemeProvider>
  </BrowserRouter>
)

const mockNotifications = [
  {
    id: '1',
    message: '今日は「週末の買い物」の買い物予定があります！',
    type: 'shopping-list',
    isRead: false,
    relatedItemId: 'list-1',
    navigateTo: '/shopping',
    createdAt: new Date().toISOString()
  },
  {
    id: '2',
    message: '今日の献立が設定されています',
    type: 'menu',
    isRead: true,
    relatedItemId: 'menu-1',
    navigateTo: '/menu',
    createdAt: new Date(Date.now() - 60 * 60 * 1000).toISOString()
  }
]

describe('NotificationCenter', () => {
  beforeEach(async () => {
    vi.clearAllMocks()
    
    // generateClientをモック
    const { generateClient } = await import('aws-amplify/api')
    vi.mocked(generateClient).mockReturnValue(mockClient)
    
    // getCurrentUserをモック
    const { getCurrentUser } = await import('aws-amplify/auth')
    vi.mocked(getCurrentUser).mockResolvedValue({
      userId: 'test-user-123'
    })
    
    // モック関数をリセット
    mockClient.graphql.mockReset()
  })

  it('正常にレンダリングされる', () => {
    // 初期通知取得のモックを設定
    mockClient.graphql.mockResolvedValueOnce({
      data: {
        notificationsByOwnerAndCreatedAt: {
          items: []
        }
      }
    })

    render(
      <TestWrapper>
        <NotificationCenter />
      </TestWrapper>
    )

    const notificationButton = screen.getByLabelText('通知')
    expect(notificationButton).toBeInTheDocument()
  })

  it('通知一覧の取得に成功した場合、正しく表示される', async () => {
    // 初期読み込みで通知データを返す
    mockClient.graphql.mockResolvedValueOnce({
      data: {
        notificationsByOwnerAndCreatedAt: {
          items: mockNotifications
        }
      }
    })

    render(
      <TestWrapper>
        <NotificationCenter />
      </TestWrapper>
    )

    const notificationButton = screen.getByLabelText('通知')
    fireEvent.click(notificationButton)

    await waitFor(() => {
      expect(screen.getByText('今日は「週末の買い物」の買い物予定があります！')).toBeInTheDocument()
      expect(screen.getByText('今日の献立が設定されています')).toBeInTheDocument()
    })

    // GraphQLクエリが正しいパラメータで呼ばれることを確認
    expect(mockClient.graphql).toHaveBeenCalledWith({
      query: expect.any(String),
      variables: {
        owner: 'test-user-123',
        sortDirection: 'DESC',
        limit: 20
      }
    })
  })

  it('未読通知数がバッジに正しく表示される', async () => {
    mockClient.graphql.mockResolvedValueOnce({
      data: {
        notificationsByOwnerAndCreatedAt: {
          items: mockNotifications
        }
      }
    })

    render(
      <TestWrapper>
        <NotificationCenter />
      </TestWrapper>
    )

    const notificationButton = screen.getByLabelText('通知')
    fireEvent.click(notificationButton)

    await waitFor(() => {
      // 未読通知は1つなので、バッジに1が表示される
      const badge = screen.getByText('1')
      expect(badge).toBeInTheDocument()
    })
  })

  it('通知の取得中はローディングが表示される', async () => {
    // 解決しないPromiseでローディング状態をテスト
    mockClient.graphql.mockImplementationOnce(() => new Promise(() => {}))

    render(
      <TestWrapper>
        <NotificationCenter />
      </TestWrapper>
    )

    const notificationButton = screen.getByLabelText('通知')
    fireEvent.click(notificationButton)

    await waitFor(() => {
      expect(screen.getByRole('progressbar')).toBeInTheDocument()
    })
  })

  it('通知の取得に失敗した場合、エラーメッセージが表示される', async () => {
    mockClient.graphql.mockRejectedValueOnce(new Error('Network error'))

    render(
      <TestWrapper>
        <NotificationCenter />
      </TestWrapper>
    )

    const notificationButton = screen.getByLabelText('通知')
    fireEvent.click(notificationButton)

    await waitFor(() => {
      expect(screen.getByText('通知の読み込みに失敗しました。')).toBeInTheDocument()
    })
  })

  it('通知がない場合、適切なメッセージが表示される', async () => {
    mockClient.graphql.mockResolvedValueOnce({
      data: {
        notificationsByOwnerAndCreatedAt: {
          items: []
        }
      }
    })

    render(
      <TestWrapper>
        <NotificationCenter />
      </TestWrapper>
    )

    const notificationButton = screen.getByLabelText('通知')
    fireEvent.click(notificationButton)

    await waitFor(() => {
      expect(screen.getByText('通知はありません')).toBeInTheDocument()
      expect(screen.getByText('新しい通知があると、ここに表示されます。')).toBeInTheDocument()
    })
  })

  it('通知をクリックすると既読になる', async () => {
    mockClient.graphql
      .mockResolvedValueOnce({
        data: {
          notificationsByOwnerAndCreatedAt: {
            items: mockNotifications
          }
        }
      })
      .mockResolvedValueOnce({
        data: {
          updateNotificationMessage: {
            id: '1',
            isRead: true
          }
        }
      })

    render(
      <TestWrapper>
        <NotificationCenter />
      </TestWrapper>
    )

    const notificationButton = screen.getByLabelText('通知')
    fireEvent.click(notificationButton)

    await waitFor(() => {
      const notification = screen.getByText('今日は「週末の買い物」の買い物予定があります！')
      fireEvent.click(notification)
    })

    // 既読更新のGraphQLミューテーションが呼ばれることを確認
    await waitFor(() => {
      expect(mockClient.graphql).toHaveBeenCalledWith({
        query: expect.any(String),
        variables: {
          input: {
            id: '1',
            isRead: true
          }
        }
      })
    })

    // ナビゲーションが呼ばれることを確認
    expect(mockNavigate).toHaveBeenCalledWith('/shopping')
  })

  it('既読の通知をクリックしても更新リクエストは送信されない', async () => {
    mockClient.graphql.mockResolvedValueOnce({
      data: {
        notificationsByOwnerAndCreatedAt: {
          items: mockNotifications
        }
      }
    })

    render(
      <TestWrapper>
        <NotificationCenter />
      </TestWrapper>
    )

    const notificationButton = screen.getByLabelText('通知')
    fireEvent.click(notificationButton)

    await waitFor(() => {
      const readNotification = screen.getByText('今日の献立が設定されています')
      fireEvent.click(readNotification)
    })

    // 既読の通知なので、更新リクエストは1回のみ（初期取得）
    expect(mockClient.graphql).toHaveBeenCalledTimes(1)
    expect(mockNavigate).toHaveBeenCalledWith('/menu')
  })

  it('「すべて既読にする」ボタンが機能する', async () => {
    const unreadNotifications = [
      { ...mockNotifications[0], isRead: false },
      { ...mockNotifications[1], isRead: false }
    ]

    // 最初の呼び出し（初期読み込み）で空の配列を返す
    mockClient.graphql
      .mockResolvedValueOnce({
        data: {
          notificationsByOwnerAndCreatedAt: {
            items: []
          }
        }
      })
      // 2回目の呼び出し（ボタンクリック時）で未読通知を返す
      .mockResolvedValueOnce({
        data: {
          notificationsByOwnerAndCreatedAt: {
            items: unreadNotifications
          }
        }
      })
      // 更新リクエスト用のモック
      .mockResolvedValue({
        data: {
          updateNotificationMessage: {
            isRead: true
          }
        }
      })

    render(
      <TestWrapper>
        <NotificationCenter />
      </TestWrapper>
    )

    const notificationButton = screen.getByLabelText('通知')
    fireEvent.click(notificationButton)

    // 通知が読み込まれるまで待つ
    await waitFor(() => {
      expect(screen.getByText('今日は「週末の買い物」の買い物予定があります！')).toBeInTheDocument()
    })

    // 「すべて既読にする」ボタンを探してクリック
    await waitFor(() => {
      const markAllReadButton = screen.getByText('すべて既読にする')
      fireEvent.click(markAllReadButton)
    })

    // すべての未読通知に対して更新リクエストが送信されることを確認
    await waitFor(() => {
      expect(mockClient.graphql).toHaveBeenCalledTimes(4) // 初期取得 + ボタンクリック時取得 + 2回の更新
    })
  })

  it('定期的に通知を更新する', async () => {
    vi.useFakeTimers()

    mockClient.graphql.mockResolvedValue({
      data: {
        notificationsByOwnerAndCreatedAt: {
          items: mockNotifications
        }
      }
    })

    render(
      <TestWrapper>
        <NotificationCenter />
      </TestWrapper>
    )

    // 初期読み込みを待つ
    await waitFor(() => {
      expect(mockClient.graphql).toHaveBeenCalledTimes(1)
    })

    // 5分進める
    vi.advanceTimersByTime(5 * 60 * 1000)

    // 定期更新が実行されることを確認
    await waitFor(() => {
      expect(mockClient.graphql).toHaveBeenCalledTimes(2)
    })

    vi.useRealTimers()
  })

  it('コンポーネントがアンマウントされたときに定期更新が停止する', async () => {
    vi.useFakeTimers()

    mockClient.graphql.mockResolvedValue({
      data: {
        notificationsByOwnerAndCreatedAt: {
          items: mockNotifications
        }
      }
    })

    const { unmount } = render(
      <TestWrapper>
        <NotificationCenter />
      </TestWrapper>
    )

    // 初期読み込みを待つ
    await waitFor(() => {
      expect(mockClient.graphql).toHaveBeenCalledTimes(1)
    })

    // コンポーネントをアンマウント
    unmount()

    // 5分進める
    vi.advanceTimersByTime(5 * 60 * 1000)

    // 定期更新は実行されない（初期読み込みの1回のみ）
    expect(mockClient.graphql).toHaveBeenCalledTimes(1)

    vi.useRealTimers()
  })

  it('認証エラーが発生した場合、適切にハンドリングされる', async () => {
    mockGetCurrentUser.mockRejectedValueOnce(new Error('Authentication failed'))

    render(
      <TestWrapper>
        <NotificationCenter />
      </TestWrapper>
    )

    const notificationButton = screen.getByLabelText('通知')
    fireEvent.click(notificationButton)

    await waitFor(() => {
      expect(screen.getByText('通知の読み込みに失敗しました。')).toBeInTheDocument()
    })
  })
})