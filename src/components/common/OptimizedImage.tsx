import React, { useState } from 'react';
import {
  getOptimizedImageUrl,
  generateResponsiveSrcSet,
  getLowQualityPlaceholder,
  FALLBACK_CAR_IMAGE,
} from '../../utils/imageOptimizer';

interface OptimizedImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  priority?: boolean;
  aspectRatio?: string;
  sizes?: string;
  className?: string;
}

export const OptimizedImage: React.FC<OptimizedImageProps> = ({
  src,
  alt,
  width = 800,
  height,
  priority = false,
  aspectRatio,
  sizes = '(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw',
  className = '',
  ...rest
}) => {
  const [hasError, setHasError] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  const targetSrc = hasError ? FALLBACK_CAR_IMAGE : src;
  const optimizedSrc = getOptimizedImageUrl(targetSrc, { width, height });
  const lqipSrc = !hasError ? getLowQualityPlaceholder(targetSrc) : undefined;
  const srcSet = !hasError ? generateResponsiveSrcSet(targetSrc) : undefined;

  return (
    <div
      className={`relative overflow-hidden bg-zinc-950/60 ${className}`}
      style={aspectRatio ? { aspectRatio } : undefined}
    >
      {/* Background skeleton/placeholder shimmer + LQIP blur before high-res loads */}
      {!isLoaded && (
        <div className="absolute inset-0 z-0">
          {lqipSrc ? (
            <img
              src={lqipSrc}
              alt=""
              aria-hidden="true"
              className="w-full h-full object-cover filter blur-lg scale-105 opacity-60"
            />
          ) : (
            <div className="w-full h-full bg-zinc-900/60 animate-pulse" />
          )}
        </div>
      )}

      <img
        src={optimizedSrc}
        srcSet={srcSet}
        sizes={sizes}
        alt={alt}
        loading={priority ? 'eager' : 'lazy'}
        decoding="async"
        fetchPriority={priority ? 'high' : 'auto'}
        referrerPolicy="no-referrer"
        onLoad={() => setIsLoaded(true)}
        onError={() => {
          if (!hasError) {
            setHasError(true);
          }
        }}
        className={`relative z-10 w-full h-full object-cover transition-opacity duration-300 ${
          isLoaded ? 'opacity-100' : 'opacity-0'
        }`}
        {...rest}
      />
    </div>
  );
};
