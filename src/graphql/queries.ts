/* tslint:disable */
 
// this is an auto generated file. This will be overwritten

export const getShoppingList = /* GraphQL */ `
  query GetShoppingList($id: ID!) {
    getShoppingList(id: $id) {
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

export const listShoppingLists = /* GraphQL */ `
  query ListShoppingLists(
    $filter: ModelShoppingListFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listShoppingLists(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
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
          }
          nextToken
        }
        createdAt
        updatedAt
      }
      nextToken
    }
  }
`;

export const getShoppingItem = /* GraphQL */ `
  query GetShoppingItem($id: ID!) {
    getShoppingItem(id: $id) {
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

export const listShoppingItems = /* GraphQL */ `
  query ListShoppingItems(
    $filter: ModelShoppingItemFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listShoppingItems(filter: $filter, limit: $limit, nextToken: $nextToken) {
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
  }
`;

export const shoppingItemsByShoppingListId = /* GraphQL */ `
  query ShoppingItemsByShoppingListId(
    $shoppingListId: ID!
    $sortDirection: ModelSortDirection
    $filter: ModelShoppingItemFilterInput
    $limit: Int
    $nextToken: String
  ) {
    shoppingItemsByShoppingListId(
      shoppingListId: $shoppingListId
      sortDirection: $sortDirection
      filter: $filter
      limit: $limit
      nextToken: $nextToken
    ) {
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
  }
`;

// Recipeに関するクエリの追加
export const getRecipe = /* GraphQL */ `
  query GetRecipe($id: ID!) {
    getRecipe(id: $id) {
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

export const listRecipes = /* GraphQL */ `
  query ListRecipes(
    $filter: ModelRecipeFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listRecipes(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
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
      nextToken
    }
  }
`;

export const recipesByCategory = /* GraphQL */ `
  query RecipesByCategory(
    $category: String!
    $sortDirection: ModelSortDirection
    $filter: ModelRecipeFilterInput
    $limit: Int
    $nextToken: String
  ) {
    recipesByCategory(
      category: $category
      sortDirection: $sortDirection
      filter: $filter
      limit: $limit
      nextToken: $nextToken
    ) {
      items {
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
        createdBy
        owner
        createdAt
        updatedAt
      }
      nextToken
    }
  }
`;