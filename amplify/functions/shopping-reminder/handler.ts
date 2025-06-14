import type { Handler } from 'aws-lambda';
import { generateClient, type GraphQLResult } from 'aws-amplify/api';

// Constants
const NOTIFICATION_TYPE_SHOPPING_REMINDER = 'SHOPPING_REMINDER';
const NOTIFICATION_MESSAGE_TEMPLATE_SHOPPING_REMINDER = (title: string) => `今日の買い物リスト「${title}」の予定があります。`;

// Helper function to get today's date in JST (YYYY-MM-DD)
function getJstTodayDateString(): string {
  const now = new Date();
  const jstOffset = 9 * 60; // JST is UTC+9
  const jstNow = new Date(now.getTime() + (jstOffset + now.getTimezoneOffset()) * 60000);
  const year = jstNow.getFullYear();
  const month = (jstNow.getMonth() + 1).toString().padStart(2, '0');
  const day = jstNow.getDate().toString().padStart(2, '0');
  return `${year}-${month}-${day}`;
}

// Define the shape of your data items
interface ShoppingListItem {
  id: string;
  title: string;
  owner?: string | null;
  scheduledDate?: string | null;
  // other fields as defined in your schema...
}

interface UserProfile {
  id: string;
  owner?: string | null; // Assuming owner is the same as id for UserProfile linked to Cognito user
  notificationEnabled?: boolean | null;
  // other fields as defined in your schema...
}

// Data structure for listShoppingLists query response
interface ListShoppingListsData {
  listShoppingLists?: {
    items: (ShoppingListItem | null)[];
    nextToken?: string | null;
  } | null;
}

// Data structure for getUserProfile query response
interface GetUserProfileData {
  getUserProfile?: UserProfile | null;
}

// Data structure for createNotificationMessage mutation response
interface CreateNotificationMessageData {
  createNotificationMessage?: {
    id: string;
    // other fields from the response if needed
  } | null;
}

// Input type for creating a NotificationMessage
interface CreateNotificationMessageInput {
  owner: string;
  message: string;
  type: string;
  isRead: boolean;
  relatedItemId?: string;
  navigateTo?: string;
  expireAt: number; // Unix timestamp
}

// GraphQL Queries and Mutations (ensure these are correctly defined)
const listShoppingListsQuery = /* GraphQL */ `
  query ListShoppingLists(
    $filter: ModelShoppingListFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listShoppingLists(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
        id
        title
        owner
        scheduledDate
        # include other fields you need
      }
      nextToken
    }
  }
`;

const getUserProfileQuery = /* GraphQL */ `
  query GetUserProfile($id: ID!) {
    getUserProfile(id: $id) {
      id
      owner
      notificationEnabled
      # include other fields you need
    }
  }
`;

const createNotificationMessageMutation = /* GraphQL */ `
  mutation CreateNotificationMessage(
    $input: CreateNotificationMessageInput!
    $condition: ModelNotificationMessageConditionInput
  ) {
    createNotificationMessage(input: $input, condition: $condition) {
      id
      owner
      message
      type
      isRead
      relatedItemId
      navigateTo
      expireAt
      createdAt
      updatedAt
    }
  }
`;


export const handler: Handler = async (event) => {
  console.log('Shopping Reminder scheduler triggered:', event);
  const client = generateClient();

  try {
    const todayJst = getJstTodayDateString();
    console.log(`INFO: Checking shopping lists for date: ${todayJst}`);

    // Perform the GraphQL query for shopping lists
    const shoppingListPromise = client.graphql<ListShoppingListsData>({
      query: listShoppingListsQuery,
      variables: {
        filter: {
          scheduledDate: { eq: todayJst },
        },
      },
    });
    const shoppingListResult = await shoppingListPromise as GraphQLResult<ListShoppingListsData>; // Type assertion

    // Type guard to filter out null items and ensure correct type
    const shoppingLists = shoppingListResult.data?.listShoppingLists?.items?.filter(
        (item: ShoppingListItem | null): item is ShoppingListItem => item !== null
    );

    if (shoppingListResult.errors) {
      console.error('ERROR: GraphQL errors while fetching shopping lists:', JSON.stringify(shoppingListResult.errors, null, 2));
    }

    if (!shoppingLists || shoppingLists.length === 0) {
      console.log(`INFO: No shopping lists scheduled for ${todayJst}.`);
      return;
    }

    console.log(`INFO: Found ${shoppingLists.length} shopping list(s) for ${todayJst}.`);

    for (const list of shoppingLists) {
      if (!list.owner) {
        console.warn(`WARN: Shopping list ${list.id} has no owner. Skipping.`);
        continue;
      }
      const userId = list.owner;

      try {
        // Perform the GraphQL query for user profile
        const userProfilePromise = client.graphql<GetUserProfileData>({
          query: getUserProfileQuery,
          variables: { id: userId }, // Assuming UserProfile ID is the same as the owner ID from ShoppingList
        });
        const userProfileResult = await userProfilePromise as GraphQLResult<GetUserProfileData>; // Type assertion

        if (userProfileResult.errors) {
          console.error(`ERROR: GraphQL errors while fetching user profile for ${userId}:`, JSON.stringify(userProfileResult.errors, null, 2));
          continue;
        }
        
        const userProfile = userProfileResult.data?.getUserProfile;

        if (!userProfile) {
          console.warn(`WARN: User profile not found for owner ${userId} of shopping list ${list.id}. Skipping.`);
          continue;
        }

        if (userProfile.notificationEnabled === false) {
          console.log(`INFO: User ${userId} has notifications disabled. Skipping shopping list ${list.id}.`);
          continue;
        }

        const notificationMessage = NOTIFICATION_MESSAGE_TEMPLATE_SHOPPING_REMINDER(list.title);
        const sevenDaysFromNow = Math.floor((Date.now() / 1000) + (7 * 24 * 60 * 60));

        const notificationInput: CreateNotificationMessageInput = {
          owner: userId,
          message: notificationMessage,
          type: NOTIFICATION_TYPE_SHOPPING_REMINDER,
          isRead: false,
          relatedItemId: list.id,
          navigateTo: `/shopping-lists/${list.id}`, 
          expireAt: sevenDaysFromNow,
        };

        try {
          // Perform the GraphQL mutation to create notification message
          const createNotificationPromise = client.graphql<CreateNotificationMessageData>({
            query: createNotificationMessageMutation,
            variables: { input: notificationInput },
          });
          const createNotificationResult = await createNotificationPromise as GraphQLResult<CreateNotificationMessageData>; // Type assertion

          if (createNotificationResult.errors) {
            console.error(`ERROR: GraphQL errors while creating NotificationMessage for user ${userId}, list ${list.id}:`, JSON.stringify(createNotificationResult.errors, null, 2));
          } else {
            console.log(`INFO: NotificationMessage created for user ${userId} for shopping list ${list.id}. ID: ${createNotificationResult.data?.createNotificationMessage?.id}`);
          }
        } catch (cmError: any) {
          console.error(`ERROR: Failed to create NotificationMessage for user ${userId}, list ${list.id}:`, cmError.message || cmError);
        }

      } catch (upError: any) {
        console.error(`ERROR: Failed to process user profile or create notification for user ${userId}, list ${list.id}:`, upError.message || upError);
      }
    }
    console.log('INFO: Shopping Reminder scheduler finished successfully.');

  } catch (error: any) {
    console.error('ERROR: Shopping Reminder scheduler failed:', error.message || error, error.stack);
    // Consider re-throwing or specific error handling for Lambda to indicate failure
    // For example, throw error; to make the Lambda invocation fail.
  }
};
