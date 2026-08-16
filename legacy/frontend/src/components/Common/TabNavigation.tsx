import React from 'react';

export interface TabItem<T = string> {
  key: T;
  label: string;
  icon?: string;
  hasImage?: boolean;
  customImagePath?: string;
}

interface TabNavigationProps<T> {
  items: TabItem<T>[];
  activeItem: T;
  onItemChange: (item: T) => void;
  title?: string;
  description?: string | React.ReactNode;
  className?: string;
  buttonSize?: 'sm' | 'md' | 'lg';
  layout?: 'left' | 'center';
  descriptionClassName?: string; // 自定義描述區塊的樣式
  // 自定義圖標渲染函數
  renderIcon?: (item: TabItem<T>) => React.ReactNode;
}

const TabNavigation = <T extends string | number>({
  items,
  activeItem,
  onItemChange,
  title,
  description,
  className = '',
  buttonSize = 'md',
  layout = 'left',
  descriptionClassName,
  renderIcon
}: TabNavigationProps<T>): React.ReactElement => {
  
  const sizeClasses = {
    sm: 'px-3 py-1.5 text-xs',
    md: 'px-4 py-2 text-sm',
    lg: 'px-6 py-3 text-lg'
  };

  const layoutClasses = {
    left: 'justify-start',
    center: 'justify-center'
  };

  const defaultRenderIcon = (item: TabItem<T>) => {
    if (renderIcon) {
      return renderIcon(item);
    }
    
    if (item.icon) {
      return <span className="text-lg">{item.icon}</span>;
    }
    
    return null;
  };

  return (
    <div className={`mb-6 bg-white rounded-lg shadow-md p-4 ${className}`}>
      {title && (
        <h3 className="text-lg font-semibold text-gray-800 mb-3">{title}</h3>
      )}
      
      {description && (
        <div className={descriptionClassName || "mb-3 p-2 bg-blue-50 border border-blue-200 rounded-lg"}>
          {typeof description === 'string' ? (
            <div className="text-xs text-blue-700">
              <p>{description}</p>
            </div>
          ) : (
            description
          )}
        </div>
      )}
      
      <div className={`flex flex-wrap gap-2 ${layoutClasses[layout]}`}>
        {items.map((item) => {
          const icon = defaultRenderIcon(item);
          
          return (
            <button
              key={String(item.key)}
              onClick={() => onItemChange(item.key)}
              className={`rounded-lg font-medium transition-all duration-200 flex items-center gap-2 ${sizeClasses[buttonSize]} ${
                activeItem === item.key
                  ? 'bg-blue-500 text-white shadow-md transform scale-105'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200 hover:transform hover:scale-105'
              }`}
            >
              {icon && (
                <div className="flex items-center justify-center w-6 h-6">
                  {icon}
                </div>
              )}
              <span>{item.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default TabNavigation;