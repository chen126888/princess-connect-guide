import React from 'react';

interface ButtonProps {
  children: React.ReactNode;
  onClick: () => void;
  variant?: 'default' | 'primary' | 'secondary';
  size?: 'sm' | 'md' | 'lg';
  isSelected?: boolean;
  className?: string;
  disabled?: boolean;
}

const Button: React.FC<ButtonProps> = ({
  children,
  onClick,
  variant = 'default',
  size = 'md',
  isSelected = false,
  className = '',
  disabled = false
}) => {
  const getVariantStyles = () => {
    if (isSelected) {
      return 'bg-blue-500 text-white border-blue-500';
    }
    
    switch (variant) {
      case 'primary':
        return 'bg-blue-500 text-white border-blue-500 hover:bg-blue-600';
      case 'secondary':
        return 'bg-gray-500 text-white border-gray-500 hover:bg-gray-600';
      default:
        return 'bg-white text-gray-700 border-gray-300 hover:bg-blue-500 hover:text-white hover:border-blue-500';
    }
  };

  const getSizeStyles = () => {
    switch (size) {
      case 'sm':
        return 'px-3 py-1.5 text-sm';
      case 'lg':
        return 'px-6 py-3 text-base';
      default:
        return 'px-4 py-2 text-sm';
    }
  };

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`
        font-medium cursor-pointer transition-all duration-200 border-2 
        ${getVariantStyles()} 
        ${getSizeStyles()} 
        ${className}
        ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
      `}
      style={{ 
        borderRadius: '8px',
        margin: '0.25rem',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
      }}
    >
      {children}
    </button>
  );
};

export default Button;