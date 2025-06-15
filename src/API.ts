/* tslint:disable */
/* eslint-disable */
//  This file was automatically generated and should not be edited.

export type Menu = {
  __typename: "Menu",
  createdAt: string,
  date: string,
  id: string,
  menuItems?: ModelMenuItemConnection | null,
  notes?: string | null,
  owner?: string | null,
  updatedAt: string,
};

export type ModelMenuItemConnection = {
  __typename: "ModelMenuItemConnection",
  items:  Array<MenuItem | null >,
  nextToken?: string | null,
};

export type MenuItem = {
  __typename: "MenuItem",
  createdAt: string,
  id: string,
  isOutside?: boolean | null,
  mealType: string,
  menu?: Menu | null,
  menuId: string,
  name?: string | null,
  notes?: string | null,
  outsideLocation?: string | null,
  owner?: string | null,
  recipe?: Recipe | null,
  recipeId?: string | null,
  updatedAt: string,
};

export type Recipe = {
  __typename: "Recipe",
  category?: string | null,
  cookTime?: number | null,
  cookwareNeeded?: string | null,
  createdAt: string,
  createdBy?: string | null,
  cuisine?: string | null,
  description?: string | null,
  externalUrl?: string | null,
  favorite?: boolean | null,
  id: string,
  imageUrl?: string | null,
  ingredientsJson?: string | null,
  instructionsJson?: string | null,
  menuItems?: ModelMenuItemConnection | null,
  name: string,
  notes?: string | null,
  owner?: string | null,
  prepTime?: number | null,
  rating?: number | null,
  servings: number,
  updatedAt: string,
};

export type MenuTemplate = {
  __typename: "MenuTemplate",
  createdAt: string,
  description?: string | null,
  id: string,
  name: string,
  owner?: string | null,
  templateItemsJson?: string | null,
  updatedAt: string,
};

export type ShoppingItem = {
  __typename: "ShoppingItem",
  amount?: number | null,
  category?: string | null,
  createdAt: string,
  id: string,
  isChecked?: boolean | null,
  name: string,
  notes?: string | null,
  owner?: string | null,
  shoppingList?: ShoppingList | null,
  shoppingListId: string,
  sourceRecipe?: string | null,
  unit?: string | null,
  updatedAt: string,
};

export type ShoppingList = {
  __typename: "ShoppingList",
  createdAt: string,
  description?: string | null,
  dueDate?: string | null,
  id: string,
  isCompleted?: boolean | null,
  items?: ModelShoppingItemConnection | null,
  name: string,
  owner?: string | null,
  updatedAt: string,
};

export type ModelShoppingItemConnection = {
  __typename: "ModelShoppingItemConnection",
  items:  Array<ShoppingItem | null >,
  nextToken?: string | null,
};

export type UserProfile = {
  __typename: "UserProfile",
  autoUpdate?: boolean | null,
  bio?: string | null,
  cookingExperience?: UserProfileCookingExperience | null,
  createdAt: string,
  darkMode?: boolean | null,
  dataSync?: boolean | null,
  dietaryRestrictions?: string | null,
  email: string,
  emailNotifications?: boolean | null,
  familyName: string,
  favoriteCuisines?: Array< string | null > | null,
  givenName: string,
  id: string,
  location?: string | null,
  notifications?: boolean | null,
  owner?: string | null,
  preferredCuisine?: string | null,
  profileImageKey?: string | null,
  pushNotifications?: boolean | null,
  recipePortionSize?: number | null,
  recipesCreatedCount?: number | null,
  updatedAt: string,
  userId: string,
};

export enum UserProfileCookingExperience {
  ADVANCED = "ADVANCED",
  BEGINNER = "BEGINNER",
  INTERMEDIATE = "INTERMEDIATE",
}


export type ModelMenuItemFilterInput = {
  and?: Array< ModelMenuItemFilterInput | null > | null,
  createdAt?: ModelStringInput | null,
  id?: ModelIDInput | null,
  isOutside?: ModelBooleanInput | null,
  mealType?: ModelStringInput | null,
  menuId?: ModelStringInput | null,
  name?: ModelStringInput | null,
  not?: ModelMenuItemFilterInput | null,
  notes?: ModelStringInput | null,
  or?: Array< ModelMenuItemFilterInput | null > | null,
  outsideLocation?: ModelStringInput | null,
  owner?: ModelStringInput | null,
  recipeId?: ModelStringInput | null,
  updatedAt?: ModelStringInput | null,
};

export type ModelStringInput = {
  attributeExists?: boolean | null,
  attributeType?: ModelAttributeTypes | null,
  beginsWith?: string | null,
  between?: Array< string | null > | null,
  contains?: string | null,
  eq?: string | null,
  ge?: string | null,
  gt?: string | null,
  le?: string | null,
  lt?: string | null,
  ne?: string | null,
  notContains?: string | null,
  size?: ModelSizeInput | null,
};

export enum ModelAttributeTypes {
  _null = "_null",
  binary = "binary",
  binarySet = "binarySet",
  bool = "bool",
  list = "list",
  map = "map",
  number = "number",
  numberSet = "numberSet",
  string = "string",
  stringSet = "stringSet",
}


export type ModelSizeInput = {
  between?: Array< number | null > | null,
  eq?: number | null,
  ge?: number | null,
  gt?: number | null,
  le?: number | null,
  lt?: number | null,
  ne?: number | null,
};

export type ModelIDInput = {
  attributeExists?: boolean | null,
  attributeType?: ModelAttributeTypes | null,
  beginsWith?: string | null,
  between?: Array< string | null > | null,
  contains?: string | null,
  eq?: string | null,
  ge?: string | null,
  gt?: string | null,
  le?: string | null,
  lt?: string | null,
  ne?: string | null,
  notContains?: string | null,
  size?: ModelSizeInput | null,
};

export type ModelBooleanInput = {
  attributeExists?: boolean | null,
  attributeType?: ModelAttributeTypes | null,
  eq?: boolean | null,
  ne?: boolean | null,
};

export type ModelMenuTemplateFilterInput = {
  and?: Array< ModelMenuTemplateFilterInput | null > | null,
  createdAt?: ModelStringInput | null,
  description?: ModelStringInput | null,
  id?: ModelIDInput | null,
  name?: ModelStringInput | null,
  not?: ModelMenuTemplateFilterInput | null,
  or?: Array< ModelMenuTemplateFilterInput | null > | null,
  owner?: ModelStringInput | null,
  templateItemsJson?: ModelStringInput | null,
  updatedAt?: ModelStringInput | null,
};

export type ModelMenuTemplateConnection = {
  __typename: "ModelMenuTemplateConnection",
  items:  Array<MenuTemplate | null >,
  nextToken?: string | null,
};

export type ModelMenuFilterInput = {
  and?: Array< ModelMenuFilterInput | null > | null,
  createdAt?: ModelStringInput | null,
  date?: ModelStringInput | null,
  id?: ModelIDInput | null,
  not?: ModelMenuFilterInput | null,
  notes?: ModelStringInput | null,
  or?: Array< ModelMenuFilterInput | null > | null,
  owner?: ModelStringInput | null,
  updatedAt?: ModelStringInput | null,
};

export type ModelMenuConnection = {
  __typename: "ModelMenuConnection",
  items:  Array<Menu | null >,
  nextToken?: string | null,
};

export type ModelRecipeFilterInput = {
  and?: Array< ModelRecipeFilterInput | null > | null,
  category?: ModelStringInput | null,
  cookTime?: ModelIntInput | null,
  cookwareNeeded?: ModelStringInput | null,
  createdAt?: ModelStringInput | null,
  createdBy?: ModelStringInput | null,
  cuisine?: ModelStringInput | null,
  description?: ModelStringInput | null,
  externalUrl?: ModelStringInput | null,
  favorite?: ModelBooleanInput | null,
  id?: ModelIDInput | null,
  imageUrl?: ModelStringInput | null,
  ingredientsJson?: ModelStringInput | null,
  instructionsJson?: ModelStringInput | null,
  name?: ModelStringInput | null,
  not?: ModelRecipeFilterInput | null,
  notes?: ModelStringInput | null,
  or?: Array< ModelRecipeFilterInput | null > | null,
  owner?: ModelStringInput | null,
  prepTime?: ModelIntInput | null,
  rating?: ModelIntInput | null,
  servings?: ModelIntInput | null,
  updatedAt?: ModelStringInput | null,
};

export type ModelIntInput = {
  attributeExists?: boolean | null,
  attributeType?: ModelAttributeTypes | null,
  between?: Array< number | null > | null,
  eq?: number | null,
  ge?: number | null,
  gt?: number | null,
  le?: number | null,
  lt?: number | null,
  ne?: number | null,
};

export type ModelRecipeConnection = {
  __typename: "ModelRecipeConnection",
  items:  Array<Recipe | null >,
  nextToken?: string | null,
};

export type ModelShoppingItemFilterInput = {
  amount?: ModelFloatInput | null,
  and?: Array< ModelShoppingItemFilterInput | null > | null,
  category?: ModelStringInput | null,
  createdAt?: ModelStringInput | null,
  id?: ModelIDInput | null,
  isChecked?: ModelBooleanInput | null,
  name?: ModelStringInput | null,
  not?: ModelShoppingItemFilterInput | null,
  notes?: ModelStringInput | null,
  or?: Array< ModelShoppingItemFilterInput | null > | null,
  owner?: ModelStringInput | null,
  shoppingListId?: ModelStringInput | null,
  sourceRecipe?: ModelStringInput | null,
  unit?: ModelStringInput | null,
  updatedAt?: ModelStringInput | null,
};

