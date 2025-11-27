import React from "react";
import Card from "./Card";

const CropCard = ({ crop, Icon, t }) => {
  return (
    <Card className="flex items-center gap-4 p-4 hover:shadow-lg transition-shadow">
      {Icon && (
        <div className="text-green-600 flex-shrink-0">
          <Icon size={48} />
        </div>
      )}
      <div>
        <h4 className="text-lg font-semibold text-gray-900">{crop.name}</h4>
        <p className="text-sm text-gray-600">{crop.description}</p>
        {crop.season && (
          <p className="text-xs text-green-600 mt-1">
            <strong>Season:</strong> {crop.season}
          </p>
        )}
      </div>
    </Card>
  );
};

export default CropCard;
