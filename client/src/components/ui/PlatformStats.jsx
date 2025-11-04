import React from "react";
import useLanguageStore from "../../store/useLanguageStore";

const PlatformStats = () => {
  const { t } = useLanguageStore();

  const stats = [
    {
      number: "100+",
      label: t("HomePage.platform.stats.1.label"),
      description: t("HomePage.platform.stats.1.description"),
    },
    {
      number: "24/7",
      label: t("HomePage.platform.stats.2.label"),
      description: t("HomePage.platform.stats.2.description"),
    },
    {
      number: "AI",
      label: t("HomePage.platform.stats.3.label"),
      description: t("HomePage.platform.stats.3.description"),
    },
  ];

  return (
    <div className="mt-12 pt-8 border-t border-gray-200">
      <p className="text-sm text-gray-500 mb-4">
        {t("HomePage.platform.title")}
      </p>
      <div className="flex justify-center items-center space-x-8 opacity-60">
        {stats.map((stat, index) => (
          <React.Fragment key={index}>
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-400">
                {stat.number}
              </div>
            </div>
            {index < stats.length - 1 && (
              <div className="w-px h-8 bg-gray-300"></div>
            )}
          </React.Fragment>
        ))}
      </div>
      <div className="flex justify-center items-center space-x-8 mt-2">
        {stats.map((stat, index) => (
          <div key={index} className="text-center">
            <div className="text-xs text-gray-400">{stat.label}</div>
            <div className="text-xs text-gray-300">{stat.description}</div>
          </div>
        ))}
      </div>

      {/* Additional Platform Features */}
      <div className="mt-6 flex justify-center">
        <div className="flex items-center space-x-6 text-xs text-gray-500">
          <div className="flex items-center">
            <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
            {t("HomePage.platform.features.1")}
          </div>
          <div className="flex items-center">
            <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
            {t("HomePage.platform.features.2")}
          </div>
          <div className="flex items-center">
            <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
            {t("HomePage.platform.features.3")}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PlatformStats;
