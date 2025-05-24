/* tslint:disable */
/* eslint-disable */
//  This file was automatically generated and should not be edited.

// APIの型定義
export interface ShoppingList {
  __typename: "ShoppingList";
  id: string;
  name: string;
  description?: string | null;
  dueDate?: string | null;
  isCompleted?: boolean | null;
  owner?: string | null;
  createdAt?: string | null;
  updatedAt?: string | null;
  items?: {
    __typename: "ModelShoppingItemConnection";
    items: Array<{
      __typename: "ShoppingItem";
      id: string;
      name: string;
      amount?: number | null;
      unit?: string | null;
      category?: string | null;
      isChecked?: boolean | null;
      notes?: string | null;
      shoppingListId?: string | null;
      sourceRecipe?: string | null;
      owner?: string | null;
      createdAt?: string | null;
      updatedAt?: string | null;
    } | null> | null;
    nextToken?: string | null;
  } | null;
}

export interface ShoppingItem {
  __typename: "ShoppingItem";
  id: string;
  name: string;
  amount?: number | null;
  unit?: string | null;
  category?: string | null;
  isChecked?: boolean | null;
  notes?: string | null;
  shoppingListId?: string | null;
  sourceRecipe?: string | null;
  shoppingList?: ShoppingList | null;
  owner?: string | null;
  createdAt?: string | null;
  updatedAt?: string | null;
}

// Recipe関連の型定義
export interface Recipe {
  __typename: "Recipe";
  id: string;
  name: string;
  description?: string | null;
  prepTime?: number | null;
  cookTime?: number | null;
  servings?: number | null;
  category?: string | null;
  cuisine?: string | null;
  imageUrl?: string | null;
  externalUrl?: string | null;
  rating?: number | null;
  notes?: string | null;
  favorite?: boolean | null;
  ingredientsJson?: string | null;
  instructionsJson?: string | null;
  cookwareNeeded?: string | null;
  createdBy?: string | null;
  owner?: string | null;
  tags?: string[] | null;
  ingredients?: Array<{ id: string; name: string; amount: string; unit: string }> | null;
  steps?: Array<{ id: string; description: string }> | null;
  cookingTime?: number | null;
  createdAt?: string | null;
  updatedAt?: string | null;
}

export interface CreateShoppingListInput {
  id?: string | null;
  name: string;
  description?: string | null;
  dueDate?: string | null;
  isCompleted?: boolean | null;
  owner?: string | null;
}

export interface UpdateShoppingListInput {
  id: string;
  name?: string | null;
  description?: string | null;
  dueDate?: string | null;
  isCompleted?: boolean | null;
}

export interface DeleteShoppingListInput {
  id: string;
}

export interface CreateShoppingItemInput {
  id?: string | null;
  name: string;
  amount?: number | null;
  unit?: string | null;
  category?: string | null;
  isChecked?: boolean | null;
  notes?: string | null;
  shoppingListId: string;
  sourceRecipe?: string | null;
  owner?: string | null;
}

export interface UpdateShoppingItemInput {
  id: string;
  name?: string | null;
  amount?: number | null;
  unit?: string | null;
  category?: string | null;
  isChecked?: boolean | null;
  notes?: string | null;
  shoppingListId?: string | null;
  sourceRecipe?: string | null;
}

export interface DeleteShoppingItemInput {
  id: string;
}

// Recipe関連の入力型の追加
export interface CreateRecipeInput {
  id?: string | null;
  name: string;
  description?: string | null;
  prepTime?: number | null;
  cookTime?: number | null;
  servings?: number | null;
  category?: string | null;
  cuisine?: string | null;
  imageUrl?: string | null;
  externalUrl?: string | null;
  rating?: number | null;
  notes?: string | null;
  favorite?: boolean | null;
  ingredientsJson?: string | null;
  instructionsJson?: string | null;
  cookwareNeeded?: string | null;
  createdBy?: string | null;
  owner?: string | null;
}

