import React from 'react';

const KDSView = ({ onLogout, orders = [], onOrderReady }) => {
  return (
    <div className="flex flex-col items-center min-h-screen bg-gray-800 text-white p-8">
      <div className="w-full flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold">Acceso Cocina (KDS)</h1>
          <button onClick={onLogout} className="text-gray-400 hover:text-white underline">
            Cerrar Sesión
          </button>
      </div>
      
      {orders.length === 0 ? (
          <div className="p-6 bg-gray-700 rounded-lg shadow-lg">
            <p className="text-xl">No hay comandas pendientes.</p>
          </div>
      ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full">
              {orders.map((order) => (
                  <div key={order.id} className={'bg-white text-gray-800 p-4 rounded shadow-lg ' + (order.isDelivery ? 'border-4 border-orange-400' : '')}>
                      <div className="flex justify-between border-b pb-2 mb-2">
                          <span className="font-bold text-lg">
                              {order.isDelivery && '🏠 '}
                              Pedido #{String(order.id).slice(-4)}
                          </span>
                          <span className="text-gray-500 text-sm">{order.timestamp}</span>
                      </div>
                      {order.isDelivery && (
                          <div className="mb-3 p-2 bg-orange-50 rounded text-sm">
                              <p className="font-semibold text-orange-700">📦 DOMICILIO</p>
                              <p className="text-gray-700"><strong>Cliente:</strong> {order.customerName}</p>
                              <p className="text-gray-700"><strong>Tel:</strong> {order.customerPhone}</p>
                              <p className="text-gray-700"><strong>Dir:</strong> {order.address}</p>
                          </div>
                      )}
                      <ul className="mb-4">
                          {order.items.map((item, idx) => (
                              <li key={idx} className="flex justify-between">
                                  <span>{item.name}</span>
                                  {item.price > 0 && <span className="font-semibold">${item.price.toLocaleString()}</span>}
                              </li>
                          ))}
                      </ul>
                      <button
                          onClick={() => onOrderReady && onOrderReady(order)}
                          className="w-full mt-2 pt-2 border-t bg-green-600 hover:bg-green-700 text-white font-bold py-2 rounded transition"
                      >
                           Pedido Listo
                      </button>
                  </div>
              ))}
          </div>
      )}
    </div>
  );
};

export default KDSView;
