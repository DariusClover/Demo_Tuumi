import React, { useState } from 'react';

const Register = ({ onRegister, onGoToLogin }) => {
  const [formData, setFormData] = useState({
    name: '',
    username: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [errors, setErrors] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    setErrors([]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors([]);

    // Validaciones locales
    const validationErrors = [];

    if (formData.password !== formData.confirmPassword) {
      validationErrors.push('Las contraseñas no coinciden');
    }

    if (formData.password.length < 6) {
      validationErrors.push('La contraseña debe tener al menos 6 caracteres');
    }

    if (validationErrors.length > 0) {
      setErrors(validationErrors);
      return;
    }

    setIsLoading(true);

    setTimeout(() => {
      const result = onRegister({
        name: formData.name,
        username: formData.username,
        email: formData.email,
        password: formData.password
      });

      if (!result.success) {
        setErrors(result.errors || ['Error al registrar usuario']);
      }
      
      setIsLoading(false);
    }, 500);
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-pink-50">
      <div className="p-8 bg-white rounded-2xl shadow-2xl w-full max-w-md">
        <div className="text-center mb-6">
          <div className="text-6xl mb-4"></div>
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Bienvenido a Yuumi POS</h1>
          <p className="text-sm text-gray-600">Crea tu cuenta de administrador</p>
          
        </div>

        {errors.length > 0 && (
          <div className="mb-4 p-3 bg-red-100 border border-red-300 rounded-lg">
            {errors.map((error, index) => (
              <p key={index} className="text-sm text-red-700">❌ {error}</p>
            ))}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block mb-2 text-sm font-bold text-gray-700">
               Nombre Completo
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              placeholder="Ej: Juan Pérez"
              required
              disabled={isLoading}
            />
          </div>

          <div className="mb-4">
            <label className="block mb-2 text-sm font-bold text-gray-700">
               Correo Electrónico
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              placeholder="correo@ejemplo.com"
              required
              disabled={isLoading}
            />
          </div>

          <div className="mb-4">
            <label className="block mb-2 text-sm font-bold text-gray-700">
               Usuario
            </label>
            <input
              type="text"
              name="username"
              value={formData.username}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              placeholder="usuario123"
              required
              disabled={isLoading}
            />
          </div>

          <div className="mb-4">
            <label className="block mb-2 text-sm font-bold text-gray-700">
               Contraseña
            </label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              placeholder="••••••••"
              required
              disabled={isLoading}
              minLength={6}
            />
            <p className="text-xs text-gray-500 mt-1">Mínimo 6 caracteres</p>
          </div>

          <div className="mb-6">
            <label className="block mb-2 text-sm font-bold text-gray-700">
               Confirmar Contraseña
            </label>
            <input
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
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
                : 'bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700'
            }`}
          >
            {isLoading ? ' Creando cuenta...' : ' Crear Cuenta de Administrador'}
          </button>
        </form>

        {onGoToLogin && (
          <div className="mt-6 pt-6 border-t text-center">
            <p className="text-sm text-gray-600">
              ¿Ya tienes una cuenta?{' '}
              <button
                onClick={onGoToLogin}
                className="text-purple-600 hover:text-purple-800 font-semibold"
              >
                Iniciar sesión
              </button>
            </p>
          </div>
        )}

        <div className="mt-4 text-center">
          <p className="text-xs text-gray-400">
            Yuumi POS v2.0 - Sistema de gestión restaurantes
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
