import React from 'react';

const Toast = ({ message, type = 'success', onClose }) => {
  const bgColor = type === 'success' ? 'bg-green-500' : 
                  type === 'error' ? 'bg-red-500' : 
                  type === 'warning' ? 'bg-yellow-500' : 'bg-blue-500';

  const icon = type === 'success' ? '' : 
               type === 'error' ? '' : 
               type === 'warning' ? '' : 'ℹ';

  return (
   <>
   </>
  );
};

export default Toast;
