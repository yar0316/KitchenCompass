/* tslint:disable */
/* eslint-disable */
// this is an auto generated file. This will be overwritten

import * as APITypes from "./API";
type GeneratedMutation<InputType, OutputType> = string & {
  __generatedMutationInput: InputType;
  __generatedMutationOutput: OutputType;
};

export const createMenu = /* GraphQL */ `mutation CreateMenu(
  $condition: ModelMenuConditionInput
  $input: CreateMenuInput!
) {
  createMenu(condition: $condition, input: $input) {
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
` as GeneratedMutation<
  APITypes.CreateMenuMutationVariables,
  APITypes.CreateMenuMutation
>;
export const createMenuItem = /* GraphQL */ `mutation CreateMenuItem(
  $condition: ModelMenuItemConditionInput
  $input: CreateMenuItemInput!
) {
  createMenuItem(condition: $condition, input: $input) {
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
` as GeneratedMutation<
  APITypes.CreateMenuItemMutationVariables,
  APITypes.CreateMenuItemMutation
>;
export const createMenuTemplate = /* GraphQL */ `mutation CreateMenuTemplate(
  $condition: ModelMenuTemplateConditionInput
  $input: CreateMenuTemplateInput!
) {
  createMenuTemplate(condition: $condition, input: $input) {
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
` as GeneratedMutation<
  APITypes.CreateMenuTemplateMutationVariables,
  APITypes.CreateMenuTemplateMutation
>;
export const createRecipe = /* GraphQL */ `mutation CreateRecipe(
  $condition: ModelRecipeConditionInput
  $input: CreateRecipeInput!
) {
  createRecipe(condition: $condition, input: $input) {
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
` as GeneratedMutation<
  APITypes.CreateRecipeMutationVariables,
  APITypes.CreateRecipeMutation
>;
export const createShoppingItem = /* GraphQL */ `mutation CreateShoppingItem(
  $condition: ModelShoppingItemConditionInput
  $input: CreateShoppingItemInput!
) {
  createShoppingItem(condition: $condition, input: $input) {
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
` as GeneratedMutation<
  APITypes.CreateShoppingItemMutationVariables,
  APITypes.CreateShoppingItemMutation
>;
export const createShoppingList = /* GraphQL */ `mutation CreateShoppingList(
  $condition: ModelShoppingListConditionInput
  $input: CreateShoppingListInput!
) {
  createShoppingList(condition: $condition, input: $input) {
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
` as GeneratedMutation<
  APITypes.CreateShoppingListMutationVariables,
  APITypes.CreateShoppingListMutation
>;
export const createUserProfile = /* GraphQL */ `mutation CreateUserProfile(
  $condition: ModelUserProfileConditionInput
  $input: CreateUserProfileInput!
) {
  createUserProfile(condition: $condition, input: $input) {
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
` as GeneratedMutation<
  APITypes.CreateUserProfileMutationVariables,
  APITypes.CreateUserProfileMutation
>;
export const deleteMenu = /* GraphQL */ `mutation DeleteMenu(
  $condition: ModelMenuConditionInput
  $input: DeleteMenuInput!
) {
  deleteMenu(condition: $condition, input: $input) {
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
` as GeneratedMutation<
  APITypes.DeleteMenuMutationVariables,
  APITypes.DeleteMenuMutation
>;
export const deleteMenuItem = /* GraphQL */ `mutation DeleteMenuItem(
  $condition: ModelMenuItemConditionInput
  $input: DeleteMenuItemInput!
) {
  deleteMenuItem(condition: $condition, input: $input) {
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
` as GeneratedMutation<
  APITypes.DeleteMenuItemMutationVariables,
  APITypes.DeleteMenuItemMutation
>;
export const deleteMenuTemplate = /* GraphQL */ `mutation DeleteMenuTemplate(
  $condition: ModelMenuTemplateConditionInput
  $input: DeleteMenuTemplateInput!
) {
  deleteMenuTemplate(condition: $condition, input: $input) {
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
` as GeneratedMutation<
  APITypes.DeleteMenuTemplateMutationVariables,
  APITypes.DeleteMenuTemplateMutation
