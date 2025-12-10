import React, { useState, useEffect } from 'react';
import { useAuth } from './hooks/useAuth';
import { ROLE_CONFIG } from './constants/roles';
import Toast from './components/Toast';
import { useToast } from './hooks/useToast';

// Importar componentes
import Login from './components/Login';
import Register from './components/Register';
import TomaPedido from './components/TomaPedido';
import SecurityDashboard from './components/SecurityDashboard';
import KDSView from './components/KDSView';
import CajaView from './components/CajaView';
import DomiciliosView from './components/DomiciliosView';
import ProductManager from './components/ProductManager';
import EmployeeManager from './components/EmployeeManager';
import CategoryManager from './components/CategoryManager';

/**
 * AppRouter - Maneja la navegación y renderizado de vistas
 * Usa AuthContext para determinar acceso y vistas
 */
const AppRouter = () => {
  const { currentUser, isAuthenticated, login, register, logout, hasUsers } = useAuth();
  const { toast, showSuccess, showError } = useToast();
  
  const getInitialView = () => {
    if (isAuthenticated && currentUser) {
      return ROLE_CONFIG[currentUser.role]?.defaultView || 'dashboard';
    }
    return hasUsers() ? 'login' : 'register';
  };
  
  const [currentView, setCurrentView] = useState(getInitialView);

  // Actualizar vista cuando cambie autenticación
  useEffect(() => {
    if (!isAuthenticated) {
      setCurrentView(hasUsers() ? 'login' : 'register');
    } else if (currentUser && currentView === 'login') {
      const defaultView = ROLE_CONFIG[currentUser.role]?.defaultView || 'dashboard';
      setCurrentView(defaultView);
    }
  }, [isAuthenticated, currentUser, hasUsers, currentView]);

  // Handlers
  const handleLogin = (username, password) => {
    const result = login(username, password);
    
    if (result.success) {
      showSuccess(`👋 Bienvenido, ${result.user.name}!`);
      const defaultView = ROLE_CONFIG[result.user.role]?.defaultView || 'dashboard';
      setCurrentView(defaultView);
    } else {
      showError(result.error || 'Error al iniciar sesión');
    }
  };

  const handleRegister = (userData) => {
    const result = register(userData);
    
    if (result.success) {
      if (result.isFirstUser) {
        showSuccess(`🎉 ¡Bienvenido! Eres el administrador del sistema`);
      } else {
        showSuccess(`✅ Cuenta creada exitosamente`);
      }
      setCurrentView('dashboard');
      return result;
    } else {
      return result;
    }
  };

  const handleLogout = () => {
    showSuccess(`👋 Hasta luego, ${currentUser?.name}`);
    setTimeout(() => {
      logout();
      setCurrentView('login');
    }, 1000);
  };

  const handleNavigate = (view) => {
    setCurrentView(view);
  };

  const handleGoToLogin = () => {
    setCurrentView('login');
  };

  const handleGoToRegister = () => {
    setCurrentView('register');
  };

  // Renderizado de vistas
  const renderView = () => {
    // Vistas públicas (sin autenticación)
    if (!isAuthenticated) {
      switch (currentView) {
        case 'register':
          return <Register onRegister={handleRegister} onGoToLogin={handleGoToLogin} />;
        case 'login':
        default:
          return (
            <Login 
              onLogin={handleLogin} 
              onGoToRegister={hasUsers() ? null : handleGoToRegister}
            />
          );
      }
    }

    // Vistas protegidas (requieren autenticación)
    switch (currentView) {
      // Vista POS
      case 'pos':
        return <TomaPedido onLogout={handleLogout} currentUser={currentUser} />;

      // Vista Dashboard (Admin)
      case 'dashboard':
        return (
          <SecurityDashboard
            onLogout={handleLogout}
            onNavigate={handleNavigate}
            currentUser={currentUser}
          />
        );

      // Vista Cocina
      case 'kds':
        return <KDSView onLogout={handleLogout} currentUser={currentUser} />;

      // Vista Caja
      case 'caja':
        return <CajaView onLogout={handleLogout} currentUser={currentUser} />;

      // Vista Domicilios
      case 'domicilios':
        return <DomiciliosView onLogout={handleLogout} currentUser={currentUser} />;

      // Gestión de Productos (Admin)
      case 'admin-products':
        if (currentUser?.role !== 'admin') {
          setCurrentView('dashboard');
          return null;
        }
        return (
          <ProductManager
            onBack={() => handleNavigate('dashboard')}
          />
        );

      // Gestión de Categorías (Admin)
      case 'admin-categories':
        if (currentUser?.role !== 'admin') {
          setCurrentView('dashboard');
          return null;
        }
        return (
          <CategoryManager
            onBack={() => handleNavigate('dashboard')}
          />
        );

      // Gestión de Empleados (Admin)
      case 'admin-employees':
        if (currentUser?.role !== 'admin') {
          setCurrentView('dashboard');
          return null;
        }
        return (
          <EmployeeManager
            onBack={() => handleNavigate('dashboard')}
          />
        );

      default: {
        // Vista por defecto según rol
        const defaultView = ROLE_CONFIG[currentUser?.role]?.defaultView || 'dashboard';
        if (currentView !== defaultView) {
          setCurrentView(defaultView);
        }
        return null;
      }
    }
  };

  return (
    <div className="min-h-screen">
      {toast && <Toast message={toast.message} type={toast.type} />}
      {renderView()}
      
      {/* Botón flotante para admin en vista POS */}
      {isAuthenticated && currentUser?.role === 'admin' && currentView === 'pos' && (
        <div className="fixed bottom-4 right-4 z-50">
          <button
            onClick={() => handleNavigate('dashboard')}
            className="bg-gray-800 text-white px-4 py-2 rounded-lg shadow-lg hover:bg-gray-700 transition"
          >
            ⚙️ Volver al Dashboard
          </button>
        </div>
      )}
    </div>
  );
};

export default AppRouter;
