/* tslint:disable */
 
// this is an auto generated file. This will be overwritten

export const createShoppingList = /* GraphQL */ `
  mutation CreateShoppingList(
    $input: CreateShoppingListInput!
    $condition: ModelShoppingListConditionInput
  ) {
    createShoppingList(input: $input, condition: $condition) {
      id
      name
      description
      dueDate
      isCompleted
      owner
      items {
        items {
          id
          name
          amount
          unit
          category
          isChecked
          notes
          shoppingListId
          sourceRecipe
          owner
          createdAt
          updatedAt
        }
        nextToken
      }
      createdAt
      updatedAt
    }
  }
`;

export const updateShoppingList = /* GraphQL */ `
  mutation UpdateShoppingList(
    $input: UpdateShoppingListInput!
    $condition: ModelShoppingListConditionInput
  ) {
    updateShoppingList(input: $input, condition: $condition) {
      id
      name
      description
      dueDate
      isCompleted
      owner
      items {
        items {
          id
          name
          amount
          unit
          category
          isChecked
          notes
          shoppingListId
          sourceRecipe
          owner
          createdAt
          updatedAt
        }
        nextToken
      }
      createdAt
      updatedAt
    }
  }
`;

export const deleteShoppingList = /* GraphQL */ `
  mutation DeleteShoppingList(
    $input: DeleteShoppingListInput!
    $condition: ModelShoppingListConditionInput
  ) {
    deleteShoppingList(input: $input, condition: $condition) {
      id
      name
      description
      dueDate
      isCompleted
      owner
      createdAt
      updatedAt
    }
  }
`;

export const createShoppingItem = /* GraphQL */ `
  mutation CreateShoppingItem(
    $input: CreateShoppingItemInput!
    $condition: ModelShoppingItemConditionInput
  ) {
    createShoppingItem(input: $input, condition: $condition) {
      id
      name
      amount
      unit
      category
      isChecked
      notes
      shoppingListId
      sourceRecipe
      owner
      createdAt
      updatedAt
    }
  }
`;

export const updateShoppingItem = /* GraphQL */ `
  mutation UpdateShoppingItem(
    $input: UpdateShoppingItemInput!
    $condition: ModelShoppingItemConditionInput
  ) {
    updateShoppingItem(input: $input, condition: $condition) {
      id
      name
      amount
      unit
      category
      isChecked
      notes
      shoppingListId
      sourceRecipe
      owner
      createdAt
      updatedAt
    }
  }
`;

export const deleteShoppingItem = /* GraphQL */ `
  mutation DeleteShoppingItem(
    $input: DeleteShoppingItemInput!
    $condition: ModelShoppingItemConditionInput
  ) {
    deleteShoppingItem(input: $input, condition: $condition) {
      id
      name
      amount
      unit
      category
      isChecked
      notes
      shoppingListId
      sourceRecipe
      owner
      createdAt
      updatedAt
    }
  }
`;

// Recipe関連のミューテーションを追加
export const createRecipe = /* GraphQL */ `
  mutation CreateRecipe(
    $input: CreateRecipeInput!
    $condition: ModelRecipeConditionInput
  ) {
    createRecipe(input: $input, condition: $condition) {
      id
      name
      description
      prepTime
      cookTime
      servings
      category
      cuisine
      imageUrl
      externalUrl
      rating
      notes
      favorite
      ingredientsJson
      instructionsJson
      cookwareNeeded
      createdBy
      owner
      createdAt
      updatedAt
    }
  }
`;

export const updateRecipe = /* GraphQL */ `
  mutation UpdateRecipe(
    $input: UpdateRecipeInput!
    $condition: ModelRecipeConditionInput
  ) {
    updateRecipe(input: $input, condition: $condition) {
      id
      name
      description
      prepTime
      cookTime
      servings
      category
      cuisine
      imageUrl
      externalUrl
      rating
      notes
      favorite
      ingredientsJson
      instructionsJson
      cookwareNeeded
      createdBy
      owner
      createdAt
      updatedAt
    }
  }
`;

