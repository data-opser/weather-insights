import os

import pandas as pd

import dlt
from dlt.sources.helpers import requests

os.environ['CREDENTIALS__DATABASE'] = ''
os.environ['CREDENTIALS__PASSWORD'] = ''
os.environ['CREDENTIALS__USERNAME'] = ''
os.environ['CREDENTIALS__HOST'] = 'weather.postgres.database.azure.com'

df = pd.read_csv('~/weather-insights/dags/ingest/common/seeds/cities.csv')

# Specify the URL of the API endpoint
base_url = "https://pro.openweathermap.org/data/2.5/weather?appid="
# url = "https://pro.openweathermap.org/data/2.5/forecast/hourly?appid=&lat=51.5085&lon=-0.1257"

data = []

# Iterate over each row in the DataFrame
for index, city in df.iterrows():
    # Construct the URL with latitude and longitude from the DataFrame
    lat = city['lat']
    lon = city['lng']
    url = f"{base_url}&lat={lat}&lon={lon}"

    # Print the constructed URL for each city
    print(url)

    response = requests.get(url)
    response.raise_for_status()

    data.append(response.json())

pipeline = dlt.pipeline(
    pipeline_name='weather_data',
    destination='postgres',
    dataset_name='weather_data',
)

load_info = pipeline.run(
    data,
    table_name="current_weather",
)

print(load_info)

