import { ModelInit, MutableModel, PersistentModelConstructor } from "@aws-amplify/datastore";
import { initSchema } from "@aws-amplify/datastore";

import { schema } from "./schema";

export enum UserProfileCookingExperience {
  BEGINNER = "BEGINNER",
  INTERMEDIATE = "INTERMEDIATE",
  ADVANCED = "ADVANCED"
}

type EagerUserProfileModel = {
  readonly [__modelMeta__]: {
    identifier: ManagedIdentifier<UserProfile, 'id'>;
    readOnlyFields: 'createdAt' | 'updatedAt';
  };
  readonly id: string;
  readonly userId: string;
  readonly givenName: string;
  readonly familyName: string;
  readonly preferredCuisine?: string | null;
  readonly email: string;
  readonly profileImageKey?: string | null;
  readonly bio?: string | null;
  readonly location?: string | null;
  readonly dietaryRestrictions?: string | null;
  readonly cookingExperience?: UserProfileCookingExperience | keyof typeof UserProfileCookingExperience | null;
  readonly notifications?: boolean | null;
  readonly emailNotifications?: boolean | null;
  readonly pushNotifications?: boolean | null;
  readonly darkMode?: boolean | null;
  readonly autoUpdate?: boolean | null;
  readonly recipePortionSize?: number | null;
  readonly dataSync?: boolean | null;
  readonly recipesCreatedCount?: number | null;
  readonly favoriteCuisines?: (string | null)[] | null;
  readonly createdAt?: string | null;
  readonly updatedAt?: string | null;
}

type LazyUserProfileModel = {
  readonly [__modelMeta__]: {
    identifier: ManagedIdentifier<UserProfile, 'id'>;
    readOnlyFields: 'createdAt' | 'updatedAt';
  };
  readonly id: string;
  readonly userId: string;
  readonly givenName: string;
  readonly familyName: string;
  readonly preferredCuisine?: string | null;
  readonly email: string;
  readonly profileImageKey?: string | null;
  readonly bio?: string | null;
  readonly location?: string | null;
  readonly dietaryRestrictions?: string | null;
  readonly cookingExperience?: UserProfileCookingExperience | keyof typeof UserProfileCookingExperience | null;
  readonly notifications?: boolean | null;
  readonly emailNotifications?: boolean | null;
  readonly pushNotifications?: boolean | null;
  readonly darkMode?: boolean | null;
  readonly autoUpdate?: boolean | null;
  readonly recipePortionSize?: number | null;
  readonly dataSync?: boolean | null;
  readonly recipesCreatedCount?: number | null;
  readonly favoriteCuisines?: (string | null)[] | null;
  readonly createdAt?: string | null;
  readonly updatedAt?: string | null;
}

export declare type UserProfileModel = LazyLoading extends LazyLoadingDisabled ? EagerUserProfileModel : LazyUserProfileModel

export declare const UserProfileModel: (new (init: ModelInit<UserProfileModel>) => UserProfileModel) & {
  copyOf(source: UserProfileModel, mutator: (draft: MutableModel<UserProfileModel>) => MutableModel<UserProfileModel> | void): UserProfileModel;
}

type EagerRecipeModel = {
  readonly [__modelMeta__]: {
    identifier: ManagedIdentifier<Recipe, 'id'>;
    readOnlyFields: 'createdAt' | 'updatedAt';
  };
  readonly id: string;
  readonly name: string;
  readonly description?: string | null;
  readonly prepTime?: number | null;
  readonly cookTime?: number | null;
  readonly servings: number;
  readonly category?: string | null;
  readonly cuisine?: string | null;
  readonly imageUrl?: string | null;
  readonly externalUrl?: string | null;
  readonly rating?: number | null;
  readonly notes?: string | null;
  readonly favorite?: boolean | null;
  readonly ingredientsJson?: string | null;
  readonly instructionsJson?: string | null;
  readonly cookwareNeeded?: string | null;
  readonly createdBy?: string | null;
  readonly owner?: string | null;
  readonly menuItems?: (MenuItemModel | null)[] | null;
  readonly createdAt?: string | null;
  readonly updatedAt?: string | null;
}

type LazyRecipeModel = {
  readonly [__modelMeta__]: {
    identifier: ManagedIdentifier<Recipe, 'id'>;
    readOnlyFields: 'createdAt' | 'updatedAt';
  };
  readonly id: string;
  readonly name: string;
  readonly description?: string | null;
  readonly prepTime?: number | null;
  readonly cookTime?: number | null;
  readonly servings: number;
  readonly category?: string | null;
  readonly cuisine?: string | null;
  readonly imageUrl?: string | null;
  readonly externalUrl?: string | null;
  readonly rating?: number | null;
  readonly notes?: string | null;
  readonly favorite?: boolean | null;
  readonly ingredientsJson?: string | null;
  readonly instructionsJson?: string | null;
  readonly cookwareNeeded?: string | null;
  readonly createdBy?: string | null;
  readonly owner?: string | null;
  readonly menuItems: AsyncCollection<MenuItemModel>;
  readonly createdAt?: string | null;
  readonly updatedAt?: string | null;
}

