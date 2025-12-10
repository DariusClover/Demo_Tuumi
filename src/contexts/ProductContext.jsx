import React, { createContext, useState } from 'react';
import { ProductService } from '../services/ProductService';

export const ProductContext = createContext(undefined);

export const ProductProvider = ({ children }) => {
  const [products, setProducts] = useState(() => ProductService.getAll());
  const [isLoading, setIsLoading] = useState(false);

  const refreshProducts = () => {
    setIsLoading(true);
    const updated = ProductService.getAll();
    setProducts(updated);
    setIsLoading(false);
  };

  const getAvailableProducts = () => {
    return products.filter(p => p.isAvailable);
  };

  const createProduct = (productData, createdBy) => {
    const result = ProductService.create(productData, createdBy);
    
    if (result.success) {
      refreshProducts();
    }
    
    return result;
  };

  const updateProduct = (id, updates) => {
    const result = ProductService.update(id, updates);
    
    if (result.success) {
      refreshProducts();
    }
    
    return result;
  };

  const deleteProduct = (id) => {
    const result = ProductService.delete(id);
    
    if (result.success) {
      refreshProducts();
    }
    
    return result;
  };

  return (
    <ProductContext.Provider
      value={{
        products,
        isLoading,
        getAvailableProducts,
        refreshProducts,
        createProduct,
        updateProduct,
        deleteProduct,
      }}
    >
      {children}
    </ProductContext.Provider>
  );
};
