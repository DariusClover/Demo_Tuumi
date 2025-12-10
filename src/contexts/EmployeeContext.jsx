import React, { createContext, useState } from 'react';
import { EmployeeService } from '../services/EmployeeService';

export const EmployeeContext = createContext(undefined);

export const EmployeeProvider = ({ children }) => {
  const [employees, setEmployees] = useState(() => EmployeeService.getAll());
  const [isLoading, setIsLoading] = useState(false);

  const refreshEmployees = () => {
    setIsLoading(true);
    const updated = EmployeeService.getAll();
    setEmployees(updated);
    setIsLoading(false);
  };

  const getActiveEmployees = () => {
    return employees.filter(emp => emp.isActive);
  };

  const createEmployee = (employeeData) => {
    const result = EmployeeService.create(employeeData);
    
    if (result.success) {
      refreshEmployees();
    }
    
    return result;
  };

  const updateEmployee = (id, updates) => {
    const result = EmployeeService.update(id, updates);
    
    if (result.success) {
      refreshEmployees();
    }
    
    return result;
  };

  const deleteEmployee = (id) => {
    const result = EmployeeService.delete(id);
    
    if (result.success) {
      refreshEmployees();
    }
    
    return result;
  };

  return (
    <EmployeeContext.Provider
      value={{
        employees,
        isLoading,
        getActiveEmployees,
        refreshEmployees,
        createEmployee,
        updateEmployee,
        deleteEmployee,
      }}
    >
      {children}
    </EmployeeContext.Provider>
  );
};
