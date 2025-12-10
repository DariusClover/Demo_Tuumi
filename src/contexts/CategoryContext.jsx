import React, { createContext, useState } from 'react';
import { CategoryService } from '../services/CategoryService';

export const CategoryContext = createContext(undefined);

export const CategoryProvider = ({ children }) => {
  const [categories, setCategories] = useState(() => CategoryService.initializeDefaultCategories());
  const [isLoading, setIsLoading] = useState(false);

  const refreshCategories = () => {
    setIsLoading(true);
    const updated = CategoryService.getAll();
    setCategories(updated);
    setIsLoading(false);
  };

  const getActiveCategories = () => {
    return categories.filter(cat => cat.isActive);
  };

  const createCategory = (categoryData, createdBy) => {
    const result = CategoryService.create(categoryData, createdBy);
    
    if (result.success) {
      refreshCategories();
    }
    
    return result;
  };

  const updateCategory = (id, updates) => {
    const result = CategoryService.update(id, updates);
    
    if (result.success) {
      refreshCategories();
    }
    
    return result;
  };

  const deleteCategory = (id) => {
    const result = CategoryService.delete(id);
    
    if (result.success) {
      refreshCategories();
    }
    
    return result;
  };

  const reorderCategories = (categoryOrders) => {
    const result = CategoryService.reorder(categoryOrders);
    
    if (result.success) {
      refreshCategories();
    }
    
    return result;
  };

  return (
    <CategoryContext.Provider
      value={{
        categories,
        isLoading,
        getActiveCategories,
        refreshCategories,
        createCategory,
        updateCategory,
        deleteCategory,
        reorderCategories,
      }}
    >
      {children}
    </CategoryContext.Provider>
  );
};
