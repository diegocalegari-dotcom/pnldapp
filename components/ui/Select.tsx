
import React from 'react';

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {}

const Select: React.FC<SelectProps> = ({ className, children, ...props }) => {
  return (
    <select
      className={`w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm bg-white ${className}`}
      {...props}
    >
      {children}
    </select>
  );
};

export default Select;
