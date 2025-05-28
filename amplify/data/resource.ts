import { type ClientSchema, a, defineData } from '@aws-amplify/backend';

/**
 * KitchenCompassアプリケーション用データモデル
 * 要件定義に基づいて以下のモデルを実装:
 * - UserProfile: ユーザープロフィール情報
 * - Recipe: レシピ情報
 * - Menu: 献立情報
 * - ShoppingList: 買い物リスト
 * - ShoppingItem: 買い物アイテム
 */
const schema = a.schema({  // ユーザープロフィール
  UserProfile: a
    .model({
      userId: a.string().required(),
      givenName: a.string().required(),
      familyName: a.string().required(),
      preferredCuisine: a.string(),
      
      // プロフィール情報を拡張
      email: a.string().required(), // メールアドレス
      profileImageKey: a.string(), // プロフィール画像のストレージキー
      bio: a.string(), // 自己紹介文
      location: a.string(), // 地域
      dietaryRestrictions: a.string(), // 食事制限（アレルギーなど）
      cookingExperience: a.enum(['BEGINNER', 'INTERMEDIATE', 'ADVANCED']), // 料理経験レベル
      
      // 設定情報 - ネストされた構造はオブジェクトとして定義
      preferences: a.json(), // JSON形式としてシリアライズされた設定情報
      
      // ユーザー統計情報
      recipesCreatedCount: a.integer().default(0), // 作成したレシピ数
      favoriteCuisines: a.string().array(), // 好きな料理ジャンル（配列）
      
      // リレーション：お気に入りレシピ（後で追加）
      // favoriteRecipes: a.hasMany('UserRecipeFavorite', 'userId'),
    })
    .authorization((allow) => allow.owner()),  // レシピ情報
  Recipe: a
    .model({
      // 基本情報
      name: a.string().required(),
      description: a.string(),
      prepTime: a.integer(), // 準備時間（分）
      cookTime: a.integer(), // 調理時間（分）
      servings: a.integer().required(), // 人数
      
      // 詳細情報
      category: a.string(), // 料理カテゴリ
      cuisine: a.string(), // 料理の種類
      imageUrl: a.string(), // レシピ画像URL
      externalUrl: a.string(), // 外部レシピURL
      rating: a.integer(), // 評価（1-5）
      notes: a.string(), // メモ
      favorite: a.boolean().default(false), // お気に入り
      
      // カスタム型 - JSON文字列として保存
      ingredientsJson: a.json(), // JSON形式の材料情報
      instructionsJson: a.json(), // JSON形式の手順情報
      
      // 調理器具 - カンマ区切り文字列として保存
      cookwareNeeded: a.string(), // カンマ区切りの文字列
      
      // 作成者
      createdBy: a.string(),
      // 所有者（認証用）
      owner: a.string(),
      
      // MenuItem との関連付け
      menuItems: a.hasMany('MenuItem', 'recipeId'),
    })
    .authorization((allow) => [
      allow.owner()
    ]),  // 献立情報
  Menu: a
    .model({
      date: a.datetime().required(), // 日付
      notes: a.string(), // メモ
      owner: a.string(),
      
      // 献立項目（リスト型） - 修正：hasMany構文
      menuItems: a.hasMany('MenuItem', 'menuId'),
    })
    .authorization((allow) => allow.owner()),  // 献立項目
  MenuItem: a
    .model({
      // 基本情報
      name: a.string(), // メニュー項目の名前を追加
      mealType: a.string().required(), // 朝食、昼食、夕食など
      isOutside: a.boolean().default(false), // 外食かどうか
      outsideLocation: a.string(), // 外食先
      notes: a.string(), // メモ

      // リレーションキー
      menuId: a.string().required(),
      
      // リレーション - 修正：belongsTo構文
      menu: a.belongsTo('Menu', 'menuId'),
      
      // レシピ関連
      recipeId: a.string(), // レシピID（任意）
      recipe: a.belongsTo('Recipe', 'recipeId'), // Recipeモデルとの関連付け
    })
    .authorization((allow) => allow.owner()),  // 買い物リスト
  ShoppingList: a
    .model({
      // 基本情報
      name: a.string().required(),
      description: a.string(),
      dueDate: a.datetime(), // 買い物予定日
      isCompleted: a.boolean().default(false),
      owner: a.string(),
      
      // リレーション - 修正：hasMany構文
      items: a.hasMany('ShoppingItem', 'shoppingListId'),
    })
    .authorization((allow) => allow.owner()),  // 買い物アイテム
  ShoppingItem: a
    .model({
      // 基本情報
      name: a.string().required(),
      amount: a.float(),
      unit: a.string(),
      category: a.string(), // 野菜、肉、調味料など
      isChecked: a.boolean().default(false),
      notes: a.string(),
      
      // リレーション - 修正：belongsTo構文
      shoppingListId: a.string().required(),
      shoppingList: a.belongsTo('ShoppingList', 'shoppingListId'),
      sourceRecipe: a.string(), // どのレシピから追加されたか
    })
    .authorization((allow) => allow.owner()),  // 献立テンプレート（要件2.1.3）
  MenuTemplate: a
    .model({
      // 基本情報
      name: a.string().required(),
      description: a.string(),
      owner: a.string(),
      
      // テンプレート内容 - JSON文字列として保存
      templateItemsJson: a.json(), // JSON形式テンプレート項目
    })
    .authorization((allow) => allow.owner()),
});

export type Schema = ClientSchema<typeof schema>;

export const data = defineData({
  schema,
  authorizationModes: {
    defaultAuthorizationMode: 'userPool',
    // API Keyモードを削除し、User Pool認証のみに変更
  },
});
