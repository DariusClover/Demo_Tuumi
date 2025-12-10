import { categoriesRepository } from '../repositories/LocalStorageRepository';
import { CategoryFactory } from '../factories/CategoryFactory';
import { DEFAULT_CATEGORIES } from '../constants/categories';

/**
 * Service Layer para gestión de categorías
 */
export class CategoryService {
  /**
   * Inicializar categorías por defecto
   */
  static initializeDefaultCategories(createdBy = 'system') {
    const existing = categoriesRepository.getAll();
    
    if (existing.length === 0) {
      const categories = DEFAULT_CATEGORIES.map(cat => ({
        ...cat,
        createdBy,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }));
      
      categoriesRepository.save(categories);
      return categories;
    }
    
    return existing;
  }

  /**
   * Obtener todas las categorías
   */
  static getAll() {
    return categoriesRepository.getAll();
  }

  /**
   * Obtener categorías activas
   */
  static getActive() {
    return categoriesRepository.getAll()
      .filter(cat => cat.isActive === true)
      .sort((a, b) => (a.order || 0) - (b.order || 0));
  }

  /**
   * Obtener categoría por ID
   */
  static getById(id) {
    return categoriesRepository.getById(id);
  }

  /**
   * Crear nueva categoría
   */
  static create(categoryData, createdBy) {
    const validation = CategoryFactory.validate(categoryData);
    
    if (!validation.valid) {
      return { success: false, errors: validation.errors };
    }

    // Verificar nombre único
    const existing = categoriesRepository.find(
      cat => cat.name.toLowerCase() === categoryData.name.toLowerCase()
    );

    if (existing) {
      return { success: false, errors: ['Ya existe una categoría con ese nombre'] };
    }

    const newCategory = CategoryFactory.createCategory(categoryData, createdBy);
    const result = categoriesRepository.add(newCategory);

    if (result.success) {
      return { success: true, category: newCategory };
    }

    return { success: false, errors: ['Error al crear la categoría'] };
  }

  /**
   * Actualizar categoría
   */
  static update(id, updates) {
    const validation = CategoryFactory.validate({ ...updates, name: updates.name || 'temp' });
    
    if (!validation.valid) {
      return { success: false, errors: validation.errors };
    }

    const existing = categoriesRepository.getById(id);
    if (!existing) {
      return { success: false, errors: ['Categoría no encontrada'] };
    }

    const updatedCategory = CategoryFactory.updateCategory(existing, updates);
    const result = categoriesRepository.update(id, updatedCategory);

    if (result.success) {
      return { success: true, category: updatedCategory };
    }

    return { success: false, errors: ['Error al actualizar la categoría'] };
  }

  /**
   * Eliminar categoría
   */
  static delete(id) {
    const category = categoriesRepository.getById(id);
    
    if (!category) {
      return { success: false, errors: ['Categoría no encontrada'] };
    }

    // Aquí deberíamos verificar si hay productos asociados
    // Por ahora solo eliminamos
    return categoriesRepository.delete(id);
  }

  /**
   * Activar/Desactivar categoría
   */
  static toggleActive(id) {
    const category = categoriesRepository.getById(id);
    
    if (!category) {
      return { success: false, errors: ['Categoría no encontrada'] };
    }

    return categoriesRepository.update(id, { isActive: !category.isActive });
  }

  /**
   * Reordenar categorías
   */
  static reorder(categoryOrders) {
    try {
      categoryOrders.forEach(({ id, order }) => {
        categoriesRepository.update(id, { order });
      });
      return { success: true };
    } catch (err) {
      console.error('Error reordering categories:', err);
      return { success: false, errors: ['Error al reordenar categorías'] };
    }
  }
}
