import React from 'react';
import { AuthProvider } from './contexts/AuthContext';
import { CategoryProvider } from './contexts/CategoryContext';
import { ProductProvider } from './contexts/ProductContext';
import { OrderProvider } from './contexts/OrderContext';
import { EmployeeProvider } from './contexts/EmployeeContext';
import { ToastProvider } from './contexts/ToastContext';
import AppRouter from './AppRouter';

/**
 * App - Componente raíz con arquitectura refactorizada
 * 
 * Arquitectura:
 * - Context API para estado global (elimina prop drilling)
 * - Service Layer para lógica de negocio
 * - Repository Pattern para persistencia
 * - Factory Pattern para creación de entidades
 * 
 * Orden de Providers (importante):
 * 1. AuthProvider - Debe estar primero (otros dependen de auth)
 * 2. CategoryProvider - Necesario antes de Products
 * 3. ProductProvider - Depende de Categories
 * 4. OrderProvider - Puede usar Products
 * 5. EmployeeProvider - Independiente
 * 6. ToastProvider - Debe estar último (todos pueden usarlo)
 */
function App() {
  return (
    <AuthProvider>
      <CategoryProvider>
        <ProductProvider>
          <OrderProvider>
            <EmployeeProvider>
              <ToastProvider>
                <AppRouter />
              </ToastProvider>
            </EmployeeProvider>
          </OrderProvider>
        </ProductProvider>
      </CategoryProvider>
    </AuthProvider>
  );
}

export default App;
