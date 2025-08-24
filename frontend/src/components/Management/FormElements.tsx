import React from 'react';
import { Trash2, Plus } from 'lucide-react';

// 樣式常數
export const MODAL_STYLES = {
  input: "px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500",
  select: "px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500",
  deleteButton: "text-red-500 hover:text-red-700",
  addButton: "text-blue-500 hover:text-blue-700 text-sm",
  primaryButton: "px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600",
  secondaryButton: "px-4 py-2 text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50"
};

// 通用輸入框
interface ModalInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  className?: string;
}

export const ModalInput: React.FC<ModalInputProps> = ({ className = "w-full", ...props }) => (
  <input className={`${MODAL_STYLES.input} ${className}`} {...props} />
);

// 通用選擇框
interface ModalSelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  className?: string;
  children: React.ReactNode;
}

export const ModalSelect: React.FC<ModalSelectProps> = ({ className = "w-full", children, ...props }) => (
  <select className={`${MODAL_STYLES.select} ${className}`} {...props}>
    {children}
  </select>
);

// 刪除按鈕
interface DeleteButtonProps {
  onClick: () => void;
  size?: number;
}

export const DeleteButton: React.FC<DeleteButtonProps> = ({ onClick, size = 16 }) => (
  <button 
    type="button"
    onClick={onClick} 
    className={MODAL_STYLES.deleteButton}
  >
    <Trash2 size={size} />
  </button>
);

// 新增按鈕
interface AddButtonProps {
  onClick: () => void;
  children: React.ReactNode;
  disabled?: boolean;
}

export const AddButton: React.FC<AddButtonProps> = ({ onClick, children, disabled = false }) => (
  <button 
    type="button"
    onClick={onClick}
    disabled={disabled}
    className={`flex items-center gap-2 px-3 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 ${
      disabled ? 'opacity-50 cursor-not-allowed hover:bg-blue-500' : ''
    }`}
  >
    <Plus size={16} />
    {children}
  </button>
);

// 確認按鈕組
interface ConfirmButtonsProps {
  onCancel: () => void;
  onSave: () => void;
  saveText?: string;
  cancelText?: string;
  disabled?: boolean;
}

export const ConfirmButtons: React.FC<ConfirmButtonsProps> = ({ 
  onCancel, 
  onSave, 
  saveText = "保存", 
  cancelText = "取消",
  disabled = false
}) => (
  <div className="flex gap-4 pt-4 border-t">
    <button
      type="button"
      onClick={onCancel}
      className={MODAL_STYLES.secondaryButton}
    >
      {cancelText}
    </button>
    <button
      type="button"
      onClick={onSave}
      disabled={disabled}
      className={`${MODAL_STYLES.primaryButton} ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
    >
      {saveText}
    </button>
  </div>
);