import React from "react";

const Section = ({ title, children, className = "" }) => {
  return (
    <section className={`py-12 ${className}`}>
      {title && (
        <h2 className="text-3xl font-bold text-center mb-8 text-gray-900">
          {title}
        </h2>
      )}
      {children}
    </section>
  );
};

export default Section;
