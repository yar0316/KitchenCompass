// filepath: c:\Users\yutar\workspace\KitchenCompass\amplify\storage\resource.ts
import { defineStorage } from '@aws-amplify/backend';

/**
 * KitchenCompassアプリケーション用ストレージ設定
 * レシピ画像などを保存するためのS3バケットを設定
 * @see https://docs.amplify.aws/gen2/build-a-backend/storage/
 */
export const storage = defineStorage({
  // ストレージ名
  name: 'kitchencompassstorage',
  
  // アクセス制御
  access: {
    // 認証済みユーザー
    authenticated: {
      // 自分の投稿画像に対するフルアクセス
      myImages: {
        bucketKeyPattern: '{user}/{filename}',
        operations: ['read', 'write']
      },
      // レシピ画像の閲覧
      recipeImages: {
        bucketKeyPattern: 'recipes/*',
        operations: ['read']
      }
    },
    
    // 未認証ユーザー
    unauthenticated: {
      // パブリックコンテンツの閲覧のみ許可
      publicImages: {
        bucketKeyPattern: 'public/*',
        operations: ['read']
      }
    }
  }
});
