import os

import pandas as pd

from dotenv import load_dotenv

import dlt
from dlt.sources.helpers import requests


load_dotenv()

os.environ['CREDENTIALS__DATABASE'] = os.getenv('PG_DATABASE')
os.environ['CREDENTIALS__PASSWORD'] = os.getenv('PG_PASSWORD')
os.environ['CREDENTIALS__USERNAME'] = os.getenv('PG_USER')
os.environ['CREDENTIALS__HOST'] = os.getenv('PG_HOST')

appid = os.getenv('APP_ID')

cwd = os.getcwd()
file_path = os.path.join(cwd, 'dags', 'common', 'seeds', 'cities.csv')

df = pd.read_csv(file_path)

ioconf = [
    'weather:current_weather',
    'forecast/hourly:weather_forecast_hourly',
    'forecast/daily:weather_forecast_daily',
    'air_pollution:air_pollution',
    'air_pollution/forecast:air_pollution_forecast'
    ]

for entry in ioconf:
    endpoint, table_name = entry.split(':')
    pipeline_name = table_name + '_pipeline'
    base_url = f"https://pro.openweathermap.org/data/2.5/{endpoint}?appid={appid}"

    data = []
    for index, city in df.iterrows():
        coord_diff = False

        lat = city['lat']
        lon = city['lng']
        url = f"{base_url}&lat={lat}&lon={lon}"

        print(url)

        response = requests.get(url)
        response.raise_for_status()

        response_data = response.json()

        data.append(response_data)

    pipeline = dlt.pipeline(
        pipeline_name=pipeline_name,
        destination='postgres',
        dataset_name='weather_data',
    )

    load_info = pipeline.run(
        data,
        table_name=table_name,
        write_disposition='replace',
    )

    print(load_info)
