import React from 'react';

const SkeletonLoader = ({ type = 'card', count = 1 }) => {
  const renderSkeleton = () => {
    switch (type) {
      case 'card':
        return (
          <div className="bg-white p-6 rounded-lg shadow-xl animate-pulse">
            <div className="h-4 bg-gray-300 rounded w-3/4 mb-4"></div>
            <div className="h-4 bg-gray-300 rounded w-1/2 mb-2"></div>
            <div className="h-4 bg-gray-300 rounded w-5/6"></div>
          </div>
        );
      
      case 'table-row':
        return (
          <tr className="animate-pulse">
            <td className="py-3 px-6"><div className="h-4 bg-gray-300 rounded w-full"></div></td>
            <td className="py-3 px-6"><div className="h-4 bg-gray-300 rounded w-full"></div></td>
            <td className="py-3 px-6"><div className="h-4 bg-gray-300 rounded w-full"></div></td>
            <td className="py-3 px-6"><div className="h-4 bg-gray-300 rounded w-full"></div></td>
          </tr>
        );
      
      case 'product-grid':
        return (
          <div className="border-2 border-gray-200 rounded-lg p-4 animate-pulse">
            <div className="h-6 bg-gray-300 rounded w-3/4 mb-2"></div>
            <div className="h-4 bg-gray-300 rounded w-1/2 mb-4"></div>
            <div className="flex justify-between items-center">
              <div className="h-6 bg-gray-300 rounded w-1/3"></div>
              <div className="h-10 bg-gray-300 rounded w-24"></div>
            </div>
          </div>
        );
      
      case 'metric-card':
        return (
          <div className="bg-white p-6 rounded-lg shadow-xl border-l-4 border-gray-300 animate-pulse">
            <div className="h-4 bg-gray-300 rounded w-2/3 mb-2"></div>
            <div className="h-8 bg-gray-300 rounded w-1/2"></div>
          </div>
        );

      case 'list-item':
        return (
          <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg border border-gray-200 animate-pulse">
            <div className="flex-1">
              <div className="h-4 bg-gray-300 rounded w-3/4 mb-2"></div>
              <div className="h-3 bg-gray-300 rounded w-1/2"></div>
            </div>
            <div className="h-8 bg-gray-300 rounded w-16"></div>
          </div>
        );

      default:
        return (
          <div className="h-8 bg-gray-300 rounded animate-pulse"></div>
        );
    }
  };

  return (
    <>
      {Array.from({ length: count }).map((_, index) => (
        <div key={index}>{renderSkeleton()}</div>
      ))}
    </>
  );
};

export default SkeletonLoader;