>;
export const deleteRecipe = /* GraphQL */ `mutation DeleteRecipe(
  $condition: ModelRecipeConditionInput
  $input: DeleteRecipeInput!
) {
  deleteRecipe(condition: $condition, input: $input) {
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
` as GeneratedMutation<
  APITypes.DeleteRecipeMutationVariables,
  APITypes.DeleteRecipeMutation
>;
export const deleteShoppingItem = /* GraphQL */ `mutation DeleteShoppingItem(
  $condition: ModelShoppingItemConditionInput
  $input: DeleteShoppingItemInput!
) {
  deleteShoppingItem(condition: $condition, input: $input) {
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
` as GeneratedMutation<
  APITypes.DeleteShoppingItemMutationVariables,
  APITypes.DeleteShoppingItemMutation
>;
export const deleteShoppingList = /* GraphQL */ `mutation DeleteShoppingList(
  $condition: ModelShoppingListConditionInput
  $input: DeleteShoppingListInput!
) {
  deleteShoppingList(condition: $condition, input: $input) {
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
` as GeneratedMutation<
  APITypes.DeleteShoppingListMutationVariables,
  APITypes.DeleteShoppingListMutation
>;
export const deleteUserProfile = /* GraphQL */ `mutation DeleteUserProfile(
  $condition: ModelUserProfileConditionInput
  $input: DeleteUserProfileInput!
) {
  deleteUserProfile(condition: $condition, input: $input) {
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
` as GeneratedMutation<
  APITypes.DeleteUserProfileMutationVariables,
  APITypes.DeleteUserProfileMutation
>;
export const updateMenu = /* GraphQL */ `mutation UpdateMenu(
  $condition: ModelMenuConditionInput
  $input: UpdateMenuInput!
) {
  updateMenu(condition: $condition, input: $input) {
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
` as GeneratedMutation<
  APITypes.UpdateMenuMutationVariables,
  APITypes.UpdateMenuMutation
>;
export const updateMenuItem = /* GraphQL */ `mutation UpdateMenuItem(
  $condition: ModelMenuItemConditionInput
  $input: UpdateMenuItemInput!
) {
  updateMenuItem(condition: $condition, input: $input) {
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
` as GeneratedMutation<
  APITypes.UpdateMenuItemMutationVariables,
  APITypes.UpdateMenuItemMutation
>;
export const updateMenuTemplate = /* GraphQL */ `mutation UpdateMenuTemplate(
  $condition: ModelMenuTemplateConditionInput
  $input: UpdateMenuTemplateInput!
) {
  updateMenuTemplate(condition: $condition, input: $input) {
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
` as GeneratedMutation<
  APITypes.UpdateMenuTemplateMutationVariables,
  APITypes.UpdateMenuTemplateMutation
>;
export const updateRecipe = /* GraphQL */ `mutation UpdateRecipe(
  $condition: ModelRecipeConditionInput
  $input: UpdateRecipeInput!
) {
  updateRecipe(condition: $condition, input: $input) {
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
` as GeneratedMutation<
  APITypes.UpdateRecipeMutationVariables,
  APITypes.UpdateRecipeMutation
>;
export const updateShoppingItem = /* GraphQL */ `mutation UpdateShoppingItem(
  $condition: ModelShoppingItemConditionInput
  $input: UpdateShoppingItemInput!
) {
  updateShoppingItem(condition: $condition, input: $input) {
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
` as GeneratedMutation<
  APITypes.UpdateShoppingItemMutationVariables,
  APITypes.UpdateShoppingItemMutation
>;
export const updateShoppingList = /* GraphQL */ `mutation UpdateShoppingList(
  $condition: ModelShoppingListConditionInput
  $input: UpdateShoppingListInput!
) {
  updateShoppingList(condition: $condition, input: $input) {
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
` as GeneratedMutation<
  APITypes.UpdateShoppingListMutationVariables,
  APITypes.UpdateShoppingListMutation
>;
export const updateUserProfile = /* GraphQL */ `mutation UpdateUserProfile(
  $condition: ModelUserProfileConditionInput
  $input: UpdateUserProfileInput!
) {
  updateUserProfile(condition: $condition, input: $input) {
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
` as GeneratedMutation<
  APITypes.UpdateUserProfileMutationVariables,
  APITypes.UpdateUserProfileMutation
>;
