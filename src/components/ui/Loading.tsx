import React from 'react';
import { ClipLoader, PulseLoader, SyncLoader } from 'react-spinners';

interface LoadingProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  variant?: 'spinner' | 'pulse' | 'sync' | 'dots';
  color?: string;
  text?: string;
  fullScreen?: boolean;
  overlay?: boolean;
}

const Loading: React.FC<LoadingProps> = ({
  size = 'md',
  variant = 'spinner',
  color = '#16a34a',
  text,
  fullScreen = false,
  overlay = false
}) => {
  const getSizeValue = () => {
    switch (size) {
      case 'sm': return 20;
      case 'md': return 35;
      case 'lg': return 50;
      case 'xl': return 80;
      default: return 35;
    }
  };

  const getSpinner = () => {
    const sizeValue = getSizeValue();
    
    switch (variant) {
      case 'pulse':
        return <PulseLoader color={color} size={sizeValue} />;
      case 'sync':
        return <SyncLoader color={color} size={sizeValue} />;
      case 'dots':
        return (
          <div className="flex space-x-1">
            {[0, 1, 2].map((i) => (
              <div
                key={i}
                className="w-3 h-3 rounded-full animate-bounce"
                style={{ 
                  backgroundColor: color,
                  animationDelay: `${i * 0.1}s`
                }}
              />
            ))}
          </div>
        );
      default:
        return <ClipLoader color={color} size={sizeValue} />;
    }
  };

  const content = (
    <div className="flex flex-col items-center justify-center space-y-4">
      {getSpinner()}
      {text && (
        <p className="text-gray-600 text-sm font-medium animate-pulse">
          {text}
        </p>
      )}
    </div>
  );

  if (fullScreen) {
    return (
      <div className="fixed inset-0 bg-white bg-opacity-95 backdrop-blur-sm flex items-center justify-center z-50">
        <div className="text-center">
          {content}
          <div className="mt-8">
            <div className="flex items-center space-x-2 text-xs text-gray-400">
              <div className="w-8 h-8 bg-gradient-to-br from-jamaica-green-500 to-jamaica-gold-500 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">Y</span>
              </div>
              <span className="font-semibold">YaadFeed</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (overlay) {
    return (
      <div className="absolute inset-0 bg-white bg-opacity-75 backdrop-blur-sm flex items-center justify-center rounded-lg z-10">
        {content}
      </div>
    );
  }

  return content;
};

// Specialized loading components
export const PageLoader = ({ text = "Loading..." }: { text?: string }) => (
  <Loading fullScreen variant="spinner" text={text} />
);

export const ButtonLoader = ({ size = "sm" }: { size?: 'sm' | 'md' }) => (
  <Loading size={size} variant="spinner" color="#ffffff" />
);

export const CardLoader = () => (
  <div className="animate-pulse">
    <div className="bg-gray-200 h-48 rounded-t-lg mb-4"></div>
    <div className="px-6 pb-6">
      <div className="h-4 bg-gray-200 rounded mb-2"></div>
      <div className="h-4 bg-gray-200 rounded w-3/4 mb-3"></div>
      <div className="h-3 bg-gray-200 rounded w-1/2"></div>
    </div>
  </div>
);

export const ArticleLoader = () => (
  <div className="animate-pulse">
    <div className="bg-gray-200 h-64 rounded-lg mb-8"></div>
    <div className="space-y-4">
      <div className="h-8 bg-gray-200 rounded w-3/4"></div>
      <div className="h-4 bg-gray-200 rounded"></div>
      <div className="h-4 bg-gray-200 rounded w-5/6"></div>
      <div className="h-4 bg-gray-200 rounded w-4/6"></div>
    </div>
  </div>
);

export default Loading; 