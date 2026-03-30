import requests
from utils.logger import setup_logger

logger = setup_logger("weather_service")

# Map WMO Weather interpretation codes (https://open-meteo.com/en/docs)
WEATHER_CODES = {
    0: "Clear sky",
    1: "Mainly clear",
    2: "Partly cloudy",
    3: "Overcast",
    45: "Fog",
    48: "Depositing rime fog",
    51: "Light drizzle",
    53: "Moderate drizzle",
    55: "Dense drizzle",
    61: "Slight rain",
    63: "Moderate rain",
    65: "Heavy rain",
    71: "Slight snow fall",
    73: "Moderate snow fall",
    75: "Heavy snow fall",
    77: "Snow grains",
    80: "Slight rain showers",
    81: "Moderate rain showers",
    82: "Violent rain showers",
    85: "Slight snow showers",
    86: "Heavy snow showers",
    95: "Thunderstorm",
    96: "Thunderstorm with slight hail",
    99: "Thunderstorm with heavy hail",
}

def get_weather_description(code):
    return WEATHER_CODES.get(code, "Unknown weather condition")

def get_coordinates(city_name):
    """
    Fetches latitude and longitude for a given city name using Open-Meteo geocoding API.
    """
    logger.info(f"Geocoding city: {city_name}")
    url = f"https://geocoding-api.open-meteo.com/v1/search?name={city_name}&count=1&language=en&format=json"
    
    try:
        response = requests.get(url, timeout=5)
        response.raise_for_status()
        data = response.json()
        
        if "results" not in data or len(data["results"]) == 0:
            logger.warning(f"City not found: {city_name}")
            return None, None, "City not found"
            
        location = data["results"][0]
        # Always return the matched name to be precise
        return location["latitude"], location["longitude"], location.get("name")
        
    except requests.exceptions.RequestException as e:
        logger.error(f"Error calling Geocoding API: {str(e)}")
        raise Exception("Failed to fetch location data from external API")

def get_current_weather(lat, lon, city_name):
    """
    Fetches current weather for coordinates.
    """
    logger.info(f"Fetching current weather for {city_name} ({lat}, {lon})")
    url = f"https://api.open-meteo.com/v1/forecast?latitude={lat}&longitude={lon}&current=temperature_2m,relative_humidity_2m,weather_code"
    
    try:
        response = requests.get(url, timeout=5)
        response.raise_for_status()
        data = response.json()
        
        current = data.get("current", {})
        
        return {
            "city": city_name,
            "temperature": current.get("temperature_2m"),
            "humidity": current.get("relative_humidity_2m"),
            "weather_description": get_weather_description(current.get("weather_code")),
        }
    except requests.exceptions.RequestException as e:
        logger.error(f"Error calling Weather API: {str(e)}")
        raise Exception("Failed to fetch weather data from external API")

def get_weather_forecast(lat, lon, city_name):
    """
    Fetches a 5-day weather forecast.
    """
    logger.info(f"Fetching 5-day forecast for {city_name} ({lat}, {lon})")
    url = f"https://api.open-meteo.com/v1/forecast?latitude={lat}&longitude={lon}&daily=weather_code,temperature_2m_max,temperature_2m_min&timezone=auto&forecast_days=5"
    
    try:
        response = requests.get(url, timeout=5)
        response.raise_for_status()
        data = response.json()
        
        daily = data.get("daily", {})
        forecast_list = []
        
        # Open-Meteo returns parallel arrays for daily data
        time_list = daily.get("time", [])
        temp_max_list = daily.get("temperature_2m_max", [])
        temp_min_list = daily.get("temperature_2m_min", [])
        code_list = daily.get("weather_code", [])
        
        for i in range(len(time_list)):
            avg_temp = (temp_max_list[i] + temp_min_list[i]) / 2.0
            forecast_list.append({
                "date": time_list[i],
                "temperature": round(avg_temp, 1),
                "weather_condition": get_weather_description(code_list[i])
            })
            
        return {
            "city": city_name,
            "forecast": forecast_list
        }
    except requests.exceptions.RequestException as e:
        logger.error(f"Error calling Forecast API: {str(e)}")
        raise Exception("Failed to fetch forecast data from external API")
