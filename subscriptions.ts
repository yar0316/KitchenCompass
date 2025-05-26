/* tslint:disable */
/* eslint-disable */
// this is an auto generated file. This will be overwritten

import * as APITypes from "./API";
type GeneratedSubscription<InputType, OutputType> = string & {
  __generatedSubscriptionInput: InputType;
  __generatedSubscriptionOutput: OutputType;
};

export const onCreateMenu = /* GraphQL */ `subscription OnCreateMenu($filter: ModelSubscriptionMenuFilterInput) {
  onCreateMenu(filter: $filter) {
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
` as GeneratedSubscription<
  APITypes.OnCreateMenuSubscriptionVariables,
  APITypes.OnCreateMenuSubscription
>;
export const onCreateMenuItem = /* GraphQL */ `subscription OnCreateMenuItem($filter: ModelSubscriptionMenuItemFilterInput) {
  onCreateMenuItem(filter: $filter) {
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
` as GeneratedSubscription<
  APITypes.OnCreateMenuItemSubscriptionVariables,
  APITypes.OnCreateMenuItemSubscription
>;
export const onCreateMenuTemplate = /* GraphQL */ `subscription OnCreateMenuTemplate(
  $filter: ModelSubscriptionMenuTemplateFilterInput
) {
  onCreateMenuTemplate(filter: $filter) {
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
` as GeneratedSubscription<
  APITypes.OnCreateMenuTemplateSubscriptionVariables,
  APITypes.OnCreateMenuTemplateSubscription
>;
export const onCreateRecipe = /* GraphQL */ `subscription OnCreateRecipe($filter: ModelSubscriptionRecipeFilterInput) {
  onCreateRecipe(filter: $filter) {
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
` as GeneratedSubscription<
  APITypes.OnCreateRecipeSubscriptionVariables,
  APITypes.OnCreateRecipeSubscription
>;
export const onCreateShoppingItem = /* GraphQL */ `subscription OnCreateShoppingItem(
  $filter: ModelSubscriptionShoppingItemFilterInput
) {
  onCreateShoppingItem(filter: $filter) {
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
` as GeneratedSubscription<
  APITypes.OnCreateShoppingItemSubscriptionVariables,
  APITypes.OnCreateShoppingItemSubscription
>;
export const onCreateShoppingList = /* GraphQL */ `subscription OnCreateShoppingList(
  $filter: ModelSubscriptionShoppingListFilterInput
) {
  onCreateShoppingList(filter: $filter) {
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
` as GeneratedSubscription<
  APITypes.OnCreateShoppingListSubscriptionVariables,
  APITypes.OnCreateShoppingListSubscription
>;
export const onCreateUserProfile = /* GraphQL */ `subscription OnCreateUserProfile(
  $filter: ModelSubscriptionUserProfileFilterInput
) {
  onCreateUserProfile(filter: $filter) {
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
` as GeneratedSubscription<
  APITypes.OnCreateUserProfileSubscriptionVariables,
  APITypes.OnCreateUserProfileSubscription
>;
export const onDeleteMenu = /* GraphQL */ `subscription OnDeleteMenu($filter: ModelSubscriptionMenuFilterInput) {
  onDeleteMenu(filter: $filter) {
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
` as GeneratedSubscription<
  APITypes.OnDeleteMenuSubscriptionVariables,
  APITypes.OnDeleteMenuSubscription
>;
export const onDeleteMenuItem = /* GraphQL */ `subscription OnDeleteMenuItem($filter: ModelSubscriptionMenuItemFilterInput) {
  onDeleteMenuItem(filter: $filter) {
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
` as GeneratedSubscription<
  APITypes.OnDeleteMenuItemSubscriptionVariables,
  APITypes.OnDeleteMenuItemSubscription
>;
export const onDeleteMenuTemplate = /* GraphQL */ `subscription OnDeleteMenuTemplate(
  $filter: ModelSubscriptionMenuTemplateFilterInput
) {
  onDeleteMenuTemplate(filter: $filter) {
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
` as GeneratedSubscription<
  APITypes.OnDeleteMenuTemplateSubscriptionVariables,
  APITypes.OnDeleteMenuTemplateSubscription
