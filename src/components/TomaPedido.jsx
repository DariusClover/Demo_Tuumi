import React, { useState } from 'react';

const TomaPedido = ({ onLogout, onAddOrder, products = [] }) => {
  const [cart, setCart] = useState([]);
  const [orderSent, setOrderSent] = useState(false);

  const addToCart = (product) => {
    setCart([...cart, product]);
    setOrderSent(false);
  };

  const total = cart.reduce((sum, item) => sum + item.price, 0);

  const handleSendOrder = () => {
    const newOrder = {
      id: `${Date.now()}-${Math.random()}`,
      items: cart,
      total: total,
      timestamp: new Date().toLocaleTimeString()
    };
    if (onAddOrder) {
      onAddOrder(newOrder);
    }
    setOrderSent(true);
    setCart([]);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Toma de Pedidos</h1>
        <button onClick={onLogout} className="text-red-500 hover:text-red-700">Cerrar Sesión</button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded shadow">
          <h2 className="text-xl font-semibold mb-4">Menú</h2>
          <div className="space-y-4">
            {products.map((product) => (
              <div key={product.id} className="flex justify-between items-center border-b pb-2">
                <div>
                  <p className="font-medium">{product.name}</p>
                  <p className="text-gray-600">${product.price.toLocaleString()}</p>
                </div>
                <button
                  onClick={() => addToCart(product)}
                  className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600"
                >
                  Agregar
                </button>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white p-6 rounded shadow">
          <h2 className="text-xl font-semibold mb-4">Pedido Actual</h2>
          {cart.length === 0 ? (
            <p className="text-gray-500">No hay productos en el pedido.</p>
          ) : (
            <ul className="mb-4 space-y-2">
              {cart.map((item, index) => (
                <li key={index} className="flex justify-between">
                  <span>{item.name}</span>
                  <span>${item.price.toLocaleString()}</span>
                </li>
              ))}
            </ul>
          )}
          <div className="border-t pt-4 mt-4">
            <div className="flex justify-between font-bold text-lg mb-4">
              <span>Total:</span>
              <span>${total.toLocaleString()}</span>
            </div>
            <button
              onClick={handleSendOrder}
              disabled={cart.length === 0}
              className={`w-full py-2 rounded font-bold text-white ${
                cart.length === 0 ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'
              }`}
            >
              Enviar Pedido
            </button>
          </div>
        </div>
      </div>

      {orderSent && (
        <div className="mt-6 p-4 bg-green-100 border border-green-400 text-green-700 rounded">
          <p className="font-bold">Pedido #{new Date().getTime().toString().slice(-4)} Enviado.</p>
          <p>Pedido enviado con éxito.</p>
        </div>
      )}
    </div>
  );
};

export default TomaPedido;
