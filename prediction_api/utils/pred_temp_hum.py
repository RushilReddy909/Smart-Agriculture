import os
import requests
from dotenv import load_dotenv

# Load the .env file from the parent directory
load_dotenv(dotenv_path='../.env')

def get_weather_data(state, district):
    """
    Fetches temperature, humidity, and rainfall for a given state and district
    in a single API call to OpenWeatherMap.
    """
    API_KEY = os.getenv("OPENWEATHER_API_KEY")
    if not API_KEY:
        raise Exception("OpenWeatherMap API key not found in the root .env file.")

    # Step 1: Get latitude and longitude for the location
    geocode_url = f"http://api.openweathermap.org/geo/1.0/direct?q={district},{state},IN&limit=1&appid={API_KEY}"
    
    try:
        geo_response = requests.get(geocode_url)
        geo_response.raise_for_status()
        location_data = geo_response.json()

        if not location_data:
            raise Exception(f"Could not find location for District: {district}, State: {state}")

        lat = location_data[0]['lat']
        lon = location_data[0]['lon']

    except requests.exceptions.RequestException as e:
        raise Exception(f"API request failed during geocoding: {e}")

    # Step 2: Get all weather data in a single call using the coordinates
    weather_url = f"https://api.openweathermap.org/data/2.5/weather?lat={lat}&lon={lon}&appid={API_KEY}&units=metric"
    
    try:
        weather_response = requests.get(weather_url)
        weather_response.raise_for_status()
        weather_data = weather_response.json()

        # Extract Temperature (average of min/max for consistency)
        temp = weather_data['main']['temp']
        
        # Extract Humidity
        humidity = weather_data['main']['humidity']

        # Extract Rainfall (defaulting to 0 if no rain)
        rainfall = weather_data.get('rain', {}).get('1h', 0.0)
        
        return (temp, humidity, rainfall)

    except requests.exceptions.RequestException as e:
        raise Exception(f"API request for weather data failed: {e}")