import React from 'react';

const Card = ({ 
  children, 
  className = '', 
  hover = false,
  padding = 'md',
  ...props 
}) => {
  const baseClasses = 'bg-white rounded-2xl shadow-sm border border-gray-100';
  const hoverClasses = hover ? 'card-hover cursor-pointer' : '';
  
  const paddings = {
    sm: 'p-4',
    md: 'p-6',
    lg: 'p-8',
    none: ''
  };
  
  const classes = `${baseClasses} ${hoverClasses} ${paddings[padding]} ${className}`;
  
  return (
    <div className={classes} {...props}>
      {children}
    </div>
  );
};

export default Card;