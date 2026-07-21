import React from 'react';

interface PageContainerProps {
  children: React.ReactNode;
  maxWidth?: string;
}

const PageContainer: React.FC<PageContainerProps> = ({ 
  children, 
  maxWidth = '1200px' 
}) => {
  return (
    <div className="min-h-screen" style={{ backgroundColor: '#f8f9fa' }}>
      <div 
        className="container mx-auto px-4" 
        style={{ 
          maxWidth,
          width: '100%'
        }}
      >
        {children}
      </div>
    </div>
  );
};

export default PageContainer;