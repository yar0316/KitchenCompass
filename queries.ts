/* tslint:disable */
/* eslint-disable */
// this is an auto generated file. This will be overwritten

import * as APITypes from "./API";
type GeneratedQuery<InputType, OutputType> = string & {
  __generatedQueryInput: InputType;
  __generatedQueryOutput: OutputType;
};

export const getMenu = /* GraphQL */ `query GetMenu($id: ID!) {
  getMenu(id: $id) {
    createdAt
    date
    id
    menuItems {
      nextToken
      __typename
    }
    notes
    owner
    updatedAt
    __typename
  }
}
` as GeneratedQuery<APITypes.GetMenuQueryVariables, APITypes.GetMenuQuery>;
export const getMenuItem = /* GraphQL */ `query GetMenuItem($id: ID!) {
  getMenuItem(id: $id) {
    createdAt
    id
    isOutside
    mealType
    menu {
      createdAt
      date
      id
      notes
      owner
      updatedAt
      __typename
    }
    menuId
    name
    notes
    outsideLocation
    recipe {
      category
      cookTime
      cookwareNeeded
      createdAt
      createdBy
      cuisine
      description
      externalUrl
      favorite
      id
      imageUrl
      ingredientsJson
      instructionsJson
      name
      notes
      owner
      prepTime
      rating
      servings
      updatedAt
      __typename
    }
    recipeId
    updatedAt
    __typename
  }
}
` as GeneratedQuery<
  APITypes.GetMenuItemQueryVariables,
  APITypes.GetMenuItemQuery
>;
export const getMenuTemplate = /* GraphQL */ `query GetMenuTemplate($id: ID!) {
  getMenuTemplate(id: $id) {
    createdAt
    description
    id
    name
    owner
    templateItemsJson
    updatedAt
    __typename
  }
}
` as GeneratedQuery<
  APITypes.GetMenuTemplateQueryVariables,
  APITypes.GetMenuTemplateQuery
>;
export const getRecipe = /* GraphQL */ `query GetRecipe($id: ID!) {
  getRecipe(id: $id) {
    category
    cookTime
    cookwareNeeded
    createdAt
    createdBy
    cuisine
    description
    externalUrl
    favorite
    id
    imageUrl
    ingredientsJson
    instructionsJson
    menuItems {
      nextToken
      __typename
    }
    name
    notes
    owner
    prepTime
    rating
    servings
    updatedAt
    __typename
  }
}
` as GeneratedQuery<APITypes.GetRecipeQueryVariables, APITypes.GetRecipeQuery>;
export const getShoppingItem = /* GraphQL */ `query GetShoppingItem($id: ID!) {
  getShoppingItem(id: $id) {
    amount
    category
    createdAt
    id
    isChecked
    name
    notes
    shoppingList {
      createdAt
      description
      dueDate
      id
      isCompleted
      name
      owner
      updatedAt
      __typename
    }
    shoppingListId
    sourceRecipe
    unit
    updatedAt
    __typename
  }
}
` as GeneratedQuery<
  APITypes.GetShoppingItemQueryVariables,
  APITypes.GetShoppingItemQuery
>;
export const getShoppingList = /* GraphQL */ `query GetShoppingList($id: ID!) {
  getShoppingList(id: $id) {
    createdAt
    description
    dueDate
    id
    isCompleted
    items {
      nextToken
      __typename
    }
    name
    owner
    updatedAt
    __typename
  }
}
` as GeneratedQuery<
  APITypes.GetShoppingListQueryVariables,
  APITypes.GetShoppingListQuery
>;
export const getUserProfile = /* GraphQL */ `query GetUserProfile($id: ID!) {
  getUserProfile(id: $id) {
    bio
    cookingExperience
    createdAt
    dietaryRestrictions
    email
    familyName
    favoriteCuisines
    givenName
    id
    location
    preferences
    preferredCuisine
    profileImageKey
    recipesCreatedCount
    updatedAt
    userId
    __typename
  }
}
` as GeneratedQuery<
  APITypes.GetUserProfileQueryVariables,
  APITypes.GetUserProfileQuery
