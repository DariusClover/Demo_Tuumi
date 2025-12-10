import { productsRepository, categoriesRepository } from '../repositories/LocalStorageRepository';
import { ProductFactory } from '../factories/ProductFactory';

/**
 * Service Layer para gestión de productos
 */
export class ProductService {
  /**
   * Obtener todos los productos
   */
  static getAll() {
    return productsRepository.getAll();
  }

  /**
   * Obtener productos disponibles
   */
  static getAvailable() {
    return productsRepository.filter(prod => prod.isAvailable === true);
  }

  /**
   * Obtener productos por categoría
   */
  static getByCategory(categoryId) {
    return productsRepository.filter(prod => prod.categoryId === categoryId);
  }

  /**
   * Obtener productos agrupados por categoría
   */
  static getGroupedByCategory() {
    const products = this.getAvailable();
    const categories = categoriesRepository.filter(cat => cat.active === true);
    
    const grouped = {};
    
    categories.forEach(category => {
      grouped[category.id] = {
        category,
        products: products.filter(p => p.categoryId === category.id)
      };
    });

    // Productos sin categoría
    const uncategorized = products.filter(
      p => !categories.find(c => c.id === p.categoryId)
    );

    if (uncategorized.length > 0) {
      grouped['uncategorized'] = {
        category: { id: 'uncategorized', name: 'Sin categoría', icon: '📦' },
        products: uncategorized
      };
    }

    return grouped;
  }

  /**
   * Crear nuevo producto
   */
  static create(productData, createdBy) {
    const validation = ProductFactory.validate(productData);
    
    if (!validation.valid) {
      return { success: false, errors: validation.errors };
    }

    // Obtener nombre de categoría
    const category = categoriesRepository.getById(productData.categoryId);
    const categoryName = category ? category.name : 'Sin categoría';

    const newProduct = ProductFactory.createProduct(
      { ...productData, categoryName },
      createdBy
    );

    const result = productsRepository.add(newProduct);

    if (result.success) {
      return { success: true, product: newProduct };
    }

    return { success: false, errors: ['Error al crear el producto'] };
  }

  /**
   * Actualizar producto
   */
  static update(id, updates) {
    const existing = productsRepository.getById(id);
    
    if (!existing) {
      return { success: false, errors: ['Producto no encontrado'] };
    }

    // Si se cambió la categoría, actualizar el nombre
    if (updates.categoryId && updates.categoryId !== existing.categoryId) {
      const category = categoriesRepository.getById(updates.categoryId);
      updates.categoryName = category ? category.name : 'Sin categoría';
    }

    const updatedProduct = ProductFactory.updateProduct(existing, updates);
    const validation = ProductFactory.validate(updatedProduct);

    if (!validation.valid) {
      return { success: false, errors: validation.errors };
    }

    const result = productsRepository.update(id, updatedProduct);

    if (result.success) {
      return { success: true, product: updatedProduct };
    }

    return { success: false, errors: ['Error al actualizar el producto'] };
  }

  /**
   * Eliminar producto
   */
  static delete(id) {
    const product = productsRepository.getById(id);
    
    if (!product) {
      return { success: false, errors: ['Producto no encontrado'] };
    }

    return productsRepository.delete(id);
  }

  /**
   * Activar/Desactivar producto
   */
  static toggleAvailability(id) {
    const product = productsRepository.getById(id);
    
    if (!product) {
      return { success: false, errors: ['Producto no encontrado'] };
    }

    return productsRepository.update(id, { isAvailable: !product.isAvailable });
  }

  /**
   * Actualizar productos cuando se elimina una categoría
   */
  static updateProductsOnCategoryDelete(categoryId, newCategoryId = 'CAT-UNCATEGORIZED') {
    const products = this.getByCategory(categoryId);
    
    products.forEach(product => {
      this.update(product.id, { categoryId: newCategoryId });
    });

    return { success: true, updated: products.length };
  }
}