export type ModelFloatInput = {
  attributeExists?: boolean | null,
  attributeType?: ModelAttributeTypes | null,
  between?: Array< number | null > | null,
  eq?: number | null,
  ge?: number | null,
  gt?: number | null,
  le?: number | null,
  lt?: number | null,
  ne?: number | null,
};

export type ModelShoppingListFilterInput = {
  and?: Array< ModelShoppingListFilterInput | null > | null,
  createdAt?: ModelStringInput | null,
  description?: ModelStringInput | null,
  dueDate?: ModelStringInput | null,
  id?: ModelIDInput | null,
  isCompleted?: ModelBooleanInput | null,
  name?: ModelStringInput | null,
  not?: ModelShoppingListFilterInput | null,
  or?: Array< ModelShoppingListFilterInput | null > | null,
  owner?: ModelStringInput | null,
  updatedAt?: ModelStringInput | null,
};

export type ModelShoppingListConnection = {
  __typename: "ModelShoppingListConnection",
  items:  Array<ShoppingList | null >,
  nextToken?: string | null,
};

export type ModelUserProfileFilterInput = {
  and?: Array< ModelUserProfileFilterInput | null > | null,
  autoUpdate?: ModelBooleanInput | null,
  bio?: ModelStringInput | null,
  cookingExperience?: ModelUserProfileCookingExperienceInput | null,
  createdAt?: ModelStringInput | null,
  darkMode?: ModelBooleanInput | null,
  dataSync?: ModelBooleanInput | null,
  dietaryRestrictions?: ModelStringInput | null,
  email?: ModelStringInput | null,
  emailNotifications?: ModelBooleanInput | null,
  familyName?: ModelStringInput | null,
  favoriteCuisines?: ModelStringInput | null,
  givenName?: ModelStringInput | null,
  id?: ModelIDInput | null,
  location?: ModelStringInput | null,
  not?: ModelUserProfileFilterInput | null,
  notifications?: ModelBooleanInput | null,
  or?: Array< ModelUserProfileFilterInput | null > | null,
  owner?: ModelStringInput | null,
  preferredCuisine?: ModelStringInput | null,
  profileImageKey?: ModelStringInput | null,
  pushNotifications?: ModelBooleanInput | null,
  recipePortionSize?: ModelIntInput | null,
  recipesCreatedCount?: ModelIntInput | null,
  updatedAt?: ModelStringInput | null,
  userId?: ModelStringInput | null,
};

export type ModelUserProfileCookingExperienceInput = {
  eq?: UserProfileCookingExperience | null,
  ne?: UserProfileCookingExperience | null,
};

export type ModelUserProfileConnection = {
  __typename: "ModelUserProfileConnection",
  items:  Array<UserProfile | null >,
  nextToken?: string | null,
};

export type ModelMenuConditionInput = {
  and?: Array< ModelMenuConditionInput | null > | null,
  createdAt?: ModelStringInput | null,
  date?: ModelStringInput | null,
  not?: ModelMenuConditionInput | null,
  notes?: ModelStringInput | null,
  or?: Array< ModelMenuConditionInput | null > | null,
  owner?: ModelStringInput | null,
  updatedAt?: ModelStringInput | null,
};

export type CreateMenuInput = {
  date: string,
  id?: string | null,
  notes?: string | null,
  owner?: string | null,
};

export type ModelMenuItemConditionInput = {
  and?: Array< ModelMenuItemConditionInput | null > | null,
  createdAt?: ModelStringInput | null,
  isOutside?: ModelBooleanInput | null,
  mealType?: ModelStringInput | null,
  menuId?: ModelStringInput | null,
  name?: ModelStringInput | null,
  not?: ModelMenuItemConditionInput | null,
  notes?: ModelStringInput | null,
  or?: Array< ModelMenuItemConditionInput | null > | null,
  outsideLocation?: ModelStringInput | null,
  owner?: ModelStringInput | null,
  recipeId?: ModelStringInput | null,
  updatedAt?: ModelStringInput | null,
};

export type CreateMenuItemInput = {
  id?: string | null,
  isOutside?: boolean | null,
  mealType: string,
  menuId: string,
  name?: string | null,
  notes?: string | null,
  outsideLocation?: string | null,
  recipeId?: string | null,
};

export type ModelMenuTemplateConditionInput = {
  and?: Array< ModelMenuTemplateConditionInput | null > | null,
  createdAt?: ModelStringInput | null,
  description?: ModelStringInput | null,
  name?: ModelStringInput | null,
  not?: ModelMenuTemplateConditionInput | null,
  or?: Array< ModelMenuTemplateConditionInput | null > | null,
  owner?: ModelStringInput | null,
  templateItemsJson?: ModelStringInput | null,
  updatedAt?: ModelStringInput | null,
};

export type CreateMenuTemplateInput = {
  description?: string | null,
  id?: string | null,
  name: string,
  owner?: string | null,
  templateItemsJson?: string | null,
};

export type ModelRecipeConditionInput = {
  and?: Array< ModelRecipeConditionInput | null > | null,
  category?: ModelStringInput | null,
  cookTime?: ModelIntInput | null,
  cookwareNeeded?: ModelStringInput | null,
  createdAt?: ModelStringInput | null,
  createdBy?: ModelStringInput | null,
  cuisine?: ModelStringInput | null,
  description?: ModelStringInput | null,
  externalUrl?: ModelStringInput | null,
  favorite?: ModelBooleanInput | null,
  imageUrl?: ModelStringInput | null,
  ingredientsJson?: ModelStringInput | null,
  instructionsJson?: ModelStringInput | null,
  name?: ModelStringInput | null,
  not?: ModelRecipeConditionInput | null,
  notes?: ModelStringInput | null,
  or?: Array< ModelRecipeConditionInput | null > | null,
  owner?: ModelStringInput | null,
  prepTime?: ModelIntInput | null,
  rating?: ModelIntInput | null,
  servings?: ModelIntInput | null,
  updatedAt?: ModelStringInput | null,
};

export type CreateRecipeInput = {
  category?: string | null,
  cookTime?: number | null,
  cookwareNeeded?: string | null,
  createdBy?: string | null,
  cuisine?: string | null,
  description?: string | null,
  externalUrl?: string | null,
  favorite?: boolean | null,
  id?: string | null,
  imageUrl?: string | null,
  ingredientsJson?: string | null,
  instructionsJson?: string | null,
  name: string,
  notes?: string | null,
  owner?: string | null,
  prepTime?: number | null,
  rating?: number | null,
  servings: number,
};

export type ModelShoppingItemConditionInput = {
  amount?: ModelFloatInput | null,
  and?: Array< ModelShoppingItemConditionInput | null > | null,
  category?: ModelStringInput | null,
  createdAt?: ModelStringInput | null,
  isChecked?: ModelBooleanInput | null,
  name?: ModelStringInput | null,
  not?: ModelShoppingItemConditionInput | null,
  notes?: ModelStringInput | null,
  or?: Array< ModelShoppingItemConditionInput | null > | null,
  owner?: ModelStringInput | null,
  shoppingListId?: ModelStringInput | null,
  sourceRecipe?: ModelStringInput | null,
  unit?: ModelStringInput | null,
  updatedAt?: ModelStringInput | null,
};

export type CreateShoppingItemInput = {
  amount?: number | null,
  category?: string | null,
  id?: string | null,
  isChecked?: boolean | null,
  name: string,
  notes?: string | null,
  shoppingListId: string,
  sourceRecipe?: string | null,
  unit?: string | null,
};

export type ModelShoppingListConditionInput = {
  and?: Array< ModelShoppingListConditionInput | null > | null,
  createdAt?: ModelStringInput | null,
  description?: ModelStringInput | null,
  dueDate?: ModelStringInput | null,
  isCompleted?: ModelBooleanInput | null,
  name?: ModelStringInput | null,
  not?: ModelShoppingListConditionInput | null,
  or?: Array< ModelShoppingListConditionInput | null > | null,
  owner?: ModelStringInput | null,
  updatedAt?: ModelStringInput | null,
};

export type CreateShoppingListInput = {
  description?: string | null,
  dueDate?: string | null,
  id?: string | null,
  isCompleted?: boolean | null,
  name: string,
  owner?: string | null,
};

export type ModelUserProfileConditionInput = {
  and?: Array< ModelUserProfileConditionInput | null > | null,
  autoUpdate?: ModelBooleanInput | null,
  bio?: ModelStringInput | null,
  cookingExperience?: ModelUserProfileCookingExperienceInput | null,
  createdAt?: ModelStringInput | null,
  darkMode?: ModelBooleanInput | null,
  dataSync?: ModelBooleanInput | null,
  dietaryRestrictions?: ModelStringInput | null,
  email?: ModelStringInput | null,
  emailNotifications?: ModelBooleanInput | null,
  familyName?: ModelStringInput | null,
  favoriteCuisines?: ModelStringInput | null,
  givenName?: ModelStringInput | null,
  location?: ModelStringInput | null,
  not?: ModelUserProfileConditionInput | null,
  notifications?: ModelBooleanInput | null,
  or?: Array< ModelUserProfileConditionInput | null > | null,
  owner?: ModelStringInput | null,
  preferredCuisine?: ModelStringInput | null,
  profileImageKey?: ModelStringInput | null,
  pushNotifications?: ModelBooleanInput | null,
  recipePortionSize?: ModelIntInput | null,
  recipesCreatedCount?: ModelIntInput | null,
  updatedAt?: ModelStringInput | null,
  userId?: ModelStringInput | null,
};

