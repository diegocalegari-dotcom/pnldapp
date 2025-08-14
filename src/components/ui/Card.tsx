import React, { ReactNode } from 'react';

interface CardProps {
  children: ReactNode;
  className?: string;
}

const Card: React.FC<CardProps> = ({ children, className }) => {
  return (
    <div className={`bg-white shadow-md rounded-lg overflow-hidden ${className}`}>
      <div className="p-6">
        {children}
      </div>
    </div>
  );
};

export const CardHeader: React.FC<{ children: ReactNode, className?: string }> = ({ children, className }) => (
    <div className={`border-b border-slate-200 pb-4 mb-4 ${className}`}>
        {children}
    </div>
)


export default Card;
