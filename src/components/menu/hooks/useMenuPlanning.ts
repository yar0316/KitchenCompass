import { useState, useEffect, useRef } from 'react';
import { generateClient } from 'aws-amplify/api';
import { Schema } from '../../../../amplify/data/resource';
import { 
  MenuItem, 
  OutingInfo, 
  createInitialMenuItem, 
  createInitialOutingInfo,
  filterRecipesByQuery 
} from '../utils/menuPlanningUtils';

// Recipe type definition
type Recipe = {
  id: string;
  name: string;
  description?: string | null;
  cookingTime?: number | null;
  prepTime?: number | null;
  servings?: number | null;
  difficulty?: string | null;
  category?: string | null;
  tags?: string[] | null;
  owner?: string | null;
  createdAt?: string | null;
  updatedAt?: string | null;
};

// Edit meal type definition
type EditingMeal = {
  name?: string;
  recipeId?: string | null;
  menuItems?: MenuItem[];
  isOuting?: boolean;
  restaurantName?: string;
  notes?: string;
};

const client = generateClient<Schema>();

export const useMenuPlanning = (open: boolean, editingMeal: EditingMeal | null) => {
  const [menuItems, setMenuItems] = useState<MenuItem[]>([createInitialMenuItem()]);
  const [currentEditingItem, setCurrentEditingItem] = useState<MenuItem | null>(null);
  const [editingItemId, setEditingItemId] = useState<string | null>(null);
  const [tempItemName, setTempItemName] = useState('');
  const [outingInfo, setOutingInfo] = useState<OutingInfo>(createInitialOutingInfo());
  const inputRef = useRef<HTMLInputElement>(null);
  // Recipe-related state
  const [allRecipes, setAllRecipes] = useState<Recipe[]>([]);
  const [filteredRecipes, setFilteredRecipes] = useState<Recipe[]>([]);
  const [loadingRecipes, setLoadingRecipes] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Menu item operations
  const handleAddMenuItem = () => {
    const newItem = createInitialMenuItem();
    setMenuItems([...menuItems, newItem]);
    setCurrentEditingItem(newItem);
    setEditingItemId(newItem.id);
    setTempItemName('');
    
    setTimeout(() => {
      if (inputRef.current) {
        inputRef.current.focus();
      }
    }, 100);
  };

  const handleDeleteMenuItem = (itemId: string) => {
    if (menuItems.length <= 1) return;

    const updatedItems = menuItems.filter(item => item.id !== itemId);
    setMenuItems(updatedItems);    if (currentEditingItem && currentEditingItem.id === itemId) {
      setCurrentEditingItem(updatedItems[0] || null);

      if (updatedItems[0]) {
        // Note: selectedRecipe is handled in useRecipeSelection hook
      }
    }

    if (editingItemId === itemId) {
      setEditingItemId(null);
    }
  };

  const handleSelectMenuItem = (item: MenuItem) => {
    setCurrentEditingItem(item);
  };

  const handleStartEditing = (item: MenuItem) => {
    setEditingItemId(item.id);
    setTempItemName(item.name);
    setCurrentEditingItem(item);
    
    setTimeout(() => {
      if (inputRef.current) {
        inputRef.current.focus();
      }
    }, 100);
  };

  const handleFinishEditing = () => {
    if (editingItemId) {
      const updatedItems = menuItems.map(item => {
        if (item.id === editingItemId) {
          return {
            ...item,
            name: tempItemName.trim() || item.name,
          };
        }
        return item;
      });
      setMenuItems(updatedItems);
      setEditingItemId(null);
    }
  };

  // Outing operations
  const handleOutingToggle = (event: React.ChangeEvent<HTMLInputElement>) => {
    setOutingInfo({
      ...outingInfo,
      isOuting: event.target.checked
    });
  };

  const handleOutingInfoChange = (field: keyof OutingInfo, value: string) => {
    setOutingInfo({
      ...outingInfo,
      [field]: value
    });
  };

  // Recipe operations
  const handleAddMenuItemFromRecipe = (recipe: { id: string; name: string }) => {
    if (!recipe) return;

    const newItem: MenuItem = {
      id: `menu-${Date.now()}`,
      name: recipe.name,
      recipeId: recipe.id
    };

    const updatedItems = [...menuItems, newItem];
    setMenuItems(updatedItems);
    setCurrentEditingItem(newItem);
  };

  // Load recipes
  useEffect(() => {
    if (open) {
      setLoadingRecipes(true);
      client.models.Recipe.list({})
        .then(res => {
          setAllRecipes(res.data || []);
          setFilteredRecipes(res.data || []);
        })
        .finally(() => setLoadingRecipes(false));
    }
  }, [open]);

  // Filter recipes by search query
  useEffect(() => {
    setFilteredRecipes(filterRecipesByQuery(allRecipes, searchQuery));
  }, [searchQuery, allRecipes]);

  // Initialize state from editing meal
  useEffect(() => {
    if (open && editingMeal) {
      // Initialize menu items
      if (editingMeal.menuItems && Array.isArray(editingMeal.menuItems) && editingMeal.menuItems.length > 0) {
        setMenuItems(editingMeal.menuItems);
        setCurrentEditingItem(editingMeal.menuItems[0]);
      } else {
        const initialItem: MenuItem = {
          id: `menu-${Date.now()}`,
          name: editingMeal.name || '',
          recipeId: editingMeal.recipeId || null
        };
        setMenuItems([initialItem]);
        setCurrentEditingItem(initialItem);
      }

      // Initialize outing info
      if (editingMeal.isOuting) {
        setOutingInfo({
          isOuting: true,
          restaurantName: editingMeal.restaurantName || '',
          notes: editingMeal.notes || ''
        });
      } else {
        setOutingInfo(createInitialOutingInfo());
      }
    } else if (open) {
      // Initialize for new meal
      const initialItem = createInitialMenuItem();
      setMenuItems([initialItem]);
      setCurrentEditingItem(initialItem);
      setOutingInfo(createInitialOutingInfo());
      setEditingItemId(initialItem.id);
      setTempItemName('');
      
      setTimeout(() => {
        if (inputRef.current) {
          inputRef.current.focus();
        }
      }, 100);
    }

    setSearchQuery('');
    setFilteredRecipes(allRecipes);
  }, [open, editingMeal, allRecipes]);

  return {
    // State
    menuItems,
    currentEditingItem,
    editingItemId,
    tempItemName,
    outingInfo,
    allRecipes,
    filteredRecipes,
    loadingRecipes,
    searchQuery,
    inputRef,
    
    // Setters
    setMenuItems,
    setCurrentEditingItem,
    setTempItemName,
    setSearchQuery,
    
    // Operations
    handleAddMenuItem,
    handleDeleteMenuItem,
    handleSelectMenuItem,
    handleStartEditing,
    handleFinishEditing,
    handleOutingToggle,
    handleOutingInfoChange,
    handleAddMenuItemFromRecipe
  };
};