export type CreateUserProfileInput = {
  autoUpdate?: boolean | null,
  bio?: string | null,
  cookingExperience?: UserProfileCookingExperience | null,
  darkMode?: boolean | null,
  dataSync?: boolean | null,
  dietaryRestrictions?: string | null,
  email: string,
  emailNotifications?: boolean | null,
  familyName: string,
  favoriteCuisines?: Array< string | null > | null,
  givenName: string,
  id?: string | null,
  location?: string | null,
  notifications?: boolean | null,
  preferredCuisine?: string | null,
  profileImageKey?: string | null,
  pushNotifications?: boolean | null,
  recipePortionSize?: number | null,
  recipesCreatedCount?: number | null,
  userId: string,
};

export type DeleteMenuInput = {
  id: string,
};

export type DeleteMenuItemInput = {
  id: string,
};

export type DeleteMenuTemplateInput = {
  id: string,
};

export type DeleteRecipeInput = {
  id: string,
};

export type DeleteShoppingItemInput = {
  id: string,
};

export type DeleteShoppingListInput = {
  id: string,
};

export type DeleteUserProfileInput = {
  id: string,
};

export type UpdateMenuInput = {
  date?: string | null,
  id: string,
  notes?: string | null,
  owner?: string | null,
};

export type UpdateMenuItemInput = {
  id: string,
  isOutside?: boolean | null,
  mealType?: string | null,
  menuId?: string | null,
  name?: string | null,
  notes?: string | null,
  outsideLocation?: string | null,
  recipeId?: string | null,
};

export type UpdateMenuTemplateInput = {
  description?: string | null,
  id: string,
  name?: string | null,
  owner?: string | null,
  templateItemsJson?: string | null,
};

export type UpdateRecipeInput = {
  category?: string | null,
  cookTime?: number | null,
  cookwareNeeded?: string | null,
  createdBy?: string | null,
  cuisine?: string | null,
  description?: string | null,
  externalUrl?: string | null,
  favorite?: boolean | null,
  id: string,
  imageUrl?: string | null,
  ingredientsJson?: string | null,
  instructionsJson?: string | null,
  name?: string | null,
  notes?: string | null,
  owner?: string | null,
  prepTime?: number | null,
  rating?: number | null,
  servings?: number | null,
};

export type UpdateShoppingItemInput = {
  amount?: number | null,
  category?: string | null,
  id: string,
  isChecked?: boolean | null,
  name?: string | null,
  notes?: string | null,
  shoppingListId?: string | null,
  sourceRecipe?: string | null,
  unit?: string | null,
};

export type UpdateShoppingListInput = {
  description?: string | null,
  dueDate?: string | null,
  id: string,
  isCompleted?: boolean | null,
  name?: string | null,
  owner?: string | null,
};

export type UpdateUserProfileInput = {
  autoUpdate?: boolean | null,
  bio?: string | null,
  cookingExperience?: UserProfileCookingExperience | null,
  darkMode?: boolean | null,
  dataSync?: boolean | null,
  dietaryRestrictions?: string | null,
  email?: string | null,
  emailNotifications?: boolean | null,
  familyName?: string | null,
  favoriteCuisines?: Array< string | null > | null,
  givenName?: string | null,
  id: string,
  location?: string | null,
  notifications?: boolean | null,
  preferredCuisine?: string | null,
  profileImageKey?: string | null,
  pushNotifications?: boolean | null,
  recipePortionSize?: number | null,
  recipesCreatedCount?: number | null,
  userId?: string | null,
};

export type ModelSubscriptionMenuFilterInput = {
  and?: Array< ModelSubscriptionMenuFilterInput | null > | null,
  createdAt?: ModelSubscriptionStringInput | null,
  date?: ModelSubscriptionStringInput | null,
  id?: ModelSubscriptionIDInput | null,
  notes?: ModelSubscriptionStringInput | null,
  or?: Array< ModelSubscriptionMenuFilterInput | null > | null,
  owner?: ModelStringInput | null,
  updatedAt?: ModelSubscriptionStringInput | null,
};

export type ModelSubscriptionStringInput = {
  beginsWith?: string | null,
  between?: Array< string | null > | null,
  contains?: string | null,
  eq?: string | null,
  ge?: string | null,
  gt?: string | null,
  in?: Array< string | null > | null,
  le?: string | null,
  lt?: string | null,
  ne?: string | null,
  notContains?: string | null,
  notIn?: Array< string | null > | null,
};

export type ModelSubscriptionIDInput = {
  beginsWith?: string | null,
  between?: Array< string | null > | null,
  contains?: string | null,
  eq?: string | null,
  ge?: string | null,
  gt?: string | null,
  in?: Array< string | null > | null,
  le?: string | null,
  lt?: string | null,
  ne?: string | null,
  notContains?: string | null,
  notIn?: Array< string | null > | null,
};

export type ModelSubscriptionMenuItemFilterInput = {
  and?: Array< ModelSubscriptionMenuItemFilterInput | null > | null,
  createdAt?: ModelSubscriptionStringInput | null,
  id?: ModelSubscriptionIDInput | null,
  isOutside?: ModelSubscriptionBooleanInput | null,
  mealType?: ModelSubscriptionStringInput | null,
  menuId?: ModelSubscriptionStringInput | null,
  name?: ModelSubscriptionStringInput | null,
  notes?: ModelSubscriptionStringInput | null,
  or?: Array< ModelSubscriptionMenuItemFilterInput | null > | null,
  outsideLocation?: ModelSubscriptionStringInput | null,
  owner?: ModelStringInput | null,
  recipeId?: ModelSubscriptionStringInput | null,
  updatedAt?: ModelSubscriptionStringInput | null,
};

export type ModelSubscriptionBooleanInput = {
  eq?: boolean | null,
  ne?: boolean | null,
};

export type ModelSubscriptionMenuTemplateFilterInput = {
  and?: Array< ModelSubscriptionMenuTemplateFilterInput | null > | null,
  createdAt?: ModelSubscriptionStringInput | null,
  description?: ModelSubscriptionStringInput | null,
  id?: ModelSubscriptionIDInput | null,
  name?: ModelSubscriptionStringInput | null,
  or?: Array< ModelSubscriptionMenuTemplateFilterInput | null > | null,
  owner?: ModelStringInput | null,
  templateItemsJson?: ModelSubscriptionStringInput | null,
  updatedAt?: ModelSubscriptionStringInput | null,
};

export type ModelSubscriptionRecipeFilterInput = {
  and?: Array< ModelSubscriptionRecipeFilterInput | null > | null,
  category?: ModelSubscriptionStringInput | null,
  cookTime?: ModelSubscriptionIntInput | null,
  cookwareNeeded?: ModelSubscriptionStringInput | null,
  createdAt?: ModelSubscriptionStringInput | null,
  createdBy?: ModelSubscriptionStringInput | null,
  cuisine?: ModelSubscriptionStringInput | null,
  description?: ModelSubscriptionStringInput | null,
  externalUrl?: ModelSubscriptionStringInput | null,
  favorite?: ModelSubscriptionBooleanInput | null,
  id?: ModelSubscriptionIDInput | null,
  imageUrl?: ModelSubscriptionStringInput | null,
  ingredientsJson?: ModelSubscriptionStringInput | null,
  instructionsJson?: ModelSubscriptionStringInput | null,
  name?: ModelSubscriptionStringInput | null,
  notes?: ModelSubscriptionStringInput | null,
  or?: Array< ModelSubscriptionRecipeFilterInput | null > | null,
  owner?: ModelStringInput | null,
  prepTime?: ModelSubscriptionIntInput | null,
  rating?: ModelSubscriptionIntInput | null,
  servings?: ModelSubscriptionIntInput | null,
  updatedAt?: ModelSubscriptionStringInput | null,
};

export type ModelSubscriptionIntInput = {
  between?: Array< number | null > | null,
  eq?: number | null,
  ge?: number | null,
  gt?: number | null,
  in?: Array< number | null > | null,
  le?: number | null,
  lt?: number | null,
  ne?: number | null,
  notIn?: Array< number | null > | null,
};

export type ModelSubscriptionShoppingItemFilterInput = {
  amount?: ModelSubscriptionFloatInput | null,
  and?: Array< ModelSubscriptionShoppingItemFilterInput | null > | null,
  category?: ModelSubscriptionStringInput | null,
  createdAt?: ModelSubscriptionStringInput | null,
  id?: ModelSubscriptionIDInput | null,
  isChecked?: ModelSubscriptionBooleanInput | null,
  name?: ModelSubscriptionStringInput | null,
  notes?: ModelSubscriptionStringInput | null,
  or?: Array< ModelSubscriptionShoppingItemFilterInput | null > | null,
  owner?: ModelStringInput | null,
  shoppingListId?: ModelSubscriptionStringInput | null,
  sourceRecipe?: ModelSubscriptionStringInput | null,
  unit?: ModelSubscriptionStringInput | null,
  updatedAt?: ModelSubscriptionStringInput | null,
};

