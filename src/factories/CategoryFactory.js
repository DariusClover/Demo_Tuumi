import { generateId } from '../utils/formatters';

/**
 * Factory Pattern para creación de categorías
 */
export class CategoryFactory {
  /**
   * Crear una nueva categoría
   */
  static createCategory(categoryData, createdBy) {
    return {
      id: generateId('CAT'),
      name: categoryData.name,
      icon: categoryData.icon || '📦',
      color: categoryData.color || 'gray',
      description: categoryData.description || '',
      isActive: categoryData.isActive !== undefined ? categoryData.isActive : true,
      order: categoryData.order || 100,
      createdBy: createdBy,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
  }

  /**
   * Actualizar categoría
   */
  static updateCategory(existingCategory, updates) {
    return {
      ...existingCategory,
      ...updates,
      id: existingCategory.id, // Preservar ID
      updatedAt: new Date().toISOString()
    };
  }

  /**
   * Validar categoría
   */
  static validate(categoryData) {
    const errors = [];

    if (!categoryData.name || categoryData.name.trim().length === 0) {
      errors.push('El nombre es requerido');
    }

    if (categoryData.name && categoryData.name.length > 50) {
      errors.push('El nombre no puede exceder 50 caracteres');
    }

    return {
      valid: errors.length === 0,
      errors
    };
  }
}
