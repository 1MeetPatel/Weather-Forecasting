def analyze_temperature_trend(forecast_data):
    """
    Given a list of forecast data points, calculates a simple trend string.
    Expects forecast_data as a list of dictionaries with 'temperature' keys.
    """
    if not forecast_data or len(forecast_data) < 2:
        return "Not enough data for prediction."

    temps = [item['temperature'] for item in forecast_data if 'temperature' in item]
    
    if len(temps) < 2:
        return "Missing temperature data."
        
    avg_first_half = sum(temps[:len(temps)//2]) / (len(temps)//2)
    avg_second_half = sum(temps[len(temps)//2:]) / (len(temps) - len(temps)//2)

    diff = avg_second_half - avg_first_half
    
    if diff > 1.5:
        return f"Temperatures are trending warmer over the forecast period (avg increase of {diff:.1f}°C)."
    elif diff < -1.5:
        return f"Temperatures are trending cooler over the forecast period (avg decrease of {abs(diff):.1f}°C)."
    else:
        return "Temperatures are relatively stable over the forecast period."
