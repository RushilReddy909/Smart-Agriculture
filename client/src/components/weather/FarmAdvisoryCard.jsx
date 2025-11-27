import React from "react";
import Card from "../ui/Card";

const FarmAdvisoryCard = ({ advisories, t }) => {
  if (!advisories || advisories.length === 0) {
    return (
      <div className="text-center text-gray-500 mb-8">
        <p>
          No weather advisories at this time. Conditions are favorable for
          normal farm operations.
        </p>
      </div>
    );
  }

  return (
    <Card className="mb-8 p-6 bg-gradient-to-br from-orange-50 to-red-50">
      <div className="flex items-center gap-3 mb-4">
        <div className="bg-orange-500 text-white p-2 rounded-lg">
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
            />
          </svg>
        </div>
        <h3 className="text-2xl font-bold text-gray-800">
          Farm Advisories & Alerts
        </h3>
      </div>
      <div className="space-y-3">
        {advisories.map((advisory, idx) => (
          <div
            key={idx}
            className={`p-4 rounded-lg border-l-4 shadow-sm ${
              advisory.priority === "high"
                ? "bg-red-50 border-red-500"
                : advisory.priority === "medium"
                ? "bg-yellow-50 border-yellow-500"
                : "bg-blue-50 border-blue-500"
            }`}
          >
            <div className="flex items-start gap-2">
              <span
                className={`mt-1 px-2 py-1 text-xs font-bold rounded ${
                  advisory.priority === "high"
                    ? "bg-red-500 text-white"
                    : advisory.priority === "medium"
                    ? "bg-yellow-500 text-white"
                    : "bg-blue-500 text-white"
                }`}
              >
                {advisory.priority
                  ? String(advisory.priority).toUpperCase()
                  : "INFO"}
              </span>
              <div className="flex-1">
                <p className="font-bold text-gray-900 text-lg">
                  {advisory.title}
                </p>
                <p className="text-sm text-gray-700 mt-1">
                  {advisory.description}
                </p>
                {advisory.action && (
                  <div className="mt-2 p-2 bg-white rounded border-l-2 border-green-500">
                    <p className="text-sm text-gray-800">
                      <strong className="text-green-700">
                        💡 Recommended Action:
                      </strong>{" "}
                      {advisory.action}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
};

export default FarmAdvisoryCard;
