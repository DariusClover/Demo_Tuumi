import { useContext } from 'react';
import { EmployeeContext } from '../contexts/EmployeeContext';

export const useEmployees = () => {
  const context = useContext(EmployeeContext);
  if (!context) {
    throw new Error('useEmployees must be used within EmployeeProvider');
  }
  return context;
};
