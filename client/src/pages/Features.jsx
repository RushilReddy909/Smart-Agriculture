import React from 'react';
import { Link } from 'react-router-dom';
import Container from '../components/layout/Container';
import Card from '../components/ui/Card';
import { TbPlant2, TbSun, TbBrain, TbCloudRain } from 'react-icons/tb';

// Data for our feature cards
const featuresList = [
  {
    title: 'Seasonal Crop Suggestions',
    description: 'Get personalized crop recommendations based on the current agricultural season.',
    icon: <TbPlant2 size={32} />,
    path: '/crop-suggestion',
    color: 'text-green-600',
    bgColor: 'bg-green-100',
  },
  {
    title: 'AI Crop Prediction',
    description: "Provide your farm's specific data to our AI model to get a hyper-personalized crop prediction.",
    icon: <TbBrain size={32} />,
    path: '/crop-prediction', // No link for now
    color: 'text-blue-600',
    bgColor: 'bg-blue-100',
    //disabled: true,
  },
    {
    title: 'Weather Prediction',
    description: 'Coming soon: Access accurate weather forecasts to plan your farming activities.',
    icon: <TbCloudRain size={32} />,
    path: '#', // No link for now
    color: 'text-blue-600',
    bgColor: 'bg-blue-100',
    disabled: true,
  },
  // Add more features here in the future
];

const Features = () => {
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <Container>
        {/* Page Header */}
        <div className="text-center mb-12 animate-fade-in">
          <div className="inline-block bg-yellow-100 text-yellow-700 p-4 rounded-2xl mb-4">
            <TbSun size={40} />
          </div>
          <h1 className="heading-secondary text-gray-900 mb-2">
            Explore Our Smart Tools
          </h1>
          <p className="text-body-large">
            Discover all the features designed to help you farm smarter.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {featuresList.map((feature, index) => (
            <Link 
              to={feature.disabled ? '#' : feature.path} 
              key={index} 
              className={feature.disabled ? 'pointer-events-none' : ''}
            >
              <Card
                hover={!feature.disabled}
                className={`flex flex-col text-center h-full animate-fade-in ${feature.disabled ? 'opacity-50' : ''}`}
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className={`inline-flex items-center justify-center w-20 h-20 ${feature.bgColor} rounded-2xl mb-6 mx-auto`}>
                  <div className={feature.color}>{feature.icon}</div>
                </div>
                <h3 className="heading-tertiary text-gray-900 mb-4 flex-grow">
                  {feature.title}
                </h3>
                <p className="text-body text-gray-600">
                  {feature.description}
                </p>
                {feature.disabled && (
                  <div className="mt-4 px-3 py-1 bg-gray-200 text-gray-600 text-xs font-bold rounded-full self-center">
                    COMING SOON
                  </div>
                )}
              </Card>
            </Link>
          ))}
        </div>
      </Container>
    </div>
  );
};

export default Features;