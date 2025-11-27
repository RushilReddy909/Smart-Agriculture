import React from "react";
import { useState } from "react";
import Container from "../components/layout/Container";
import Card from "../components/ui/Card";
import Button from "../components/ui/Button";
import { getCurrentSeason, crops } from "../data/cropData";
import { TbPlant2, TbClock, TbLeaf, TbArrowDown } from "react-icons/tb";
import useLanguageStore from "../store/useLanguageStore";

// JSON key prefix for this page to make code cleaner
const jsonPrefix = "CropSuggestionPage.crop_suggestion";

const CropSuggestion = () => {
  const [showSuggestions, setShowSuggestions] = useState(false);
  const { t } = useLanguageStore();

  // --- LOGIC FIX ---
  // Get the simple, non-translatable key (e.g., 'kharif')
  const currentSeasonKey = getCurrentSeason();

  // State now holds the key, not the translated string
  const [activeTabKey, setActiveTabKey] = useState(currentSeasonKey);

  // Filter logic now works perfectly because it compares keys (e.g., 'kharif' === 'kharif')
  const recommendedCrops = crops.filter(
    (crop) => crop.season === currentSeasonKey
  );
  const displayedCrops = crops.filter((crop) => crop.season === activeTabKey);

  // The list of keys for our tabs
  const seasonKeys = ["kharif", "rabi", "zaid"];
  // --- END LOGIC FIX ---

  const handleRevealClick = () => {
    setShowSuggestions(true);
    setTimeout(() => {
      document
        .getElementById("suggestions-section")
        ?.scrollIntoView({ behavior: "smooth" });
    }, 100);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <Container>
        {/* Initial Prompt Section */}
        <div className="text-center mb-12 animate-fade-in max-w-3xl mx-auto">
          <div className="inline-block bg-green-100 text-green-700 p-4 rounded-2xl mb-4">
            <TbPlant2 size={40} />
          </div>
          <h1 className="heading-secondary text-gray-900 mb-4">
            {t(`${jsonPrefix}.title`)}
          </h1>
          <p className="text-body-large mb-8">{t(`${jsonPrefix}.subtitle`)}</p>
          {!showSuggestions && (
            <Button size="lg" onClick={handleRevealClick}>
              {t(`${jsonPrefix}.button`)} <TbArrowDown className="ml-2" />
            </Button>
          )}
        </div>

        {/* Suggestions Section */}
        {showSuggestions && (
          <div id="suggestions-section" className="animate-fade-in">
            <div className="text-center mb-12">
              <h2 className="heading-tertiary text-gray-800">
                {t(`${jsonPrefix}.season_header`)}{" "}
                {/* Use t() to translate the key */}
                <span className="text-green-600">
                  {t(`${jsonPrefix}.seasons.${currentSeasonKey}`)}
                </span>{" "}
                {t(`${jsonPrefix}.season_header_2`)}
              </h2>
              <p className="text-body">{t(`${jsonPrefix}.recommendations`)}</p>
            </div>

            {/* Recommended Crops Grid */}
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
              {recommendedCrops.map((crop) => (
                <Card key={crop.id} className="flex flex-col">
                  {/* --- TRANSLATION FIX --- */}
                  <h3 className="heading-tertiary text-gray-900 mb-3">
                    {t(`${jsonPrefix}.crops.${crop.id}.name`)}
                  </h3>
                  <div className="flex items-center space-x-4 mb-4 text-sm text-gray-500">
                    <span className="flex items-center">
                      <TbLeaf className="mr-1.5 text-green-500" />
                      {t(`${jsonPrefix}.${crop.typeKey}`)}
                    </span>
                    <span className="flex items-center">
                      <TbClock className="mr-1.5 text-blue-500" />
                      {t(`${jsonPrefix}.${crop.difficultyKey}`)}{" "}
                      {t(`${jsonPrefix}.crop_info.to_grow`)}
                    </span>
                  </div>
                  <p className="text-body flex-grow">
                    {t(`${jsonPrefix}.crops.${crop.id}.description`)}
                  </p>
                  {/* --- END TRANSLATION FIX --- */}
                </Card>
              ))}
            </div>

            {/* Explore Other Seasons Section */}
            <div className="text-center border-t border-gray-200 pt-12">
              <h2 className="heading-tertiary text-gray-800 mb-6">
                {t(`${jsonPrefix}.explore_title`)}
              </h2>
              <div className="flex justify-center space-x-2 md:space-x-4 mb-8">
                {/* --- LOGIC FIX --- */}
                {seasonKeys.map((key) => (
                  <button
                    key={key}
                    onClick={() => setActiveTabKey(key)} // Set state using the key
                    className={`px-4 py-2 text-sm md:text-base font-semibold rounded-full transition-colors ${
                      activeTabKey === key // Compare keys
                        ? "bg-green-600 text-white shadow"
                        : "bg-white text-gray-600 hover:bg-gray-100"
                    }`}
                  >
                    {t(`${jsonPrefix}.seasons.${key}`)}{" "}
                    {/* Translate the key for display */}
                  </button>
                ))}
                {/* --- END LOGIC FIX --- */}
              </div>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                {displayedCrops.map((crop) => (
                  <Card key={crop.id} className="flex flex-col">
                    {/* --- TRANSLATION FIX --- */}
                    <h3 className="heading-tertiary text-gray-900 mb-3">
                      {t(`${jsonPrefix}.crops.${crop.id}.name`)}
                    </h3>
                    <div className="flex items-center space-x-4 mb-4 text-sm text-gray-500">
                      <span className="flex items-center">
                        <TbLeaf className="mr-1.5 text-green-500" />
                        {t(`${jsonPrefix}.${crop.typeKey}`)}
                      </span>
                      <span className="flex items-center">
                        <TbClock className="mr-1.5 text-blue-500" />
                        {t(`${jsonPrefix}.${crop.difficultyKey}`)}{" "}
                        {t(`${jsonPrefix}.crop_info.to_grow`)}
                      </span>
                    </div>
                    <p className="text-body flex-grow">
                      {t(`${jsonPrefix}.crops.${crop.id}.description`)}
                    </p>
                    {/* --- END TRANSLATION FIX --- */}
                  </Card>
                ))}
              </div>
            </div>
          </div>
        )}
      </Container>
    </div>
  );
};

export default CropSuggestion;
