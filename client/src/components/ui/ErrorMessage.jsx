import React from "react";

const ErrorMessage = ({ message, t }) => {
  if (!message) return null;

  return (
    <p className="text-center text-red-600 bg-red-100 p-4 rounded-lg max-w-2xl mx-auto">
      {message}
    </p>
  );
};

export default ErrorMessage;
