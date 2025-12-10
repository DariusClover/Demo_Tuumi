import { employeesRepository } from '../repositories/LocalStorageRepository';
import { UserFactory } from '../factories/UserFactory';
import { validatePassword } from '../utils/validators';

/**
 * Service Layer para lógica de autenticación
 */
export class AuthService {
  /**
   * Verificar si hay usuarios registrados
   */
  static hasUsers() {
    const employees = employeesRepository.getAll();
    return employees.length > 0;
  }

  /**
   * Registrar nuevo usuario
   * El primer usuario será admin automáticamente
   */
  static register(userData) {
    // Validar datos
    const validation = UserFactory.validate(userData);
    if (!validation.valid) {
      return { success: false, errors: validation.errors };
    }

    // Validar username único
    const existingUser = employeesRepository.find(
      emp => emp.username === userData.username
    );

    if (existingUser) {
      return { success: false, errors: ['El nombre de usuario ya existe'] };
    }

    // Determinar si es el primer usuario
    const isFirstUser = !this.hasUsers();

    // Crear usuario
    const newUser = UserFactory.createEmployee(userData, isFirstUser);

    // Guardar
    const result = employeesRepository.add(newUser);

    if (result.success) {
      return {
        success: true,
        user: newUser,
        isFirstUser
      };
    }

    return { success: false, errors: ['Error al guardar el usuario'] };
  }

  /**
   * Autenticar usuario
   */
  static login(username, password) {
    console.log('🔐 Intento de login:', { username, password });
    
    // Admin hardcoded (solo para desarrollo)
    if (username === 'admin' && password === 'admin123') {
      console.log('✅ Login como admin hardcoded');
      return {
        success: true,
        user: UserFactory.createDefaultAdmin()
      };
    }

    // Buscar en empleados registrados
    const allEmployees = employeesRepository.getAll();
    console.log('👥 Total empleados en BD:', allEmployees.length);
    console.log('📋 Empleados:', allEmployees.map(e => ({ 
      username: e.username, 
      role: e.role, 
      active: e.active 
    })));
    
    const employee = employeesRepository.find(
      emp => emp.username === username && 
             emp.password === password &&
             emp.active === true
    );

    if (employee) {
      console.log('✅ Empleado encontrado:', { 
        username: employee.username, 
        role: employee.role,
        active: employee.active 
      });
      return {
        success: true,
        user: employee
      };
    }

    console.log('❌ Login fallido - Usuario no encontrado o inactivo');
    return {
      success: false,
      error: 'Usuario o contraseña incorrectos'
    };
  }

  /**
   * Verificar si usuario es admin
   */
  static isAdmin(user) {
    return user && user.role === 'admin';
  }

  /**
   * Cambiar contraseña
   */
  static changePassword(userId, oldPassword, newPassword) {
    const user = employeesRepository.getById(userId);

    if (!user) {
      return { success: false, error: 'Usuario no encontrado' };
    }

    if (user.password !== oldPassword) {
      return { success: false, error: 'Contraseña actual incorrecta' };
    }

    const validation = validatePassword(newPassword);
    if (!validation.valid) {
      return { success: false, error: validation.error };
    }

    const result = employeesRepository.update(userId, { password: newPassword });
    return result;
  }
}
