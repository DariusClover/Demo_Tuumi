import React, { useState } from 'react';

const CajaView = ({ onLogout, pendingBills = [], onPayBill }) => {
  const [selectedBill, setSelectedBill] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState('efectivo');

  const handlePayment = () => {
    if (selectedBill && onPayBill) {
      onPayBill({
        ...selectedBill,
        paymentMethod,
        paidAt: new Date().toLocaleTimeString()
      });
      setSelectedBill(null);
      setPaymentMethod('efectivo');
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Caja - Facturación</h1>
        <button onClick={onLogout} className="text-red-500 hover:text-red-700 font-semibold">
          Cerrar Sesión
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-bold mb-4 text-gray-800">Facturas Pendientes</h2>
          {pendingBills.length === 0 ? (
            <p className="text-gray-500 text-center py-8">No hay facturas pendientes</p>
          ) : (
            <div className="space-y-4">
              {pendingBills.map((bill) => (
                <div
                  key={bill.id}
                  onClick={() => setSelectedBill(bill)}
                  className={'p-4 border rounded-lg cursor-pointer transition ' + (selectedBill?.id === bill.id ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:bg-gray-50')}
                >
                  <div className="flex justify-between items-start mb-2">
                    <span className="font-bold text-lg">Pedido #{String(bill.id).slice(-4)}</span>
                    <span className="text-sm text-gray-500">{bill.timestamp}</span>
                  </div>
                  <div className="text-sm text-gray-600 mb-2">
                    <span className="font-semibold">{bill.items.length} producto(s)</span>
                  </div>
                  <div className="text-xl font-bold text-green-600">
                    ${bill.total.toLocaleString()}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-bold mb-4 text-gray-800">Detalle de Factura</h2>
          {!selectedBill ? (
            <p className="text-gray-500 text-center py-8">Selecciona una factura para procesar el pago</p>
          ) : (
            <div>
              <div className="mb-6 p-4 bg-gray-50 rounded">
                <h3 className="font-bold text-lg mb-3">Pedido #{String(selectedBill.id).slice(-4)}</h3>
                <ul className="space-y-2 mb-4">
                  {selectedBill.items.map((item, idx) => (
                    <li key={idx} className="flex justify-between">
                      <span>{item.name}</span>
                      <span className="font-semibold">${item.price.toLocaleString()}</span>
                    </li>
                  ))}
                </ul>
                <div className="border-t pt-3 flex justify-between text-xl font-bold">
                  <span>Total:</span>
                  <span className="text-green-600">${selectedBill.total.toLocaleString()}</span>
                </div>
              </div>

              <div className="mb-6">
                <label className="block text-sm font-bold text-gray-700 mb-2">Método de Pago</label>
                <select
                  value={paymentMethod}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="efectivo">Efectivo</option>
                  <option value="tarjeta">Tarjeta Débito/Crédito</option>
                  <option value="transferencia">Transferencia</option>
                  <option value="nequi">Nequi</option>
                </select>
              </div>

              <button
                onClick={handlePayment}
                className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-4 rounded-lg transition"
              >
                Procesar Pago
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CajaView;