export interface UpdateRecipeInput {
  id: string;
  name?: string | null;
  description?: string | null;
  prepTime?: number | null;
  cookTime?: number | null;
  servings?: number | null;
  category?: string | null;
  cuisine?: string | null;
  imageUrl?: string | null;
  externalUrl?: string | null;
  rating?: number | null;
  notes?: string | null;
  favorite?: boolean | null;
  ingredientsJson?: string | null;
  instructionsJson?: string | null;
  cookwareNeeded?: string | null;
  createdBy?: string | null;
}

export interface DeleteRecipeInput {
  id: string;
}

export interface ModelShoppingListFilterInput {
  id?: ModelIDInput | null;
  name?: ModelStringInput | null;
  description?: ModelStringInput | null;
  dueDate?: ModelStringInput | null;
  isCompleted?: ModelBooleanInput | null;
  owner?: ModelStringInput | null;
  and?: Array<ModelShoppingListFilterInput | null> | null;
  or?: Array<ModelShoppingListFilterInput | null> | null;
  not?: ModelShoppingListFilterInput | null;
}

export interface ModelShoppingItemFilterInput {
  id?: ModelIDInput | null;
  name?: ModelStringInput | null;
  amount?: ModelFloatInput | null;
  unit?: ModelStringInput | null;
  category?: ModelStringInput | null;
  isChecked?: ModelBooleanInput | null;
  notes?: ModelStringInput | null;
  shoppingListId?: ModelIDInput | null;
  sourceRecipe?: ModelStringInput | null;
  owner?: ModelStringInput | null;
  and?: Array<ModelShoppingItemFilterInput | null> | null;
  or?: Array<ModelShoppingItemFilterInput | null> | null;
  not?: ModelShoppingItemFilterInput | null;
}

// Recipe関連のフィルター入力型の追加
export interface ModelRecipeFilterInput {
  id?: ModelIDInput | null;
  name?: ModelStringInput | null;
  description?: ModelStringInput | null;
  prepTime?: ModelIntInput | null;
  cookTime?: ModelIntInput | null;
  servings?: ModelIntInput | null;
  category?: ModelStringInput | null;
  cuisine?: ModelStringInput | null;
  imageUrl?: ModelStringInput | null;
  externalUrl?: ModelStringInput | null;
  rating?: ModelIntInput | null;
  notes?: ModelStringInput | null;
  favorite?: ModelBooleanInput | null;
  ingredientsJson?: ModelStringInput | null;
  instructionsJson?: ModelStringInput | null;
  cookwareNeeded?: ModelStringInput | null;
  createdBy?: ModelStringInput | null;
  owner?: ModelStringInput | null;
  and?: Array<ModelRecipeFilterInput | null> | null;
  or?: Array<ModelRecipeFilterInput | null> | null;
  not?: ModelRecipeFilterInput | null;
}

export interface ModelIDInput {
  ne?: string | null;
  eq?: string | null;
  le?: string | null;
  lt?: string | null;
  ge?: string | null;
  gt?: string | null;
  contains?: string | null;
  notContains?: string | null;
  between?: Array<string | null> | null;
  beginsWith?: string | null;
  attributeExists?: boolean | null;
  attributeType?: ModelAttributeTypes | null;
  size?: ModelSizeInput | null;
}

export interface ModelStringInput {
  ne?: string | null;
  eq?: string | null;
  le?: string | null;
  lt?: string | null;
  ge?: string | null;
  gt?: string | null;
  contains?: string | null;
  notContains?: string | null;
  between?: Array<string | null> | null;
  beginsWith?: string | null;
  attributeExists?: boolean | null;
  attributeType?: ModelAttributeTypes | null;
  size?: ModelSizeInput | null;
}

