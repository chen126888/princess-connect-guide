import React from 'react';

interface FilterButtonProps {
  label: string;
  checked: boolean;
  onClick: () => void;
  isAll?: boolean;
  variant?: 'default' | 'sort';
}

const FilterButton: React.FC<FilterButtonProps> = ({ 
  label, 
  checked, 
  onClick,
  isAll = false,
  variant = 'default'
}) => {
  const getButtonStyles = () => {
    if (variant === 'sort') {
      return checked 
        ? 'bg-blue-500 text-white border-blue-500' 
        : 'bg-white text-gray-700 border-gray-300';
    }
    
    if (isAll) {
      return checked 
        ? 'bg-slate-600 text-white border-slate-600' 
        : 'bg-white text-slate-600 border-gray-300';
    }
    
    return checked 
      ? 'bg-blue-500 text-white border-blue-500' 
      : 'bg-white text-gray-700 border-gray-300';
  };

  return (
    <button
      onClick={onClick}
      className={`filter-button px-4 py-2 text-sm font-medium cursor-pointer transition-all duration-200 border-2 ${getButtonStyles()}`}
      style={{ 
        borderRadius: '8px',
        margin: '4px',
        boxShadow: checked ? '0 4px 8px rgba(0,0,0,0.15)' : '0 2px 4px rgba(0,0,0,0.1)',
        fontSize: '14px'
      }}
      onMouseEnter={(e) => {
        if (!checked) {
          e.currentTarget.style.backgroundColor = '#3b82f6';
          e.currentTarget.style.color = 'white';
          e.currentTarget.style.transform = 'translateY(-2px)';
          e.currentTarget.style.boxShadow = '0 4px 8px rgba(0,0,0,0.15)';
        }
      }}
      onMouseLeave={(e) => {
        if (!checked) {
          if (isAll) {
            e.currentTarget.style.backgroundColor = 'white';
            e.currentTarget.style.color = '#64748b';
          } else {
            e.currentTarget.style.backgroundColor = 'white';
            e.currentTarget.style.color = '#374151';
          }
          e.currentTarget.style.transform = 'translateY(0px)';
          e.currentTarget.style.boxShadow = '0 2px 4px rgba(0,0,0,0.1)';
        }
      }}
      onMouseDown={(e) => {
        e.currentTarget.style.transform = 'translateY(0px)';
        e.currentTarget.style.boxShadow = '0 2px 4px rgba(0,0,0,0.1)';
      }}
      onMouseUp={(e) => {
        if (!checked) {
          e.currentTarget.style.transform = 'translateY(-2px)';
          e.currentTarget.style.boxShadow = '0 4px 8px rgba(0,0,0,0.15)';
        }
      }}
    >
      {label}
    </button>
  );
};

export default FilterButton;