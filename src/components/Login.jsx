import React, { useState } from 'react';

const Login = ({ onLogin }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    // Logic:
    // mesero / 123 -> TomaPedido
    // admin / secure -> SecurityDashboard
    // cocina / pass -> KDSView
    // cajero / caja123 -> CajaView
    // domicilios / dom123 -> DomiciliosView
    
    if (username === 'mesero' && password === '123') {
      onLogin('mesero');
    } else if (username === 'admin' && password === 'secure') {
      onLogin('admin');
    } else if (username === 'cocina' && password === 'pass') {
      onLogin('cocina');
    } else if (username === 'cajero' && password === 'caja123') {
      onLogin('cajero');
    } else if (username === 'domicilios' && password === 'dom123') {
      onLogin('domicilios');
    } else {
      setError('Acceso No Autorizado. Violación de Confidencialidad Evitada.');
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="p-8 bg-white rounded shadow-md w-96">
        <h2 className="mb-6 text-2xl font-bold text-center text-gray-800">Yuumi POS Login</h2>
        {error && <div className="p-2 mb-4 text-sm text-red-700 bg-red-100 rounded">{error}</div>}
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block mb-2 text-sm font-bold text-gray-700">Usuario</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full px-3 py-2 border rounded shadow appearance-none focus:outline-none focus:shadow-outline"
            />
          </div>
          <div className="mb-6">
            <label className="block mb-2 text-sm font-bold text-gray-700">Contraseña</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-3 py-2 border rounded shadow appearance-none focus:outline-none focus:shadow-outline"
            />
          </div>
          <button
            type="submit"
            className="w-full px-4 py-2 font-bold text-white bg-blue-500 rounded hover:bg-blue-700 focus:outline-none focus:shadow-outline"
          >
            Ingresar
          </button>
        </form>

        <div className="mt-6 pt-6 border-t">
          <p className="text-xs text-gray-600 mb-3 text-center font-semibold">Acceso Rápido (Solo para Demo)</p>
          <div className="grid grid-cols-2 gap-2">
            <button onClick={() => onLogin('mesero')} className="text-xs bg-green-100 hover:bg-green-200 text-green-800 py-2 px-3 rounded">
              👨‍🍳 Mesero
            </button>
            <button onClick={() => onLogin('cocina')} className="text-xs bg-orange-100 hover:bg-orange-200 text-orange-800 py-2 px-3 rounded">
              🍳 Cocina
            </button>
            <button onClick={() => onLogin('cajero')} className="text-xs bg-blue-100 hover:bg-blue-200 text-blue-800 py-2 px-3 rounded">
              💰 Cajero
            </button>
            <button onClick={() => onLogin('domicilios')} className="text-xs bg-purple-100 hover:bg-purple-200 text-purple-800 py-2 px-3 rounded">
              🏍️ Domicilios
            </button>
            <button onClick={() => onLogin('admin')} className="col-span-2 text-xs bg-gray-800 hover:bg-gray-900 text-white py-2 px-3 rounded">
              👑 Administrador
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
