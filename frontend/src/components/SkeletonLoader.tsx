interface SkeletonLoaderProps {
  variant?: 'card' | 'text' | 'avatar' | 'image' | 'button' | 'list' | 'grid';
  count?: number;
  className?: string;
}

export default function SkeletonLoader({ variant = 'card', count = 1, className = '' }: SkeletonLoaderProps) {
  const renderSkeleton = () => {
    switch (variant) {
      case 'card':
        return (
          <div className={`bg-white rounded-2xl shadow-lg border border-gray-100 p-6 animate-pulse ${className}`}>
            <div className="w-12 h-12 bg-gray-200 rounded-lg mb-4"></div>
            <div className="h-6 bg-gray-200 rounded mb-2 w-3/4"></div>
            <div className="h-4 bg-gray-200 rounded mb-2"></div>
            <div className="h-4 bg-gray-200 rounded w-5/6"></div>
          </div>
        );
      
      case 'text':
        return (
          <div className={`animate-pulse ${className}`}>
            <div className="h-4 bg-gray-200 rounded mb-2"></div>
            <div className="h-4 bg-gray-200 rounded w-5/6 mb-2"></div>
            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
          </div>
        );
      
      case 'avatar':
        return (
          <div className={`animate-pulse ${className}`}>
            <div className="w-10 h-10 bg-gray-200 rounded-full"></div>
          </div>
        );
      
      case 'image':
        return (
          <div className={`bg-gray-200 rounded-lg animate-pulse ${className}`}>
            <div className="w-full h-48 bg-gray-300 rounded-lg"></div>
          </div>
        );
      
      case 'button':
        return (
          <div className={`h-12 bg-gray-200 rounded-lg animate-pulse ${className}`}></div>
        );
      
      case 'list':
        return (
          <div className={`space-y-3 animate-pulse ${className}`}>
            {Array.from({ length: count }).map((_, i) => (
              <div key={i} className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-gray-200 rounded"></div>
                <div className="flex-1">
                  <div className="h-4 bg-gray-200 rounded mb-1"></div>
                  <div className="h-3 bg-gray-200 rounded w-2/3"></div>
                </div>
              </div>
            ))}
          </div>
        );
      
      case 'grid':
        return (
          <div className={`grid grid-cols-1 md:grid-cols-3 gap-6 ${className}`}>
            {Array.from({ length: count }).map((_, i) => (
              <div key={i} className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 animate-pulse">
                <div className="w-12 h-12 bg-gray-200 rounded-lg mb-4"></div>
                <div className="h-6 bg-gray-200 rounded mb-2 w-3/4"></div>
                <div className="h-4 bg-gray-200 rounded mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-5/6"></div>
              </div>
            ))}
          </div>
        );
      
      default:
        return (
          <div className={`h-4 bg-gray-200 rounded animate-pulse ${className}`}></div>
        );
    }
  };

  return (
    <>
      {Array.from({ length: count }).map((_, index) => (
        <div key={index}>
          {renderSkeleton()}
        </div>
      ))}
    </>
  );
}