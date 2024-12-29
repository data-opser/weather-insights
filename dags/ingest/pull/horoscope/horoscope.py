import os
import time

from datetime import datetime, timezone

import dlt
from dlt.sources.helpers import requests


def fetch_and_load_data():
    client_id = os.getenv('HOROSCOPE_CLIENT_ID')
    client_secret = os.getenv('HOROSCOPE_CLIENT_SECRET')

    token_url = "https://api.prokerala.com/token"

    # Headers
    headers = {
        "Content-Type": "application/x-www-form-urlencoded"
    }

    # Data payload
    data = {
        "grant_type": "client_credentials",
        "client_id": f"{client_id}",
        "client_secret": f"{client_secret}",
    }

    # Sending the POST request
    response = requests.post(token_url, headers=headers, data=data)

    # Extract and print the access token
    if response.status_code == 200:
        access_token = response.json().get('access_token')
        print("Successfully authenticated", access_token)
    else:
        raise Exception("Error:", response.status_code, response.json())

    # API endpoint
    url = "https://api.prokerala.com/v2/horoscope/daily"

    # Headers
    headers = {
        "Authorization": f"Bearer {access_token}"
    }

    # List of zodiac signs
    zodiac_signs = [
        "aries", "taurus", "gemini", "cancer", "leo",
        "virgo", "libra", "scorpio", "sagittarius",
        "capricorn", "aquarius", "pisces"
    ]

    # Current date in ISO 8601 format
    current_date = datetime.now(timezone.utc).strftime("%Y-%m-%dT%H:%M:%S")
    datetime_param = f"{current_date}+00:00"  # Adjust timezone if needed

    print('Datetime param: ', datetime_param)

    i = 0
    data = []
    for sign in zodiac_signs:
        params = {
            "datetime": datetime_param,
            "sign": sign
        }

        if (i == 5):
            time.sleep(60)
            i = 0

        print('Requesting data for params:', params, 'i =', i)
        response = requests.get(url, headers=headers, params=params)
        response.raise_for_status()

        response_data = response.json()

        data.append(response_data)

        i += 1

    pipeline = dlt.pipeline(
        pipeline_name='horoscope',
        destination='postgres',
        dataset_name='horoscope_data',
    )

    load_info = pipeline.run(
        data,
        table_name='horoscope',
        write_disposition='replace',
    )

    print(load_info)