export type ModelSubscriptionFloatInput = {
  between?: Array< number | null > | null,
  eq?: number | null,
  ge?: number | null,
  gt?: number | null,
  in?: Array< number | null > | null,
  le?: number | null,
  lt?: number | null,
  ne?: number | null,
  notIn?: Array< number | null > | null,
};

export type ModelSubscriptionShoppingListFilterInput = {
  and?: Array< ModelSubscriptionShoppingListFilterInput | null > | null,
  createdAt?: ModelSubscriptionStringInput | null,
  description?: ModelSubscriptionStringInput | null,
  dueDate?: ModelSubscriptionStringInput | null,
  id?: ModelSubscriptionIDInput | null,
  isCompleted?: ModelSubscriptionBooleanInput | null,
  name?: ModelSubscriptionStringInput | null,
  or?: Array< ModelSubscriptionShoppingListFilterInput | null > | null,
  owner?: ModelStringInput | null,
  updatedAt?: ModelSubscriptionStringInput | null,
};

export type ModelSubscriptionUserProfileFilterInput = {
  and?: Array< ModelSubscriptionUserProfileFilterInput | null > | null,
  autoUpdate?: ModelSubscriptionBooleanInput | null,
  bio?: ModelSubscriptionStringInput | null,
  cookingExperience?: ModelSubscriptionStringInput | null,
  createdAt?: ModelSubscriptionStringInput | null,
  darkMode?: ModelSubscriptionBooleanInput | null,
  dataSync?: ModelSubscriptionBooleanInput | null,
  dietaryRestrictions?: ModelSubscriptionStringInput | null,
  email?: ModelSubscriptionStringInput | null,
  emailNotifications?: ModelSubscriptionBooleanInput | null,
  familyName?: ModelSubscriptionStringInput | null,
  favoriteCuisines?: ModelSubscriptionStringInput | null,
  givenName?: ModelSubscriptionStringInput | null,
  id?: ModelSubscriptionIDInput | null,
  location?: ModelSubscriptionStringInput | null,
  notifications?: ModelSubscriptionBooleanInput | null,
  or?: Array< ModelSubscriptionUserProfileFilterInput | null > | null,
  owner?: ModelStringInput | null,
  preferredCuisine?: ModelSubscriptionStringInput | null,
  profileImageKey?: ModelSubscriptionStringInput | null,
  pushNotifications?: ModelSubscriptionBooleanInput | null,
  recipePortionSize?: ModelSubscriptionIntInput | null,
  recipesCreatedCount?: ModelSubscriptionIntInput | null,
  updatedAt?: ModelSubscriptionStringInput | null,
  userId?: ModelSubscriptionStringInput | null,
};

export type GetMenuQueryVariables = {
  id: string,
};

export type GetMenuQuery = {
  getMenu?:  {
    __typename: "Menu",
    createdAt: string,
    date: string,
    id: string,
    menuItems?:  {
      __typename: "ModelMenuItemConnection",
      nextToken?: string | null,
    } | null,
    notes?: string | null,
    owner?: string | null,
    updatedAt: string,
  } | null,
};

export type GetMenuItemQueryVariables = {
  id: string,
};

export type GetMenuItemQuery = {
  getMenuItem?:  {
    __typename: "MenuItem",
    createdAt: string,
    id: string,
    isOutside?: boolean | null,
    mealType: string,
    menu?:  {
      __typename: "Menu",
      createdAt: string,
      date: string,
      id: string,
      notes?: string | null,
      owner?: string | null,
      updatedAt: string,
    } | null,
    menuId: string,
    name?: string | null,
    notes?: string | null,
    outsideLocation?: string | null,
    owner?: string | null,
    recipe?:  {
      __typename: "Recipe",
      category?: string | null,
      cookTime?: number | null,
      cookwareNeeded?: string | null,
      createdAt: string,
      createdBy?: string | null,
      cuisine?: string | null,
      description?: string | null,
      externalUrl?: string | null,
      favorite?: boolean | null,
      id: string,
      imageUrl?: string | null,
      ingredientsJson?: string | null,
      instructionsJson?: string | null,
      name: string,
      notes?: string | null,
      owner?: string | null,
      prepTime?: number | null,
      rating?: number | null,
      servings: number,
      updatedAt: string,
    } | null,
    recipeId?: string | null,
    updatedAt: string,
  } | null,
};

export type GetMenuTemplateQueryVariables = {
  id: string,
};

export type GetMenuTemplateQuery = {
  getMenuTemplate?:  {
    __typename: "MenuTemplate",
    createdAt: string,
    description?: string | null,
    id: string,
    name: string,
    owner?: string | null,
    templateItemsJson?: string | null,
    updatedAt: string,
  } | null,
};

export type GetRecipeQueryVariables = {
  id: string,
};

export type GetRecipeQuery = {
  getRecipe?:  {
    __typename: "Recipe",
    category?: string | null,
    cookTime?: number | null,
    cookwareNeeded?: string | null,
    createdAt: string,
    createdBy?: string | null,
    cuisine?: string | null,
    description?: string | null,
    externalUrl?: string | null,
    favorite?: boolean | null,
    id: string,
    imageUrl?: string | null,
    ingredientsJson?: string | null,
    instructionsJson?: string | null,
    menuItems?:  {
      __typename: "ModelMenuItemConnection",
      nextToken?: string | null,
    } | null,
    name: string,
    notes?: string | null,
    owner?: string | null,
    prepTime?: number | null,
    rating?: number | null,
    servings: number,
    updatedAt: string,
  } | null,
};

export type GetShoppingItemQueryVariables = {
  id: string,
};

export type GetShoppingItemQuery = {
  getShoppingItem?:  {
    __typename: "ShoppingItem",
    amount?: number | null,
    category?: string | null,
    createdAt: string,
    id: string,
    isChecked?: boolean | null,
    name: string,
    notes?: string | null,
    owner?: string | null,
    shoppingList?:  {
      __typename: "ShoppingList",
      createdAt: string,
      description?: string | null,
      dueDate?: string | null,
      id: string,
      isCompleted?: boolean | null,
      name: string,
      owner?: string | null,
      updatedAt: string,
    } | null,
    shoppingListId: string,
    sourceRecipe?: string | null,
    unit?: string | null,
    updatedAt: string,
  } | null,
};

export type GetShoppingListQueryVariables = {
  id: string,
};

export type GetShoppingListQuery = {
  getShoppingList?:  {
    __typename: "ShoppingList",
    createdAt: string,
    description?: string | null,
    dueDate?: string | null,
    id: string,
    isCompleted?: boolean | null,
    items?:  {
      __typename: "ModelShoppingItemConnection",
      nextToken?: string | null,
    } | null,
    name: string,
    owner?: string | null,
    updatedAt: string,
  } | null,
};

export type GetUserProfileQueryVariables = {
  id: string,
};

export type GetUserProfileQuery = {
  getUserProfile?:  {
    __typename: "UserProfile",
    autoUpdate?: boolean | null,
    bio?: string | null,
    cookingExperience?: UserProfileCookingExperience | null,
    createdAt: string,
    darkMode?: boolean | null,
    dataSync?: boolean | null,
    dietaryRestrictions?: string | null,
    email: string,
    emailNotifications?: boolean | null,
    familyName: string,
    favoriteCuisines?: Array< string | null > | null,
    givenName: string,
    id: string,
    location?: string | null,
    notifications?: boolean | null,
    owner?: string | null,
    preferredCuisine?: string | null,
    profileImageKey?: string | null,
    pushNotifications?: boolean | null,
    recipePortionSize?: number | null,
    recipesCreatedCount?: number | null,
    updatedAt: string,
    userId: string,
  } | null,
};

export type ListMenuItemsQueryVariables = {
  filter?: ModelMenuItemFilterInput | null,
  limit?: number | null,
  nextToken?: string | null,
};

export type ListMenuItemsQuery = {
  listMenuItems?:  {
    __typename: "ModelMenuItemConnection",
    items:  Array< {
      __typename: "MenuItem",
      createdAt: string,
      id: string,
      isOutside?: boolean | null,
      mealType: string,
      menuId: string,
      name?: string | null,
      notes?: string | null,
      outsideLocation?: string | null,
      owner?: string | null,
      recipeId?: string | null,
      updatedAt: string,
    } | null >,
    nextToken?: string | null,
  } | null,
};

export type ListMenuTemplatesQueryVariables = {
  filter?: ModelMenuTemplateFilterInput | null,
  limit?: number | null,
  nextToken?: string | null,
};

export type ListMenuTemplatesQuery = {
  listMenuTemplates?:  {
    __typename: "ModelMenuTemplateConnection",
    items:  Array< {
      __typename: "MenuTemplate",
      createdAt: string,
      description?: string | null,
      id: string,
      name: string,
      owner?: string | null,
      templateItemsJson?: string | null,
      updatedAt: string,
    } | null >,
    nextToken?: string | null,
  } | null,
};

export type ListMenusQueryVariables = {
  filter?: ModelMenuFilterInput | null,
  limit?: number | null,
  nextToken?: string | null,
};

export type ListMenusQuery = {
  listMenus?:  {
    __typename: "ModelMenuConnection",
    items:  Array< {
      __typename: "Menu",
      createdAt: string,
      date: string,
      id: string,
      notes?: string | null,
      owner?: string | null,
      updatedAt: string,
    } | null >,
    nextToken?: string | null,
  } | null,
};

export type ListRecipesQueryVariables = {
  filter?: ModelRecipeFilterInput | null,
  limit?: number | null,
  nextToken?: string | null,
};

