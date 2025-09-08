import { WifiOff, AlertTriangle, RefreshCw } from 'lucide-react';

interface ErrorStateProps {
  type?: 'network' | 'server' | 'generic';
  title?: string;
  description?: string;
  onRetry?: () => void;
  className?: string;
}

export default function ErrorState({
  type = 'generic',
  title,
  description,
  onRetry,
  className = ''
}: ErrorStateProps) {
  const getErrorConfig = () => {
    switch (type) {
      case 'network':
        return {
          icon: WifiOff,
          defaultTitle: 'No Internet Connection',
          defaultDescription: 'Please check your internet connection and try again.',
          iconColor: 'text-red-500',
          bgColor: 'bg-red-100'
        };
      case 'server':
        return {
          icon: AlertTriangle,
          defaultTitle: 'Server Error',
          defaultDescription: 'Something went wrong on our end. Please try again later.',
          iconColor: 'text-orange-500',
          bgColor: 'bg-orange-100'
        };
      default:
        return {
          icon: AlertTriangle,
          defaultTitle: 'Something went wrong',
          defaultDescription: 'An unexpected error occurred. Please try again.',
          iconColor: 'text-gray-500',
          bgColor: 'bg-gray-100'
        };
    }
  };

  const config = getErrorConfig();
  const Icon = config.icon;

  return (
    <div className={`bg-white rounded-2xl shadow-sm border border-gray-200 p-12 text-center ${className}`}>
      <div className={`w-16 h-16 ${config.bgColor} rounded-full flex items-center justify-center mx-auto mb-4`}>
        <Icon className={`h-8 w-8 ${config.iconColor}`} />
      </div>
      <h3 className="text-xl font-semibold text-gray-900 mb-2">
        {title || config.defaultTitle}
      </h3>
      <p className="text-gray-600 mb-6 max-w-md mx-auto">
        {description || config.defaultDescription}
      </p>
      
      {onRetry && (
        <button
          onClick={onRetry}
          className="inline-flex items-center space-x-2 px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium"
        >
          <RefreshCw className="h-4 w-4" />
          <span>Try Again</span>
        </button>
      )}
    </div>
  );
}