import { employeesRepository } from '../repositories/LocalStorageRepository';
import { UserFactory } from '../factories/UserFactory';

/**
 * Service Layer para gestión de empleados
 */
export class EmployeeService {
  /**
   * Obtener todos los empleados
   */
  static getAll() {
    return employeesRepository.getAll();
  }

  /**
   * Obtener empleados activos
   */
  static getActive() {
    return employeesRepository.filter(emp => emp.active === true);
  }

  /**
   * Obtener empleados por rol
   */
  static getByRole(role) {
    return employeesRepository.filter(emp => emp.role === role && emp.active === true);
  }

  /**
   * Crear empleado
   */
  static create(employeeData) {
    const validation = UserFactory.validate(employeeData);

    if (!validation.valid) {
      return { success: false, errors: validation.errors };
    }

    // Verificar username único
    const existing = employeesRepository.find(
      emp => emp.username === employeeData.username
    );

    if (existing) {
      return { success: false, errors: ['El nombre de usuario ya existe'] };
    }

    const newEmployee = UserFactory.createEmployee(employeeData, false);
    const result = employeesRepository.add(newEmployee);

    if (result.success) {
      return { success: true, employee: newEmployee };
    }

    return { success: false, errors: ['Error al crear el empleado'] };
  }

  /**
   * Actualizar empleado
   */
  static update(id, updates) {
    const existing = employeesRepository.getById(id);

    if (!existing) {
      return { success: false, errors: ['Empleado no encontrado'] };
    }

    // Si se cambia el username, verificar que sea único
    if (updates.username && updates.username !== existing.username) {
      const usernameExists = employeesRepository.find(
        emp => emp.username === updates.username && emp.id !== id
      );

      if (usernameExists) {
        return { success: false, errors: ['El nombre de usuario ya existe'] };
      }
    }

    const updatedEmployee = {
      ...existing,
      ...updates,
      id, // Preservar ID
      updatedAt: new Date().toISOString()
    };

    const result = employeesRepository.update(id, updatedEmployee);

    if (result.success) {
      return { success: true, employee: updatedEmployee };
    }

    return { success: false, errors: ['Error al actualizar el empleado'] };
  }

  /**
   * Eliminar empleado
   */
  static delete(id) {
    const employee = employeesRepository.getById(id);

    if (!employee) {
      return { success: false, errors: ['Empleado no encontrado'] };
    }

    // No permitir eliminar al primer admin
    if (employee.isFirstUser) {
      return { success: false, errors: ['No se puede eliminar el administrador principal'] };
    }

    return employeesRepository.delete(id);
  }

  /**
   * Activar/Desactivar empleado
   */
  static toggleActive(id) {
    const employee = employeesRepository.getById(id);

    if (!employee) {
      return { success: false, errors: ['Empleado no encontrado'] };
    }

    if (employee.isFirstUser) {
      return { success: false, errors: ['No se puede desactivar el administrador principal'] };
    }

    return employeesRepository.update(id, { active: !employee.active });
  }
}
