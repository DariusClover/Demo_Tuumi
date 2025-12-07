import React, { useState } from 'react';

const TomaPedido = ({ onLogout, onAddOrder, products = [], currentUser }) => {
  const [cart, setCart] = useState([]);
  const [orderSent, setOrderSent] = useState(false);

  const addToCart = (product) => {
    setCart([...cart, product]);
    setOrderSent(false);
  };

  const removeFromCart = (index) => {
    setCart(cart.filter((_, i) => i !== index));
  };

  const clearCart = () => {
    if (window.confirm('¿Descartar todos los productos del carrito?')) {
      setCart([]);
    }
  };

  const total = cart.reduce((sum, item) => sum + item.price, 0);

  const handleSendOrder = () => {
    const orderId = `${Date.now()}-${Math.random()}`;
    const orderTime = new Date().toLocaleTimeString();
    const newOrder = {
      id: orderId,
      items: cart,
      total: total,
      timestamp: orderTime,
      waiter: currentUser?.name || 'Mesero'
    };
    if (onAddOrder) {
      onAddOrder(newOrder);
    }
    setOrderSent(true);
    setCart([]);
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-green-50 to-blue-50 p-4">
      {/* Header con info de usuario */}
      <div className="flex justify-between items-center mb-6 bg-white p-4 rounded-lg shadow">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-full bg-green-500 flex items-center justify-center text-white font-bold text-xl">
            {currentUser?.avatar || currentUser?.name?.charAt(0) || 'M'}
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Toma de Pedidos</h1>
            <p className="text-sm text-gray-600"> {currentUser?.name || 'Mesero'}</p>
          </div>
        </div>
        <button onClick={onLogout} className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 font-semibold">
           Cerrar Sesión
        </button>
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

        <div className="bg-white p-6 rounded-lg shadow-xl">
          <h2 className="text-xl font-semibold mb-4">🛒 Pedido Actual</h2>
          {cart.length === 0 ? (
            <p className="text-gray-500 text-center py-8">No hay productos en el pedido.</p>
          ) : (
            <div>
              <ul className="mb-4 space-y-2 max-h-96 overflow-y-auto">
                {cart.map((item, index) => (
                  <li key={index} className="flex justify-between items-center p-2 bg-gray-50 rounded hover:bg-gray-100">
                    <div>
                      <span className="font-medium">{item.name}</span>
                      <p className="text-sm text-gray-600">${item.price.toLocaleString()}</p>
                    </div>
                    <button
                      onClick={() => removeFromCart(index)}
                      className="text-red-500 hover:text-red-700 font-bold"
                      title="Eliminar producto"
                    >
                      🗑️
                    </button>
                  </li>
                ))}
              </ul>
              
              <button
                onClick={clearCart}
                className="w-full mb-3 bg-gray-400 text-white py-2 rounded-lg hover:bg-gray-500 font-semibold"
              >
                 Descartar Todo
              </button>
            </div>
          )}
          <div className="border-t pt-4 mt-4">
            <div className="flex justify-between font-bold text-xl mb-4">
              <span>Total:</span>
              <span className="text-green-600">${total.toLocaleString()}</span>
            </div>
            <button
              onClick={handleSendOrder}
              disabled={cart.length === 0}
              className={cart.length === 0 ? 'w-full bg-gray-300 text-gray-500 cursor-not-allowed py-3 rounded-lg font-bold' : 'w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 font-bold'}
            >
               Enviar a Cocina
            </button>
          </div>
        </div>
      </div>

      {orderSent && (
        <div className="mt-6 p-4 bg-green-100 border border-green-400 text-green-700 rounded-lg animate-bounce">
          <p className="font-bold">✅ Pedido enviado a la cocina exitosamente!</p>
        </div>
      )}
    </div>
  );
};

export default TomaPedido;
