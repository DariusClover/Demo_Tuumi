import React, { createContext, useState } from 'react';
import { OrderService } from '../services/OrderService';

export const OrderContext = createContext(undefined);

export const OrderProvider = ({ children }) => {
  const [orders, setOrders] = useState(() => OrderService.getPendingOrders());
  const [pendingBills, setPendingBills] = useState(() => OrderService.getPendingBills());
  const [completedSales, setCompletedSales] = useState(() => OrderService.getCompletedSales());
  const [isLoading, setIsLoading] = useState(false);

  const refreshOrders = () => {
    setIsLoading(true);
    setOrders(OrderService.getPendingOrders());
    setPendingBills(OrderService.getPendingBills());
    setCompletedSales(OrderService.getCompletedSales());
    setIsLoading(false);
  };

  const createOrder = (items, user, options = {}) => {
    const result = OrderService.createOrder(items, user, options);
    
    if (result.success) {
      refreshOrders();
    }
    
    return result;
  };

  const createDeliveryOrder = (items, deliveryInfo, user) => {
    const result = OrderService.createDeliveryOrder(items, user, deliveryInfo);
    
    if (result.success) {
      refreshOrders();
    }
    
    return result;
  };

  const markOrderReady = (orderId) => {
    const result = OrderService.markAsReady(orderId);
    
    if (result.success) {
      refreshOrders();
    }
    
    return result;
  };

  const processPayment = (billId, paymentMethod, user) => {
    const paymentData = {
      paymentMethod,
      cashier: user?.name || user?.id,
      cashierId: user?.id
    };
    
    const result = OrderService.processPayment(billId, paymentData);
    
    if (result.success) {
      refreshOrders();
    }
    
    return result;
  };

  const getSalesMetrics = () => {
    return OrderService.getSalesMetrics();
  };

  return (
    <OrderContext.Provider
      value={{
        orders,
        pendingBills,
        completedSales,
        isLoading,
        refreshOrders,
        createOrder,
        createDeliveryOrder,
        markOrderReady,
        processPayment,
        getSalesMetrics,
      }}
    >
      {children}
    </OrderContext.Provider>
  );
};
