# CLAUDE.md

必ず日本語で回答してください。
This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

KitchenCompass is a personal meal management system built with React + TypeScript + Material-UI frontend and AWS Amplify Gen2 backend. It helps users plan meals, manage recipes, and create shopping lists with integrated functionality between all components.

## Development Commands

### Frontend Development

- `npm run dev` - Start development server with Vite
- `npm run build` - Build for production (runs TypeScript check + Vite build)
- `npm run lint` - Run ESLint on codebase
- `npm run preview` - Preview production build locally

### Backend Development (Amplify)

- `npx ampx sandbox` - Start local development sandbox
- `npx ampx generate graphql-schema` - Generate GraphQL schema
- `npx ampx deploy` - Deploy to AWS

### Type Checking

TypeScriptの型チェックは以下で実行可能：

- `npx tsc --noEmit` - 型チェックのみ実行（出力ファイル生成なし）

## Conversation Guidelines

- 常に日本語で会話する

## コーディングの基本ルール

あなたは高度な問題解決能力を持つAIアシスタントです。以下の指示に従って、効率的かつ正確にタスクを遂行してください。

まず、ユーザーから受け取った指示を確認します。
この指示を元に、以下のプロセスに従って作業を進めてください：

---

1. 指示の分析と計画
   <タスク分析>
   - 主要なタスクを簡潔に要約してください。
   - 記載された技術スタックを確認し、その制約内での実装方法を検討してください。  
     **※ 技術スタックに記載のバージョンは変更せず、必要があれば必ず承認を得てください。**
   - 重要な要件と制約を特定してください。
   - 潜在的な課題をリストアップしてください。
   - タスク実行のための具体的なステップを詳細に列挙してください。
   - それらのステップの最適な実行順序を決定してください。

   ### 重複実装の防止

   実装前に以下の確認を行ってください：
   - 既存の類似機能の有無
   - 同名または類似名の関数やコンポーネント
   - 重複するAPIエンドポイント
   - 共通化可能な処理の特定

   このセクションは、後続のプロセス全体を導くものなので、時間をかけてでも、十分に詳細かつ包括的な分析を行ってください。
   </タスク分析>

---

2. タスクの実行
   - 特定したステップを一つずつ実行してください。
   - 各ステップの完了後、簡潔に進捗を報告してください。
   - 実装時は以下の点に注意してください：
     - 適切なディレクトリ構造の遵守
     - 命名規則の一貫性維持
     - 共通処理の適切な配置
   - ターミナル利用時は以下の点に注意してください：
     - Windowsシステムを利用する前提でコマンドを作成してください。
     - 以前の作業を確認し、何度もローカルの開発サーバーを起動しないように注意してください。

---

1. 品質管理と問題対応
   - 各タスクの実行結果を迅速に検証してください。
   - エラーや不整合が発生した場合は、以下のプロセスで対応してください：
     a. 問題の切り分けと原因特定（ログ分析、デバッグ情報の確認）
     b. 対策案の作成と実施
     c. 修正後の動作検証
     d. デバッグログの確認と分析

   - 検証結果は以下の形式で記録してください：
     a. 検証項目と期待される結果
     b. 実際の結果と差異
     c. 必要な対応策（該当する場合）

---

4. 最終確認
   - すべてのタスクが完了したら、成果物全体を評価してください。
   - 当初の指示内容との整合性を確認し、必要に応じて調整を行ってください。
   - 実装した機能に重複がないことを最終確認してください。

---

5. 結果報告
   以下のフォーマットで最終的な結果を報告してください：

   ```markdown
   # 実行結果報告

   ## 概要
   [全体の要約を簡潔に記述]

   ## 実行ステップ
   1. [ステップ1の説明と結果]
   2. [ステップ2の説明と結果]
   ...

   ## 最終成果物
   [成果物の詳細や、該当する場合はリンクなど]

   ## 課題対応（該当する場合）
   - 発生した問題と対応内容
   - 今後の注意点

   ## 注意点・改善提案
   - [気づいた点や改善提案があれば記述]
   ```

---

## 重要な注意事項

- 不明点がある場合は、作業開始前に必ず確認を取ってください。
- 重要な判断が必要な場合は、その都度報告し、承認を得てください。
- 予期せぬ問題が発生した場合は、即座に報告し、対応策を提案してください。
- **明示的に指示されていない変更は行わないでください。** 必要と思われる変更がある場合は、まず提案として報告し、承認を得てから実施してください。
- **特に UI/UXデザインの変更（レイアウト、色、フォント、間隔など）は禁止**とし、変更が必要な場合は必ず事前に理由を示し、承認を得てから行ってください。
- **技術スタックに記載のバージョン（APIやフレームワーク、ライブラリ等）を勝手に変更しないでください。** 変更が必要な場合は、その理由を明確にして承認を得るまでは変更を行わないでください。
- 使用するフレームワークやツールで **自動生成されるファイルがまだなくても、作成する必要はありません。** 必要と思われる変更がある場合は、まず提案として報告し、承認を得てから実施してください。

