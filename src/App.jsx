import React, { useState, useEffect } from 'react';
import Login from './components/Login';
import TomaPedido from './components/TomaPedido';
import SecurityDashboard from './components/SecurityDashboard';
import KDSView from './components/KDSView';
import ProductManager from './components/ProductManager';
import CajaView from './components/CajaView';
import DomiciliosView from './components/DomiciliosView';
import EmployeeManager from './components/EmployeeManager';
import Toast from './components/Toast';


const initialProducts = [
  { id: 1, name: 'Hamburguesa Clásica', price: 25000 },
  { id: 2, name: 'Papas Fritas', price: 5000 },
  { id: 3, name: 'Gaseosa', price: 4000 },
  { id: 4, name: 'Ensalada César', price: 8000 },
  { id: 5, name: 'Salchipapas', price: 20000 },
];

// Función para cargar datos desde localStorage
const loadFromLocalStorage = (key, defaultValue) => {
  try {
    const saved = localStorage.getItem(key);
    return saved ? JSON.parse(saved) : defaultValue;
  } catch (error) {
    console.error(`Error loading ${key} from localStorage:`, error);
    return defaultValue;
  }
};

// Función para guardar datos en localStorage
const saveToLocalStorage = (key, value) => {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.error(`Error saving ${key} to localStorage:`, error);
  }
};

