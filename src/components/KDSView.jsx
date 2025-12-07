import React from 'react';

const KDSView = ({ onLogout, orders = [], onOrderReady, currentUser }) => {
  return (
    <div className="flex flex-col min-h-screen bg-gray-900 text-white p-6">
      {/* Header con info de usuario */}
      <div className="w-full flex justify-between items-center mb-8 bg-gray-800 p-4 rounded-lg shadow-xl">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-full bg-orange-500 flex items-center justify-center text-white font-bold text-xl">
            {currentUser?.avatar || currentUser?.name?.charAt(0) || 'C'}
          </div>
          <div>
            <h1 className="text-3xl font-bold"> Cocina </h1>
            <p className="text-sm text-gray-400">Cocinero: {currentUser?.name || 'Cocina'}</p>
          </div>
        </div>
        <button onClick={onLogout} className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 font-semibold">
           Cerrar Sesión
        </button>
      </div>
      
      {orders.length === 0 ? (
          <div className="p-8 bg-gray-800 rounded-lg shadow-lg text-center">
            <p className="text-2xl"> No hay comandas pendientes</p>
            <p className="text-gray-400 mt-2">Los nuevos pedidos aparecerán aquí automáticamente</p>
          </div>
      ) : (
          <div>
            <div className="mb-4 bg-gray-800 p-3 rounded-lg">
              <p className="text-lg font-semibold">📋 Pedidos Pendientes: <span className="text-yellow-400">{orders.length}</span></p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full">
              {orders.map((order) => (
                  <div key={order.id} className={'bg-white text-gray-800 p-4 rounded-lg shadow-xl transform hover:scale-105 transition ' + (order.isDelivery ? 'border-4 border-orange-400' : 'border-2 border-gray-200')}>
                      <div className="flex justify-between border-b-2 pb-2 mb-3">
                          <span className="font-bold text-xl">
                              {order.isDelivery && ' '}
                              Pedido #{String(order.id).slice(-4)}
                          </span>
                          <span className="text-gray-500 text-sm">{order.timestamp}</span>
                      </div>
                      {order.waiter && (
                          <p className="text-xs text-gray-600 mb-2">👨‍🍳 Mesero: {order.waiter}</p>
                      )}
                      {order.isDelivery && (
                          <div className="mb-3 p-3 bg-orange-50 rounded-lg text-sm border-l-4 border-orange-500">
                              <p className="font-bold text-orange-700 mb-1">📦 PEDIDO A DOMICILIO</p>
                              <p className="text-gray-700"><strong>Cliente:</strong> {order.customerName}</p>
                              <p className="text-gray-700"><strong>Tel:</strong> {order.customerPhone}</p>
                              <p className="text-gray-700"><strong>Dir:</strong> {order.address}</p>
                          </div>
                      )}
                      <ul className="mb-4 space-y-1">
                          {order.items.map((item, idx) => (
                              <li key={idx} className="flex justify-between p-2 bg-gray-50 rounded">
                                  <span className="font-medium">{item.name}</span>
                                  {item.price > 0 && <span className="font-semibold text-green-600">${item.price.toLocaleString()}</span>}
                              </li>
                          ))}
                      </ul>
                      <div className="border-t-2 pt-3">
                        <p className="text-right font-bold text-lg mb-2">Total: <span className="text-green-600">${order.total.toLocaleString()}</span></p>
                        <button
                            onClick={() => onOrderReady && onOrderReady(order)}
                            className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-3 rounded-lg transition shadow-lg"
                        >
                            ✅ Marcar como Listo
                        </button>
                      </div>
                  </div>
              ))}
            </div>
          </div>
      )}
    </div>
  );
};

export default KDSView;
