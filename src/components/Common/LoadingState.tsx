import React from 'react';

interface LoadingStateProps {
  title?: string;
  description?: string;
  className?: string;
}

export default function LoadingState({
  title = 'Loading...',
  description = 'Please wait while we fetch your data',
  className = ''
}: LoadingStateProps) {
  return (
    <div className={`bg-white rounded-2xl shadow-sm border border-gray-200 p-12 text-center ${className}`}>
      <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
        <div className="w-8 h-8 border-3 border-green-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
      <h3 className="text-xl font-semibold text-gray-900 mb-2">{title}</h3>
      <p className="text-gray-600 max-w-md mx-auto">{description}</p>
    </div>
  );
}