import React from 'react';

// 1. Rename 'as' to 'Component' and set a default value
const Button = ({ 
  children, 
  variant = 'primary', 
  size = 'md', 
  className = '', 
  as: Component = 'button', // <-- EDIT THIS LINE
  ...props 
}) => {
  const baseClasses = 'inline-flex items-center justify-center font-semibold transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed';
  
  const variants = {
    primary: 'button-primary focus:ring-green-500',
    secondary: 'button-secondary focus:ring-gray-500',
    outline: 'border-2 border-green-600 text-green-600 bg-transparent hover:bg-green-50 focus:ring-green-500',
    ghost: 'text-gray-600 bg-transparent hover:bg-gray-100 focus:ring-gray-500'
  };
  
  const sizes = {
    sm: 'px-3 py-2 text-sm rounded-lg',
    md: 'px-6 py-3 text-base rounded-xl',
    lg: 'px-8 py-4 text-lg rounded-xl'
  };
  
  const classes = `${baseClasses} ${variants[variant]} ${sizes[size]} ${className}`;
  
  // 2. Render the dynamic 'Component' instead of a hardcoded 'button'
  return (
    <Component
      className={classes}
      {...props}
    >
      {children}
    </Component>
  );
};

export default Button;