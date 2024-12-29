"""Utilities for DAGs generation."""

from cosmos import ProjectConfig, ProfileConfig, RenderConfig, LoadMode, DbtTaskGroup

from ingest.pull.weather.weather import fetch_and_load_data as weather_pull
from ingest.pull.horoscope.horoscope import fetch_and_load_data as horoscope_pull

from common.tasks import start_task, end_task
from common.constants import (DBT_PROJECT_PATH, DBT_PROFILES_PATH, ENV as AIRFLOW_ENV, DAGS_PATH,
                              PG_HOST, PG_USER, PG_PORT, PG_DATABASE, PG_PASSWORD)

from airflow.utils.task_group import TaskGroup
from airflow.operators.python import PythonOperator

from airflow.utils.dates import days_ago
from airflow.models import DAG, Variable


def generate_dbt_dag() -> DAG:
    dbt_project_config = ProjectConfig(
        dbt_project_path=DBT_PROJECT_PATH,
        env_vars={
            "PG_HOST": PG_HOST,
            "PG_USER": PG_USER,
            "PG_PORT": PG_PORT,
            "PG_DATABASE": PG_DATABASE,
            "PG_PASSWORD": PG_PASSWORD,
        }
    )

    dbt_profile_config = ProfileConfig(
        target_name=AIRFLOW_ENV,
        profile_name="weather_insights",
        profiles_yml_filepath=DBT_PROFILES_PATH,
    )

    dbt_render_config = RenderConfig(
        load_method=LoadMode.DBT_LS,
        dbt_deps=True,
        select=['tag:transform'],
    )

    cosmos_config = {
        'project_config': dbt_project_config,
        'profile_config': dbt_profile_config,
        'render_config': dbt_render_config,
        'operator_args': {
            "dbt_cmd_global_flags": ["--debug"],
            "vars": {"etl_ts": "{{ data_interval_end.strftime('%Y-%m-%d-%H:%M:%S') }}"},
            "install_deps": True
        }
    }

    with DAG(
        dag_id='transform',
        schedule_interval='10 * * * *',
        max_active_runs=1,
        catchup=False,
        start_date=days_ago(1),
    ) as dag:
        start = start_task()
        end = end_task()

        dbt_tg = DbtTaskGroup(**cosmos_config)

        start >> dbt_tg >> end

    return dag


def generate_dlt_dag_weather(ioconf) -> DAG:
    # Define the DAG
    with DAG(
            dag_id='ingest_weather',
            schedule_interval='0 * * * *',
            start_date=days_ago(1),
            catchup=False
    ) as dag:
        start = start_task()
        end = end_task()

        with TaskGroup(group_id='fetch_and_load_weather_data') as fetch_and_load_group:
            for entry in ioconf:
                endpoint, table_name = entry.split(':')

                task = PythonOperator(
                    task_id=f"fetch_and_load_{table_name}",
                    python_callable=weather_pull,
                    op_kwargs={
                        'endpoint': endpoint,
                        'table_name': table_name,
                    }
                )

                start >> task

        start >> fetch_and_load_group >> end

    return dag


def generate_dlt_dag_horoscope() -> DAG:
    # Define the DAG
    with DAG(
            dag_id='ingest_horoscope',
            schedule_interval='@daily',
            start_date=days_ago(1),
            catchup=False
    ) as dag:
        start = start_task()
        end = end_task()
        task = PythonOperator(
            task_id=f"fetch_and_load_horoscope",
            python_callable=horoscope_pull,
        )

        start >> task >> end

    return dag
