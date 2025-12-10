import { generateId } from '../utils/formatters';
import { ROLES, ROLE_CONFIG } from '../constants/roles';

/**
 * Factory Pattern para creación de usuarios/empleados
 */
export class UserFactory {
  /**
   * Crear un nuevo empleado
   */
  static createEmployee(userData, isFirstUser = false) {
    const role = isFirstUser ? ROLES.ADMIN : (userData.role || ROLES.MESERO);
    const roleConfig = ROLE_CONFIG[role];

    return {
      id: generateId('EMP'),
      username: userData.username,
      password: userData.password, // TODO: Implementar hash
      name: userData.name,
      email: userData.email || '',
      role: role,
      avatar: roleConfig?.avatar || userData.name?.charAt(0).toUpperCase() || '👤',
      isFirstUser: isFirstUser,
      active: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
  }

  /**
   * Crear admin por defecto
   */
  static createDefaultAdmin() {
    return {
      id: 'admin-default',
      username: 'admin',
      password: 'admin123',
      name: 'Administrador',
      email: 'admin@yuumi.com',
      role: ROLES.ADMIN,
      avatar: '👑',
      isFirstUser: false,
      active: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
  }

  /**
   * Validar datos de usuario
   */
  static validate(userData) {
    const errors = [];

    if (!userData.username || userData.username.length < 3) {
      errors.push('El usuario debe tener al menos 3 caracteres');
    }

    if (!userData.password || userData.password.length < 6) {
      errors.push('La contraseña debe tener al menos 6 caracteres');
    }

    if (!userData.name || userData.name.length < 3) {
      errors.push('El nombre debe tener al menos 3 caracteres');
    }

    return {
      valid: errors.length === 0,
      errors
    };
  }
}
