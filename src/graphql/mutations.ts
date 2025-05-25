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