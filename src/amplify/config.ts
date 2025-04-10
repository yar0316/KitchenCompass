// filepath: c:\Users\yutar\workspace\KitchenCompass\src\amplify\config.ts
import { Amplify } from 'aws-amplify';
import amplifyconfig from '../../amplify_outputs.json';

/**
 * Amplifyクライアント設定
 * バックエンドリソースとの連携設定
 * @see https://docs.amplify.aws/gen2/build-a-backend/
 */
// Amplify全体の設定
Amplify.configure(amplifyconfig);

// Amplify設定をエクスポート（他のコンポーネントで利用可能に）
export { amplifyconfig };