import os
import time

from dotenv import load_dotenv

from datetime import datetime, timezone

import dlt
from dlt.sources.helpers import requests

import logging

logger = logging.getLogger()


load_dotenv()

os.environ['CREDENTIALS__DATABASE'] = os.getenv('PG_DATABASE')
os.environ['CREDENTIALS__PASSWORD'] = os.getenv('PG_PASSWORD')
os.environ['CREDENTIALS__USERNAME'] = os.getenv('PG_USER')
os.environ['CREDENTIALS__HOST'] = os.getenv('PG_HOST')

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

# access_token = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJhdWQiOiJmZjY2ZDFmNC0wMjdhLTQ2N2EtYjQxMi0yYzRiMzNmZTY5YzIiLCJqdGkiOiJmMjE3MzEwNDhhZWI2MzhlOGEzNmViMGUwNDcwM2ZmNDQ1Zjg4MTFmZWZlZTk5MjJlZGVmMGI3MmYwMDhiYzk2NTJkYTQ4NmJmYWUyMjg4NSIsImlhdCI6MTczNTQ3ODk3NS4yOTE2MDcsIm5iZiI6MTczNTQ3ODk3NS4yOTE2MDksImV4cCI6MTczNTQ4MjU3NS4yOTE1MSwic3ViIjoiNzIzYjRjODMtMzNkYi00YTEzLThiZWUtY2EyOTA3ZTY5NjljIiwic2NvcGVzIjpbXSwiY3JlZGl0c19yZW1haW5pbmciOjAsInJhdGVfbGltaXRzIjpbeyJyYXRlIjo1LCJpbnRlcnZhbCI6NjB9XX0.F9jI0ZwK3RsmLd6OimED2FIOtQROGlegqS7b_dRmZQUuGhROPI93XBuJb_KiPebg_Wjbqno3XmnCtRoYOzNqE0OWnJfDQigRNkJxsC2_f2SlJMRaaDzs6x8HXlN1KIOWmBRarjtmP2oshjQHi3xRszoLhnrhn2Yl_mMg-5MWKqJnMvQm1xmyZIs_1LGNYRbj9lVacQyaROIJr_UxDBrbRR-fNWLpi4QwwiFNyAgSbh70hszcGXvyRZamtAFmTko-m_hHI64oUFSY5mhUPainanBPHEBvEEbpjsok1TZZWYLKkpm0faIOx-g4t5lKVqB9Keml8qFagLQ9B2OSc_vuAQ'

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
