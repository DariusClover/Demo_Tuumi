import React, { useState } from 'react';
import { useCategories } from '../hooks/useCategories';
import { useAuth } from '../hooks/useAuth';
import { useToast } from '../hooks/useToast';
import ConfirmDialog from './ConfirmDialog';

const CategoryManager = ({ onBack }) => {
  const { categories, createCategory, updateCategory, deleteCategory, toggleActive } = useCategories();
  const { currentUser } = useAuth();
  const { showSuccess, showError } = useToast();
  
  const [showForm, setShowForm] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    icon: '📦',
    color: 'gray',
    description: ''
  });
  
  // Estado para confirmación
  const [confirmDialog, setConfirmDialog] = useState({ isOpen: false, category: null });

  const colorOptions = [
    { value: 'red', label: 'Rojo', bg: 'bg-red-500' },
    { value: 'orange', label: 'Naranja', bg: 'bg-orange-500' },
    { value: 'yellow', label: 'Amarillo', bg: 'bg-yellow-500' },
    { value: 'green', label: 'Verde', bg: 'bg-green-500' },
    { value: 'blue', label: 'Azul', bg: 'bg-blue-500' },
    { value: 'purple', label: 'Morado', bg: 'bg-purple-500' },
    { value: 'pink', label: 'Rosa', bg: 'bg-pink-500' },
    { value: 'gray', label: 'Gris', bg: 'bg-gray-500' }
  ];

  const iconOptions = ['🍔', '🍕', '🌮', '🥗', '🍜', '🍝', '🥤', '☕', '🍰', '🍪', '🍟', '🌭', '🥙', '🍱', '🍛', '📦'];

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (editingCategory) {
      const result = updateCategory(editingCategory.id, formData);
      if (result.success) {
        showSuccess(`✅ Categoría "${formData.name}" actualizada`);
        handleCancel();
      } else {
        showError(result.errors?.join(', ') || 'Error al actualizar');
      }
    } else {
      const result = createCategory(formData, currentUser?.id);
      if (result.success) {
        showSuccess(`✅ Categoría "${formData.name}" creada`);
        handleCancel();
      } else {
        showError(result.errors?.join(', ') || 'Error al crear');
      }
    }
  };

  const handleEdit = (category) => {
    setEditingCategory(category);
    setFormData({
      name: category.name,
      icon: category.icon,
      color: category.color,
      description: category.description || ''
    });
    setShowForm(true);
  };

  const handleDelete = (category) => {
    setConfirmDialog({ isOpen: true, category });
  };

  const confirmDelete = () => {
    const category = confirmDialog.category;
    const result = deleteCategory(category.id);
    if (result.success) {
      showSuccess(`🗑️ Categoría "${category.name}" eliminada`);
    } else {
      showError(result.errors?.join(', ') || 'Error al eliminar');
    }
  };

  const handleToggleActive = (category) => {
    const result = toggleActive(category.id);
    if (result.success) {
      showSuccess(`${category.isActive ? '🔴' : '✅'} Categoría ${category.isActive ? 'desactivada' : 'activada'}`);
    }
  };

  const handleCancel = () => {
    setFormData({ name: '', icon: '📦', color: 'gray', description: '' });
    setEditingCategory(null);
    setShowForm(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">🏷️ Gestión de Categorías</h1>
            <p className="text-gray-600 mt-1">Organiza tu menú por categorías</p>
          </div>
          <button
            onClick={onBack}
            className="text-purple-600 hover:text-purple-800 font-semibold"
          >
            ← Volver al Dashboard
          </button>
        </div>

        {/* Botón agregar */}
        {!showForm && (
          <button
            onClick={() => setShowForm(true)}
            className="mb-6 bg-gradient-to-r from-purple-600 to-blue-600 text-white px-6 py-3 rounded-lg font-bold hover:from-purple-700 hover:to-blue-700 transition shadow-lg"
          >
            ➕ Nueva Categoría
          </button>
        )}

        {/* Formulario */}
        {showForm && (
          <div className="bg-white rounded-lg shadow-xl p-6 mb-6 border-2 border-purple-200">
            <h2 className="text-xl font-bold mb-4">
              {editingCategory ? '✏️ Editar Categoría' : '➕ Nueva Categoría'}
            </h2>
            <form onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">
                    Nombre de la Categoría *
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                    placeholder="Ej: Hamburguesas"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">
                    Icono
                  </label>
                  <div className="grid grid-cols-8 gap-2">
                    {iconOptions.map((icon) => (
                      <button
                        key={icon}
                        type="button"
                        onClick={() => setFormData({ ...formData, icon })}
                        className={`p-2 text-2xl rounded border-2 transition ${
                          formData.icon === icon
                            ? 'border-purple-500 bg-purple-50'
                            : 'border-gray-200 hover:border-purple-300'
                        }`}
                      >
                        {icon}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div className="mb-4">
                <label className="block text-sm font-bold text-gray-700 mb-2">
                  Color
                </label>
                <div className="grid grid-cols-4 md:grid-cols-8 gap-2">
                  {colorOptions.map((option) => (
                    <button
                      key={option.value}
                      type="button"
                      onClick={() => setFormData({ ...formData, color: option.value })}
                      className={`${option.bg} h-10 rounded-lg border-4 transition ${
                        formData.color === option.value
                          ? 'border-gray-800 scale-110'
                          : 'border-white hover:scale-105'
                      }`}
                      title={option.label}
                    />
                  ))}
                </div>
              </div>

              <div className="mb-4">
                <label className="block text-sm font-bold text-gray-700 mb-2">
                  Descripción (opcional)
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                  placeholder="Descripción de la categoría"
                  rows="2"
                />
              </div>

              <div className="flex gap-4">
                <button
                  type="submit"
                  className="bg-purple-600 text-white px-6 py-2 rounded-lg font-bold hover:bg-purple-700 transition"
                >
                  {editingCategory ? '💾 Guardar Cambios' : '➕ Crear Categoría'}
                </button>
                <button
                  type="button"
                  onClick={handleCancel}
                  className="bg-gray-400 text-white px-6 py-2 rounded-lg font-bold hover:bg-gray-500 transition"
                >
                  ❌ Cancelar
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Lista de categorías */}
        <div className="bg-white rounded-lg shadow-xl p-6">
          <h2 className="text-xl font-bold mb-4">
            📋 Categorías Registradas ({categories.length})
          </h2>
          
          {categories.length === 0 ? (
            <p className="text-gray-500 text-center py-8">
              No hay categorías registradas. Crea la primera categoría.
            </p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {categories.map((category) => (
                <div
                  key={category.id}
                  className={`border-2 rounded-lg p-4 transition ${
                    category.isActive
                      ? 'border-gray-200 hover:border-purple-300 hover:shadow-lg'
                      : 'border-gray-100 bg-gray-50 opacity-60'
                  }`}
                >
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <span className="text-3xl">{category.icon}</span>
                      <div>
                        <h3 className="font-bold text-lg">{category.name}</h3>
                        <span className={`inline-block px-2 py-1 text-xs rounded bg-${category.color}-100 text-${category.color}-800`}>
                          {category.color}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => handleToggleActive(category)}
                        className={`px-3 py-1 rounded text-xs font-semibold transition-colors ${
                          category.isActive 
                            ? 'bg-green-200 text-green-800 hover:bg-green-300' 
                            : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
                        }`}
                        title={category.isActive ? 'Desactivar categoría' : 'Activar categoría'}
                      >
                        {category.isActive ? '✓ Activa' : '✗ Inactiva'}
                      </button>
                    </div>
                  </div>

                  {category.description && (
                    <p className="text-sm text-gray-600 mb-3">{category.description}</p>
                  )}

                  <div className="flex gap-2 mt-3">
                    <button
                      onClick={() => handleEdit(category)}
                      className="flex-1 bg-blue-500 text-white px-3 py-1 rounded text-sm hover:bg-blue-600"
                    >
                      ✏️ Editar
                    </button>
                    <button
                      onClick={() => handleDelete(category)}
                      className="flex-1 bg-red-500 text-white px-3 py-1 rounded text-sm hover:bg-red-600"
                    >
                      🗑️ Eliminar
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Diálogo de confirmación */}
      <ConfirmDialog
        isOpen={confirmDialog.isOpen}
        onClose={() => setConfirmDialog({ isOpen: false, category: null })}
        onConfirm={confirmDelete}
        title="¿Eliminar categoría?"
        message={`Estás a punto de eliminar la categoría "${confirmDialog.category?.name}". Todos los productos de esta categoría se moverán a "Sin categoría". Esta acción no se puede deshacer.`}
        confirmText="Sí, eliminar"
        cancelText="Cancelar"
        confirmColor="red"
        icon="🏷️"
      />
    </div>
  );
};

export default CategoryManager;
