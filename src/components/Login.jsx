import React, { useState } from 'react';

const Login = ({ onLogin, employees }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    // Simular delay de autenticación
    setTimeout(() => {
      // Verificar credenciales admin
      if (username === 'admin' && password === 'admin123') {
        onLogin('admin', { 
          id: 'admin', 
          name: 'Administrador', 
          role: 'admin', 
          username: 'admin' 
        });
        setIsLoading(false);
        return;
      }

      // Verificar empleados registrados
      const employee = employees.find(
        emp => emp.username === username && emp.password === password
      );

      if (employee) {
        onLogin(employee.role, employee);
      } else {
        setError(' Usuario o contraseña incorrectos');
      }
      setIsLoading(false);
    }, 500);
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-linear-to-br from-blue-50 to-purple-50">
      <div className="p-8 bg-white rounded-lg shadow-2xl w-96">
        <div className="text-center mb-6">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">🍔 Yuumi POS</h1>
          <p className="text-sm text-gray-600">Sistema de Punto de Venta</p>
        </div>

        {error && (
          <div className="p-3 mb-4 text-sm text-red-700 bg-red-100 border border-red-300 rounded-lg animate-shake">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block mb-2 text-sm font-bold text-gray-700">
              👤 Usuario
            </label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Ingresa tu usuario"
              required
              disabled={isLoading}
            />
          </div>
          <div className="mb-6">
            <label className="block mb-2 text-sm font-bold text-gray-700">
              🔒 Contraseña
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="••••••••"
              required
              disabled={isLoading}
            />
          </div>
          <button
            type="submit"
            disabled={isLoading}
            className={`w-full px-4 py-3 font-bold text-white rounded-lg transition ${
              isLoading 
                ? 'bg-gray-400 cursor-not-allowed' 
                : 'bg-blue-600 hover:bg-blue-700'
            }`}
          >
            {isLoading ? ' Verificando...' : ' Ingresar'}
          </button>
        </form>

        <div className="mt-6 pt-6 border-t text-center">
         
          <p className="text-xs text-gray-500 mt-1">
            
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
