import { defineStorage } from '@aws-amplify/backend';

/**
 * KitchenCompassアプリケーション用ストレージ設定
 * レシピ画像、献立PDFなどを保存するためのS3バケットを設定
 * @see https://docs.amplify.aws/gen2/build-a-backend/storage/
 */
export const storage = defineStorage({
  // ストレージ名
  name: 'kitchencompassstorage',
  
  // アクセス制御 - 詳細なアクセス制御設定
  access: (allow) => ({
    // ユーザー固有のファイル（プロファイル画像など）
    '${user}/*': [
      allow.authenticated.to(['read', 'write', 'delete'])
    ],
    
    // レシピ画像 - オーナーは全操作可能、他の認証ユーザーは閲覧のみ
    'recipes/{entity_id}/*': [
      allow.entity('identity').to(['read', 'write', 'delete']),
      allow.authenticated.to(['read'])
    ],

    // 献立PDFやエクスポートファイル - オーナー専用
    'menus/{entity_id}/*': [
      allow.entity('identity').to(['read', 'write', 'delete'])
    ],

    // 買い物リスト関連ファイル - オーナー専用
    'shopping/{entity_id}/*': [
      allow.entity('identity').to(['read', 'write', 'delete'])
    ],
    
    // パブリックコンテンツ（アプリロゴや共通アセットなど）
    'public/*': [
      allow.guest.to(['read'])
    ]
  })
});