export declare type RecipeModel = LazyLoading extends LazyLoadingDisabled ? EagerRecipeModel : LazyRecipeModel

export declare const RecipeModel: (new (init: ModelInit<RecipeModel>) => RecipeModel) & {
  copyOf(source: RecipeModel, mutator: (draft: MutableModel<RecipeModel>) => MutableModel<RecipeModel> | void): RecipeModel;
}

type EagerMenuModel = {
  readonly [__modelMeta__]: {
    identifier: ManagedIdentifier<Menu, 'id'>;
    readOnlyFields: 'createdAt' | 'updatedAt';
  };
  readonly id: string;
  readonly date: string;
  readonly notes?: string | null;
  readonly owner?: string | null;
  readonly menuItems?: (MenuItemModel | null)[] | null;
  readonly createdAt?: string | null;
  readonly updatedAt?: string | null;
}

type LazyMenuModel = {
  readonly [__modelMeta__]: {
    identifier: ManagedIdentifier<Menu, 'id'>;
    readOnlyFields: 'createdAt' | 'updatedAt';
  };
  readonly id: string;
  readonly date: string;
  readonly notes?: string | null;
  readonly owner?: string | null;
  readonly menuItems: AsyncCollection<MenuItemModel>;
  readonly createdAt?: string | null;
  readonly updatedAt?: string | null;
}

export declare type MenuModel = LazyLoading extends LazyLoadingDisabled ? EagerMenuModel : LazyMenuModel

export declare const MenuModel: (new (init: ModelInit<MenuModel>) => MenuModel) & {
  copyOf(source: MenuModel, mutator: (draft: MutableModel<MenuModel>) => MutableModel<MenuModel> | void): MenuModel;
}

type EagerMenuItemModel = {
  readonly [__modelMeta__]: {
    identifier: ManagedIdentifier<MenuItem, 'id'>;
    readOnlyFields: 'createdAt' | 'updatedAt';
  };
  readonly id: string;
  readonly name?: string | null;
  readonly mealType: string;
  readonly isOutside?: boolean | null;
  readonly outsideLocation?: string | null;
  readonly notes?: string | null;
  readonly menuId: string;
  readonly menu?: MenuModel | null;
  readonly recipeId?: string | null;
  readonly recipe?: RecipeModel | null;
  readonly createdAt?: string | null;
  readonly updatedAt?: string | null;
}

type LazyMenuItemModel = {
  readonly [__modelMeta__]: {
    identifier: ManagedIdentifier<MenuItem, 'id'>;
    readOnlyFields: 'createdAt' | 'updatedAt';
  };
  readonly id: string;
  readonly name?: string | null;
  readonly mealType: string;
  readonly isOutside?: boolean | null;
  readonly outsideLocation?: string | null;
  readonly notes?: string | null;
  readonly menuId: string;
  readonly menu: AsyncItem<MenuModel | undefined>;
  readonly recipeId?: string | null;
  readonly recipe: AsyncItem<RecipeModel | undefined>;
  readonly createdAt?: string | null;
  readonly updatedAt?: string | null;
}

export declare type MenuItemModel = LazyLoading extends LazyLoadingDisabled ? EagerMenuItemModel : LazyMenuItemModel

export declare const MenuItemModel: (new (init: ModelInit<MenuItemModel>) => MenuItemModel) & {
  copyOf(source: MenuItemModel, mutator: (draft: MutableModel<MenuItemModel>) => MutableModel<MenuItemModel> | void): MenuItemModel;
}

type EagerShoppingListModel = {
  readonly [__modelMeta__]: {
    identifier: ManagedIdentifier<ShoppingList, 'id'>;
    readOnlyFields: 'createdAt' | 'updatedAt';
  };
  readonly id: string;
  readonly name: string;
  readonly description?: string | null;
  readonly dueDate?: string | null;
  readonly isCompleted?: boolean | null;
  readonly owner?: string | null;
  readonly items?: (ShoppingItemModel | null)[] | null;
  readonly createdAt?: string | null;
  readonly updatedAt?: string | null;
}

type LazyShoppingListModel = {
  readonly [__modelMeta__]: {
    identifier: ManagedIdentifier<ShoppingList, 'id'>;
    readOnlyFields: 'createdAt' | 'updatedAt';
  };
  readonly id: string;
  readonly name: string;
  readonly description?: string | null;
  readonly dueDate?: string | null;
  readonly isCompleted?: boolean | null;
  readonly owner?: string | null;
  readonly items: AsyncCollection<ShoppingItemModel>;
  readonly createdAt?: string | null;
  readonly updatedAt?: string | null;
}

