import React from 'react';

interface BaseModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  maxWidth?: string;
  headerActions?: React.ReactNode; // 新增：右上角操作按鈕區域
}

const BaseModal: React.FC<BaseModalProps> = ({ 
  isOpen, 
  onClose: _, // 移除X按鈕後不再使用，但保留介面一致性
  title, 
  children,
  maxWidth = "max-w-2xl",
  headerActions
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className={`bg-white rounded-lg shadow-xl ${maxWidth} w-full max-h-[90vh] overflow-y-auto`}>
        <div className="flex justify-between items-center p-6 border-b">
          <h2 className="text-xl font-bold text-gray-800">{title}</h2>
          <div className="flex items-center gap-3">
            {headerActions}
          </div>
        </div>
        
        {children}
      </div>
    </div>
  );
};

export default BaseModal;