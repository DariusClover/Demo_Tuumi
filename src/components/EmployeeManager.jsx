import React, { useState, useMemo } from 'react';
import { useEmployees } from '../hooks/useEmployees';
import { useToast } from '../hooks/useToast';
import { ROLES } from '../constants/roles';
import ConfirmDialog from './ConfirmDialog';

const EmployeeManager = ({ onBack }) => {
  const { employees, createEmployee, updateEmployee, deleteEmployee } = useEmployees();
  const { showSuccess, showError } = useToast();
  
  const [showForm, setShowForm] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState(null);
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    name: '',
    role: ROLES.MESERO,
    email: ''
  });

  // Estados para búsqueda y filtros
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRole, setFilterRole] = useState('all');
  
  // Estado para confirmación
  const [confirmDialog, setConfirmDialog] = useState({ 
    isOpen: false, 
    type: null, // 'create', 'edit', 'delete'
    employee: null 
  });

  const rolesOptions = [
    { value: ROLES.MESERO, label: ' Mesero', color: 'blue' },
    { value: ROLES.COCINA, label: ' Cocinero', color: 'red' },
    { value: ROLES.CAJERO, label: ' Cajero', color: 'green' },
    { value: ROLES.DOMICILIOS, label: ' Domicilios', color: 'orange' }
  ];

  // Filtrar empleados
  const filteredEmployees = useMemo(() => {
    return employees.filter(employee => {
      const matchesSearch = employee.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           employee.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           (employee.email && employee.email.toLowerCase().includes(searchTerm.toLowerCase()));
      const matchesRole = filterRole === 'all' || employee.role === filterRole;
      
      return matchesSearch && matchesRole;
    });
  }, [employees, searchTerm, filterRole]);

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
      showError('⚠️ El nombre de usuario ya existe');
      return;
    }

    const employeeData = { ...formData };
    if (editingEmployee) {
      setConfirmDialog({ 
        isOpen: true, 
        type: 'edit', 
        employee: { ...employeeData, id: editingEmployee.id } 
      });
    } else {
      setConfirmDialog({ 
        isOpen: true, 
        type: 'create', 
        employee: employeeData 
      });
    }
  };

  const confirmCreate = () => {
    const result = createEmployee(confirmDialog.employee);
    if (result.success) {
      showSuccess(`✅ Empleado ${confirmDialog.employee.name} registrado exitosamente`);
      setFormData({ username: '', password: '', name: '', role: ROLES.MESERO, email: '' });
      setShowForm(false);
    } else {
      showError(result.errors?.[0] || 'Error al crear empleado');
    }
  };

  const confirmEdit = () => {
    const result = updateEmployee(confirmDialog.employee.id, confirmDialog.employee);
    if (result.success) {
      showSuccess(`✅ Empleado ${confirmDialog.employee.name} actualizado exitosamente`);
      setFormData({ username: '', password: '', name: '', role: ROLES.MESERO, email: '' });
      setEditingEmployee(null);
      setShowForm(false);
    } else {
      showError(result.errors?.[0] || 'Error al actualizar empleado');
    }
  };

  const handleEdit = (employee) => {
    setEditingEmployee(employee);
    setFormData({
      username: employee.username,
      password: employee.password,
      name: employee.name,
      role: employee.role,
      email: employee.email || ''
    });
    setShowForm(true);
  };

  const handleDelete = (employee) => {
    setConfirmDialog({ isOpen: true, type: 'delete', employee });
  };

  const confirmDelete = () => {
    const employee = confirmDialog.employee;
    const result = deleteEmployee(employee.id);
    if (result.success) {
      showSuccess(`🗑️ Empleado ${employee.name} eliminado`);
    } else {
      showError(result.errors?.[0] || 'Error al eliminar empleado');
    }
  };

  const handleConfirm = () => {
    if (confirmDialog.type === 'delete') {
      confirmDelete();
    } else if (confirmDialog.type === 'create') {
      confirmCreate();
    } else if (confirmDialog.type === 'edit') {
      confirmEdit();
    }
  };

  const handleCancel = () => {
    setFormData({ username: '', password: '', name: '', role: ROLES.MESERO, email: '' });
    setEditingEmployee(null);
    setShowForm(false);
  };

  const getRoleColor = (role) => {
    const roleData = rolesOptions.find(r => r.value === role);
    return roleData?.color || 'gray';
  };

  const getRoleLabel = (role) => {
    const roleData = rolesOptions.find(r => r.value === role);
    return roleData?.label || role;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 p-6 animate-fadeIn">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">👥 Gestión de Empleados</h1>
          <button onClick={onBack} className="text-purple-600 hover:text-purple-800 font-semibold transition">
            ← Volver al Dashboard
          </button>
        </div>

        {/* Barra de búsqueda y filtros */}
        {!showForm && (
          <div className="bg-white p-4 rounded-lg shadow-md mb-6 animate-slideInUp">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Búsqueda */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">🔍 Buscar</label>
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Buscar por nombre, usuario o email..."
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>

              {/* Filtro por rol */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">👔 Rol</label>
                <select
                  value={filterRole}
                  onChange={(e) => setFilterRole(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                >
                  <option value="all">Todos los roles</option>
                  {rolesOptions.map(role => (
                    <option key={role.value} value={role.value}>
                      {role.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Contador de resultados */}
            <div className="mt-3 text-sm text-gray-600">
              Mostrando <span className="font-bold text-purple-600">{filteredEmployees.length}</span> de <span className="font-bold">{employees.length}</span> empleados
            </div>
          </div>
        )}

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
                    {rolesOptions.map(role => (
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
                  {editingEmployee ? ' Guardar Cambios' : ' Registrar Empleado'}
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
        <div className="bg-white rounded-lg shadow-xl p-6 animate-slideInUp">
          <h2 className="text-xl font-bold mb-4">📋 Empleados Registrados ({filteredEmployees.length})</h2>
          
          {filteredEmployees.length === 0 ? (
            <p className="text-gray-500 text-center py-8">
              {searchTerm || filterRole !== 'all' 
                ? 'No se encontraron empleados con los filtros aplicados.' 
                : 'No hay empleados registrados. Registra el primer empleado para comenzar.'}
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
                  {filteredEmployees.map((employee) => (
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

      {/* Diálogo de confirmación */}
      <ConfirmDialog
        isOpen={confirmDialog.isOpen}
        onClose={() => setConfirmDialog({ isOpen: false, type: null, employee: null })}
        onConfirm={handleConfirm}
        title={
          confirmDialog.type === 'delete' ? '¿Eliminar empleado?' :
          confirmDialog.type === 'create' ? '¿Crear nuevo empleado?' :
          '¿Actualizar empleado?'
        }
        message={
          confirmDialog.type === 'delete' 
            ? `Estás a punto de eliminar a "${confirmDialog.employee?.name}". Esta acción no se puede deshacer y el empleado no podrá iniciar sesión.`
            : confirmDialog.type === 'create'
            ? `Estás a punto de crear el empleado "${confirmDialog.employee?.name}" con el usuario "${confirmDialog.employee?.username}". ¿Deseas continuar?`
            : `Estás a punto de actualizar la información de "${confirmDialog.employee?.name}". ¿Deseas guardar los cambios?`
        }
        confirmText={
          confirmDialog.type === 'delete' ? 'Sí, eliminar' :
          confirmDialog.type === 'create' ? 'Sí, crear' :
          'Sí, actualizar'
        }
        cancelText="Cancelar"
        confirmColor={
          confirmDialog.type === 'delete' ? 'red' :
          confirmDialog.type === 'create' ? 'green' :
          'blue'
        }
        icon={
          confirmDialog.type === 'delete' ? '🗑️' :
          confirmDialog.type === 'create' ? '✨' :
          '✏️'
        }
      />
    </div>
  );
};

export default EmployeeManager;