## Development Philosophy

### Test-Driven Development (TDD)

- 原則としてテスト駆動開発（TDD）で進める
- 期待される入出力に基づき、まずテストを作成する
- 実装コードは書かず、テストのみを用意する
- テストを実行し、失敗を確認する
- テストが正しいことを確認できた段階でコミットする
- その後、テストをパスさせる実装を進める
- 実装中はテストを変更せず、コードを修正し続ける
- すべてのテストが通過するまで繰り返す

## Architecture

### Frontend Structure

- **React 19** with **TypeScript** and **Vite** build tool
- **Material-UI (MUI) v7** for UI components with custom theming
- **React Router DOM v7** for client-side routing
- **AWS Amplify** for backend integration and authentication

### Key Frontend Patterns

- **AuthWrapper** component handles authentication state and wraps the entire app
- **Layout** component provides consistent navigation and theming across all pages
- **Responsive design** using MUI breakpoints (mobile-first approach)
- **Theme system** supports light/dark mode switching
- **Component-based architecture** with clear separation of concerns

### Backend Architecture (AWS Amplify Gen2)

- **Authentication**: Amazon Cognito user pools with owner-based authorization
- **Data**: GraphQL API with DynamoDB backend using AWS AppSync
- **Storage**: Amazon S3 for file storage (recipe images, profile pictures)
- **Infrastructure as Code**: CDK-based resource definitions

### Data Model Relationships

- **UserProfile**: User settings and profile information
- **Recipe**: Individual recipes with ingredients (JSON), instructions (JSON), and metadata
- **Menu**: Daily meal plans with hasMany MenuItems
- **MenuItem**: Individual meal entries (breakfast/lunch/dinner) with belongsTo Menu and optional Recipe
- **ShoppingList**: Shopping lists with hasMany ShoppingItems
- **ShoppingItem**: Individual shopping items with belongsTo ShoppingList
- **MenuTemplate**: Reusable meal plan templates

### Key Components Structure

```
src/
├── components/
│   ├── auth/           # Authentication components
│   ├── dashboard/      # Main dashboard
│   ├── layout/         # Navigation and layout components
│   ├── menu/           # Meal planning components
│   ├── recipe/         # Recipe management
│   ├── shopping/       # Shopping list management
│   ├── profile/        # User profile
│   └── settings/       # App settings
├── routes/             # React Router configuration
├── theme/              # MUI theme configuration
├── graphql/            # GraphQL queries and mutations
└── utils/              # Utility functions
```

## Key Development Patterns

### Component Organization

- Each feature has its own folder with related components
- Custom hooks are placed in `hooks/` subfolders
- Types are defined in `types/` subfolders
- Utilities are in `utils/` subfolders within each feature

### Authentication

- All data operations require authentication (owner-based authorization)
- `AuthWrapper` component handles auth state and provides fallback UI
- Use `useAuthenticator` hook from `@aws-amplify/ui-react` for auth operations

### State Management

- React hooks for local component state
- Amplify DataStore for backend data synchronization
- No external state management library (Redux, Zustand) is used

### GraphQL Integration

- Auto-generated GraphQL schema from Amplify data models
- Use `generateClient` from `aws-amplify/data` for API operations
- Queries and mutations are defined in `src/graphql/`

### Styling Approach

- Material-UI components with custom theme
- Use `sx` prop for component-specific styling
- Theme supports both light and dark modes
- Responsive design using MUI's breakpoint system

## Testing

No specific test framework is currently configured in the project. When adding tests, follow the project's existing patterns and consider using Vitest (Vite's test runner) or Jest.

## Important Technical Notes

### Data Storage

- Complex data types (ingredients, instructions) are stored as JSON in DynamoDB
- Images are stored in S3 with keys referenced in the data models
- User data is isolated using Cognito owner-based authorization

### Internationalization

- The codebase contains Japanese comments and some Japanese text in the requirements
- UI text should be considered for internationalization in the future

### Deployment

- Frontend deploys through Amplify hosting
- Backend resources are managed through CDK/Amplify Gen2
- All AWS resources are defined in the `amplify/` directory