export type ListRecipesQuery = {
  listRecipes?:  {
    __typename: "ModelRecipeConnection",
    items:  Array< {
      __typename: "Recipe",
      category?: string | null,
      cookTime?: number | null,
      cookwareNeeded?: string | null,
      createdAt: string,
      createdBy?: string | null,
      cuisine?: string | null,
      description?: string | null,
      externalUrl?: string | null,
      favorite?: boolean | null,
      id: string,
      imageUrl?: string | null,
      ingredientsJson?: string | null,
      instructionsJson?: string | null,
      name: string,
      notes?: string | null,
      owner?: string | null,
      prepTime?: number | null,
      rating?: number | null,
      servings: number,
      updatedAt: string,
    } | null >,
    nextToken?: string | null,
  } | null,
};

export type ListShoppingItemsQueryVariables = {
  filter?: ModelShoppingItemFilterInput | null,
  limit?: number | null,
  nextToken?: string | null,
};

export type ListShoppingItemsQuery = {
  listShoppingItems?:  {
    __typename: "ModelShoppingItemConnection",
    items:  Array< {
      __typename: "ShoppingItem",
      amount?: number | null,
      category?: string | null,
      createdAt: string,
      id: string,
      isChecked?: boolean | null,
      name: string,
      notes?: string | null,
      owner?: string | null,
      shoppingListId: string,
      sourceRecipe?: string | null,
      unit?: string | null,
      updatedAt: string,
    } | null >,
    nextToken?: string | null,
  } | null,
};

export type ListShoppingListsQueryVariables = {
  filter?: ModelShoppingListFilterInput | null,
  limit?: number | null,
  nextToken?: string | null,
};

export type ListShoppingListsQuery = {
  listShoppingLists?:  {
    __typename: "ModelShoppingListConnection",
    items:  Array< {
      __typename: "ShoppingList",
      createdAt: string,
      description?: string | null,
      dueDate?: string | null,
      id: string,
      isCompleted?: boolean | null,
      name: string,
      owner?: string | null,
      updatedAt: string,
    } | null >,
    nextToken?: string | null,
  } | null,
};

export type ListUserProfilesQueryVariables = {
  filter?: ModelUserProfileFilterInput | null,
  limit?: number | null,
  nextToken?: string | null,
};

export type ListUserProfilesQuery = {
  listUserProfiles?:  {
    __typename: "ModelUserProfileConnection",
    items:  Array< {
      __typename: "UserProfile",
      autoUpdate?: boolean | null,
      bio?: string | null,
      cookingExperience?: UserProfileCookingExperience | null,
      createdAt: string,
      darkMode?: boolean | null,
      dataSync?: boolean | null,
      dietaryRestrictions?: string | null,
      email: string,
      emailNotifications?: boolean | null,
      familyName: string,
      favoriteCuisines?: Array< string | null > | null,
      givenName: string,
      id: string,
      location?: string | null,
      notifications?: boolean | null,
      owner?: string | null,
      preferredCuisine?: string | null,
      profileImageKey?: string | null,
      pushNotifications?: boolean | null,
      recipePortionSize?: number | null,
      recipesCreatedCount?: number | null,
      updatedAt: string,
      userId: string,
    } | null >,
    nextToken?: string | null,
  } | null,
};

export type CreateMenuMutationVariables = {
  condition?: ModelMenuConditionInput | null,
  input: CreateMenuInput,
};

export type CreateMenuMutation = {
  createMenu?:  {
    __typename: "Menu",
    createdAt: string,
    date: string,
    id: string,
    menuItems?:  {
      __typename: "ModelMenuItemConnection",
      nextToken?: string | null,
    } | null,
    notes?: string | null,
    owner?: string | null,
    updatedAt: string,
  } | null,
};

export type CreateMenuItemMutationVariables = {
  condition?: ModelMenuItemConditionInput | null,
  input: CreateMenuItemInput,
};

export type CreateMenuItemMutation = {
  createMenuItem?:  {
    __typename: "MenuItem",
    createdAt: string,
    id: string,
    isOutside?: boolean | null,
    mealType: string,
    menu?:  {
      __typename: "Menu",
      createdAt: string,
      date: string,
      id: string,
      notes?: string | null,
      owner?: string | null,
      updatedAt: string,
    } | null,
    menuId: string,
    name?: string | null,
    notes?: string | null,
    outsideLocation?: string | null,
    owner?: string | null,
    recipe?:  {
      __typename: "Recipe",
      category?: string | null,
      cookTime?: number | null,
      cookwareNeeded?: string | null,
      createdAt: string,
      createdBy?: string | null,
      cuisine?: string | null,
      description?: string | null,
      externalUrl?: string | null,
      favorite?: boolean | null,
      id: string,
      imageUrl?: string | null,
      ingredientsJson?: string | null,
      instructionsJson?: string | null,
      name: string,
      notes?: string | null,
      owner?: string | null,
      prepTime?: number | null,
      rating?: number | null,
      servings: number,
      updatedAt: string,
    } | null,
    recipeId?: string | null,
    updatedAt: string,
  } | null,
};

export type CreateMenuTemplateMutationVariables = {
  condition?: ModelMenuTemplateConditionInput | null,
  input: CreateMenuTemplateInput,
};

export type CreateMenuTemplateMutation = {
  createMenuTemplate?:  {
    __typename: "MenuTemplate",
    createdAt: string,
    description?: string | null,
    id: string,
    name: string,
    owner?: string | null,
    templateItemsJson?: string | null,
    updatedAt: string,
  } | null,
};

export type CreateRecipeMutationVariables = {
  condition?: ModelRecipeConditionInput | null,
  input: CreateRecipeInput,
};

export type CreateRecipeMutation = {
  createRecipe?:  {
    __typename: "Recipe",
    category?: string | null,
    cookTime?: number | null,
    cookwareNeeded?: string | null,
    createdAt: string,
    createdBy?: string | null,
    cuisine?: string | null,
    description?: string | null,
    externalUrl?: string | null,
    favorite?: boolean | null,
    id: string,
    imageUrl?: string | null,
    ingredientsJson?: string | null,
    instructionsJson?: string | null,
    menuItems?:  {
      __typename: "ModelMenuItemConnection",
      nextToken?: string | null,
    } | null,
    name: string,
    notes?: string | null,
    owner?: string | null,
    prepTime?: number | null,
    rating?: number | null,
    servings: number,
    updatedAt: string,
  } | null,
};

export type CreateShoppingItemMutationVariables = {
  condition?: ModelShoppingItemConditionInput | null,
  input: CreateShoppingItemInput,
};

export type CreateShoppingItemMutation = {
  createShoppingItem?:  {
    __typename: "ShoppingItem",
    amount?: number | null,
    category?: string | null,
    createdAt: string,
    id: string,
    isChecked?: boolean | null,
    name: string,
    notes?: string | null,
    owner?: string | null,
    shoppingList?:  {
      __typename: "ShoppingList",
      createdAt: string,
      description?: string | null,
      dueDate?: string | null,
      id: string,
      isCompleted?: boolean | null,
      name: string,
      owner?: string | null,
      updatedAt: string,
    } | null,
    shoppingListId: string,
    sourceRecipe?: string | null,
    unit?: string | null,
    updatedAt: string,
  } | null,
};

export type CreateShoppingListMutationVariables = {
  condition?: ModelShoppingListConditionInput | null,
  input: CreateShoppingListInput,
};

export type CreateShoppingListMutation = {
  createShoppingList?:  {
    __typename: "ShoppingList",
    createdAt: string,
    description?: string | null,
    dueDate?: string | null,
    id: string,
    isCompleted?: boolean | null,
    items?:  {
      __typename: "ModelShoppingItemConnection",
      nextToken?: string | null,
    } | null,
    name: string,
    owner?: string | null,
    updatedAt: string,
  } | null,
};

export type CreateUserProfileMutationVariables = {
  condition?: ModelUserProfileConditionInput | null,
  input: CreateUserProfileInput,
};

export type CreateUserProfileMutation = {
  createUserProfile?:  {
    __typename: "UserProfile",
    autoUpdate?: boolean | null,
    bio?: string | null,
    cookingExperience?: UserProfileCookingExperience | null,
    createdAt: string,
    darkMode?: boolean | null,
    dataSync?: boolean | null,
    dietaryRestrictions?: string | null,
    email: string,
    emailNotifications?: boolean | null,
    familyName: string,
    favoriteCuisines?: Array< string | null > | null,
    givenName: string,
    id: string,
    location?: string | null,
    notifications?: boolean | null,
    owner?: string | null,
    preferredCuisine?: string | null,
    profileImageKey?: string | null,
    pushNotifications?: boolean | null,
    recipePortionSize?: number | null,
    recipesCreatedCount?: number | null,
    updatedAt: string,
    userId: string,
  } | null,
};

export type DeleteMenuMutationVariables = {
  condition?: ModelMenuConditionInput | null,
  input: DeleteMenuInput,
};

export type DeleteMenuMutation = {
  deleteMenu?:  {
    __typename: "Menu",
    createdAt: string,
    date: string,
    id: string,
    menuItems?:  {
      __typename: "ModelMenuItemConnection",
      nextToken?: string | null,
    } | null,
    notes?: string | null,
    owner?: string | null,
    updatedAt: string,
  } | null,
};

export type DeleteMenuItemMutationVariables = {
  condition?: ModelMenuItemConditionInput | null,
  input: DeleteMenuItemInput,
};