export interface ModelIntInput {
  ne?: number | null;
  eq?: number | null;
  le?: number | null;
  lt?: number | null;
  ge?: number | null;
  gt?: number | null;
  between?: Array<number | null> | null;
  attributeExists?: boolean | null;
  attributeType?: ModelAttributeTypes | null;
}

export interface ModelBooleanInput {
  ne?: boolean | null;
  eq?: boolean | null;
  attributeExists?: boolean | null;
  attributeType?: ModelAttributeTypes | null;
}

export interface ModelFloatInput {
  ne?: number | null;
  eq?: number | null;
  le?: number | null;
  lt?: number | null;
  ge?: number | null;
  gt?: number | null;
  between?: Array<number | null> | null;
  attributeExists?: boolean | null;
  attributeType?: ModelAttributeTypes | null;
}

export enum ModelAttributeTypes {
  binary = "binary",
  binarySet = "binarySet",
  bool = "bool",
  list = "list",
  map = "map",
  number = "number",
  numberSet = "numberSet",
  string = "string",
  stringSet = "stringSet",
  _null = "_null",
}

export interface ModelSizeInput {
  ne?: number | null;
  eq?: number | null;
  le?: number | null;
  lt?: number | null;
  ge?: number | null;
  gt?: number | null;
  between?: Array<number | null> | null;
}

// レスポンス型の追加
export enum ModelSortDirection {
  ASC = "ASC",
  DESC = "DESC",
}

export interface ModelRecipeConnection {
  __typename: "ModelRecipeConnection";
  items: Array<Recipe | null>;
  nextToken?: string | null;
}

export interface ModelShoppingListConnection {
  __typename: "ModelShoppingListConnection";
  items: Array<ShoppingList | null>;
  nextToken?: string | null;
}

export interface ModelShoppingItemConnection {
  __typename: "ModelShoppingItemConnection";
  items: Array<ShoppingItem | null>;
  nextToken?: string | null;
}

export interface ModelRecipeConditionInput {
  name?: ModelStringInput | null;
  description?: ModelStringInput | null;
  prepTime?: ModelIntInput | null;
  cookTime?: ModelIntInput | null;
  servings?: ModelIntInput | null;
  category?: ModelStringInput | null;
  cuisine?: ModelStringInput | null;
  imageUrl?: ModelStringInput | null;
  externalUrl?: ModelStringInput | null;
  rating?: ModelIntInput | null;
  notes?: ModelStringInput | null;
  favorite?: ModelBooleanInput | null;
  ingredientsJson?: ModelStringInput | null;
  instructionsJson?: ModelStringInput | null;
  cookwareNeeded?: ModelStringInput | null;
  createdBy?: ModelStringInput | null;
  owner?: ModelStringInput | null;
  and?: Array<ModelRecipeConditionInput | null> | null;
  or?: Array<ModelRecipeConditionInput | null> | null;
  not?: ModelRecipeConditionInput | null;
}

export interface ModelShoppingListConditionInput {
  name?: ModelStringInput | null;
  description?: ModelStringInput | null;
  dueDate?: ModelStringInput | null;
  isCompleted?: ModelBooleanInput | null;
  owner?: ModelStringInput | null;
  and?: Array<ModelShoppingListConditionInput | null> | null;
  or?: Array<ModelShoppingListConditionInput | null> | null;
  not?: ModelShoppingListConditionInput | null;
}

export interface ModelShoppingItemConditionInput {
  name?: ModelStringInput | null;
  amount?: ModelFloatInput | null;
  unit?: ModelStringInput | null;
  category?: ModelStringInput | null;
  isChecked?: ModelBooleanInput | null;
  notes?: ModelStringInput | null;
  shoppingListId?: ModelIDInput | null;
  sourceRecipe?: ModelStringInput | null;
  owner?: ModelStringInput | null;
  and?: Array<ModelShoppingItemConditionInput | null> | null;
  or?: Array<ModelShoppingItemConditionInput | null> | null;
  not?: ModelShoppingItemConditionInput | null;
}