import React, { useState } from 'react';
import { useOrders } from '../hooks/useOrders';

const SecurityDashboard = ({ onLogout, onNavigate, currentUser }) => {
  const { getSalesMetrics } = useOrders();
  const metrics = getSalesMetrics();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const menuItems = [
    { 
      id: 'admin-categories', 
      label: 'Categorías', 
      icon: '',
      gradient: 'from-purple-600 to-pink-600'
    },
    { 
      id: 'admin-products', 
      label: 'Productos', 
      icon: '',
      gradient: 'from-blue-600 to-cyan-600'
    },
    { 
      id: 'admin-employees', 
      label: 'Empleados', 
      icon: '',
      gradient: 'from-green-600 to-teal-600'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 flex">
      {/* Sidebar Desktop */}
      <aside className="hidden lg:flex lg:flex-col lg:w-64 bg-white shadow-xl">
        <div className="p-6 border-b">
          <h2 className="text-xl font-bold text-gray-800"> Gestión</h2>
        </div>
        <nav className="flex-1 p-4">
          <ul className="space-y-2">
            {menuItems.map((item) => (
              <li key={item.id}>
                <button
                  onClick={() => onNavigate(item.id)}
                  className={`w-full text-left px-4 py-3 rounded-lg font-semibold transition transform hover:scale-105 bg-gradient-to-r ${item.gradient} text-white hover:shadow-lg`}
                >
                  <span className="text-xl mr-2">{item.icon}</span>
                  {item.label}
                </button>
              </li>
            ))}
          </ul>
        </nav>
      </aside>

      {/* Sidebar Mobile */}
      <div className={`fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden transition-opacity ${sidebarOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`} onClick={() => setSidebarOpen(false)}>
      </div>
      <aside className={`fixed top-0 left-0 h-full w-64 bg-white shadow-xl z-50 transform transition-transform lg:hidden ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="p-6 border-b flex justify-between items-center">
          <h2 className="text-xl font-bold text-gray-800">🎛️ Gestión</h2>
          <button onClick={() => setSidebarOpen(false)} className="text-gray-600 hover:text-gray-900">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <nav className="p-4">
          <ul className="space-y-2">
            {menuItems.map((item) => (
              <li key={item.id}>
                <button
                  onClick={() => {
                    onNavigate(item.id);
                    setSidebarOpen(false);
                  }}
                  className={`w-full text-left px-4 py-3 rounded-lg font-semibold transition bg-gradient-to-r ${item.gradient} text-white hover:shadow-lg`}
                >
                  <span className="text-xl mr-2">{item.icon}</span>
                  {item.label}
                </button>
              </li>
            ))}
          </ul>
        </nav>
      </aside>

      {/* Main Content */}
      <div className="flex-1 p-4 lg:p-6">
        {/* Header con info de usuario */}
        <div className="flex justify-between items-center mb-6 bg-white p-4 rounded-lg shadow-xl">
          {/* Botón hamburguesa para móviles */}
          <button 
            onClick={() => setSidebarOpen(true)}
            className="lg:hidden text-gray-600 hover:text-gray-900 mr-4"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
          
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 lg:w-12 lg:h-12 rounded-full bg-red-500 flex items-center justify-center text-white font-bold text-lg lg:text-xl">
              {currentUser?.avatar || currentUser?.name?.charAt(0) || 'A'}
            </div>
            <div>
              <h1 className="text-xl lg:text-3xl font-bold text-gray-900"> Panel de Administración</h1>
              <p className="text-xs lg:text-sm text-gray-600">Administrador: {currentUser?.name || 'Admin'}</p>
            </div>
          </div>
          <button onClick={onLogout} className="bg-red-500 text-white px-3 py-2 lg:px-4 rounded-lg hover:bg-red-600 font-semibold text-sm lg:text-base">
             Salir
          </button>
        </div>

        {/* Métricas de ventas */}
        <div className="mb-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
          <div className="bg-white p-4 lg:p-6 rounded-lg shadow-xl border-l-4 border-green-500">
            <h3 className="text-xs lg:text-sm font-semibold text-gray-600 mb-2">📊 Ventas Completadas</h3>
            <p className="text-2xl lg:text-4xl font-bold text-gray-900">{metrics.totalCount}</p>
          </div>
          <div className="bg-white p-4 lg:p-6 rounded-lg shadow-xl border-l-4 border-blue-500">
            <h3 className="text-xs lg:text-sm font-semibold text-gray-600 mb-2">💰 Total Vendido</h3>
            <p className="text-2xl lg:text-3xl font-bold text-green-600">${metrics.totalSales.toLocaleString()}</p>
          </div>
          <div className="bg-white p-4 lg:p-6 rounded-lg shadow-xl border-l-4 border-yellow-500">
            <h3 className="text-xs lg:text-sm font-semibold text-gray-600 mb-2">📈 Ticket Promedio</h3>
            <p className="text-2xl lg:text-3xl font-bold text-blue-600">${Math.round(metrics.averageSale).toLocaleString()}</p>
          </div>
          <div className="bg-white p-4 lg:p-6 rounded-lg shadow-xl border-l-4 border-purple-500">
            <h3 className="text-xs lg:text-sm font-semibold text-gray-600 mb-2">🏪 Ventas de Hoy</h3>
            <p className="text-2xl lg:text-3xl font-bold text-purple-600">${metrics.todaySales.toLocaleString()}</p>
            <p className="text-xs text-gray-500 mt-1">{metrics.todayCount} pedidos</p>
          </div>
        </div>

        {/* Estadísticas adicionales */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div className="bg-white p-6 rounded-lg shadow-xl">
            <h3 className="text-lg font-bold text-gray-900 mb-4">📊 Tipos de Pedido</h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center p-3 bg-blue-50 rounded">
                <span className="font-semibold">🍽️ Pedidos en Local</span>
                <span className="text-2xl font-bold text-blue-600">{metrics.localOrders}</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-orange-50 rounded">
                <span className="font-semibold">🏍️ Pedidos a Domicilio</span>
                <span className="text-2xl font-bold text-orange-600">{metrics.deliveryOrders}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SecurityDashboard;
