import React from 'react';

const Toast = ({ message, type = 'success', onClose }) => {
  const bgColor = type === 'success' ? 'bg-green-500' : 
                  type === 'error' ? 'bg-red-500' : 
                  type === 'warning' ? 'bg-yellow-500' : 'bg-blue-500';

  const icon = type === 'success' ? '✅' : 
               type === 'error' ? '❌' : 
               type === 'warning' ? '⚠️' : 'ℹ️';

  return (
    <div className={`fixed top-4 right-4 z-50 ${bgColor} text-white px-6 py-4 rounded-lg shadow-lg flex items-center gap-3 animate-slide-in`}>
      <span className="text-2xl">{icon}</span>
      <span className="font-medium">{message}</span>
      {onClose && (
        <button onClick={onClose} className="ml-4 text-white hover:text-gray-200">
          ✕
        </button>
      )}
    </div>
  );
};

export default Toast;
