import os
import pandas as pd

import dlt
from dlt.sources.helpers import requests
import logging


logger = logging.getLogger()


def fetch_and_load_data(endpoint, table_name):
    cwd = os.getcwd()
    file_path = os.path.join(cwd, 'dags', 'common', 'seeds', 'cities.csv')
    df = pd.read_csv(file_path)

    appid = os.getenv('WEATHER_API_KEY')

    base_url = f"https://pro.openweathermap.org/data/2.5/{endpoint}?appid={appid}"
    data = []

    for index, city in df.iterrows():
        lat = city['lat']
        lon = city['lng']
        url = f"{base_url}&lat={lat}&lon={lon}"

        logger.info("Fetching data from URL: %s", url)
        response = requests.get(url)
        response.raise_for_status()
        response_data = response.json()

        try:
            if response_data.get('coord', {}).get('lat') != lat or response_data.get('coord', {}).get('lon') != lon:
                response_data['coord'] = {'lat': lat, 'lon': lon}

            if response_data.get('city', {}).get('coord', {}).get('lat') != lat or response_data.get('city', {}).get('coord', {}).get('lon') != lon:
                if 'city' in response_data:
                    response_data['city']['coord'] = {'lat': lat, 'lon': lon}

        except Exception as e:
            logger.error("Error updating response data: %s", e)

        data.append(response_data)

    pipeline = dlt.pipeline(
        pipeline_name=f"{table_name}_pipeline",
        destination='postgres',
        dataset_name='weather_data',
    )

    load_info = pipeline.run(
        data,
        table_name=table_name,
        write_disposition='replace',
    )

    logger.info("Load info: %s", load_info)
