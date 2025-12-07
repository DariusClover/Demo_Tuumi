import React from 'react';

const SecurityDashboard = ({ onLogout,  onGoToProducts, onGoToEmployees, completedSales = [], currentUser }) => {
  const totalSales = completedSales.reduce((sum, sale) => sum + sale.total, 0);
  const averageSale = completedSales.length > 0 ? totalSales / completedSales.length : 0;
  
  return (
    <div className="min-h-screen bg-linear-to-br from-gray-50 to-blue-50 p-6">
      {/* Header con info de usuario */}
      <div className="flex justify-between items-center mb-8 bg-white p-4 rounded-lg shadow-xl">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-full bg-red-500 flex items-center justify-center text-white font-bold text-xl">
            {currentUser?.avatar || currentUser?.name?.charAt(0) || 'A'}
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-900"> Panel de Administración</h1>
            <p className="text-sm text-gray-600">Administrador: {currentUser?.name || 'Admin'}</p>
          </div>
        </div>
        <button onClick={onLogout} className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 font-semibold">
           Cerrar Sesión
        </button>
      </div>

      {/* Botones de acceso rápido */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <button onClick={onGoToEmployees} className="bg-purple-600 text-white px-6 py-4 rounded-lg hover:bg-purple-700 font-bold shadow-lg transition transform hover:scale-105">
           Gestionar Empleados
        </button>
        <button onClick={onGoToProducts} className="bg-blue-600 text-white px-6 py-4 rounded-lg hover:bg-blue-700 font-bold shadow-lg transition transform hover:scale-105">
           Gestionar Productos
        </button>
       
      </div>

      {/* Métricas de ventas */}
      <div className="mb-6 grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-xl border-l-4 border-green-500">
          <h3 className="text-sm font-semibold text-gray-600 mb-2"> Ventas Completadas</h3>
          <p className="text-4xl font-bold text-gray-900">{completedSales.length}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-xl border-l-4 border-blue-500">
          <h3 className="text-sm font-semibold text-gray-600 mb-2"> Total Vendido</h3>
          <p className="text-3xl font-bold text-green-600">${totalSales.toLocaleString()}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-xl border-l-4 border-yellow-500">
          <h3 className="text-sm font-semibold text-gray-600 mb-2"> Ticket Promedio</h3>
          <p className="text-3xl font-bold text-blue-600">${Math.round(averageSale).toLocaleString()}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-xl border-l-4 border-purple-500">
          <h3 className="text-sm font-semibold text-gray-600 mb-2"> Estado del Sistema</h3>
          <p className="text-lg font-bold text-green-600"> Operativo</p>
        </div>
      </div>

      {/* Últimas ventas */}
      <div className="bg-white p-6 rounded-lg shadow-xl">
        <h2 className="text-2xl font-bold mb-4 text-gray-900"> Últimas Ventas Registradas</h2>
        {completedSales.length === 0 ? (
          <p className="text-gray-500 text-center py-8">No hay ventas registradas aún</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b-2 border-gray-200">
                  <th className="text-left py-3 px-4">ID Pedido</th>
                  <th className="text-left py-3 px-4">Hora</th>
                  <th className="text-left py-3 px-4">Tipo</th>
                  <th className="text-left py-3 px-4">Atendió</th>
                  <th className="text-left py-3 px-4">Método Pago</th>
                  <th className="text-left py-3 px-4">Total</th>
                </tr>
              </thead>
              <tbody>
                {completedSales.slice(-10).reverse().map((sale) => (
                  <tr key={sale.id} className="border-b hover:bg-gray-50">
                    <td className="py-3 px-4 font-mono">#{String(sale.id).slice(-4)}</td>
                    <td className="py-3 px-4">{sale.paidAt || sale.timestamp}</td>
                    <td className="py-3 px-4">
                      {sale.isDelivery ? (
                        <span className="bg-orange-100 text-orange-800 px-2 py-1 rounded text-xs font-bold">🏠 Domicilio</span>
                      ) : (
                        <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs font-bold">🍽️ Local</span>
                      )}
                    </td>
                    <td className="py-3 px-4 text-sm">{sale.waiter || 'N/A'}</td>
                    <td className="py-3 px-4">
                      <span className="bg-green-100 text-green-800 px-2 py-1 rounded text-xs">
                        {sale.paymentMethod || 'efectivo'}
                      </span>
                    </td>
                    <td className="py-3 px-4 font-bold text-green-600">${sale.total.toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default SecurityDashboard;
