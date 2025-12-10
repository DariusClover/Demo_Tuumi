/**
 * Repository Pattern para manejo de LocalStorage
 * Centraliza la lógica de persistencia
 */

class LocalStorageRepository {
  constructor(key) {
    this.key = key;
  }

  /**
   * Obtener todos los registros
   */
  getAll() {
    try {
      const data = localStorage.getItem(this.key);
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error(`Error loading ${this.key} from localStorage:`, error);
      return [];
    }
  }

  /**
   * Obtener un registro por ID
   */
  getById(id) {
    const items = this.getAll();
    return items.find(item => item.id === id);
  }

  /**
   * Guardar todos los registros
   */
  save(data) {
    try {
      localStorage.setItem(this.key, JSON.stringify(data));
      return { success: true };
    } catch (error) {
      console.error(`Error saving ${this.key} to localStorage:`, error);
      return { success: false, error: error.message };
    }
  }

  /**
   * Agregar un nuevo registro
   */
  add(item) {
    const items = this.getAll();
    items.push(item);
    return this.save(items);
  }

  /**
   * Actualizar un registro existente
   */
  update(id, updatedItem) {
    const items = this.getAll();
    const index = items.findIndex(item => item.id === id);
    
    if (index === -1) {
      return { success: false, error: 'Item not found' };
    }
    
    items[index] = { ...items[index], ...updatedItem, id };
    return this.save(items);
  }

  /**
   * Eliminar un registro
   */
  delete(id) {
    const items = this.getAll();
    const filtered = items.filter(item => item.id !== id);
    
    if (filtered.length === items.length) {
      return { success: false, error: 'Item not found' };
    }
    
    return this.save(filtered);
  }

  /**
   * Limpiar todos los registros
   */
  clear() {
    try {
      localStorage.removeItem(this.key);
      return { success: true };
    } catch (error) {
      console.error(`Error clearing ${this.key}:`, error);
      return { success: false, error: error.message };
    }
  }

  /**
   * Filtrar registros
   */
  filter(predicate) {
    const items = this.getAll();
    return items.filter(predicate);
  }

  /**
   * Buscar registros
   */
  find(predicate) {
    const items = this.getAll();
    return items.find(predicate);
  }

  /**
   * Contar registros
   */
  count() {
    return this.getAll().length;
  }
}

// Instancias de repositorios
export const ordersRepository = new LocalStorageRepository('orders');
export const pendingBillsRepository = new LocalStorageRepository('pendingBills');
export const completedSalesRepository = new LocalStorageRepository('completedSales');
export const productsRepository = new LocalStorageRepository('products');
export const employeesRepository = new LocalStorageRepository('employees');
export const categoriesRepository = new LocalStorageRepository('categories');

export default LocalStorageRepository;