export declare type ShoppingListModel = LazyLoading extends LazyLoadingDisabled ? EagerShoppingListModel : LazyShoppingListModel

export declare const ShoppingListModel: (new (init: ModelInit<ShoppingListModel>) => ShoppingListModel) & {
  copyOf(source: ShoppingListModel, mutator: (draft: MutableModel<ShoppingListModel>) => MutableModel<ShoppingListModel> | void): ShoppingListModel;
}

type EagerShoppingItemModel = {
  readonly [__modelMeta__]: {
    identifier: ManagedIdentifier<ShoppingItem, 'id'>;
    readOnlyFields: 'createdAt' | 'updatedAt';
  };
  readonly id: string;
  readonly name: string;
  readonly amount?: number | null;
  readonly unit?: string | null;
  readonly category?: string | null;
  readonly isChecked?: boolean | null;
  readonly notes?: string | null;
  readonly shoppingListId: string;
  readonly shoppingList?: ShoppingListModel | null;
  readonly sourceRecipe?: string | null;
  readonly createdAt?: string | null;
  readonly updatedAt?: string | null;
}

type LazyShoppingItemModel = {
  readonly [__modelMeta__]: {
    identifier: ManagedIdentifier<ShoppingItem, 'id'>;
    readOnlyFields: 'createdAt' | 'updatedAt';
  };
  readonly id: string;
  readonly name: string;
  readonly amount?: number | null;
  readonly unit?: string | null;
  readonly category?: string | null;
  readonly isChecked?: boolean | null;
  readonly notes?: string | null;
  readonly shoppingListId: string;
  readonly shoppingList: AsyncItem<ShoppingListModel | undefined>;
  readonly sourceRecipe?: string | null;
  readonly createdAt?: string | null;
  readonly updatedAt?: string | null;
}

export declare type ShoppingItemModel = LazyLoading extends LazyLoadingDisabled ? EagerShoppingItemModel : LazyShoppingItemModel

export declare const ShoppingItemModel: (new (init: ModelInit<ShoppingItemModel>) => ShoppingItemModel) & {
  copyOf(source: ShoppingItemModel, mutator: (draft: MutableModel<ShoppingItemModel>) => MutableModel<ShoppingItemModel> | void): ShoppingItemModel;
}

type EagerMenuTemplateModel = {
  readonly [__modelMeta__]: {
    identifier: ManagedIdentifier<MenuTemplate, 'id'>;
    readOnlyFields: 'createdAt' | 'updatedAt';
  };
  readonly id: string;
  readonly name: string;
  readonly description?: string | null;
  readonly owner?: string | null;
  readonly templateItemsJson?: string | null;
  readonly createdAt?: string | null;
  readonly updatedAt?: string | null;
}

type LazyMenuTemplateModel = {
  readonly [__modelMeta__]: {
    identifier: ManagedIdentifier<MenuTemplate, 'id'>;
    readOnlyFields: 'createdAt' | 'updatedAt';
  };
  readonly id: string;
  readonly name: string;
  readonly description?: string | null;
  readonly owner?: string | null;
  readonly templateItemsJson?: string | null;
  readonly createdAt?: string | null;
  readonly updatedAt?: string | null;
}

export declare type MenuTemplateModel = LazyLoading extends LazyLoadingDisabled ? EagerMenuTemplateModel : LazyMenuTemplateModel

export declare const MenuTemplateModel: (new (init: ModelInit<MenuTemplateModel>) => MenuTemplateModel) & {
  copyOf(source: MenuTemplateModel, mutator: (draft: MutableModel<MenuTemplateModel>) => MutableModel<MenuTemplateModel> | void): MenuTemplateModel;
}



const { UserProfile, Recipe, Menu, MenuItem, ShoppingList, ShoppingItem, MenuTemplate } = initSchema(schema) as {
  UserProfile: PersistentModelConstructor<UserProfileModel>;
  Recipe: PersistentModelConstructor<RecipeModel>;
  Menu: PersistentModelConstructor<MenuModel>;
  MenuItem: PersistentModelConstructor<MenuItemModel>;
  ShoppingList: PersistentModelConstructor<ShoppingListModel>;
  ShoppingItem: PersistentModelConstructor<ShoppingItemModel>;
  MenuTemplate: PersistentModelConstructor<MenuTemplateModel>;
};

export {
  UserProfile,
  Recipe,
  Menu,
  MenuItem,
  ShoppingList,
  ShoppingItem,
  MenuTemplate
};