>;
export const listMenuItems = /* GraphQL */ `query ListMenuItems(
  $filter: ModelMenuItemFilterInput
  $limit: Int
  $nextToken: String
) {
  listMenuItems(filter: $filter, limit: $limit, nextToken: $nextToken) {
    items {
      createdAt
      id
      isOutside
      mealType
      menuId
      name
      notes
      outsideLocation
      recipeId
      updatedAt
      __typename
    }
    nextToken
    __typename
  }
}
` as GeneratedQuery<
  APITypes.ListMenuItemsQueryVariables,
  APITypes.ListMenuItemsQuery
>;
export const listMenuTemplates = /* GraphQL */ `query ListMenuTemplates(
  $filter: ModelMenuTemplateFilterInput
  $limit: Int
  $nextToken: String
) {
  listMenuTemplates(filter: $filter, limit: $limit, nextToken: $nextToken) {
    items {
      createdAt
      description
      id
      name
      owner
      templateItemsJson
      updatedAt
      __typename
    }
    nextToken
    __typename
  }
}
` as GeneratedQuery<
  APITypes.ListMenuTemplatesQueryVariables,
  APITypes.ListMenuTemplatesQuery
>;
export const listMenus = /* GraphQL */ `query ListMenus(
  $filter: ModelMenuFilterInput
  $limit: Int
  $nextToken: String
) {
  listMenus(filter: $filter, limit: $limit, nextToken: $nextToken) {
    items {
      createdAt
      date
      id
      notes
      owner
      updatedAt
      __typename
    }
    nextToken
    __typename
  }
}
` as GeneratedQuery<APITypes.ListMenusQueryVariables, APITypes.ListMenusQuery>;
export const listRecipes = /* GraphQL */ `query ListRecipes(
  $filter: ModelRecipeFilterInput
  $limit: Int
  $nextToken: String
) {
  listRecipes(filter: $filter, limit: $limit, nextToken: $nextToken) {
    items {
      category
      cookTime
      cookwareNeeded
      createdAt
      createdBy
      cuisine
      description
      externalUrl
      favorite
      id
      imageUrl
      ingredientsJson
      instructionsJson
      name
      notes
      owner
      prepTime
      rating
      servings
      updatedAt
      __typename
    }
    nextToken
    __typename
  }
}
` as GeneratedQuery<
  APITypes.ListRecipesQueryVariables,
  APITypes.ListRecipesQuery
>;
export const listShoppingItems = /* GraphQL */ `query ListShoppingItems(
  $filter: ModelShoppingItemFilterInput
  $limit: Int
  $nextToken: String
) {
  listShoppingItems(filter: $filter, limit: $limit, nextToken: $nextToken) {
    items {
      amount
      category
      createdAt
      id
      isChecked
      name
      notes
      shoppingListId
      sourceRecipe
      unit
      updatedAt
      __typename
    }
    nextToken
    __typename
  }
}
` as GeneratedQuery<
  APITypes.ListShoppingItemsQueryVariables,
  APITypes.ListShoppingItemsQuery
>;
export const listShoppingLists = /* GraphQL */ `query ListShoppingLists(
  $filter: ModelShoppingListFilterInput
  $limit: Int
  $nextToken: String
) {
  listShoppingLists(filter: $filter, limit: $limit, nextToken: $nextToken) {
    items {
      createdAt
      description
      dueDate
      id
      isCompleted
      name
      owner
      updatedAt
      __typename
    }
    nextToken
    __typename
  }
}
` as GeneratedQuery<
  APITypes.ListShoppingListsQueryVariables,
  APITypes.ListShoppingListsQuery
>;
export const listUserProfiles = /* GraphQL */ `query ListUserProfiles(
  $filter: ModelUserProfileFilterInput
  $limit: Int
  $nextToken: String
) {
  listUserProfiles(filter: $filter, limit: $limit, nextToken: $nextToken) {
    items {
      bio
      cookingExperience
      createdAt
      dietaryRestrictions
      email
      familyName
      favoriteCuisines
      givenName
      id
      location
      preferences
      preferredCuisine
      profileImageKey
      recipesCreatedCount
      updatedAt
      userId
      __typename
    }
    nextToken
    __typename
  }
}
` as GeneratedQuery<
  APITypes.ListUserProfilesQueryVariables,
  APITypes.ListUserProfilesQuery
>;
