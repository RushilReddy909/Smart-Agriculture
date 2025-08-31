import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import App from './App';

// Preview component that showcases all the enhanced UI components
function SmartAgriculturePreview() {
  return (
    <BrowserRouter>
      <App />
    </BrowserRouter>
  );
}

export default SmartAgriculturePreview;