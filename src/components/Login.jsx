import React, { useState } from 'react';

const Login = ({ onLogin, onGoToRegister }) => {
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
      onLogin(username, password);
      setIsLoading(false);
    }, 500);
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
      <div className="p-8 bg-white rounded-2xl shadow-2xl w-full max-w-md">
        <div className="text-center mb-6">
          <div className="text-6xl mb-4"></div>
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Yuumi POS</h1>
          <p className="text-sm text-gray-600">Sistema de Punto de Venta</p>
        </div>

        {error && (
          <div className="p-3 mb-4 text-sm text-red-700 bg-red-100 border border-red-300 rounded-lg animate-shake">
            ❌ {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block mb-2 text-sm font-bold text-gray-700">
               Usuario
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
               Contraseña
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
                : 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 shadow-lg'
            }`}
          >
            {isLoading ? ' Verificando...' : ' Ingresar'}
          </button>
        </form>

        {onGoToRegister && (
          <div className="mt-6 pt-6 border-t text-center">
            <p className="text-sm text-gray-600">
              ¿No tienes una cuenta?{' '}
              <button
                onClick={onGoToRegister}
                className="text-blue-600 hover:text-blue-800 font-semibold"
              >
                Crear cuenta
              </button>
            </p>
          </div>
        )}

        <div className="mt-4 p-3 bg-gray-50 rounded-lg">
          <p className="text-xs text-gray-600 mb-2 font-semibold"> Credenciales de prueba:</p>
          <p className="text-xs text-gray-500">Usuario: <code className="bg-gray-200 px-1 rounded">admin</code></p>
          <p className="text-xs text-gray-500">Contraseña: <code className="bg-gray-200 px-1 rounded">admin123</code></p>
        </div>

        <div className="mt-4 text-center">
          <p className="text-xs text-gray-400">
            Yuumi POS v2.0 - Sistema de gestión restaurantes
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
