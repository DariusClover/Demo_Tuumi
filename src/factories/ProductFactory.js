import { generateId } from '../utils/formatters';

/**
 * Factory Pattern para creación de productos
 */
export class ProductFactory {
  /**
   * Crear un nuevo producto
   */
  static createProduct(productData, createdBy) {
    return {
      id: generateId('PROD'),
      name: productData.name,
      price: Number(productData.price),
      categoryId: productData.categoryId || 'CAT-UNCATEGORIZED',
      categoryName: productData.categoryName || 'Sin categoría',
      description: productData.description || '',
      image: productData.image || '',
      isAvailable: productData.isAvailable !== undefined ? productData.isAvailable : true,
      createdBy: createdBy,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
  }

  /**
   * Actualizar producto
   */
  static updateProduct(existingProduct, updates) {
    return {
      ...existingProduct,
      ...updates,
      id: existingProduct.id, // Preservar ID
      updatedAt: new Date().toISOString()
    };
  }

  /**
   * Validar producto
   */
  static validate(productData) {
    const errors = [];

    if (!productData.name || productData.name.trim().length === 0) {
      errors.push('El nombre es requerido');
    }

    if (!productData.price || Number(productData.price) <= 0) {
      errors.push('El precio debe ser mayor a 0');
    }

    if (!productData.categoryId) {
      errors.push('Debe seleccionar una categoría');
    }

    return {
      valid: errors.length === 0,
      errors
    };
  }
}
