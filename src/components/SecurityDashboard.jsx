import React from 'react';

const SecurityDashboard = ({ onLogout, onGoToPOS, onGoToProducts, completedSales = [] }) => {
  const totalSales = completedSales.reduce((sum, sale) => sum + sale.total, 0);
  
  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Panel de Seguridad y Continuidad del Negocio Terranova</h1>
        <div className="space-x-4">
          <button onClick={onGoToProducts} className="bg-purple-500 text-white px-4 py-2 rounded hover:bg-purple-600">Gestionar Productos</button>
          <button onClick={onGoToPOS} className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">Ir a POS</button>
          <button onClick={onLogout} className="text-red-500 hover:text-red-700">Cerrar Sesión</button>
        </div>
      </div>

      <div className="mb-6 grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-green-500">
          <h3 className="text-sm font-semibold text-gray-600 mb-2">Ventas Completadas Hoy</h3>
          <p className="text-3xl font-bold text-gray-900">{completedSales.length}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-blue-500">
          <h3 className="text-sm font-semibold text-gray-600 mb-2">Total Vendido</h3>
          <p className="text-3xl font-bold text-green-600">${totalSales.toLocaleString()}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-purple-500">
          <h3 className="text-sm font-semibold text-gray-600 mb-2">Sistema</h3>
          <p className="text-lg font-bold text-green-600">✅ Operativo</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
       

       
      </div>
    </div>
  );
};

export default SecurityDashboard;
