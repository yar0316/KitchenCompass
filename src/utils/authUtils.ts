import { getCurrentUser, AuthUser } from 'aws-amplify/auth';

/**
 * 認証関連のユーティリティ関数
 */

/**
 * 現在のユーザー情報を取得
 * @returns AuthUser | null
 */
export const getCurrentUserInfo = async (): Promise<AuthUser | null> => {
  try {
    const user = await getCurrentUser();
    return user;
  } catch (error) {
    console.log('No authenticated user:', error);
    return null;
  }
};

/**
 * ユーザーIDを取得
 * @returns string | null
 */
export const getCurrentUserId = async (): Promise<string | null> => {
  try {
    const user = await getCurrentUser();
    return user.userId;
  } catch (error) {
    console.log('No authenticated user:', error);
    return null;
  }
};

/**
 * ユーザーのメールアドレスを取得
 * @returns string | null
 */
export const getCurrentUserEmail = async (): Promise<string | null> => {
  try {
    const user = await getCurrentUser();
    return user.signInDetails?.loginId || null;
  } catch (error) {
    console.log('No authenticated user:', error);
    return null;
  }
};
