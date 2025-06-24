# テスト戦略とガイド

このドキュメントでは、shopping-list-notification機能のテスト戦略と実行方法について説明します。

## テスト構成

### 1. テストフレームワーク

- **Vitest**: Viteプロジェクトに最適化されたテストフレームワーク
- **React Testing Library**: Reactコンポーネントのテスト
- **Jest DOM**: カスタムマッチャー

### 2. 必要な依存関係

依存関係のインストールが必要な場合は、以下を実行してください：

```bash
npm install --save-dev vitest @vitest/ui @testing-library/react @testing-library/jest-dom @testing-library/user-event jsdom
```

## テストファイル構成

```
amplify/functions/shopping-list-notification/
├── handler.ts                     # Lambda関数の実装
└── handler.test.ts                # Lambda関数のユニットテスト

src/components/notifications/
├── NotificationCenter.tsx          # 実際の通知センター
├── NotificationCenter.test.tsx     # 通知センターのユニットテスト
├── NotificationCenter.mock.tsx     # モック版通知センター
└── NotificationCenter.mock.test.tsx # モック版のテスト

src/types/
├── notifications.ts               # 型定義
└── notifications.test.ts          # 型定義のテスト

src/test/
├── setup.ts                       # テストセットアップ
└── shopping-list-notification.integration.test.ts # 統合テスト
```

## テスト実行方法

### 基本的なテスト実行

```bash
# 全テストを実行
npm run test

# ウォッチモードでテスト実行
npm run test -- --watch

# 特定のファイルのテストを実行
npm run test handler.test.ts

# UI付きでテスト実行
npm run test:ui
```

### カバレッジレポート

```bash
# カバレッジ付きでテスト実行
npm run test:coverage
```

カバレッジレポートは以下の形式で生成されます：

- テキスト形式（ターミナル出力）
- HTML形式（coverage/index.html）
- JSON形式（coverage/coverage.json）

## テストカテゴリ

### 1. Lambda関数テスト (handler.test.ts)

**テスト対象:**

- 当日の買い物リストフィルタリング
- ユーザーごとの通知生成
- メッセージ形式の正確性
- エラーハンドリング
- 環境変数の検証
- DynamoDB操作のモック

**カバレッジ目標:** 90%以上

### 2. Reactコンポーネントテスト

#### NotificationCenter.test.tsx

- GraphQL API連携
- 認証処理
- 既読/未読管理
- ナビゲーション機能

#### NotificationCenter.mock.test.tsx

- UI表示の正確性
- ユーザーインタラクション
- 状態管理
- アクセシビリティ

**カバレッジ目標:** 85%以上

### 3. 型定義テスト (notifications.test.ts)

**テスト対象:**

- 型の正確性
- 必須/オプションフィールド
- 型制約の検証

### 4. 統合テスト (shopping-list-notification.integration.test.ts)

**テスト対象:**

- データフローの整合性
- システム間の連携
- エンドツーエンドの動作確認
- パフォーマンス要件
- ユーザーエクスペリエンス

## テスト品質指標

### カバレッジ目標

- **関数カバレッジ**: 90%以上
- **行カバレッジ**: 85%以上
- **分岐カバレッジ**: 80%以上

### テストの種類別配分

- **ユニットテスト**: 70%
- **統合テスト**: 20%
- **エンドツーエンドテスト**: 10%

## モッキング戦略

### AWS SDK のモック

```typescript
vi.mock('@aws-sdk/client-dynamodb', () => ({
  DynamoDBClient: vi.fn(() => ({}))
}))
```

### Amplify API のモック

```typescript
vi.mock('aws-amplify/api', () => ({
  generateClient: () => mockClient
}))
```

### React Router のモック

```typescript
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom')
  return {
    ...actual,
    useNavigate: () => mockNavigate
  }
})
```

## 継続的インテグレーション

### GitHub Actions設定例

```yaml
name: Test

on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      - run: npm ci
      - run: npm run test:coverage
      - uses: codecov/codecov-action@v3
```

## トラブルシューティング

### よくある問題

1. **DynamoDB モックエラー**
   - AWS SDK のバージョン確認
   - モックの設定確認

2. **React Testing Library エラー**
   - setup.ts の読み込み確認
   - ThemeProvider の設定確認

3. **TypeScript エラー**
   - 型定義ファイルの確認
   - vitest/globals の設定確認

### デバッグ方法

```bash
# デバッグモードでテスト実行
npm run test -- --reporter=verbose

# 特定のテストのみ実行
npm run test -- --grep "特定のテスト名"

# ファイル変更時の自動実行停止
npm run test -- --run
```

## テストデータ管理

### モックデータの場所

- Lambda関数: `handler.test.ts` 内
- React コンポーネント: 各テストファイル内
- 統合テスト: `integration.test.ts` 内

### データの一貫性

- 同じ構造のモックデータを使用
- 実際のAPIレスポンス形式に準拠
- 日時データは固定値を使用

## パフォーマンステスト

### テスト実行時間の目標

- 全テスト: 30秒以内
- ユニットテスト: 10秒以内
- 統合テスト: 20秒以内

### 最適化のヒント

- 不要なモックを避ける
- テストデータを最小限に
- 並列実行の活用

---

このテスト戦略に従って、高品質で保守性の高いテストスイートを構築し、機能の信頼性を確保してください。
