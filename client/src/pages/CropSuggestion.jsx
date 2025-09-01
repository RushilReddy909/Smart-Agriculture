import React from 'react';
import { useState } from 'react';
import Container from '../components/layout/Container';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import { getCurrentSeason, crops } from '../data/cropData';
import { TbPlant2, TbClock, TbLeaf, TbArrowDown } from 'react-icons/tb';

const CropSuggestion = () => {
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [activeTab, setActiveTab] = useState(getCurrentSeason());

  const currentSeason = getCurrentSeason();
  const recommendedCrops = crops.filter(crop => crop.season === currentSeason);
  const displayedCrops = crops.filter(crop => crop.season === activeTab);

  const seasons = ['Kharif (Monsoon)', 'Rabi (Winter)', 'Zaid (Summer)'];

  const handleRevealClick = () => {
    setShowSuggestions(true);
    // Smooth scroll to the suggestions
    setTimeout(() => {
      document.getElementById('suggestions-section')?.scrollIntoView({ behavior: 'smooth' });
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
            Find the Perfect Crops for This Season
          </h1>
          <p className="text-body-large mb-8">
            Our tool analyzes the current date to determine the agricultural season and suggests the most suitable crops for you to plant right now.
          </p>
          {!showSuggestions && (
            <Button size="lg" onClick={handleRevealClick}>
              Get My Suggestions <TbArrowDown className="ml-2" />
            </Button>
          )}
        </div>

        {/* Suggestions Section (conditionally rendered) */}
        {showSuggestions && (
          <div id="suggestions-section" className="animate-fade-in">
            <div className="text-center mb-12">
              <h2 className="heading-tertiary text-gray-800">
                Based on today, it's <span className="text-green-600">{currentSeason}</span> season.
              </h2>
              <p className="text-body">Here are our top recommendations:</p>
            </div>
            {/* Recommended Crops Grid */}
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
              {recommendedCrops.map((crop, index) => (
                <Card key={index} className="flex flex-col">
                  {/* Card content remains the same */}
                   <h3 className="heading-tertiary text-gray-900 mb-3">{crop.name}</h3>
                  <div className="flex items-center space-x-4 mb-4 text-sm text-gray-500">
                    <span className="flex items-center"><TbLeaf className="mr-1.5 text-green-500" />{crop.type}</span>
                    <span className="flex items-center"><TbClock className="mr-1.5 text-blue-500" />{crop.difficulty} to grow</span>
                  </div>
                  <p className="text-body flex-grow">{crop.description}</p>
                </Card>
              ))}
            </div>
            
            {/* Explore Other Seasons Section */}
            <div className="text-center border-t border-gray-200 pt-12">
              <h2 className="heading-tertiary text-gray-800 mb-6">Explore Crops from Other Seasons</h2>
              <div className="flex justify-center space-x-2 md:space-x-4 mb-8">
                {seasons.map(season => (
                  <button
                    key={season}
                    onClick={() => setActiveTab(season)}
                    className={`px-4 py-2 text-sm md:text-base font-semibold rounded-full transition-colors ${
                      activeTab === season
                        ? 'bg-green-600 text-white shadow'
                        : 'bg-white text-gray-600 hover:bg-gray-100'
                    }`}
                  >
                    {season}
                  </button>
                ))}
              </div>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                 {displayedCrops.map((crop, index) => (
                   <Card key={index} className="flex flex-col">
                     <h3 className="heading-tertiary text-gray-900 mb-3">{crop.name}</h3>
                     <p className="text-body flex-grow">{crop.description}</p>
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