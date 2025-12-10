import { ordersRepository, pendingBillsRepository, completedSalesRepository } from '../repositories/LocalStorageRepository';
import { OrderFactory } from '../factories/OrderFactory';

/**
 * Service Layer para gestión de pedidos
 */
export class OrderService {
  /**
   * Crear pedido estándar
   */
  static createOrder(items, user, options = {}) {
    const order = OrderFactory.createOrder(items, user, options);
    const validation = OrderFactory.validate(order);

    if (!validation.valid) {
      return { success: false, errors: validation.errors };
    }

    const result = ordersRepository.add(order);

    if (result.success) {
      return { success: true, order };
    }

    return { success: false, errors: ['Error al crear el pedido'] };
  }

  /**
   * Crear pedido a domicilio
   */
  static createDeliveryOrder(items, user, customerData) {
    const order = OrderFactory.createDeliveryOrder(items, user, customerData);
    const validation = OrderFactory.validate(order);

    if (!validation.valid) {
      return { success: false, errors: validation.errors };
    }

    const result = ordersRepository.add(order);

    if (result.success) {
      return { success: true, order };
    }

    return { success: false, errors: ['Error al crear el pedido'] };
  }

  /**
   * Obtener todos los pedidos pendientes
   */
  static getPendingOrders() {
    return ordersRepository.filter(order => order.status === 'pending');
  }

  /**
   * Marcar pedido como listo
   */
  static markAsReady(orderId) {
    const order = ordersRepository.getById(orderId);

    if (!order) {
      return { success: false, errors: ['Pedido no encontrado'] };
    }

    // Convertir a factura pendiente
    const pendingBill = OrderFactory.orderToPendingBill(order);

    // Eliminar de orders
    ordersRepository.delete(orderId);

    // Agregar a pendingBills
    const result = pendingBillsRepository.add(pendingBill);

    if (result.success) {
      return { success: true, bill: pendingBill };
    }

    return { success: false, errors: ['Error al marcar como listo'] };
  }

  /**
   * Obtener facturas pendientes
   */
  static getPendingBills() {
    return pendingBillsRepository.getAll();
  }

  /**
   * Procesar pago
   */
  static processPayment(billId, paymentData) {
    const bill = pendingBillsRepository.getById(billId);

    if (!bill) {
      return { success: false, errors: ['Factura no encontrada'] };
    }

    if (!paymentData.paymentMethod) {
      return { success: false, errors: ['Debe seleccionar un método de pago'] };
    }

    // Convertir a venta completada
    const completedSale = OrderFactory.billToCompletedSale(bill, paymentData);

    // Eliminar de pendingBills
    pendingBillsRepository.delete(billId);

    // Agregar a completedSales
    const result = completedSalesRepository.add(completedSale);

    if (result.success) {
      return { success: true, sale: completedSale };
    }

    return { success: false, errors: ['Error al procesar el pago'] };
  }

  /**
   * Obtener ventas completadas
   */
  static getCompletedSales() {
    return completedSalesRepository.getAll();
  }

  /**
   * Obtener métricas de ventas
   */
  static getSalesMetrics() {
    const sales = this.getCompletedSales();
    
    const total = sales.reduce((sum, sale) => sum + (sale.total || 0), 0);
    const count = sales.length;
    const average = count > 0 ? total / count : 0;

    const localOrders = sales.filter(s => !s.isDelivery).length;
    const deliveryOrders = sales.filter(s => s.isDelivery).length;

    const today = new Date().toLocaleDateString();
    const todaySales = sales.filter(s => 
      new Date(s.paidAt).toLocaleDateString() === today
    );
    const todayTotal = todaySales.reduce((sum, sale) => sum + (sale.total || 0), 0);

    return {
      totalSales: total,
      totalCount: count,
      averageSale: average,
      localOrders,
      deliveryOrders,
      todaySales: todayTotal,
      todayCount: todaySales.length
    };
  }

  /**
   * Cancelar pedido
   */
  static cancelOrder(orderId, reason = '') {
    const order = ordersRepository.getById(orderId);

    if (!order) {
      return { success: false, errors: ['Pedido no encontrado'] };
    }

    // Aquí podrías guardar el pedido cancelado en un repositorio separado
    const result = ordersRepository.delete(orderId);

    if (result.success) {
      return { success: true, canceledOrder: { ...order, cancelReason: reason } };
    }

    return { success: false, errors: ['Error al cancelar el pedido'] };
  }
}
