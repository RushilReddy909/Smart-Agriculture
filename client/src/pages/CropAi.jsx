import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as Yup from 'yup';
import axios from 'axios';

import Container from '../components/layout/Container';
import Card from '../components/ui/Card';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';
import { TbPlant, TbReportAnalytics } from 'react-icons/tb';

// Validation Schema for the form inputs
const validationSchema = Yup.object().shape({
  nitrogen: Yup.number().typeError('Must be a number').required('Nitrogen is required'),
  phosphorous: Yup.number().typeError('Must be a number').required('Phosphorous is required'),
  potassium: Yup.number().typeError('Must be a number').required('Potassium is required'),
  ph: Yup.number().typeError('Must be a number').min(0).max(14).required('pH is required'),
  state: Yup.string().required('State is required'),
  district: Yup.string().required('District is required'),
  month: Yup.string().required('Month is required'),
});

// Sample data for dropdowns
const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];


const AICropSuggestion = () => {
  const [prediction, setPrediction] = useState('');
  const [apiError, setApiError] = useState('');

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: yupResolver(validationSchema),
  });

  const onSubmit = async (data) => {
    setPrediction('');
    setApiError('');
    
    // Convert numeric fields to numbers
    const body = {
      ...data,
      nitrogen: parseFloat(data.nitrogen),
      phosphorous: parseFloat(data.phosphorous),
      potassium: parseFloat(data.potassium),
      ph: parseFloat(data.ph),
    };

    try {
      // The path "/predict" assumes you have a proxy setup in package.json
      const response = await axios.post('/predict', body);
      
      if (response.data && response.data.result) {
        setPrediction(response.data.result);
      } else {
        setApiError('The API returned an unexpected response.');
      }
    } catch (err) {
      console.error('API Error:', err);
      setApiError(err.response?.data?.detail || 'Failed to get a prediction. Please try again.');
    }
  };
  
  // Custom Select component for consistent styling
  const Select = ({ label, name, children, error, ...rest }) => (
    <div className="w-full">
      <label className="block text-sm font-medium text-gray-700 mb-2">{label}</label>
      <select name={name} className={`input-field ${error ? 'border-red-500 focus:border-red-500 focus:ring-red-200' : ''}`} {...rest}>
        {children}
      </select>
      {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <Container>
        {/* Page Header */}
        <div className="text-center mb-12 animate-fade-in max-w-3xl mx-auto">
          <div className="inline-block bg-green-100 text-green-700 p-4 rounded-2xl mb-4">
            <TbReportAnalytics size={40} />
          </div>
          <h1 className="heading-secondary text-gray-900 mb-4">
            AI-Powered Crop Recommendation
          </h1>
          <p className="text-body-large">
            Enter your farm's soil and location data to get a hyper-personalized crop suggestion from our AI model.
          </p>
        </div>

        {/* Form and Results Section */}
        <div className="grid lg:grid-cols-2 gap-12 items-start">
          {/* Input Form */}
          <Card className="animate-fade-in">
            <h3 className="heading-tertiary text-gray-800 mb-6">Enter Your Farm's Data</h3>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div className="grid md:grid-cols-3 gap-4">
                <Input label="Nitrogen" {...register('nitrogen')} error={errors.nitrogen?.message} type="number" step="any" placeholder="e.g., 83" />
                <Input label="Phosphorous" {...register('phosphorous')} error={errors.phosphorous?.message} type="number" step="any" placeholder="e.g., 45"/>
                <Input label="Potassium" {...register('potassium')} error={errors.potassium?.message} type="number" step="any" placeholder="e.g., 35"/>
              </div>
              <Input label="Soil pH" {...register('ph')} error={errors.ph?.message} type="number" step="0.1" placeholder="e.g., 6.7"/>
              
              <div className="grid md:grid-cols-2 gap-4">
                <Input label="State" {...register('state')} error={errors.state?.message} type="text" placeholder="e.g., Maharashtra" />
                <Input label="District" {...register('district')} error={errors.district?.message} type="text" placeholder="e.g., Pune" />
              </div>

              <Select label="Month" {...register('month')} error={errors.month?.message}>
                  <option value="">Select Month</option>
                  {months.map(m => <option key={m} value={m}>{m}</option>)}
              </Select>
              
              <Button type="submit" className="w-full !mt-8" disabled={isSubmitting}>
                {isSubmitting ? 'Analyzing...' : 'Get AI Recommendation'}
              </Button>
            </form>
          </Card>
          
          {/* Results Display */}
          <div className="animate-fade-in lg:sticky lg:top-32" style={{ animationDelay: '200ms' }}>
            <Card padding="lg" className="text-center min-h-[200px] flex flex-col justify-center items-center bg-white">
              {isSubmitting ? (
                 <div className="text-gray-500">
                    <svg className="animate-spin h-8 w-8 mx-auto mb-3" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                    <p>Our AI is analyzing your data...</p>
                 </div>
              ) : prediction ? (
                <div>
                  <p className="text-body text-gray-600 mb-2">Our AI recommends you plant:</p>
                  <div className="flex items-center justify-center gap-4">
                     <div className="bg-green-100 text-green-700 p-3 rounded-full">
                       <TbPlant size={32} />
                     </div>
                     <h2 className="heading-secondary text-green-600 capitalize">{prediction}</h2>
                  </div>
                </div>
              ) : apiError ? (
                <div className="text-red-600">
                  <h3 className="font-semibold mb-2">An Error Occurred</h3>
                  <p className="text-sm">{apiError}</p>
                </div>
              ) : (
                <div className="text-center text-gray-500">
                  <TbReportAnalytics size={40} className="mx-auto mb-3" />
                  <p>Your personalized crop recommendation will appear here.</p>
                </div>
              )}
            </Card>
          </div>
        </div>
      </Container>
    </div>
  );
};

export default AICropSuggestion;

