import { useState } from 'react';

/**
 * Hook for handling image loading errors
 * @returns Object with error state and handler function
 */
export const useImageErrorHandler = () => {
  const [imageErrors, setImageErrors] = useState<Set<string>>(new Set());

  const handleImageError = (key: string) => {
    setImageErrors(prev => new Set(prev).add(key));
  };

  const hasImageError = (key: string) => imageErrors.has(key);

  const resetErrors = () => {
    setImageErrors(new Set());
  };

  return {
    handleImageError,
    hasImageError,
    resetErrors
  };
};