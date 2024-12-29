from dag_factory.dag_builder import generate_dlt_dag_weather
from airflow import DAG

ioconf = [
    'weather:current_weather',
    'forecast/hourly:weather_forecast_hourly',
    'forecast/daily:weather_forecast_daily',
    'air_pollution:air_pollution',
    'air_pollution/forecast:air_pollution_forecast'
]

generate_dlt_dag_weather(ioconf)
