import React from 'react';
import { Link } from 'react-router-dom';
import Container from '../components/layout/Container';
import Card from '../components/ui/Card';
import { TbPlant2, TbSun, TbBrain } from 'react-icons/tb';
import { RiLineChartFill } from 'react-icons/ri';
import { MdAgriculture } from 'react-icons/md';
import { FaCloudSun } from 'react-icons/fa'; // Import a weather icon

const featuresList = [
  {
    title: 'Seasonal Crop Suggestions',
    description: 'Get general crop recommendations based on the current agricultural season.',
    icon: <TbPlant2 size={32} />,
    path: '/crop-suggestion',
    color: 'text-green-600',
    bgColor: 'bg-green-100',
  },
  {
    title: (
      <>
        Market Price
        <br />
        Predictor
      </>
    ),
    description: 'AI-powered price forecasts from trends and demand to time your sale.',
    icon: <RiLineChartFill size={32} />,
    path: '/market-price',
    color: 'text-emerald-700',
    bgColor: 'bg-emerald-100',
  },
  {
    title: (
      <>
        Pest & Disease
        <br />
        Diagnosis
      </>
    ),
    description: 'Identify pests/diseases from images using crop.health API.',
    icon: <TbBrain size={32} />,
    path: '/pest-diagnosis',
    color: 'text-rose-600',
    bgColor: 'bg-rose-100',
  },
  {
    title: (
      <>
        Natural
        <br />
        Pesticides
      </>
    ),
    description: 'Learn organic remedies like vermicompost, neem spray, and more.',
    icon: <MdAgriculture size={32} />,
    path: '/natural-pesticides',
    color: 'text-emerald-600',
    bgColor: 'bg-emerald-100',
  },
  {
    title: (
      <>
        AI Crop
        <br />
        Prediction
      </>
    ),
    description: "Provide your farm's data to our AI model to get a hyper-personalized crop prediction.",
    icon: <TbBrain size={32} />,
    path: '/crop-prediction',
    color: 'text-blue-600',
    bgColor: 'bg-blue-100',
  },
  {
    title: (
      <>
        Weather
        <br />
        Prediction
      </>
    ),
    description: 'Get a 7-day weather forecast for your location to help you plan farming activities.',
    icon: <FaCloudSun size={32} />,
    path: '/weather-prediction',
    color: 'text-purple-600',
    bgColor: 'bg-purple-100',
    disabled: false,
  },
];

const Features = () => {
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <Container>
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
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 justify-center">
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
              </Card>
            </Link>
          ))}
        </div>
      </Container>
    </div>
  );
};

export default Features;

