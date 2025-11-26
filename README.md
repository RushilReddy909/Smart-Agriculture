# 🌾 Smart Agriculture Platform

> An intelligent agricultural assistant powered by AI and Machine Learning to help farmers make data-driven decisions for better crop yields and sustainable farming practices.

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Node.js](https://img.shields.io/badge/Node.js-v18+-green.svg)](https://nodejs.org/)
[![Python](https://img.shields.io/badge/Python-3.8+-blue.svg)](https://python.org/)
[![React](https://img.shields.io/badge/React-19.1+-61dafb.svg)](https://reactjs.org/)

## 📋 Table of Contents

- [Overview](#-overview)
- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Project Structure](#-project-structure)
- [Getting Started](#-getting-started)
- [Environment Variables](#-environment-variables)
- [API Endpoints](#-api-endpoints)
- [Scripts](#-scripts)
- [Contributing](#-contributing)
- [License](#-license)

## 🌟 Overview

Smart Agriculture is a comprehensive full-stack platform that leverages cutting-edge AI technology to revolutionize modern farming. The platform combines machine learning models, weather APIs, and generative AI to provide farmers with actionable insights for crop management, pest control, market prices, and weather predictions.

### Key Highlights

✨ **AI-Powered Crop Recommendations** - Get personalized crop suggestions based on soil conditions and climate data  
🐛 **Intelligent Pest Diagnosis** - Identify plant diseases and pests using image recognition  
📊 **Real-time Market Prices** - Access up-to-date market information for better selling decisions  
🌤️ **Weather Predictions** - Advanced weather forecasting using ML models  
💬 **AI Chat Assistant** - Get instant farming advice through Gemini-powered chatbot  
🌍 **Multi-language Support** - Available in English, Hindi, and Telugu

## 🎯 Features

### 🌱 Crop Management

- **Seasonal Crop Suggestions** - Recommendations for Kharif, Rabi, and Zaid seasons
- **ML-Based Crop Prediction** - Predicts optimal crops based on NPK values, pH, temperature, humidity, and rainfall
- **Soil Analysis Integration** - Input soil parameters for accurate predictions

### 🦗 Pest & Disease Control

- **Image-Based Pest Identification** - Upload plant images for instant pest/disease detection
- **Natural Pesticide Recommendations** - Eco-friendly treatment options
- **Detailed Treatment Plans** - Step-by-step guides powered by Google Gemini AI

### 📈 Market Intelligence

- **Crop Price Predictions** - AI-driven market price forecasting
- **Real-time Market Data** - Stay informed about current market trends

### 🌦️ Weather Services

- **Current Weather Data** - Live weather information using OpenWeather API
- **ML Weather Predictions** - Temperature and humidity forecasting using neural networks
- **Location-Based Forecasts** - State and district-level weather data

### 💻 User Experience

- **Responsive Design** - Seamless experience across all devices
- **Secure Authentication** - JWT-based auth with refresh tokens
- **Redis Caching** - Fast response times for API calls
- **Protected Routes** - Role-based access control

## 🛠️ Tech Stack

### Frontend

- **React 19.1** - Modern UI library with latest features
- **React Router v7** - Client-side routing
- **Tailwind CSS 4** - Utility-first styling
- **Zustand** - Lightweight state management
- **React Hook Form** - Efficient form handling
- **Vite** - Lightning-fast build tool
- **Axios** - HTTP client for API calls

### Backend

- **Node.js & Express 5** - Server framework
- **MongoDB & Mongoose** - Database and ODM
- **JWT** - Secure authentication
- **Redis** - Caching layer
- **bcrypt** - Password hashing
- **Google Gemini AI** - Generative AI integration

### ML/AI Services

- **FastAPI** - High-performance Python API
- **PyTorch** - Deep learning framework
- **scikit-learn** - ML model training
- **pandas & numpy** - Data processing

### External APIs

- 🌤️ **OpenWeather API** - Weather data
- 🖼️ **Unsplash API** - Agricultural images
- 🔍 **Kindwise API** - Plant disease identification
- 🤖 **Google Gemini API** - AI-powered chat and analysis

## 📁 Project Structure

```
Smart-Agriculture/
├── 📱 client/                    # React frontend
│   ├── src/
│   │   ├── components/          # Reusable UI components
│   │   │   ├── ChatWidget.jsx   # AI chat interface
│   │   │   ├── ProtectedRoute.jsx
│   │   │   ├── layout/          # Layout components
│   │   │   ├── sections/        # Page sections
│   │   │   └── ui/              # UI primitives
│   │   ├── data/                # Static data & utilities
│   │   ├── locales/             # i18n translations (en, hi, tel)
│   │   ├── pages/               # Route pages
│   │   │   ├── Home.jsx
│   │   │   ├── CropSuggestion.jsx
│   │   │   ├── CropAi.jsx
│   │   │   ├── PestDiagnosis.jsx
│   │   │   ├── MarketPrice.jsx
│   │   │   └── WeatherPrediction.jsx
│   │   ├── store/               # Zustand stores
│   │   └── utils/               # Helper functions
│   └── public/                  # Static assets
│
├── 🖥️ server/                    # Express backend
│   ├── config/                  # Database config
│   ├── controllers/             # Route handlers
│   │   ├── authController.js
│   │   ├── chatController.js
│   │   ├── pestController.js
│   │   ├── priceController.js
│   │   └── weatherController.js
│   ├── middlewares/             # Auth & caching
│   ├── models/                  # MongoDB schemas
│   ├── routes/                  # API routes
│   └── utils/                   # Gemini client
│
└── 🤖 prediction_api/            # FastAPI ML service
    ├── main.py                  # FastAPI app
    ├── model/                   # Trained neural networks
    │   ├── net.py              # Model architecture
    │   └── baseline/           # Baseline models
    ├── utils/                   # Prediction utilities
    │   ├── pred_crop.py        # Crop prediction
    │   └── pred_temp_hum.py    # Weather prediction
    └── data/                    # Training datasets
```

## 🚀 Getting Started

### Prerequisites

- **Node.js** v18 or higher
- **Python** 3.8 or higher
- **MongoDB** (local or Atlas)
- **Redis** (optional, for caching)
- **npm** or **yarn**

### Installation

1. **Clone the repository**

```bash
git clone https://github.com/RushilReddy909/Smart-Agriculture.git
cd Smart-Agriculture
```

2. **Install root dependencies**

```bash
npm install
```

3. **Install client dependencies**

```bash
cd client
npm install
cd ..
```

4. **Install Python dependencies**

```bash
cd prediction_api
pip install -r requirements.txt
cd ..
```

5. **Configure environment variables**

```bash
# Create .env file in the root directory
cp .env.example .env
# Edit .env with your API keys (see Environment Variables section)
```

6. **Run the development servers**

```bash
# Option 1: Run all services concurrently
npm run dev

# Option 2: Run services separately
npm run dev:server   # Express server on port 5000
npm run dev:client   # Vite dev server on port 5173
npm run dev:api      # FastAPI server on port 8000
```

### Production Build

```bash
npm run build
npm start
```

## 🔐 Environment Variables

Create a `.env` file in the root directory:

```env
# Server Configuration
PORT=5000
NODE_ENV=development

# Database
MONGO_URL=mongodb://localhost:27017/smart-agriculture
# Or use MongoDB Atlas:
# MONGO_URL=mongodb+srv://username:password@cluster.mongodb.net/smart-agriculture

# Authentication
JWT_SECRET=your_super_secret_jwt_key_here
JWT_REFRESH=your_super_secret_refresh_key_here

# External APIs
OPENWEATHER_API_KEY=your_openweather_api_key
OPENSPLASH_SECRET=your_unsplash_access_key
KINDWISE_API_KEY=your_kindwise_plant_id_key
GEMINI_API_KEY=your_google_gemini_api_key

# Redis (Optional - for caching)
REDIS_URL=redis://localhost:6379
```

### Getting API Keys

- 🌤️ **OpenWeather API**: [https://openweathermap.org/api](https://openweathermap.org/api)
- 🖼️ **Unsplash API**: [https://unsplash.com/developers](https://unsplash.com/developers)
- 🔍 **Kindwise API**: [https://kindwise.com/plant-id](https://kindwise.com/plant-id)
- 🤖 **Gemini API**: [https://ai.google.dev](https://ai.google.dev)

## 🔌 API Endpoints

### Authentication

```
POST   /api/auth/register      # User registration
POST   /api/auth/login         # User login
POST   /api/auth/refresh       # Refresh access token
POST   /api/auth/logout        # User logout
```

### Weather

```
GET    /api/weather/:location  # Get current weather data
```

### Pest Control

```
POST   /api/pest/identify      # Identify pest from image
POST   /api/pest/treatment     # Get treatment recommendations
```

### Market Prices

```
POST   /api/price/predict      # Predict crop prices
```

### Chat

```
POST   /api/chat/message       # Send message to AI assistant
```

### ML Predictions

```
POST   /predict/               # Predict optimal crop
                               # Body: {nitrogen, phosphorous, potassium, ph, state, district, month}
```

## 📜 Scripts

```bash
# Development
npm run dev              # Run all services concurrently
npm run dev:server       # Run Express server only
npm run dev:client       # Run React dev server only
npm run dev:api          # Run FastAPI server only

# Production
npm run build            # Build client for production
npm start                # Start production server

# Linting
cd client && npm run lint
```

## 🌐 Application Routes

### Public Routes

- `/` - Home page with feature overview
- `/login` - User authentication
- `/signup` - New user registration

### Protected Routes (Requires Authentication)

- `/features` - Feature overview
- `/crop-suggestion` - Seasonal crop recommendations
- `/crop-prediction` - AI-based crop prediction
- `/pest-diagnosis` - Pest & disease identification
- `/natural-pesticides` - Natural treatment guide
- `/market-price` - Market price predictions
- `/weather-prediction` - Weather forecasting

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👨‍💻 Author

**Rushil Reddy**

- GitHub: [@RushilReddy909](https://github.com/RushilReddy909)

## 🙏 Acknowledgments

- OpenWeather for weather data API
- Google Gemini for AI capabilities
- Kindwise for plant identification technology
- The open-source community for amazing tools and libraries

## 📧 Support

For issues and questions, please open an issue on the [GitHub repository](https://github.com/RushilReddy909/Smart-Agriculture/issues).

---

<div align="center">
Made with 💚 for farmers and sustainable agriculture
</div>
