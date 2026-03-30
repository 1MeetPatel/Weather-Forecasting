from flask import Flask, jsonify
from flask_cors import CORS
from services.weather_service import get_coordinates, get_current_weather, get_weather_forecast
from utils.cache import weather_cache
from utils.prediction import analyze_temperature_trend
from utils.logger import setup_logger

app = Flask(__name__)
# Enable CORS for the frontend origin
CORS(app, resources={r"/*": {"origins": "http://localhost:3000"}})

logger = setup_logger("weather_api")

@app.route("/weather/<city>", methods=["GET"])
def get_weather(city):
    logger.info(f"Received weather request for city: {city}")
    
    cache_key = f"weather_{city.lower()}"
    cached_data = weather_cache.get(cache_key)
    
    if cached_data:
        logger.info(f"Returning cached weather data for {city}")
        return jsonify(cached_data)

    try:
        lat, lon, matched_name = get_coordinates(city)
        if lat is None:
            return jsonify({"error": "City not found"}), 404
            
        weather_data = get_current_weather(lat, lon, matched_name)
        
        # Cache for 10 minutes
        weather_cache.set(cache_key, weather_data)
        
        return jsonify(weather_data)
        
    except Exception as e:
        logger.error(f"Error processing weather request: {str(e)}")
        return jsonify({"error": str(e)}), 500


@app.route("/forecast/<city>", methods=["GET"])
def get_forecast(city):
    logger.info(f"Received forecast request for city: {city}")
    
    cache_key = f"forecast_{city.lower()}"
    cached_data = weather_cache.get(cache_key)
    
    if cached_data:
        logger.info(f"Returning cached forecast data for {city}")
        return jsonify(cached_data)

    try:
        lat, lon, matched_name = get_coordinates(city)
        if lat is None:
            return jsonify({"error": "City not found"}), 404
            
        forecast_data = get_weather_forecast(lat, lon, matched_name)
        
        # Bonus: Add weather prediction logic
        prediction_message = analyze_temperature_trend(forecast_data["forecast"])
        forecast_data["prediction"] = prediction_message
        
        # Cache for 10 minutes
        weather_cache.set(cache_key, forecast_data)
        
        return jsonify(forecast_data)
        
    except Exception as e:
        logger.error(f"Error processing forecast request: {str(e)}")
        return jsonify({"error": str(e)}), 500

# Error handlers
@app.errorhandler(404)
def not_found(e):
    return jsonify({"error": "Endpoint not found"}), 404

if __name__ == "__main__":
    logger.info("Starting Weather Application Backend on port 5000")
    app.run(debug=True, port=5000)
