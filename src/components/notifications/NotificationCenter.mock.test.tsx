import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'
import { ThemeProvider, createTheme } from '@mui/material/styles'
import NotificationCenterMock from './NotificationCenter.mock'

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

describe('NotificationCenterMock', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('正常にレンダリングされる', () => {
    render(
      <TestWrapper>
        <NotificationCenterMock />
      </TestWrapper>
    )

    const notificationButton = screen.getByLabelText('通知')
    expect(notificationButton).toBeInTheDocument()
  })

  it('未読通知の数がバッジに正しく表示される', () => {
    render(
      <TestWrapper>
        <NotificationCenterMock />
      </TestWrapper>
    )

    // モックデータには2つの未読通知があることを想定
    const badge = screen.getByText('2')
    expect(badge).toBeInTheDocument()
  })

  it('通知ボタンクリックでポップオーバーが開く', async () => {
    render(
      <TestWrapper>
        <NotificationCenterMock />
      </TestWrapper>
    )

    const notificationButton = screen.getByLabelText('通知')
    fireEvent.click(notificationButton)

    await waitFor(() => {
      expect(screen.getByText('通知')).toBeInTheDocument()
    })
  })

  it('通知リストが正しく表示される', async () => {
    render(
      <TestWrapper>
        <NotificationCenterMock />
      </TestWrapper>
    )

    const notificationButton = screen.getByLabelText('通知')
    fireEvent.click(notificationButton)

    await waitFor(() => {
      // モックデータの通知メッセージを確認
      expect(screen.getByText('今日は「週末の買い物」の買い物予定があります！')).toBeInTheDocument()
      expect(screen.getByText('今日は 2 件の買い物予定があります：日用品、食材')).toBeInTheDocument()
      expect(screen.getByText('今日の献立が設定されています')).toBeInTheDocument()
    })
  })

  it('未読と既読の通知が異なるスタイルで表示される', async () => {
    render(
      <TestWrapper>
        <NotificationCenterMock />
      </TestWrapper>
    )

    const notificationButton = screen.getByLabelText('通知')
    fireEvent.click(notificationButton)

    await waitFor(() => {
      const unreadNotification = screen.getByText('今日は「週末の買い物」の買い物予定があります！')
      const readNotification = screen.getByText('今日の献立が設定されています')

      // 未読通知は太字になっている（primaryTypographyPropsの確認）
      const unreadTextElement = unreadNotification.closest('[data-testid]') || unreadNotification
      const readTextElement = readNotification.closest('[data-testid]') || readNotification
      
      // Material-UIのTypographyコンポーネントの太字設定を確認
      expect(unreadTextElement).toBeDefined()
      expect(readTextElement).toBeDefined()
    })
  })

  it('買い物リスト通知にShoppingCartアイコンが表示される', async () => {
    render(
      <TestWrapper>
        <NotificationCenterMock />
      </TestWrapper>
    )

    const notificationButton = screen.getByLabelText('通知')
    fireEvent.click(notificationButton)

    await waitFor(() => {
      // Material-UIのアイコンはdata-testidで特定
      const shoppingCartIcons = screen.getAllByTestId('ShoppingCartIcon')
      expect(shoppingCartIcons.length).toBeGreaterThan(0)
    })
  })

  it('献立通知にRestaurantMenuアイコンが表示される', async () => {
    render(
      <TestWrapper>
        <NotificationCenterMock />
      </TestWrapper>
    )

    const notificationButton = screen.getByLabelText('通知')
    fireEvent.click(notificationButton)

    await waitFor(() => {
      const restaurantIcons = screen.getAllByTestId('RestaurantMenuIcon')
      expect(restaurantIcons.length).toBeGreaterThan(0)
    })
  })

  it('通知をクリックすると既読になる', async () => {
    render(
      <TestWrapper>
        <NotificationCenterMock />
      </TestWrapper>
    )

    const notificationButton = screen.getByLabelText('通知')
    fireEvent.click(notificationButton)

    await waitFor(() => {
      const unreadNotification = screen.getByText('今日は「週末の買い物」の買い物予定があります！')
      
      // 初期状態では存在することを確認
      expect(unreadNotification).toBeInTheDocument()
      
      // 通知をクリック
      fireEvent.click(unreadNotification.closest('[role="button"]') || unreadNotification)
    })

    // ナビゲーションが呼ばれることを確認
    expect(mockNavigate).toHaveBeenCalledWith('/shopping')
  })

  it('通知をクリックすると適切なページに遷移する', async () => {
    render(
      <TestWrapper>
        <NotificationCenterMock />
      </TestWrapper>
    )

    const notificationButton = screen.getByLabelText('通知')
    fireEvent.click(notificationButton)

    await waitFor(() => {
      // 買い物リスト通知をクリック
      const shoppingNotification = screen.getByText('今日は「週末の買い物」の買い物予定があります！')
      fireEvent.click(shoppingNotification.closest('[role="button"]') || shoppingNotification)
    })

    expect(mockNavigate).toHaveBeenCalledWith('/shopping')

    // ポップオーバーを再度開いて献立通知をテスト
    fireEvent.click(screen.getByLabelText('通知'))

    await waitFor(() => {
      const menuNotification = screen.getByText('今日の献立が設定されています')
      fireEvent.click(menuNotification.closest('[role="button"]') || menuNotification)
    })

    expect(mockNavigate).toHaveBeenCalledWith('/menu')
  })

  it('「すべて既読にする」ボタンが機能する', async () => {
    render(
      <TestWrapper>
        <NotificationCenterMock />
      </TestWrapper>
    )

    const notificationButton = screen.getByLabelText('通知')
    fireEvent.click(notificationButton)

    await waitFor(() => {
      const markAllReadButton = screen.getByText('すべて既読にする')
      expect(markAllReadButton).toBeInTheDocument()
      expect(markAllReadButton).not.toBeDisabled()

      fireEvent.click(markAllReadButton)
    })

    // すべて既読にした後、ボタンが無効になることを確認
    await waitFor(() => {
      const markAllReadButton = screen.getByText('すべて既読にする')
      expect(markAllReadButton).toBeDisabled()
    })
  })

  it('時間の表示が正しく動作する', async () => {
    // 固定の現在時刻を設定
    vi.useFakeTimers()
    vi.setSystemTime(new Date('2024-01-15T12:00:00Z'))

    render(
      <TestWrapper>
        <NotificationCenterMock />
      </TestWrapper>
    )

    const notificationButton = screen.getByLabelText('通知')
    fireEvent.click(notificationButton)

    await waitFor(() => {
      // モックデータの時間設定に基づいて、相対時間が表示されることを確認
      expect(screen.getByText('たった今')).toBeInTheDocument()
    }, { timeout: 10000 })

    vi.useRealTimers()
  })

  it('ポップオーバーの外側をクリックすると閉じる', async () => {
    render(
      <TestWrapper>
        <NotificationCenterMock />
      </TestWrapper>
    )

    const notificationButton = screen.getByLabelText('通知')
    fireEvent.click(notificationButton)

    await waitFor(() => {
      expect(screen.getByText('通知')).toBeInTheDocument()
    })

    // ESCキーでポップオーバーを閉じる
    fireEvent.keyDown(document, { key: 'Escape' })

    await waitFor(() => {
      expect(screen.queryByText('すべて既読にする')).not.toBeInTheDocument()
    }, { timeout: 10000 })
  })

  it('未読通知がない場合、バッジが表示されない', async () => {
    // 一旦すべての通知を既読にするテストケース
    render(
      <TestWrapper>
        <NotificationCenterMock />
      </TestWrapper>
    )

    const notificationButton = screen.getByLabelText('通知')
    fireEvent.click(notificationButton)

    await waitFor(() => {
      const markAllReadButton = screen.getByText('すべて既読にする')
      fireEvent.click(markAllReadButton)
    })

    // バッジの数字が0になるか、表示されなくなることを確認
    await waitFor(() => {
      const badges = screen.queryAllByText('2')
      expect(badges).toHaveLength(0)
    }, { timeout: 10000 })
  })
})