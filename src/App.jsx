import React, { useState } from 'react';
import Login from './components/Login';
import TomaPedido from './components/TomaPedido';
import SecurityDashboard from './components/SecurityDashboard';
import KDSView from './components/KDSView';
import ProductManager from './components/ProductManager';
import CajaView from './components/CajaView';
import DomiciliosView from './components/DomiciliosView';


const initialProducts = [
  { id: 1, name: 'Hamburguesa Clásica', price: 25000 },
  { id: 2, name: 'Papas Fritas', price: 5000 },
  { id: 3, name: 'Gaseosa', price: 4000 },
  { id: 4, name: 'Ensalada César', price: 8000 },
  { id: 5, name: 'Salchipapas', price: 20000 },
];

function App() {
  const [userRole, setUserRole] = useState(null);
  const [currentView, setCurrentView] = useState('login');
  const [orders, setOrders] = useState([]);
  const [pendingBills, setPendingBills] = useState([]);
  const [completedSales, setCompletedSales] = useState([]);
  const [products, setProducts] = useState(initialProducts);

  const handleLogin = (role) => {
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
  };

  const handleLogout = () => {
    setUserRole(null);
    setCurrentView('login');
  };

  const handleAddOrder = (newOrder) => {
    setOrders([...orders, newOrder]);
  };

  const handleOrderReady = (order) => {
    setOrders(orders.filter(o => o.id !== order.id));
    setPendingBills([...pendingBills, { ...order, status: 'ready' }]);
  };

  const handlePayBill = (paidBill) => {
    setPendingBills(pendingBills.filter(b => b.id !== paidBill.id));
    setCompletedSales([...completedSales, { ...paidBill, status: 'paid' }]);
  };

  const handleAddDeliveryOrder = (deliveryOrder) => {
    setOrders([...orders, deliveryOrder]);
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

  return (
    <div>
      {currentView === 'login' && <Login onLogin={handleLogin} />}

      {currentView === 'pos' && (
        <TomaPedido
          onLogout={handleLogout}
          onAddOrder={handleAddOrder}
          products={products}
        />
      )}

      {currentView === 'dashboard' && (
        <SecurityDashboard
          onLogout={handleLogout}
          onGoToPOS={handleGoToPOS}
          onGoToProducts={handleGoToProducts}
          completedSales={completedSales}
        />
      )}

      {currentView === 'kds' && (
        <KDSView
          onLogout={handleLogout}
          orders={orders}
          onOrderReady={handleOrderReady}
        />
      )}

      {currentView === 'caja' && (
        <CajaView
          onLogout={handleLogout}
          pendingBills={pendingBills}
          onPayBill={handlePayBill}
        />
      )}

      {currentView === 'domicilios' && (
        <DomiciliosView
          onLogout={handleLogout}
          onAddDeliveryOrder={handleAddDeliveryOrder}
          products={products}
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