export type DeleteMenuItemMutation = {
  deleteMenuItem?:  {
    __typename: "MenuItem",
    createdAt: string,
    id: string,
    isOutside?: boolean | null,
    mealType: string,
    menu?:  {
      __typename: "Menu",
      createdAt: string,
      date: string,
      id: string,
      notes?: string | null,
      owner?: string | null,
      updatedAt: string,
    } | null,
    menuId: string,
    name?: string | null,
    notes?: string | null,
    outsideLocation?: string | null,
    owner?: string | null,
    recipe?:  {
      __typename: "Recipe",
      category?: string | null,
      cookTime?: number | null,
      cookwareNeeded?: string | null,
      createdAt: string,
      createdBy?: string | null,
      cuisine?: string | null,
      description?: string | null,
      externalUrl?: string | null,
      favorite?: boolean | null,
      id: string,
      imageUrl?: string | null,
      ingredientsJson?: string | null,
      instructionsJson?: string | null,
      name: string,
      notes?: string | null,
      owner?: string | null,
      prepTime?: number | null,
      rating?: number | null,
      servings: number,
      updatedAt: string,
    } | null,
    recipeId?: string | null,
    updatedAt: string,
  } | null,
};

export type DeleteMenuTemplateMutationVariables = {
  condition?: ModelMenuTemplateConditionInput | null,
  input: DeleteMenuTemplateInput,
};

export type DeleteMenuTemplateMutation = {
  deleteMenuTemplate?:  {
    __typename: "MenuTemplate",
    createdAt: string,
    description?: string | null,
    id: string,
    name: string,
    owner?: string | null,
    templateItemsJson?: string | null,
    updatedAt: string,
  } | null,
};

export type DeleteRecipeMutationVariables = {
  condition?: ModelRecipeConditionInput | null,
  input: DeleteRecipeInput,
};

export type DeleteRecipeMutation = {
  deleteRecipe?:  {
    __typename: "Recipe",
    category?: string | null,
    cookTime?: number | null,
    cookwareNeeded?: string | null,
    createdAt: string,
    createdBy?: string | null,
    cuisine?: string | null,
    description?: string | null,
    externalUrl?: string | null,
    favorite?: boolean | null,
    id: string,
    imageUrl?: string | null,
    ingredientsJson?: string | null,
    instructionsJson?: string | null,
    menuItems?:  {
      __typename: "ModelMenuItemConnection",
      nextToken?: string | null,
    } | null,
    name: string,
    notes?: string | null,
    owner?: string | null,
    prepTime?: number | null,
    rating?: number | null,
    servings: number,
    updatedAt: string,
  } | null,
};

export type DeleteShoppingItemMutationVariables = {
  condition?: ModelShoppingItemConditionInput | null,
  input: DeleteShoppingItemInput,
};

export type DeleteShoppingItemMutation = {
  deleteShoppingItem?:  {
    __typename: "ShoppingItem",
    amount?: number | null,
    category?: string | null,
    createdAt: string,
    id: string,
    isChecked?: boolean | null,
    name: string,
    notes?: string | null,
    owner?: string | null,
    shoppingList?:  {
      __typename: "ShoppingList",
      createdAt: string,
      description?: string | null,
      dueDate?: string | null,
      id: string,
      isCompleted?: boolean | null,
      name: string,
      owner?: string | null,
      updatedAt: string,
    } | null,
    shoppingListId: string,
    sourceRecipe?: string | null,
    unit?: string | null,
    updatedAt: string,
  } | null,
};

export type DeleteShoppingListMutationVariables = {
  condition?: ModelShoppingListConditionInput | null,
  input: DeleteShoppingListInput,
};

export type DeleteShoppingListMutation = {
  deleteShoppingList?:  {
    __typename: "ShoppingList",
    createdAt: string,
    description?: string | null,
    dueDate?: string | null,
    id: string,
    isCompleted?: boolean | null,
    items?:  {
      __typename: "ModelShoppingItemConnection",
      nextToken?: string | null,
    } | null,
    name: string,
    owner?: string | null,
    updatedAt: string,
  } | null,
};

export type DeleteUserProfileMutationVariables = {
  condition?: ModelUserProfileConditionInput | null,
  input: DeleteUserProfileInput,
};

export type DeleteUserProfileMutation = {
  deleteUserProfile?:  {
    __typename: "UserProfile",
    autoUpdate?: boolean | null,
    bio?: string | null,
    cookingExperience?: UserProfileCookingExperience | null,
    createdAt: string,
    darkMode?: boolean | null,
    dataSync?: boolean | null,
    dietaryRestrictions?: string | null,
    email: string,
    emailNotifications?: boolean | null,
    familyName: string,
    favoriteCuisines?: Array< string | null > | null,
    givenName: string,
    id: string,
    location?: string | null,
    notifications?: boolean | null,
    owner?: string | null,
    preferredCuisine?: string | null,
    profileImageKey?: string | null,
    pushNotifications?: boolean | null,
    recipePortionSize?: number | null,
    recipesCreatedCount?: number | null,
    updatedAt: string,
    userId: string,
  } | null,
};

export type UpdateMenuMutationVariables = {
  condition?: ModelMenuConditionInput | null,
  input: UpdateMenuInput,
};

export type UpdateMenuMutation = {
  updateMenu?:  {
    __typename: "Menu",
    createdAt: string,
    date: string,
    id: string,
    menuItems?:  {
      __typename: "ModelMenuItemConnection",
      nextToken?: string | null,
    } | null,
    notes?: string | null,
    owner?: string | null,
    updatedAt: string,
  } | null,
};

export type UpdateMenuItemMutationVariables = {
  condition?: ModelMenuItemConditionInput | null,
  input: UpdateMenuItemInput,
};

export type UpdateMenuItemMutation = {
  updateMenuItem?:  {
    __typename: "MenuItem",
    createdAt: string,
    id: string,
    isOutside?: boolean | null,
    mealType: string,
    menu?:  {
      __typename: "Menu",
      createdAt: string,
      date: string,
      id: string,
      notes?: string | null,
      owner?: string | null,
      updatedAt: string,
    } | null,
    menuId: string,
    name?: string | null,
    notes?: string | null,
    outsideLocation?: string | null,
    owner?: string | null,
    recipe?:  {
      __typename: "Recipe",
      category?: string | null,
      cookTime?: number | null,
      cookwareNeeded?: string | null,
      createdAt: string,
      createdBy?: string | null,
      cuisine?: string | null,
      description?: string | null,
      externalUrl?: string | null,
      favorite?: boolean | null,
      id: string,
      imageUrl?: string | null,
      ingredientsJson?: string | null,
      instructionsJson?: string | null,
      name: string,
      notes?: string | null,
      owner?: string | null,
      prepTime?: number | null,
      rating?: number | null,
      servings: number,
      updatedAt: string,
    } | null,
    recipeId?: string | null,
    updatedAt: string,
  } | null,
};

export type UpdateMenuTemplateMutationVariables = {
  condition?: ModelMenuTemplateConditionInput | null,
  input: UpdateMenuTemplateInput,
};

export type UpdateMenuTemplateMutation = {
  updateMenuTemplate?:  {
    __typename: "MenuTemplate",
    createdAt: string,
    description?: string | null,
    id: string,
    name: string,
    owner?: string | null,
    templateItemsJson?: string | null,
    updatedAt: string,
  } | null,
};

export type UpdateRecipeMutationVariables = {
  condition?: ModelRecipeConditionInput | null,
  input: UpdateRecipeInput,
};

export type UpdateRecipeMutation = {
  updateRecipe?:  {
    __typename: "Recipe",
    category?: string | null,
    cookTime?: number | null,
    cookwareNeeded?: string | null,
    createdAt: string,
    createdBy?: string | null,
    cuisine?: string | null,
    description?: string | null,
    externalUrl?: string | null,
    favorite?: boolean | null,
    id: string,
    imageUrl?: string | null,
    ingredientsJson?: string | null,
    instructionsJson?: string | null,
    menuItems?:  {
      __typename: "ModelMenuItemConnection",
      nextToken?: string | null,
    } | null,
    name: string,
    notes?: string | null,
    owner?: string | null,
    prepTime?: number | null,
    rating?: number | null,
    servings: number,
    updatedAt: string,
  } | null,
};

export type UpdateShoppingItemMutationVariables = {
  condition?: ModelShoppingItemConditionInput | null,
  input: UpdateShoppingItemInput,
};

export type UpdateShoppingItemMutation = {
  updateShoppingItem?:  {
    __typename: "ShoppingItem",
    amount?: number | null,
    category?: string | null,
    createdAt: string,
    id: string,
    isChecked?: boolean | null,
    name: string,
    notes?: string | null,
    owner?: string | null,
    shoppingList?:  {
      __typename: "ShoppingList",
      createdAt: string,
      description?: string | null,
      dueDate?: string | null,
      id: string,
      isCompleted?: boolean | null,
      name: string,
      owner?: string | null,
      updatedAt: string,
    } | null,
    shoppingListId: string,
    sourceRecipe?: string | null,
    unit?: string | null,
    updatedAt: string,
  } | null,
};

export type UpdateShoppingListMutationVariables = {
  condition?: ModelShoppingListConditionInput | null,
  input: UpdateShoppingListInput,
};

