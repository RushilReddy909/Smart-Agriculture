import React from 'react';
import { TbLeaf, TbTree } from 'react-icons/tb';
import { MdAgriculture } from 'react-icons/md';
import Card from '../ui/Card';
import Container from '../layout/Container';

const FeatureSection = () => {
  const features = [
    {
      icon: <TbLeaf className="w-8 h-8" />,
      title: 'Smart Crop Management',
      description: 'Monitor your crops with AI-powered insights and get personalized recommendations for optimal growth.',
      color: 'text-green-600',
      bgColor: 'bg-green-100'
    },
    {
      icon: <MdAgriculture className="w-8 h-8" />,
      title: 'Precision Farming',
      description: 'Utilize advanced analytics and IoT sensors to optimize resource usage and maximize yield.',
      color: 'text-blue-600',
      bgColor: 'bg-blue-100'
    },
    {
      icon: <TbTree className="w-8 h-8" />,
      title: 'Sustainable Practices',
      description: 'Implement eco-friendly farming techniques that protect the environment while boosting productivity.',
      color: 'text-emerald-600',
      bgColor: 'bg-emerald-100'
    }
  ];
  
  return (
    <section className="py-20 bg-gray-50">
      <Container>
        <div className="text-center mb-16">
          <h2 className="heading-secondary text-gray-900 mb-4">
            Revolutionizing Agriculture
          </h2>
          <p className="text-body-large max-w-2xl mx-auto">
            Discover how our smart solutions are transforming farming practices 
            and helping farmers achieve better results with less effort.
          </p>
        </div>
        
        <div className="grid md:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <Card
              key={index}
              hover
              className="text-center group animate-fade-in"
              style={{ animationDelay: `${index * 0.2}s` }}
            >
              <div className={`inline-flex items-center justify-center w-16 h-16 ${feature.bgColor} rounded-2xl mb-6 group-hover:scale-110 transition-transform duration-300`}>
                <div className={feature.color}>
                  {feature.icon}
                </div>
              </div>
              
              <h3 className="heading-tertiary text-gray-900 mb-4">
                {feature.title}
              </h3>
              
              <p className="text-body text-gray-600 leading-relaxed">
                {feature.description}
              </p>
            </Card>
          ))}
        </div>
        
        {/* Additional Info Section */}
        <div className="mt-20 text-center">
          <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100">
            <h3 className="heading-tertiary text-gray-900 mb-4">
              Ready to Transform Your Farm?
            </h3>
            <p className="text-body text-gray-600 mb-6 max-w-2xl mx-auto">
              Join thousands of farmers who are already using our platform to 
              increase their productivity and profitability.
            </p>
            <div className="flex justify-center">
              <div className="flex items-center space-x-6 text-sm text-gray-500">
                <div className="flex items-center">
                  <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                  Free to start
                </div>
                <div className="flex items-center">
                  <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                  No setup fees
                </div>
                <div className="flex items-center">
                  <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                  24/7 support
                </div>
              </div>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
};

export default FeatureSection;