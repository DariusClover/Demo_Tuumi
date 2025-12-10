import React, { useState } from 'react';
import { useProducts } from '../hooks/useProducts';
import { useOrders } from '../hooks/useOrders';
import { useToast } from '../hooks/useToast';

const DomiciliosView = ({ onLogout, currentUser }) => {
  const { products, getAvailableProducts } = useProducts();
  const { createDeliveryOrder } = useOrders();
  const { showSuccess, showError } = useToast();
  
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [address, setAddress] = useState('');
  const [cart, setCart] = useState([]);
  const [orderSent, setOrderSent] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const availableProducts = getAvailableProducts();

  const addToCart = (product) => {
    setCart([...cart, product]);
  };

  const removeFromCart = (index) => {
    setCart(cart.filter((_, i) => i !== index));
  };

  const total = cart.reduce((sum, item) => sum + item.price, 0);

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (isSubmitting) return;
    
    if (cart.length === 0) {
      showError('El carrito está vacío');
      return;
    }
    
    setIsSubmitting(true);
    
    const deliveryInfo = {
      customerName,
      customerPhone,
      address
    };

    const result = createDeliveryOrder(cart, deliveryInfo, currentUser);

    if (result.success) {
      showSuccess('Pedido a domicilio creado exitosamente');
      setOrderSent(true);
      
      setTimeout(() => {
        setCustomerName('');
        setCustomerPhone('');
        setAddress('');
        setCart([]);
        setOrderSent(false);
        setIsSubmitting(false);
      }, 3000);
    } else {
      showError(result.errors?.[0] || 'Error al crear el pedido');
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-green-50 to-blue-50 p-6">
      {/* Header con info de usuario */}
      <div className="flex justify-between items-center mb-8 bg-white p-4 rounded-lg shadow-xl">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-full bg-purple-500 flex items-center justify-center text-white font-bold text-xl">
            {currentUser?.avatar || currentUser?.name?.charAt(0) || 'D'}
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-900"> Central de Domicilios</h1>
            <p className="text-sm text-gray-600">Operador: {currentUser?.name || 'Domicilios'}</p>
          </div>
        </div>
        <button onClick={onLogout} className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 font-semibold">
           Cerrar Sesión
        </button>
      </div>

      <div className="max-w-5xl mx-auto">
        <div className="mb-6 p-4 bg-blue-50 border-l-4 border-blue-500 rounded">
          <h3 className="font-bold text-blue-900 mb-2"> Registro de Pedidos por WhatsApp</h3>
          <p className="text-sm text-blue-700">
            Ingresa los pedidos recibidos por WhatsApp. El sistema sincronizará automáticamente con POS y Cocina.
          </p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white rounded-lg shadow-xl p-6">
              <h2 className="text-xl font-bold mb-4">Información del Cliente</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">
                    Nombre del Cliente *
                  </label>
                  <input
                    type="text"
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                    placeholder="Ej: Juan Pérez"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">
                    Teléfono de Contacto *
                  </label>
                  <input
                    type="tel"
                    value={customerPhone}
                    onChange={(e) => setCustomerPhone(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                    placeholder="Ej: 3001234567"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">
                    Dirección de Entrega *
                  </label>
                  <input
                    type="text"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                    placeholder="Ej: Calle 10 #5-32, Barrio Centro"
                    required
                  />
                </div>
              </div>

              <div className="mt-6">
                <h3 className="font-bold mb-3">Menú Disponible</h3>
                <div className="max-h-64 overflow-y-auto space-y-2">
                  {availableProducts.length === 0 ? (
                    <p className="text-gray-500 text-center py-4">No hay productos disponibles</p>
                  ) : (
                    availableProducts.map((product) => (
                      <div key={product.id} className="flex justify-between items-center p-2 border rounded hover:bg-gray-50">
                        <div>
                          <p className="font-medium text-sm">{product.name}</p>
                          <p className="text-gray-600 text-xs">${product.price.toLocaleString()}</p>
                        </div>
                        <button
                          type="button"
                          onClick={() => addToCart(product)}
                          className="bg-green-500 text-white px-3 py-1 text-xs rounded hover:bg-green-600"
                        >
                           Agregar
                        </button>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-xl p-6">
              <h2 className="text-xl font-bold mb-4">Detalle del Pedido</h2>
              {cart.length === 0 ? (
                <p className="text-gray-500 text-center py-8">No hay productos en el pedido</p>
              ) : (
                <div>
                  <ul className="space-y-2 mb-4 max-h-72 overflow-y-auto">
                    {cart.map((item, index) => (
                      <li key={index} className="flex justify-between items-center p-2 bg-gray-50 rounded">
                        <div>
                          <span className="font-medium">{item.name}</span>
                          <p className="text-sm text-gray-600">${item.price.toLocaleString()}</p>
                        </div>
                        <button
                          type="button"
                          onClick={() => removeFromCart(index)}
                          className="text-red-500 hover:text-red-700 text-sm"
                        >
                          ✕
                        </button>
                      </li>
                    ))}
                  </ul>
                  <div className="border-t pt-4">
                    <div className="flex justify-between text-xl font-bold mb-4">
                      <span>Total:</span>
                      <span className="text-green-600">${total.toLocaleString()}</span>
                    </div>
                  </div>
                </div>
              )}

              <button
                type="submit"
                disabled={cart.length === 0 || !customerName || !customerPhone || !address || isSubmitting}
                className={'w-full font-bold py-3 px-4 rounded-lg transition ' + (cart.length === 0 || !customerName || !customerPhone || !address || isSubmitting ? 'bg-gray-400 cursor-not-allowed text-gray-200' : 'bg-green-600 hover:bg-green-700 text-white')}
              >
                {isSubmitting ? ' Enviando...' : ' Registrar Pedido a Domicilio'}
              </button>
            </div>
          </div>
        </form>

        {orderSent && (
          <div className="mt-6 p-4 bg-green-100 border border-green-400 text-green-700 rounded-lg">
            <p className="font-bold"> Pedido registrado exitosamente</p>
            <p className="text-sm">El pedido se ha sincronizado con el sistema POS y la cocina.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default DomiciliosView;
