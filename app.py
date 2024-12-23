from flask import Flask, render_template, request, flash
import requests
from datetime import datetime

app = Flask(__name__)
app.secret_key = 'weather_app_secret_key'

def get_weather(city, api_key):
    """
    Fetch weather data for given city using Tomorrow.io API
    """
    base_url = "https://api.tomorrow.io/v4/weather/forecast"
    params = {
        'location': city,
        'apikey': api_key,
        'units': 'metric'
    }
    try:
        response = requests.get(base_url, params=params)
        response.raise_for_status()
        return response.json()
    except requests.RequestException:
        return None

def get_weather_by_coords(lat, lon, api_key):
    """
    Fetch weather data for given coordinates using Tomorrow.io API
    """
    base_url = "https://api.tomorrow.io/v4/weather/forecast"
    params = {
        'location': f"{lat},{lon}",
        'apikey': api_key,
        'units': 'metric'
    }
    try:
        response = requests.get(base_url, params=params)
        response.raise_for_status()
        return response.json()
    except requests.RequestException:
        return None

def get_weather_icon(temp, precip):
    if precip > 70:
        return "fas fa-cloud-showers-heavy", "rainy"
    elif precip > 30:
        return "fas fa-cloud-rain", "cloudy"
    elif temp > 30:
        return "fas fa-sun", "sunny"
    elif temp < 10:
        return "fas fa-snowflake", "cold"
    return "fas fa-cloud-sun", "clear"

def process_weather_data(data, location_name):
    """
    Process and extract relevant weather information with forecast
    """
    if not data or 'timelines' not in data:
        return None
    
    formatted_location = ' '.join(word.capitalize() for word in location_name.split())
    current_weather = data['timelines']['daily'][0]
    forecast = data['timelines']['daily'][:5]
    
    temp = current_weather['values']['temperatureAvg']
    precip = current_weather['values']['precipitationProbabilityAvg']
    icon, condition = get_weather_icon(temp, precip)
    
    forecast_data = []
    for day in forecast:
        temp = day['values']['temperatureAvg']
        precip = day['values']['precipitationProbabilityAvg']
        day_icon, day_condition = get_weather_icon(temp, precip)
        forecast_data.append({
            'date': datetime.fromisoformat(day['time']).strftime('%A'),
            'temperature': round(temp, 1),
            'precipitation': round(precip),
            'icon': day_icon,
            'condition': day_condition
        })
    
    return {
        'city': formatted_location,
        'temperature': round(temp, 1),
        'humidity': round(current_weather['values']['humidityAvg']),
        'wind_speed': round(current_weather['values']['windSpeedAvg'], 1),
        'precipitation': round(precip),
        'date': datetime.fromisoformat(current_weather['time']).strftime('%B %d, %Y'),
        'icon': icon,
        'condition': condition,
        'forecast': forecast_data
    }

@app.route('/', methods=['GET', 'POST'])
def index():
    weather_data = None
    if request.method == 'POST':
        API_KEY = 'potbDqdfctHifxoxZtsCYwYOQnc3gBVi'
        
        if 'use_location' in request.form:
            lat = request.form.get('latitude')
            lon = request.form.get('longitude')
            raw_weather_data = get_weather_by_coords(lat, lon, API_KEY)
            weather_data = process_weather_data(raw_weather_data, "Your Location")
        else:
            city = request.form.get('city')
            if city:
                raw_weather_data = get_weather(city, API_KEY)
                weather_data = process_weather_data(raw_weather_data, city)
        
        if not weather_data:
            flash('Unable to fetch weather data. Please try again.')
            
    return render_template('index.html', weather=weather_data)

if __name__ == '__main__':
    app.run(debug=True)