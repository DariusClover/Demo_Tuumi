import React, { useState, useMemo } from 'react';
import { useProducts } from '../hooks/useProducts';
import { useCategories } from '../hooks/useCategories';
import { useOrders } from '../hooks/useOrders';
import { useToast } from '../hooks/useToast';

const TomaPedido = ({ onLogout, currentUser }) => {
  const { getAvailableProducts } = useProducts();
  const { categories } = useCategories();
  const { createOrder } = useOrders();
  const { showSuccess, showError } = useToast();
  
  const [cart, setCart] = useState([]);
  const [orderSent, setOrderSent] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('all');
  
  const availableProducts = getAvailableProducts();
  const activeCategories = useMemo(() => {
    return categories.filter(cat => cat.isActive);
  }, [categories]);

  // Agrupar productos por categoría
  const productsByCategory = useMemo(() => {
    const grouped = {};
    
    availableProducts.forEach(product => {
      const categoryId = product.categoryId || 'CAT-UNCATEGORIZED';
      if (!grouped[categoryId]) {
        grouped[categoryId] = [];
      }
      grouped[categoryId].push(product);
    });
    
    return grouped;
  }, [availableProducts]);

  // Filtrar productos según categoría seleccionada
  const filteredProducts = useMemo(() => {
    if (selectedCategory === 'all') {
      return availableProducts;
    }
    return productsByCategory[selectedCategory] || [];
  }, [selectedCategory, availableProducts, productsByCategory]);

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
    if (cart.length === 0) {
      showError('El carrito está vacío');
      return;
    }

    const result = createOrder(cart, currentUser, {
      tableNumber: null,
      notes: ''
    });

    if (result.success) {
      showSuccess('Pedido enviado a cocina exitosamente');
      setOrderSent(true);
      setCart([]);
      
      setTimeout(() => setOrderSent(false), 3000);
    } else {
      showError(result.errors?.[0] || 'Error al crear el pedido');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 p-4 animate-fadeIn">
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

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Menú de productos */}
        <div className="lg:col-span-2 bg-white p-6 rounded-lg shadow-xl">
          <h2 className="text-2xl font-bold mb-4 text-gray-800">🍽️ Menú</h2>
          
          {/* Filtro de categorías */}
          <div className="mb-6 flex flex-wrap gap-2">
            <button
              onClick={() => setSelectedCategory('all')}
              className={`px-4 py-2 rounded-lg font-semibold transition ${
                selectedCategory === 'all' 
                  ? 'bg-blue-600 text-white' 
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              📋 Todos
            </button>
            {activeCategories.map(category => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`px-4 py-2 rounded-lg font-semibold transition ${
                  selectedCategory === category.id 
                    ? `bg-${category.color}-600 text-white` 
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                {category.icon} {category.name}
              </button>
            ))}
          </div>

          {/* Grid de productos */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-h-96 overflow-y-auto">
            {filteredProducts.length === 0 ? (
              <p className="text-gray-500 text-center py-8 col-span-2">No hay productos disponibles en esta categoría</p>
            ) : (
              filteredProducts.map((product) => {
                const category = activeCategories.find(c => c.id === product.categoryId);
                return (
                  <div key={product.id} className="border-2 border-gray-200 rounded-lg p-4 hover:shadow-lg transition">
                    <div className="flex justify-between items-start mb-2">
                      <div className="flex-1">
                        <h3 className="font-bold text-lg text-gray-800">{product.name}</h3>
                        {category && (
                          <span className={`inline-block px-2 py-1 rounded text-xs mt-1 bg-${category.color}-100 text-${category.color}-800`}>
                            {category.icon} {category.name}
                          </span>
                        )}
                        {product.description && (
                          <p className="text-sm text-gray-600 mt-1">{product.description}</p>
                        )}
                      </div>
                    </div>
                    <div className="flex justify-between items-center mt-3">
                      <span className="text-xl font-bold text-green-600">${product.price.toLocaleString()}</span>
                      <button
                        onClick={() => addToCart(product)}
                        className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 font-semibold transition"
                      >
                        ➕ Agregar
                      </button>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Carrito de compras */}
        <div className="bg-white p-6 rounded-lg shadow-xl sticky top-6 h-fit">
          <h2 className="text-2xl font-bold mb-4 text-gray-800">🛒 Pedido Actual</h2>
          {cart.length === 0 ? (
            <div className="text-center py-8">
              <div className="text-6xl mb-4">🛒</div>
              <p className="text-gray-500">El carrito está vacío</p>
              <p className="text-sm text-gray-400 mt-2">Agrega productos del menú</p>
            </div>
          ) : (
            <div>
              <div className="mb-4 p-3 bg-blue-50 rounded-lg">
                <p className="text-sm font-semibold text-blue-800">
                  {cart.length} producto{cart.length !== 1 ? 's' : ''} en el pedido
                </p>
              </div>
              
              <ul className="mb-4 space-y-2 max-h-96 overflow-y-auto">
                {cart.map((item, index) => (
                  <li key={index} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg hover:bg-gray-100 border border-gray-200">
                    <div className="flex-1">
                      <span className="font-semibold text-gray-800">{item.name}</span>
                      <p className="text-sm text-green-600 font-semibold">${item.price.toLocaleString()}</p>
                    </div>
                    <button
                      onClick={() => removeFromCart(index)}
                      className="ml-2 text-red-500 hover:text-red-700 hover:bg-red-50 p-2 rounded transition"
                      title="Eliminar producto"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </li>
                ))}
              </ul>
              
              <button
                onClick={clearCart}
                className="w-full mb-3 bg-gray-400 text-white py-2 rounded-lg hover:bg-gray-500 font-semibold transition"
              >
                🗑️ Descartar Todo
              </button>
            </div>
          )}
          
          <div className="border-t-2 pt-4 mt-4">
            <div className="flex justify-between items-center mb-4 p-3 bg-green-50 rounded-lg">
              <span className="text-lg font-bold text-gray-800">Total:</span>
              <span className="text-2xl font-bold text-green-600">${total.toLocaleString()}</span>
            </div>
            <button
              onClick={handleSendOrder}
              disabled={cart.length === 0}
              className={`w-full py-3 rounded-lg font-bold transition ${
                cart.length === 0 
                  ? 'bg-gray-300 text-gray-500 cursor-not-allowed' 
                  : 'bg-blue-600 text-white hover:bg-blue-700 shadow-lg hover:shadow-xl'
              }`}
            >
              {cart.length === 0 ? '🛒 Carrito vacío' : '🚀 Enviar a Cocina'}
            </button>
          </div>
        </div>
      </div>

      {orderSent && (
        <div className="fixed bottom-6 right-6 p-4 bg-green-500 text-white rounded-lg shadow-2xl animate-slideInUp z-50">
          <div className="flex items-center gap-3">
            <span className="text-3xl">✅</span>
            <p className="font-bold">Pedido enviado a la cocina exitosamente!</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default TomaPedido;