function App() {
  const [userRole, setUserRole] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);
  const [currentView, setCurrentView] = useState('login');
  const [orders, setOrders] = useState(() => loadFromLocalStorage('orders', []));
  const [pendingBills, setPendingBills] = useState(() => loadFromLocalStorage('pendingBills', []));
  const [completedSales, setCompletedSales] = useState(() => loadFromLocalStorage('completedSales', []));
  const [products, setProducts] = useState(() => loadFromLocalStorage('products', initialProducts));
  const [employees, setEmployees] = useState(() => loadFromLocalStorage('employees', []));
  const [toast, setToast] = useState(null);

  // Guardar orders en localStorage cuando cambien
  useEffect(() => {
    saveToLocalStorage('orders', orders);
  }, [orders]);

  // Guardar pendingBills en localStorage cuando cambien
  useEffect(() => {
    saveToLocalStorage('pendingBills', pendingBills);
  }, [pendingBills]);

  // Guardar completedSales en localStorage cuando cambien
  useEffect(() => {
    saveToLocalStorage('completedSales', completedSales);
  }, [completedSales]);

  // Guardar products en localStorage cuando cambien
  useEffect(() => {
    saveToLocalStorage('products', products);
  }, [products]);

  // Guardar employees en localStorage cuando cambien
  useEffect(() => {
    saveToLocalStorage('employees', employees);
  }, [employees]);

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const handleLogin = (role, userData) => {
    setCurrentUser(userData);
    setUserRole(role);
    if (role === 'mesero') {
      setCurrentView('pos');
    } else if (role === 'admin') {
      setCurrentView('dashboard');
    } else if (role === 'cocina') {
      setCurrentView('kds');
    } else if (role === 'cajero') {
      setCurrentView('caja');
    } else if (role === 'domicilios') {
      setCurrentView('domicilios');
    }
    showToast(`👋 Bienvenido, ${userData.name}!`);
  };

  const handleLogout = () => {
    showToast(`👋 Hasta luego, ${currentUser.name}`);
    setTimeout(() => {
      setUserRole(null);
      setCurrentUser(null);
      setCurrentView('login');
    }, 1000);
  };

  const handleAddOrder = (newOrder) => {
    setOrders([...orders, newOrder]);
    showToast('📋 Pedido enviado a cocina');
  };

  const handleOrderReady = (order) => {
    setOrders(orders.filter(o => o.id !== order.id));
    setPendingBills([...pendingBills, { ...order, status: 'ready' }]);
    showToast('✅ Pedido listo para cobrar');
  };

  const handlePayBill = (paidBill) => {
    setPendingBills(pendingBills.filter(b => b.id !== paidBill.id));
    setCompletedSales([...completedSales, { ...paidBill, status: 'paid' }]);
    showToast(`💵 Pago registrado: $${paidBill.total.toLocaleString()}`);
  };

  const handleAddDeliveryOrder = (deliveryOrder) => {
    setOrders([...orders, deliveryOrder]);
    showToast('📦 Pedido a domicilio registrado');
  };

  const handleGoToPOS = () => {
    if (userRole === 'admin') {
      setCurrentView('pos');
    }
  };

  const handleGoToProducts = () => {
    if (userRole === 'admin') {
      setCurrentView('admin-products');
    }
  };

  const handleBackToDashboard = () => {
    if (userRole === 'admin') {
      setCurrentView('dashboard');
    }
  };

  const handleAddProduct = (product) => {
    setProducts([...products, product]);
  };

  const handleUpdateProduct = (updatedProduct) => {
    setProducts(products.map(p => p.id === updatedProduct.id ? updatedProduct : p));
  };

  const handleDeleteProduct = (id) => {
    setProducts(products.filter(p => p.id !== id));
  };

  const handleGoToEmployees = () => {
    if (userRole === 'admin') {
      setCurrentView('admin-employees');
    }
  };

  const handleAddEmployee = (employee) => {
    setEmployees([...employees, employee]);
  };

  const handleUpdateEmployee = (updatedEmployee) => {
    setEmployees(employees.map(e => e.id === updatedEmployee.id ? updatedEmployee : e));
  };

  const handleDeleteEmployee = (id) => {
    setEmployees(employees.filter(e => e.id !== id));
  };

  return (
    <div>
      {toast && <Toast message={toast.message} type={toast.type} />}
      
      {currentView === 'login' && <Login onLogin={handleLogin} employees={employees} />}

      {currentView === 'pos' && (
        <TomaPedido
          onLogout={handleLogout}
          onAddOrder={handleAddOrder}
          products={products}
          currentUser={currentUser}
        />
      )}

      {currentView === 'dashboard' && (
        <SecurityDashboard
          onLogout={handleLogout}
          onGoToPOS={handleGoToPOS}
          onGoToProducts={handleGoToProducts}
          onGoToEmployees={handleGoToEmployees}
          completedSales={completedSales}
          currentUser={currentUser}
        />
      )}

      {currentView === 'kds' && (
        <KDSView
          onLogout={handleLogout}
          orders={orders}
          onOrderReady={handleOrderReady}
          currentUser={currentUser}
        />
      )}

      {currentView === 'caja' && (
        <CajaView
          onLogout={handleLogout}
          pendingBills={pendingBills}
          onPayBill={handlePayBill}
          currentUser={currentUser}
        />
      )}

      {currentView === 'domicilios' && (
        <DomiciliosView
          onLogout={handleLogout}
          onAddDeliveryOrder={handleAddDeliveryOrder}
          products={products}
          currentUser={currentUser}
        />
      )}

      {currentView === 'admin-products' && (
        <ProductManager
          products={products}
          onAddProduct={handleAddProduct}
          onUpdateProduct={handleUpdateProduct}
          onDeleteProduct={handleDeleteProduct}
          onBack={handleBackToDashboard}
        />
      )}

      {currentView === 'admin-employees' && (
        <EmployeeManager
          employees={employees}
          onAddEmployee={handleAddEmployee}
          onUpdateEmployee={handleUpdateEmployee}
          onDeleteEmployee={handleDeleteEmployee}
          onBack={handleBackToDashboard}
        />
      )}

      {currentView === 'pos' && userRole === 'admin' && (
        <div className="fixed bottom-4 right-4">
          <button
            onClick={handleBackToDashboard}
            className="bg-gray-800 text-white px-4 py-2 rounded shadow hover:bg-gray-700"
          >
            Volver al Dashboard
          </button>
        </div>
      )}
    </div>
  );
}

export default App;
