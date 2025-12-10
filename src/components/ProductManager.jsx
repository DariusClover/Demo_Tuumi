import React, { useState, useMemo } from 'react';
import { useProducts } from '../hooks/useProducts';
import { useCategories } from '../hooks/useCategories';
import { useAuth } from '../hooks/useAuth';
import { useToast } from '../hooks/useToast';
import ConfirmDialog from './ConfirmDialog';

const ProductManager = ({ onBack }) => {
  const { products, createProduct, updateProduct, deleteProduct, toggleAvailability } = useProducts();
  const { categories } = useCategories();
  const { currentUser } = useAuth();
  const { showSuccess, showError } = useToast();
  
  const [editingProduct, setEditingProduct] = useState(null);
  const [formData, setFormData] = useState({ 
    name: '', 
    price: '', 
    categoryId: '',
    description: ''
  });
  
  // Estados para búsqueda y filtros
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');
  const [filterAvailability, setFilterAvailability] = useState('all');
  
  // Estado para confirmación
  const [confirmDialog, setConfirmDialog] = useState({ isOpen: false, product: null });
  
  // Calcular categorías activas con useMemo para que se actualice cuando cambien las categorías
  const activeCategories = useMemo(() => {
    return categories.filter(cat => cat.isActive);
  }, [categories]);

  // Filtrar y buscar productos
  const filteredProducts = useMemo(() => {
    return products.filter(product => {
      const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           (product.description && product.description.toLowerCase().includes(searchTerm.toLowerCase()));
      const matchesCategory = filterCategory === 'all' || product.categoryId === filterCategory;
      const matchesAvailability = filterAvailability === 'all' || 
                                 (filterAvailability === 'available' && product.isAvailable) ||
                                 (filterAvailability === 'unavailable' && !product.isAvailable);
      
      return matchesSearch && matchesCategory && matchesAvailability;
    });
  }, [products, searchTerm, filterCategory, filterAvailability]);

  const handleSubmit = (e) => {
    e.preventDefault();
    
    const productData = {
      name: formData.name,
      price: parseFloat(formData.price),
      categoryId: formData.categoryId || null,
      description: formData.description
    };

    if (editingProduct) {
      const result = updateProduct(editingProduct.id, productData);
      if (result.success) {
        showSuccess(`Producto "${formData.name}" actualizado`);
        setEditingProduct(null);
      } else {
        showError(result.errors?.[0] || 'Error al actualizar producto');
      }
    } else {
      const result = createProduct(productData, currentUser);
      if (result.success) {
        showSuccess(`Producto "${formData.name}" creado`);
      } else {
        showError(result.errors?.[0] || 'Error al crear producto');
      }
    }
    
    setFormData({ name: '', price: '', categoryId: '', description: '' });
  };

  const handleEdit = (product) => {
    setEditingProduct(product);
    setFormData({ 
      name: product.name, 
      price: product.price,
      categoryId: product.categoryId || '',
      description: product.description || ''
    });
  };

  const handleDelete = (product) => {
    setConfirmDialog({ isOpen: true, product });
  };

  const confirmDelete = () => {
    const product = confirmDialog.product;
    const result = deleteProduct(product.id);
    if (result.success) {
      showSuccess(`Producto "${product.name}" eliminado`);
    } else {
      showError(result.errors?.[0] || 'Error al eliminar producto');
    }
  };

  const handleToggleAvailability = (product) => {
    const result = toggleAvailability(product.id);
    if (result.success) {
      showSuccess(`Producto "${product.name}" ${result.data.isAvailable ? 'activado' : 'desactivado'}`);
    } else {
      showError(result.errors?.[0] || 'Error al cambiar estado del producto');
    }
  };

  const handleCancel = () => {
    setEditingProduct(null);
    setFormData({ name: '', price: '', categoryId: '', description: '' });
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6 animate-fadeIn">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900">📦 Gestión de Productos</h1>
        <button onClick={onBack} className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600 transition">
          ← Volver al Dashboard
        </button>
      </div>

      {/* Barra de búsqueda y filtros */}
      <div className="bg-white p-4 rounded-lg shadow-md mb-6 animate-slideInUp">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Búsqueda */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">🔍 Buscar</label>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Buscar por nombre o descripción..."
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Filtro por categoría */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">🏷️ Categoría</label>
            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">Todas las categorías</option>
              {activeCategories.map(cat => (
                <option key={cat.id} value={cat.id}>
                  {cat.icon} {cat.name}
                </option>
              ))}
            </select>
          </div>

          {/* Filtro por disponibilidad */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">📊 Disponibilidad</label>
            <select
              value={filterAvailability}
              onChange={(e) => setFilterAvailability(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">Todos</option>
              <option value="available">✓ Disponibles</option>
              <option value="unavailable">✗ No disponibles</option>
            </select>
          </div>
        </div>

        {/* Contador de resultados */}
        <div className="mt-3 text-sm text-gray-600">
          Mostrando <span className="font-bold text-blue-600">{filteredProducts.length}</span> de <span className="font-bold">{products.length}</span> productos
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Formulario */}
        <div className="bg-white p-6 rounded shadow-md h-fit animate-slideInLeft">
          <h2 className="text-xl font-bold mb-4">{editingProduct ? 'Editar Producto' : 'Nuevo Producto'}</h2>
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2">Nombre</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                required
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2">Precio</label>
              <input
                type="number"
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                required
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2">Categoría</label>
              <select
                value={formData.categoryId}
                onChange={(e) => setFormData({ ...formData, categoryId: e.target.value })}
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              >
                <option value="">Sin categoría</option>
                {activeCategories.map(cat => (
                  <option key={cat.id} value={cat.id}>
                    {cat.icon} {cat.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2">Descripción</label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                rows="3"
              />
            </div>
            <div className="flex items-center justify-between">
              <button
                type="submit"
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
              >
                {editingProduct ? 'Actualizar' : 'Crear'}
              </button>
              {editingProduct && (
                <button
                  type="button"
                  onClick={handleCancel}
                  className="bg-gray-400 hover:bg-gray-500 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                >
                  Cancelar
                </button>
              )}
            </div>
          </form>
        </div>

        {/* Lista de Productos */}
        <div className="lg:col-span-2 bg-white p-6 rounded shadow-md animate-slideInRight">
          <h2 className="text-xl font-bold mb-4">📋 Inventario ({filteredProducts.length})</h2>
          <div className="overflow-x-auto">
            <table className="min-w-full table-auto">
              <thead>
                <tr className="bg-gray-200 text-gray-600 uppercase text-sm leading-normal">
                  <th className="py-3 px-6 text-left">Nombre</th>
                  <th className="py-3 px-6 text-left">Categoría</th>
                  <th className="py-3 px-6 text-left">Precio</th>
                  <th className="py-3 px-6 text-center">Estado</th>
                  <th className="py-3 px-6 text-center">Acciones</th>
                </tr>
              </thead>
              <tbody className="text-gray-600 text-sm font-light">
                {filteredProducts.map((product) => {
                  const category = categories.find(c => c.id === product.categoryId);
                  return (
                  <tr key={product.id} className="border-b border-gray-200 hover:bg-gray-100">
                    <td className="py-3 px-6 text-left whitespace-nowrap">
                      <span className="font-medium">{product.name}</span>
                      {product.description && (
                        <p className="text-xs text-gray-500">{product.description}</p>
                      )}
                    </td>
                    <td className="py-3 px-6 text-left">
                      {category ? (
                        <span className={`px-2 py-1 rounded text-xs ${category.color}`}>
                          {category.icon} {category.name}
                        </span>
                      ) : (
                        <span className="text-gray-400 text-xs">Sin categoría</span>
                      )}
                    </td>
                    <td className="py-3 px-6 text-left">
                      ${product.price.toLocaleString()}
                    </td>
                    <td className="py-3 px-6 text-center">
                      <button
                        onClick={() => handleToggleAvailability(product)}
                        className={`px-3 py-1 rounded text-xs font-semibold transition-colors ${
                          product.isAvailable 
                            ? 'bg-green-200 text-green-800 hover:bg-green-300' 
                            : 'bg-red-200 text-red-800 hover:bg-red-300'
                        }`}
                      >
                        {product.isAvailable ? '✓ Disponible' : '✗ No disponible'}
                      </button>
                    </td>
                    <td className="py-3 px-6 text-center">
                      <div className="flex item-center justify-center">
                        <button
                          onClick={() => handleEdit(product)}
                          className="w-4 mr-2 transform hover:text-purple-500 hover:scale-110"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                          </svg>
                        </button>
                        <button
                          onClick={() => handleDelete(product)}
                          className="w-4 mr-2 transform hover:text-red-500 hover:scale-110"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      </div>
                    </td>
                  </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Diálogo de confirmación */}
      <ConfirmDialog
        isOpen={confirmDialog.isOpen}
        onClose={() => setConfirmDialog({ isOpen: false, product: null })}
        onConfirm={confirmDelete}
        title="¿Eliminar producto?"
        message={`Estás a punto de eliminar "${confirmDialog.product?.name}". Esta acción no se puede deshacer.`}
        confirmText="Sí, eliminar"
        cancelText="Cancelar"
        confirmColor="red"
        icon="🗑️"
      />
    </div>
  );
};

export default ProductManager;
