"""Common constants with creds and global config params"""
import os
from pathlib import Path
from airflow.models import Variable

ENV = Variable.get("ENV",  "dev")
AIRFLOW_HOME = Path(os.getcwd())

DAGS_PATH = f'{AIRFLOW_HOME}/dags'

TRANSFORM_PATH = f'{DAGS_PATH}/transform'

DBT_PROJECT_PATH = f"{TRANSFORM_PATH}/dbt/weather_insights"
DBT_PROFILES_PATH = f"{DBT_PROJECT_PATH}/profiles.yml"

HOROSCOPE_CLIENT_ID = os.environ['HOROSCOPE_CLIENT_ID'] = Variable.get("HOROSCOPE_CLIENT_ID")
HOROSCOPE_CLIENT_SECRET = os.environ['HOROSCOPE_CLIENT_SECRET'] = Variable.get("HOROSCOPE_CLIENT_SECRET")

PG_DATABASE = os.environ['PG_DATABASE'] = Variable.get("PG_DATABASE")
PG_HOST = os.environ['PG_HOST'] = Variable.get("PG_HOST")
PG_PASSWORD = os.environ['PG_PASSWORD'] = Variable.get("PG_PASSWORD")
PG_USER = os.environ['PG_USER']= Variable.get("PG_USER")
PG_PORT = os.environ['PG_PORT'] = Variable.get("PG_PORT")

os.environ['WEATHER_API_KEY']= Variable.get("WEATHER_API_KEY")