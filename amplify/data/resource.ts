import { type ClientSchema, a, defineData } from '@aws-amplify/backend';
import { auth } from '../auth/resource';

/**
 * KitchenCompassアプリケーション用データモデル
 * 要件定義に基づいて以下のモデルを実装:
 * - UserProfile: ユーザープロフィール情報
 * - Recipe: レシピ情報
 * - Menu: 献立情報
 * - ShoppingList: 買い物リスト
 * - ShoppingItem: 買い物アイテム
 */
const schema = a.schema({
  // ユーザープロフィール
  UserProfile: a
    .model({
      userId: a.string().required(),
      givenName: a.string().required(),
      familyName: a.string().required(),
      preferredCuisine: a.string(),
      
      // 設定情報
      preferences: a.field({
        allergies: a.string().list(),
        foodRestrictions: a.string().list(),
        favoriteCategories: a.string().list(),
      }),
    })
    .authorization((allow) => [
      allow.owner(), // 所有者のみアクセス可能
    ]),
    
  // レシピ情報
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
      
      // カスタム型
      ingredients: a.field({
        items: a.field({
          name: a.string().required(),
          amount: a.float().required(),
          unit: a.string().required(),
        }).list(),
      }),
      
      instructions: a.field({
        items: a.field({
          stepNumber: a.integer().required(),
          instruction: a.string().required(),
        }).list(),
      }),
      
      // 調理器具
      cookwareNeeded: a.string().list(),
      
      // 作成者
      createdBy: a.string(),
    })
    .authorization((allow) => [
      allow.owner(), // 所有者のみ編集可能
      allow.authenticated().to(['read']), // 認証済みユーザーは閲覧のみ可能
    ]),
    
  // 献立情報
  Menu: a
    .model({
      date: a.date().required(), // 日付
      notes: a.string(), // メモ
      owner: a.string(),
      
      // 献立項目（リスト型）
      menuItems: a.hasMany('MenuItem'),
    })
    .authorization((allow) => [
      allow.owner(), // 所有者のみアクセス可能
    ]),
    
  // 献立項目
  MenuItem: a
    .model({
      // 基本情報
      mealType: a.string().required(), // 朝食、昼食、夕食など
      isOutside: a.boolean().default(false), // 外食かどうか
      outsideLocation: a.string(), // 外食先
      notes: a.string(), // メモ
      
      // リレーション
      menu: a.belongsTo('Menu'),
      recipeId: a.string(), // レシピID
    })
    .authorization((allow) => [
      allow.owner(), // 所有者のみアクセス可能
    ]),
    
  // 買い物リスト
  ShoppingList: a
    .model({
      // 基本情報
      name: a.string().required(),
      description: a.string(),
      dueDate: a.date(), // 買い物予定日
      isCompleted: a.boolean().default(false),
      owner: a.string(),
      
      // リレーション
      items: a.hasMany('ShoppingItem'),
    })
    .authorization((allow) => [
      allow.owner(), // 所有者のみアクセス可能
    ]),
    
  // 買い物アイテム
  ShoppingItem: a
    .model({
      // 基本情報
      name: a.string().required(),
      amount: a.float(),
      unit: a.string(),
      category: a.string(), // 野菜、肉、調味料など
      isChecked: a.boolean().default(false),
      notes: a.string(),
      
      // リレーション
      shoppingList: a.belongsTo('ShoppingList'),
      sourceRecipe: a.string(), // どのレシピから追加されたか
    })
    .authorization((allow) => [
      allow.owner(), // 所有者のみアクセス可能
    ]),
    
  // 献立テンプレート（要件2.1.3）
  MenuTemplate: a
    .model({
      // 基本情報
      name: a.string().required(),
      description: a.string(),
      owner: a.string(),
      
      // テンプレート内容
      templateItems: a.field({
        items: a.field({
          dayOffset: a.integer().required(), // 何日目か
          mealType: a.string().required(), // 朝食、昼食、夕食など
          recipeId: a.string(), // レシピID（オプション）
          recipeName: a.string().required(), // レシピ名
          isOutside: a.boolean().default(false),
        }).list(),
      }),
    })
    .authorization((allow) => [
      allow.owner(), // 所有者のみアクセス可能
    ]),
});

export type Schema = ClientSchema<typeof schema>;

export const data = defineData({
  schema,
  authorizationModes: {
    defaultAuthorizationMode: 'userPool',
    userPoolConfig: {
      userPool: auth,
    },
  },
});
