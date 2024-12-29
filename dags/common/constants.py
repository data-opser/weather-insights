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

PG_DATABASE = os.environ['CREDENTIALS__DATABASE'] = Variable.get("CREDENTIALS__DATABASE")
PG_HOST = os.environ['CREDENTIALS__HOST'] = Variable.get("CREDENTIALS__HOST")
PG_PASSWORD = os.environ['CREDENTIALS__PASSWORD'] = Variable.get("CREDENTIALS__PASSWORD")
PG_USER = os.environ['CREDENTIALS__USERNAME'] = Variable.get("CREDENTIALS__USERNAME")
PG_PORT = os.environ['CREDENTIALS__PORT'] = Variable.get("CREDENTIALS__PORT")

os.environ['WEATHER_API_KEY'] = Variable.get("WEATHER_API_KEY")
