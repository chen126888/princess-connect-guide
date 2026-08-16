import React from 'react';
import { Edit } from 'lucide-react';

interface ManagementButtonProps {
  onEdit: () => void;
  label?: string;
  disabled?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

const ManagementButton: React.FC<ManagementButtonProps> = ({ 
  onEdit, 
  label = "編輯", 
  disabled = false,
  size = 'sm'
}) => {
  const sizeClasses = {
    sm: 'px-2 py-1 text-xs',
    md: 'px-3 py-2 text-sm',
    lg: 'px-4 py-2 text-base'
  };

  const iconSizes = {
    sm: 14,
    md: 16,
    lg: 18
  };

  return (
    <button
      onClick={onEdit}
      disabled={disabled}
      className={`
        inline-flex items-center gap-1
        ${sizeClasses[size]}
        bg-blue-500 text-white 
        rounded-md hover:bg-blue-600 
        transition-colors duration-200
        disabled:opacity-50 disabled:cursor-not-allowed
        disabled:hover:bg-blue-500
      `}
    >
      <Edit size={iconSizes[size]} />
      {label}
    </button>
  );
};

export default ManagementButton;