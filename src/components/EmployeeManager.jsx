import React, { useState } from 'react';

const EmployeeManager = ({ employees, onAddEmployee, onUpdateEmployee, onDeleteEmployee, onBack }) => {
  const [showForm, setShowForm] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState(null);
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    name: '',
    role: 'mesero'
  });
  const [notification, setNotification] = useState(null);

  const roles = [
    { value: 'mesero', label: ' Mesero', color: 'blue' },
    { value: 'cocina', label: ' Cocinero', color: 'red' },
    { value: 'cajero', label: ' Cajero', color: 'green' },
    { value: 'domicilios', label: ' Domicilios', color: 'orange' }
  ];

  const showNotification = (message, type = 'success') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 3000);
  };

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Validar username único
    const usernameExists = employees.some(
      emp => emp.username === formData.username && emp.id !== editingEmployee?.id
    );

    if (usernameExists) {
      showNotification(' El nombre de usuario ya existe', 'error');
      return;
    }

    if (editingEmployee) {
      onUpdateEmployee({
        ...editingEmployee,
        ...formData
      });
      showNotification(` Empleado ${formData.name} actualizado exitosamente`);
    } else {
      const newEmployee = {
        id: `EMP-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        ...formData,
        createdAt: new Date().toLocaleDateString(),
        avatar: formData.name.charAt(0).toUpperCase()
      };
      onAddEmployee(newEmployee);
      showNotification(` Empleado ${formData.name} registrado exitosamente`);
    }

    setFormData({ username: '', password: '', name: '', role: 'mesero' });
    setEditingEmployee(null);
    setShowForm(false);
  };

  const handleEdit = (employee) => {
    setEditingEmployee(employee);
    setFormData({
      username: employee.username,
      password: employee.password,
      name: employee.name,
      role: employee.role
    });
    setShowForm(true);
  };

  const handleDelete = (employee) => {
    if (window.confirm(`¿Estás seguro de eliminar a ${employee.name}?`)) {
      onDeleteEmployee(employee.id);
      showNotification(`🗑️ Empleado ${employee.name} eliminado`);
    }
  };

  const handleCancel = () => {
    setFormData({ username: '', password: '', name: '', role: 'mesero' });
    setEditingEmployee(null);
    setShowForm(false);
  };

  const getRoleColor = (role) => {
    const roleData = roles.find(r => r.value === role);
    return roleData?.color || 'gray';
  };

  const getRoleLabel = (role) => {
    const roleData = roles.find(r => r.value === role);
    return roleData?.label || role;
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-purple-50 to-pink-50 p-6">
      {/* Notificación */}
      {notification && (
        <div className={`fixed top-4 right-4 z-50 px-6 py-4 rounded-lg shadow-lg animate-bounce ${
          notification.type === 'error' ? 'bg-red-500 text-white' : 'bg-green-500 text-white'
        }`}>
          {notification.message}
        </div>
      )}

      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">👥 Gestión de Empleados</h1>
          <button onClick={onBack} className="text-purple-600 hover:text-purple-800 font-semibold">
            ← Volver al Dashboard
          </button>
        </div>

        {/* Botón agregar empleado */}
        {!showForm && (
          <button
            onClick={() => setShowForm(true)}
            className="mb-6 bg-purple-600 text-white px-6 py-3 rounded-lg font-bold hover:bg-purple-700 transition"
          >
             Registrar Nuevo Empleado
          </button>
        )}

        {/* Formulario */}
        {showForm && (
          <div className="bg-white rounded-lg shadow-xl p-6 mb-6">
            <h2 className="text-xl font-bold mb-4">
              {editingEmployee ? ' Editar Empleado' : ' Nuevo Empleado'}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">
                    Nombre Completo *
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                    placeholder="Ej: Juan Pérez"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">
                    Rol *
                  </label>
                  <select
                    name="role"
                    value={formData.role}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                    required
                  >
                    {roles.map(role => (
                      <option key={role.value} value={role.value}>
                        {role.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">
                    Usuario *
                  </label>
                  <input
                    type="text"
                    name="username"
                    value={formData.username}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                    placeholder="Ej: jperez"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">
                    Contraseña *
                  </label>
                  <input
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                    placeholder="••••••••"
                    required
                  />
                </div>
              </div>

              <div className="flex gap-4">
                <button
                  type="submit"
                  className="bg-purple-600 text-white px-6 py-2 rounded-lg font-bold hover:bg-purple-700 transition"
                >
                  {editingEmployee ? '💾 Guardar Cambios' : ' Registrar Empleado'}
                </button>
                <button
                  type="button"
                  onClick={handleCancel}
                  className="bg-gray-400 text-white px-6 py-2 rounded-lg font-bold hover:bg-gray-500 transition"
                >
                   Cancelar
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Lista de empleados */}
        <div className="bg-white rounded-lg shadow-xl p-6">
          <h2 className="text-xl font-bold mb-4"> Empleados Registrados ({employees.length})</h2>
          
          {employees.length === 0 ? (
            <p className="text-gray-500 text-center py-8">
              No hay empleados registrados. Registra el primer empleado para comenzar.
            </p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-3 px-4">Avatar</th>
                    <th className="text-left py-3 px-4">Nombre</th>
                    <th className="text-left py-3 px-4">Usuario</th>
                    <th className="text-left py-3 px-4">Rol</th>
                    <th className="text-left py-3 px-4">Registrado</th>
                    <th className="text-left py-3 px-4">Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {employees.map((employee) => (
                    <tr key={employee.id} className="border-b hover:bg-gray-50">
                      <td className="py-3 px-4">
                        <div className={`w-10 h-10 rounded-full bg-${getRoleColor(employee.role)}-500 flex items-center justify-center text-white font-bold`}>
                          {employee.avatar}
                        </div>
                      </td>
                      <td className="py-3 px-4 font-medium">{employee.name}</td>
                      <td className="py-3 px-4 text-gray-600">{employee.username}</td>
                      <td className="py-3 px-4">
                        <span className={`px-3 py-1 rounded-full text-xs font-bold bg-${getRoleColor(employee.role)}-100 text-${getRoleColor(employee.role)}-800`}>
                          {getRoleLabel(employee.role)}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-sm text-gray-600">{employee.createdAt}</td>
                      <td className="py-3 px-4">
                        <button
                          onClick={() => handleEdit(employee)}
                          className="text-blue-600 hover:text-blue-800 mr-3"
                        >
                          ✏️
                        </button>
                        <button
                          onClick={() => handleDelete(employee)}
                          className="text-red-600 hover:text-red-800"
                        >
                          🗑️
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default EmployeeManager;