export const deleteRecipe = /* GraphQL */ `
  mutation DeleteRecipe(
    $input: DeleteRecipeInput!
    $condition: ModelRecipeConditionInput
  ) {
    deleteRecipe(input: $input, condition: $condition) {
      id
      name
      description
      prepTime
      cookTime
      servings
      category
      cuisine
      imageUrl
      externalUrl
      rating
      notes
      favorite
      ingredientsJson
      instructionsJson
      cookwareNeeded
      createdBy
      owner
      createdAt
      updatedAt
    }
  }
`;

// Menu関連のミューテーションを追加
export const createMenu = /* GraphQL */ `
  mutation CreateMenu(
    $input: CreateMenuInput!
    $condition: ModelMenuConditionInput
  ) {
    createMenu(input: $input, condition: $condition) {
      id
      date
      notes
      owner
      menuItems {
        items {
          id
          name
          mealType
          isOutside
          outsideLocation
          notes
          menuId
          recipeId
          createdAt
          updatedAt
        }
        nextToken
      }
      createdAt
      updatedAt
    }
  }
`;

export const updateMenu = /* GraphQL */ `
  mutation UpdateMenu(
    $input: UpdateMenuInput!
    $condition: ModelMenuConditionInput
  ) {
    updateMenu(input: $input, condition: $condition) {
      id
      date
      notes
      owner
      menuItems {
        items {
          id
          name
          mealType
          isOutside
          outsideLocation
          notes
          menuId
          recipeId
          createdAt
          updatedAt
        }
        nextToken
      }
      createdAt
      updatedAt
    }
  }
`;

export const deleteMenu = /* GraphQL */ `
  mutation DeleteMenu(
    $input: DeleteMenuInput!
    $condition: ModelMenuConditionInput
  ) {
    deleteMenu(input: $input, condition: $condition) {
      id
      date
      notes
      owner
      createdAt
      updatedAt
    }
  }
`;

export const createMenuItem = /* GraphQL */ `
  mutation CreateMenuItem(
    $input: CreateMenuItemInput!
    $condition: ModelMenuItemConditionInput
  ) {
    createMenuItem(input: $input, condition: $condition) {
      id
      name
      mealType
      isOutside
      outsideLocation
      notes
      menuId
      recipeId
      createdAt
      updatedAt
    }
  }
`;

export const updateMenuItem = /* GraphQL */ `
  mutation UpdateMenuItem(
    $input: UpdateMenuItemInput!
    $condition: ModelMenuItemConditionInput
  ) {
    updateMenuItem(input: $input, condition: $condition) {
      id
      name
      mealType
      isOutside
      outsideLocation
      notes
      menuId
      recipeId
      createdAt
      updatedAt
    }
  }
`;

export const deleteMenuItem = /* GraphQL */ `
  mutation DeleteMenuItem(
    $input: DeleteMenuItemInput!
    $condition: ModelMenuItemConditionInput
  ) {
    deleteMenuItem(input: $input, condition: $condition) {
      id
      name
      mealType
      isOutside
      outsideLocation
      notes
      menuId
      recipeId
      createdAt
      updatedAt
    }
  }
`;

// MenuTemplate関連のミューテーション
export const createMenuTemplate = /* GraphQL */ `
  mutation CreateMenuTemplate(
    $input: CreateMenuTemplateInput!
    $condition: ModelMenuTemplateConditionInput
  ) {
    createMenuTemplate(input: $input, condition: $condition) {
      id
      name
      description
      owner
      templateItemsJson
      createdAt
      updatedAt
    }
  }
`;

export const updateMenuTemplate = /* GraphQL */ `
  mutation UpdateMenuTemplate(
    $input: UpdateMenuTemplateInput!
    $condition: ModelMenuTemplateConditionInput
  ) {
    updateMenuTemplate(input: $input, condition: $condition) {
      id
      name
      description
      owner
      templateItemsJson
      createdAt
      updatedAt
    }
  }
`;

export const deleteMenuTemplate = /* GraphQL */ `
  mutation DeleteMenuTemplate(
    $input: DeleteMenuTemplateInput!
    $condition: ModelMenuTemplateConditionInput
  ) {
    deleteMenuTemplate(input: $input, condition: $condition) {
      id
      name
      description
      owner
      templateItemsJson
      createdAt
      updatedAt
    }
  }
`;