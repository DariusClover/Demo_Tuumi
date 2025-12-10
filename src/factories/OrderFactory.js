import { generateId } from '../utils/formatters';

/**
 * Factory Pattern para creación de pedidos
 */
export class OrderFactory {
  /**
   * Crear un pedido estándar (local)
   */
  static createOrder(items, user, options = {}) {
    const total = items.reduce((sum, item) => sum + (item.price || 0), 0);

    return {
      id: generateId('ORD'),
      items: items.map(item => ({
        ...item,
        orderId: generateId('ITEM')
      })),
      total,
      timestamp: new Date().toISOString(),
      waiter: user?.name || 'Mesero',
      waiterId: user?.id || null,
      status: 'pending',
      isDelivery: false,
      ...options
    };
  }

  /**
   * Crear un pedido a domicilio
   */
  static createDeliveryOrder(items, user, customerData) {
    const baseOrder = this.createOrder(items, user);

    return {
      ...baseOrder,
      isDelivery: true,
      customerName: customerData.customerName,
      customerPhone: customerData.customerPhone,
      address: customerData.address,
      deliveryNotes: customerData.deliveryNotes || ''
    };
  }

  /**
   * Convertir pedido a factura pendiente
   */
  static orderToPendingBill(order) {
    return {
      ...order,
      status: 'ready',
      readyAt: new Date().toISOString()
    };
  }

  /**
   * Convertir factura a venta completada
   */
  static billToCompletedSale(bill, paymentData) {
    return {
      ...bill,
      status: 'paid',
      paymentMethod: paymentData.paymentMethod,
      cashier: paymentData.cashier,
      cashierId: paymentData.cashierId,
      paidAt: new Date().toISOString()
    };
  }

  /**
   * Validar pedido
   */
  static validate(order) {
    const errors = [];

    if (!order.items || order.items.length === 0) {
      errors.push('El pedido debe tener al menos un producto');
    }

    if (!order.total || order.total <= 0) {
      errors.push('El total debe ser mayor a 0');
    }

    if (order.isDelivery) {
      if (!order.customerName) errors.push('Se requiere nombre del cliente');
      if (!order.customerPhone) errors.push('Se requiere teléfono del cliente');
      if (!order.address) errors.push('Se requiere dirección de entrega');
    }

    return {
      valid: errors.length === 0,
      errors
    };
  }
}