export type UpdateShoppingListMutation = {
  updateShoppingList?:  {
    __typename: "ShoppingList",
    createdAt: string,
    description?: string | null,
    dueDate?: string | null,
    id: string,
    isCompleted?: boolean | null,
    items?:  {
      __typename: "ModelShoppingItemConnection",
      nextToken?: string | null,
    } | null,
    name: string,
    owner?: string | null,
    updatedAt: string,
  } | null,
};

export type UpdateUserProfileMutationVariables = {
  condition?: ModelUserProfileConditionInput | null,
  input: UpdateUserProfileInput,
};

export type UpdateUserProfileMutation = {
  updateUserProfile?:  {
    __typename: "UserProfile",
    autoUpdate?: boolean | null,
    bio?: string | null,
    cookingExperience?: UserProfileCookingExperience | null,
    createdAt: string,
    darkMode?: boolean | null,
    dataSync?: boolean | null,
    dietaryRestrictions?: string | null,
    email: string,
    emailNotifications?: boolean | null,
    familyName: string,
    favoriteCuisines?: Array< string | null > | null,
    givenName: string,
    id: string,
    location?: string | null,
    notifications?: boolean | null,
    owner?: string | null,
    preferredCuisine?: string | null,
    profileImageKey?: string | null,
    pushNotifications?: boolean | null,
    recipePortionSize?: number | null,
    recipesCreatedCount?: number | null,
    updatedAt: string,
    userId: string,
  } | null,
};

export type OnCreateMenuSubscriptionVariables = {
  filter?: ModelSubscriptionMenuFilterInput | null,
  owner?: string | null,
};

export type OnCreateMenuSubscription = {
  onCreateMenu?:  {
    __typename: "Menu",
    createdAt: string,
    date: string,
    id: string,
    menuItems?:  {
      __typename: "ModelMenuItemConnection",
      nextToken?: string | null,
    } | null,
    notes?: string | null,
    owner?: string | null,
    updatedAt: string,
  } | null,
};

export type OnCreateMenuItemSubscriptionVariables = {
  filter?: ModelSubscriptionMenuItemFilterInput | null,
  owner?: string | null,
};

export type OnCreateMenuItemSubscription = {
  onCreateMenuItem?:  {
    __typename: "MenuItem",
    createdAt: string,
    id: string,
    isOutside?: boolean | null,
    mealType: string,
    menu?:  {
      __typename: "Menu",
      createdAt: string,
      date: string,
      id: string,
      notes?: string | null,
      owner?: string | null,
      updatedAt: string,
    } | null,
    menuId: string,
    name?: string | null,
    notes?: string | null,
    outsideLocation?: string | null,
    owner?: string | null,
    recipe?:  {
      __typename: "Recipe",
      category?: string | null,
      cookTime?: number | null,
      cookwareNeeded?: string | null,
      createdAt: string,
      createdBy?: string | null,
      cuisine?: string | null,
      description?: string | null,
      externalUrl?: string | null,
      favorite?: boolean | null,
      id: string,
      imageUrl?: string | null,
      ingredientsJson?: string | null,
      instructionsJson?: string | null,
      name: string,
      notes?: string | null,
      owner?: string | null,
      prepTime?: number | null,
      rating?: number | null,
      servings: number,
      updatedAt: string,
    } | null,
    recipeId?: string | null,
    updatedAt: string,
  } | null,
};

export type OnCreateMenuTemplateSubscriptionVariables = {
  filter?: ModelSubscriptionMenuTemplateFilterInput | null,
  owner?: string | null,
};

export type OnCreateMenuTemplateSubscription = {
  onCreateMenuTemplate?:  {
    __typename: "MenuTemplate",
    createdAt: string,
    description?: string | null,
    id: string,
    name: string,
    owner?: string | null,
    templateItemsJson?: string | null,
    updatedAt: string,
  } | null,
};

export type OnCreateRecipeSubscriptionVariables = {
  filter?: ModelSubscriptionRecipeFilterInput | null,
  owner?: string | null,
};

export type OnCreateRecipeSubscription = {
  onCreateRecipe?:  {
    __typename: "Recipe",
    category?: string | null,
    cookTime?: number | null,
    cookwareNeeded?: string | null,
    createdAt: string,
    createdBy?: string | null,
    cuisine?: string | null,
    description?: string | null,
    externalUrl?: string | null,
    favorite?: boolean | null,
    id: string,
    imageUrl?: string | null,
    ingredientsJson?: string | null,
    instructionsJson?: string | null,
    menuItems?:  {
      __typename: "ModelMenuItemConnection",
      nextToken?: string | null,
    } | null,
    name: string,
    notes?: string | null,
    owner?: string | null,
    prepTime?: number | null,
    rating?: number | null,
    servings: number,
    updatedAt: string,
  } | null,
};

export type OnCreateShoppingItemSubscriptionVariables = {
  filter?: ModelSubscriptionShoppingItemFilterInput | null,
  owner?: string | null,
};

export type OnCreateShoppingItemSubscription = {
  onCreateShoppingItem?:  {
    __typename: "ShoppingItem",
    amount?: number | null,
    category?: string | null,
    createdAt: string,
    id: string,
    isChecked?: boolean | null,
    name: string,
    notes?: string | null,
    owner?: string | null,
    shoppingList?:  {
      __typename: "ShoppingList",
      createdAt: string,
      description?: string | null,
      dueDate?: string | null,
      id: string,
      isCompleted?: boolean | null,
      name: string,
      owner?: string | null,
      updatedAt: string,
    } | null,
    shoppingListId: string,
    sourceRecipe?: string | null,
    unit?: string | null,
    updatedAt: string,
  } | null,
};

export type OnCreateShoppingListSubscriptionVariables = {
  filter?: ModelSubscriptionShoppingListFilterInput | null,
  owner?: string | null,
};

export type OnCreateShoppingListSubscription = {
  onCreateShoppingList?:  {
    __typename: "ShoppingList",
    createdAt: string,
    description?: string | null,
    dueDate?: string | null,
    id: string,
    isCompleted?: boolean | null,
    items?:  {
      __typename: "ModelShoppingItemConnection",
      nextToken?: string | null,
    } | null,
    name: string,
    owner?: string | null,
    updatedAt: string,
  } | null,
};

export type OnCreateUserProfileSubscriptionVariables = {
  filter?: ModelSubscriptionUserProfileFilterInput | null,
  owner?: string | null,
};

export type OnCreateUserProfileSubscription = {
  onCreateUserProfile?:  {
    __typename: "UserProfile",
    autoUpdate?: boolean | null,
    bio?: string | null,
    cookingExperience?: UserProfileCookingExperience | null,
    createdAt: string,
    darkMode?: boolean | null,
    dataSync?: boolean | null,
    dietaryRestrictions?: string | null,
    email: string,
    emailNotifications?: boolean | null,
    familyName: string,
    favoriteCuisines?: Array< string | null > | null,
    givenName: string,
    id: string,
    location?: string | null,
    notifications?: boolean | null,
    owner?: string | null,
    preferredCuisine?: string | null,
    profileImageKey?: string | null,
    pushNotifications?: boolean | null,
    recipePortionSize?: number | null,
    recipesCreatedCount?: number | null,
    updatedAt: string,
    userId: string,
  } | null,
};

export type OnDeleteMenuSubscriptionVariables = {
  filter?: ModelSubscriptionMenuFilterInput | null,
  owner?: string | null,
};

export type OnDeleteMenuSubscription = {
  onDeleteMenu?:  {
    __typename: "Menu",
    createdAt: string,
    date: string,
    id: string,
    menuItems?:  {
      __typename: "ModelMenuItemConnection",
      nextToken?: string | null,
    } | null,
    notes?: string | null,
    owner?: string | null,
    updatedAt: string,
  } | null,
};

export type OnDeleteMenuItemSubscriptionVariables = {
  filter?: ModelSubscriptionMenuItemFilterInput | null,
  owner?: string | null,
};

export type OnDeleteMenuItemSubscription = {
  onDeleteMenuItem?:  {
    __typename: "MenuItem",
    createdAt: string,
    id: string,
    isOutside?: boolean | null,
    mealType: string,
    menu?:  {
      __typename: "Menu",
      createdAt: string,
      date: string,
      id: string,
      notes?: string | null,
      owner?: string | null,
      updatedAt: string,
    } | null,
    menuId: string,
    name?: string | null,
    notes?: string | null,
    outsideLocation?: string | null,
    owner?: string | null,
    recipe?:  {
      __typename: "Recipe",
      category?: string | null,
      cookTime?: number | null,
      cookwareNeeded?: string | null,
      createdAt: string,
      createdBy?: string | null,
      cuisine?: string | null,
      description?: string | null,
      externalUrl?: string | null,
      favorite?: boolean | null,
      id: string,
      imageUrl?: string | null,
      ingredientsJson?: string | null,
      instructionsJson?: string | null,
      name: string,
      notes?: string | null,
      owner?: string | null,
      prepTime?: number | null,
      rating?: number | null,
      servings: number,
      updatedAt: string,
    } | null,
    recipeId?: string | null,
    updatedAt: string,
  } | null,
};

export type OnDeleteMenuTemplateSubscriptionVariables = {
  filter?: ModelSubscriptionMenuTemplateFilterInput | null,
  owner?: string | null,
};

export type OnDeleteMenuTemplateSubscription = {
  onDeleteMenuTemplate?:  {
    __typename: "MenuTemplate",
    createdAt: string,
    description?: string | null,
    id: string,
    name: string,
    owner?: string | null,
    templateItemsJson?: string | null,
    updatedAt: string,
  } | null,
};

