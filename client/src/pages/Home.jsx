import React from 'react';
import HeroSection from '../components/sections/HeroSection';
import FeatureSection from '../components/sections/FeatureSection';

function Home() {
  return (
    <div className="min-h-screen">
      <HeroSection />
      <FeatureSection />
    </div>
  );
}

export default Home;