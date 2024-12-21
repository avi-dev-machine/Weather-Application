from flask import Flask, render_template, request
import requests

app = Flask(__name__)

def get_weather(lat, lon, api_key):
    """
    Fetch weather data for given latitude and longitude.
    :param lat: Latitude
    :param lon: Longitude
    :param api_key: API key for OpenWeatherMap
    :return: Weather data as a dictionary
    """
    base_url = "https://api.openweathermap.org/data/2.5/weather"
    params = {
        'lat': lat,
        'lon': lon,
        'appid': api_key,
        'units': 'metric'
    }

    response = requests.get(base_url, params=params)
    if response.status_code == 200:
        return response.json()
    else:
        return None

@app.route('/', methods=['GET', 'POST'])
def index():
    weather_data = None
    if request.method == 'POST':
        lat = request.form.get('latitude')
        lon = request.form.get('longitude')
        API_KEY = '84e97f3c9f56ca2db90d3ca06814b3dd'
        weather_data = get_weather(lat, lon, API_KEY)
    return render_template('index.html', weather=weather_data)

if __name__ == '__main__':
    app.run(debug=True)
