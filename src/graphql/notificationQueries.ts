// NotificationMessage related GraphQL queries, mutations, and subscriptions

export const listNotificationsByOwnerAndCreatedAt = /* GraphQL */ `
  query ListNotificationsByOwnerAndCreatedAt(
    $owner: String!
    $createdAt: ModelStringKeyConditionInput
    $sortDirection: ModelSortDirection
    $filter: ModelNotificationMessageFilterInput
    $limit: Int
    $nextToken: String
  ) {
    notificationsByOwnerAndCreatedAt(
      owner: $owner
      createdAt: $createdAt
      sortDirection: $sortDirection
      filter: $filter
      limit: $limit
      nextToken: $nextToken
    ) {
      items {
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
      nextToken
    }
  }
`;

export const updateNotificationMessage = /* GraphQL */ `
  mutation UpdateNotificationMessage(
    $input: UpdateNotificationMessageInput!
    $condition: ModelNotificationMessageConditionInput
  ) {
    updateNotificationMessage(input: $input, condition: $condition) {
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

export const onCreateNotificationMessage = /* GraphQL */ `
  subscription OnCreateNotificationMessage(
    $filter: ModelSubscriptionNotificationMessageFilterInput
    $owner: String
  ) {
    onCreateNotificationMessage(filter: $filter, owner: $owner) {
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

export const onUpdateNotificationMessage = /* GraphQL */ `
  subscription OnUpdateNotificationMessage(
    $filter: ModelSubscriptionNotificationMessageFilterInput
    $owner: String
  ) {
    onUpdateNotificationMessage(filter: $filter, owner: $owner) {
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