export type OnDeleteRecipeSubscriptionVariables = {
  filter?: ModelSubscriptionRecipeFilterInput | null,
  owner?: string | null,
};

export type OnDeleteRecipeSubscription = {
  onDeleteRecipe?:  {
    __typename: "Recipe",
    category?: string | null,
    cookTime?: number | null,
    cookwareNeeded?: string | null,
    createdAt: string,
    createdBy?: string | null,
    cuisine?: string | null,
    description?: string | null,
    externalUrl?: string | null,
    favorite?: boolean | null,
    id: string,
    imageUrl?: string | null,
    ingredientsJson?: string | null,
    instructionsJson?: string | null,
    menuItems?:  {
      __typename: "ModelMenuItemConnection",
      nextToken?: string | null,
    } | null,
    name: string,
    notes?: string | null,
    owner?: string | null,
    prepTime?: number | null,
    rating?: number | null,
    servings: number,
    updatedAt: string,
  } | null,
};

export type OnDeleteShoppingItemSubscriptionVariables = {
  filter?: ModelSubscriptionShoppingItemFilterInput | null,
  owner?: string | null,
};

export type OnDeleteShoppingItemSubscription = {
  onDeleteShoppingItem?:  {
    __typename: "ShoppingItem",
    amount?: number | null,
    category?: string | null,
    createdAt: string,
    id: string,
    isChecked?: boolean | null,
    name: string,
    notes?: string | null,
    owner?: string | null,
    shoppingList?:  {
      __typename: "ShoppingList",
      createdAt: string,
      description?: string | null,
      dueDate?: string | null,
      id: string,
      isCompleted?: boolean | null,
      name: string,
      owner?: string | null,
      updatedAt: string,
    } | null,
    shoppingListId: string,
    sourceRecipe?: string | null,
    unit?: string | null,
    updatedAt: string,
  } | null,
};

export type OnDeleteShoppingListSubscriptionVariables = {
  filter?: ModelSubscriptionShoppingListFilterInput | null,
  owner?: string | null,
};

export type OnDeleteShoppingListSubscription = {
  onDeleteShoppingList?:  {
    __typename: "ShoppingList",
    createdAt: string,
    description?: string | null,
    dueDate?: string | null,
    id: string,
    isCompleted?: boolean | null,
    items?:  {
      __typename: "ModelShoppingItemConnection",
      nextToken?: string | null,
    } | null,
    name: string,
    owner?: string | null,
    updatedAt: string,
  } | null,
};

export type OnDeleteUserProfileSubscriptionVariables = {
  filter?: ModelSubscriptionUserProfileFilterInput | null,
  owner?: string | null,
};

export type OnDeleteUserProfileSubscription = {
  onDeleteUserProfile?:  {
    __typename: "UserProfile",
    autoUpdate?: boolean | null,
    bio?: string | null,
    cookingExperience?: UserProfileCookingExperience | null,
    createdAt: string,
    darkMode?: boolean | null,
    dataSync?: boolean | null,
    dietaryRestrictions?: string | null,
    email: string,
    emailNotifications?: boolean | null,
    familyName: string,
    favoriteCuisines?: Array< string | null > | null,
    givenName: string,
    id: string,
    location?: string | null,
    notifications?: boolean | null,
    owner?: string | null,
    preferredCuisine?: string | null,
    profileImageKey?: string | null,
    pushNotifications?: boolean | null,
    recipePortionSize?: number | null,
    recipesCreatedCount?: number | null,
    updatedAt: string,
    userId: string,
  } | null,
};

export type OnUpdateMenuSubscriptionVariables = {
  filter?: ModelSubscriptionMenuFilterInput | null,
  owner?: string | null,
};

export type OnUpdateMenuSubscription = {
  onUpdateMenu?:  {
    __typename: "Menu",
    createdAt: string,
    date: string,
    id: string,
    menuItems?:  {
      __typename: "ModelMenuItemConnection",
      nextToken?: string | null,
    } | null,
    notes?: string | null,
    owner?: string | null,
    updatedAt: string,
  } | null,
};

export type OnUpdateMenuItemSubscriptionVariables = {
  filter?: ModelSubscriptionMenuItemFilterInput | null,
  owner?: string | null,
};

export type OnUpdateMenuItemSubscription = {
  onUpdateMenuItem?:  {
    __typename: "MenuItem",
    createdAt: string,
    id: string,
    isOutside?: boolean | null,
    mealType: string,
    menu?:  {
      __typename: "Menu",
      createdAt: string,
      date: string,
      id: string,
      notes?: string | null,
      owner?: string | null,
      updatedAt: string,
    } | null,
    menuId: string,
    name?: string | null,
    notes?: string | null,
    outsideLocation?: string | null,
    owner?: string | null,
    recipe?:  {
      __typename: "Recipe",
      category?: string | null,
      cookTime?: number | null,
      cookwareNeeded?: string | null,
      createdAt: string,
      createdBy?: string | null,
      cuisine?: string | null,
      description?: string | null,
      externalUrl?: string | null,
      favorite?: boolean | null,
      id: string,
      imageUrl?: string | null,
      ingredientsJson?: string | null,
      instructionsJson?: string | null,
      name: string,
      notes?: string | null,
      owner?: string | null,
      prepTime?: number | null,
      rating?: number | null,
      servings: number,
      updatedAt: string,
    } | null,
    recipeId?: string | null,
    updatedAt: string,
  } | null,
};

export type OnUpdateMenuTemplateSubscriptionVariables = {
  filter?: ModelSubscriptionMenuTemplateFilterInput | null,
  owner?: string | null,
};

export type OnUpdateMenuTemplateSubscription = {
  onUpdateMenuTemplate?:  {
    __typename: "MenuTemplate",
    createdAt: string,
    description?: string | null,
    id: string,
    name: string,
    owner?: string | null,
    templateItemsJson?: string | null,
    updatedAt: string,
  } | null,
};

export type OnUpdateRecipeSubscriptionVariables = {
  filter?: ModelSubscriptionRecipeFilterInput | null,
  owner?: string | null,
};

export type OnUpdateRecipeSubscription = {
  onUpdateRecipe?:  {
    __typename: "Recipe",
    category?: string | null,
    cookTime?: number | null,
    cookwareNeeded?: string | null,
    createdAt: string,
    createdBy?: string | null,
    cuisine?: string | null,
    description?: string | null,
    externalUrl?: string | null,
    favorite?: boolean | null,
    id: string,
    imageUrl?: string | null,
    ingredientsJson?: string | null,
    instructionsJson?: string | null,
    menuItems?:  {
      __typename: "ModelMenuItemConnection",
      nextToken?: string | null,
    } | null,
    name: string,
    notes?: string | null,
    owner?: string | null,
    prepTime?: number | null,
    rating?: number | null,
    servings: number,
    updatedAt: string,
  } | null,
};

export type OnUpdateShoppingItemSubscriptionVariables = {
  filter?: ModelSubscriptionShoppingItemFilterInput | null,
  owner?: string | null,
};

export type OnUpdateShoppingItemSubscription = {
  onUpdateShoppingItem?:  {
    __typename: "ShoppingItem",
    amount?: number | null,
    category?: string | null,
    createdAt: string,
    id: string,
    isChecked?: boolean | null,
    name: string,
    notes?: string | null,
    owner?: string | null,
    shoppingList?:  {
      __typename: "ShoppingList",
      createdAt: string,
      description?: string | null,
      dueDate?: string | null,
      id: string,
      isCompleted?: boolean | null,
      name: string,
      owner?: string | null,
      updatedAt: string,
    } | null,
    shoppingListId: string,
    sourceRecipe?: string | null,
    unit?: string | null,
    updatedAt: string,
  } | null,
};

export type OnUpdateShoppingListSubscriptionVariables = {
  filter?: ModelSubscriptionShoppingListFilterInput | null,
  owner?: string | null,
};

export type OnUpdateShoppingListSubscription = {
  onUpdateShoppingList?:  {
    __typename: "ShoppingList",
    createdAt: string,
    description?: string | null,
    dueDate?: string | null,
    id: string,
    isCompleted?: boolean | null,
    items?:  {
      __typename: "ModelShoppingItemConnection",
      nextToken?: string | null,
    } | null,
    name: string,
    owner?: string | null,
    updatedAt: string,
  } | null,
};

export type OnUpdateUserProfileSubscriptionVariables = {
  filter?: ModelSubscriptionUserProfileFilterInput | null,
  owner?: string | null,
};

export type OnUpdateUserProfileSubscription = {
  onUpdateUserProfile?:  {
    __typename: "UserProfile",
    autoUpdate?: boolean | null,
    bio?: string | null,
    cookingExperience?: UserProfileCookingExperience | null,
    createdAt: string,
    darkMode?: boolean | null,
    dataSync?: boolean | null,
    dietaryRestrictions?: string | null,
    email: string,
    emailNotifications?: boolean | null,
    familyName: string,
    favoriteCuisines?: Array< string | null > | null,
    givenName: string,
    id: string,
    location?: string | null,
    notifications?: boolean | null,
    owner?: string | null,
    preferredCuisine?: string | null,
    profileImageKey?: string | null,
    pushNotifications?: boolean | null,
    recipePortionSize?: number | null,
    recipesCreatedCount?: number | null,
    updatedAt: string,
    userId: string,
  } | null,
};
