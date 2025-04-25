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