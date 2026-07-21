import React from 'react';
import type { Priority } from '../../types/shop';

interface PriorityBadgeProps {
  priority: Priority;
  className?: string;
}

const PriorityBadge: React.FC<PriorityBadgeProps> = ({ priority, className = '' }) => {
  const getPriorityConfig = (priority: Priority) => {
    const configs = {
      must_buy: {
        label: '必買',
        bgColor: 'bg-red-100',
        textColor: 'text-red-800',
        borderColor: 'border-red-300'
      },
      recommended: {
        label: '推薦',
        bgColor: 'bg-green-100',
        textColor: 'text-green-800',
        borderColor: 'border-green-300'
      },
      optional: {
        label: '可選',
        bgColor: 'bg-yellow-100',
        textColor: 'text-yellow-800',
        borderColor: 'border-yellow-300'
      },
      skip: {
        label: '跳過',
        bgColor: 'bg-gray-100',
        textColor: 'text-gray-800',
        borderColor: 'border-gray-300'
      }
    };
    return configs[priority];
  };

  const config = getPriorityConfig(priority);

  return (
    <span
      className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border ${config.bgColor} ${config.textColor} ${config.borderColor} ${className}`}
    >
      {config.label}
    </span>
  );
};

export default PriorityBadge;