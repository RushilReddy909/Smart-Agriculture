import React from "react";

const BenefitCard = ({ icon: Icon, title, description }) => {
  return (
    <div className="text-center p-6 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow">
      {Icon && (
        <div className="inline-block p-4 bg-green-100 text-green-600 rounded-full mb-4">
          <Icon size={32} />
        </div>
      )}
      <h3 className="text-xl font-semibold mb-2 text-gray-900">{title}</h3>
      <p className="text-gray-600">{description}</p>
    </div>
  );
};

export default BenefitCard;