>;
export const onDeleteRecipe = /* GraphQL */ `subscription OnDeleteRecipe($filter: ModelSubscriptionRecipeFilterInput) {
  onDeleteRecipe(filter: $filter) {
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
` as GeneratedSubscription<
  APITypes.OnDeleteRecipeSubscriptionVariables,
  APITypes.OnDeleteRecipeSubscription
>;
export const onDeleteShoppingItem = /* GraphQL */ `subscription OnDeleteShoppingItem(
  $filter: ModelSubscriptionShoppingItemFilterInput
) {
  onDeleteShoppingItem(filter: $filter) {
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
` as GeneratedSubscription<
  APITypes.OnDeleteShoppingItemSubscriptionVariables,
  APITypes.OnDeleteShoppingItemSubscription
>;
export const onDeleteShoppingList = /* GraphQL */ `subscription OnDeleteShoppingList(
  $filter: ModelSubscriptionShoppingListFilterInput
) {
  onDeleteShoppingList(filter: $filter) {
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
` as GeneratedSubscription<
  APITypes.OnDeleteShoppingListSubscriptionVariables,
  APITypes.OnDeleteShoppingListSubscription
>;
export const onDeleteUserProfile = /* GraphQL */ `subscription OnDeleteUserProfile(
  $filter: ModelSubscriptionUserProfileFilterInput
) {
  onDeleteUserProfile(filter: $filter) {
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
` as GeneratedSubscription<
  APITypes.OnDeleteUserProfileSubscriptionVariables,
  APITypes.OnDeleteUserProfileSubscription
>;
export const onUpdateMenu = /* GraphQL */ `subscription OnUpdateMenu($filter: ModelSubscriptionMenuFilterInput) {
  onUpdateMenu(filter: $filter) {
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
` as GeneratedSubscription<
  APITypes.OnUpdateMenuSubscriptionVariables,
  APITypes.OnUpdateMenuSubscription
>;
export const onUpdateMenuItem = /* GraphQL */ `subscription OnUpdateMenuItem($filter: ModelSubscriptionMenuItemFilterInput) {
  onUpdateMenuItem(filter: $filter) {
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
` as GeneratedSubscription<
  APITypes.OnUpdateMenuItemSubscriptionVariables,
  APITypes.OnUpdateMenuItemSubscription
>;
export const onUpdateMenuTemplate = /* GraphQL */ `subscription OnUpdateMenuTemplate(
  $filter: ModelSubscriptionMenuTemplateFilterInput
) {
  onUpdateMenuTemplate(filter: $filter) {
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
` as GeneratedSubscription<
  APITypes.OnUpdateMenuTemplateSubscriptionVariables,
  APITypes.OnUpdateMenuTemplateSubscription
>;
export const onUpdateRecipe = /* GraphQL */ `subscription OnUpdateRecipe($filter: ModelSubscriptionRecipeFilterInput) {
  onUpdateRecipe(filter: $filter) {
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
` as GeneratedSubscription<
  APITypes.OnUpdateRecipeSubscriptionVariables,
  APITypes.OnUpdateRecipeSubscription
>;
export const onUpdateShoppingItem = /* GraphQL */ `subscription OnUpdateShoppingItem(
  $filter: ModelSubscriptionShoppingItemFilterInput
) {
  onUpdateShoppingItem(filter: $filter) {
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
` as GeneratedSubscription<
  APITypes.OnUpdateShoppingItemSubscriptionVariables,
  APITypes.OnUpdateShoppingItemSubscription
>;
export const onUpdateShoppingList = /* GraphQL */ `subscription OnUpdateShoppingList(
  $filter: ModelSubscriptionShoppingListFilterInput
) {
  onUpdateShoppingList(filter: $filter) {
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
` as GeneratedSubscription<
  APITypes.OnUpdateShoppingListSubscriptionVariables,
  APITypes.OnUpdateShoppingListSubscription
>;
export const onUpdateUserProfile = /* GraphQL */ `subscription OnUpdateUserProfile(
  $filter: ModelSubscriptionUserProfileFilterInput
) {
  onUpdateUserProfile(filter: $filter) {
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
` as GeneratedSubscription<
  APITypes.OnUpdateUserProfileSubscriptionVariables,
  APITypes.OnUpdateUserProfileSubscription
>;
