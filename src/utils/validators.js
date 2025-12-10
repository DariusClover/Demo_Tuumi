/**
 * Validadores de negocio
 */

export const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const validatePassword = (password) => {
  if (password.length < 6) {
    return { valid: false, error: 'La contraseña debe tener al menos 6 caracteres' };
  }
  return { valid: true };
};

export const validateUsername = (username) => {
  if (username.length < 3) {
    return { valid: false, error: 'El usuario debe tener al menos 3 caracteres' };
  }
  if (!/^[a-zA-Z0-9_]+$/.test(username)) {
    return { valid: false, error: 'El usuario solo puede contener letras, números y guión bajo' };
  }
  return { valid: true };
};

export const validateProductPrice = (price) => {
  const numPrice = Number(price);
  if (isNaN(numPrice) || numPrice <= 0) {
    return { valid: false, error: 'El precio debe ser un número mayor a 0' };
  }
  return { valid: true };
};

export const validateOrder = (order) => {
  if (!order.items || order.items.length === 0) {
    return { valid: false, error: 'El pedido debe tener al menos un producto' };
  }
  if (!order.total || order.total <= 0) {
    return { valid: false, error: 'El total del pedido debe ser mayor a 0' };
  }
  return { valid: true };
};

export const validatePhone = (phone) => {
  const phoneRegex = /^[0-9]{7,10}$/;
  if (!phoneRegex.test(phone)) {
    return { valid: false, error: 'El teléfono debe tener entre 7 y 10 dígitos' };
  }
  return { valid: true };
};
