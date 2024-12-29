"""Utilities for DAGs generation."""

from cosmos import ProjectConfig, ProfileConfig, RenderConfig, LoadMode, DbtTaskGroup

import dlt
from dlt.helpers.airflow_helper import PipelineTasksGroup

from common.tasks import start_task, end_task
# from common.utils import name, get_var
# from common.config.config_tools import render_sql_template
from common.constants import (DBT_PROJECT_PATH, DBT_PROFILES_PATH, ENV as AIRFLOW_ENV, DAGS_PATH,
                              PG_HOST, PG_USER, PG_PORT, PG_DATABASE, PG_PASSWORD)
# from dag_factory import DLT_TASKS
# from dag_factory.models import Dag

# from airflow.utils.task_group import TaskGroup
from airflow.utils.dates import days_ago
from airflow.models import DAG, Variable

# from ingest.common.utils import inject_creds


def generate_dbt_dag() -> DAG:
    dbt_project_config = ProjectConfig(
        dbt_project_path=DBT_PROJECT_PATH,
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
            "env": {
                "ENV": AIRFLOW_ENV,
                "PG_HOST": PG_HOST,
                "PG_USER": PG_USER,
                "PG_PORT": PG_PORT,
                "PG_DATABASE": PG_DATABASE,
                "PG_PASSWORD": PG_PASSWORD,
            },
            "install_deps": True
        }
    }

    with DAG(
        dag_id='transform',
        schedule_interval='50 * * * *',
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
    with DAG(
        dag_id='ingest_weather',
        schedule_interval='35 * * * *',
        max_active_runs=1,
        catchup=False,
        start_date=days_ago(1),
    ) as dag:
        start = start_task()
        end = end_task()
        for resource in pipeline_config.transformers or [None]:
            with PipelineTasksGroup(
                    resource or pipeline_config.pipeline.pipeline_name,
                    **pipeline_config.pipeline.group_config.dict()
            ) as pipeline_group:

                pipeline = dlt.pipeline(
                    pipeline_name=name(pipeline_config.pipeline.pipeline_name + (resource or "")),
                    dataset_name=name(pipeline_config.pipeline.destination_name + (resource or "")),
                    **pipeline_config.pipeline.common_config.dict()
                )

                prev_task = start
                for task in pipeline_config.pipeline.tasks:
                    inject_creds(dag_type=dag_type, source=task.source, account_id=pipeline_config.account_id)
                    stream_name = {
                        "stream_name": pipeline_config.transformers[resource]} if resource is not None else {}
                    if task.source in DLT_TASKS[dag_type]:
                        f = DLT_TASKS[dag_type][task.source](**stream_name, **task.source_parameters or {})
                    else:
                        raise ValueError(f"Unknown task source: {task.source}")

                    tasks = pipeline_group.add_run(
                        pipeline,
                        f,
                        **task.run_parameters.dict()
                    )
                    for t in tasks:
                        prev_task >> t
                        prev_task = t
            if pipeline_config.depends_on:
                with TaskGroup('waiters', tooltip="Sensor tasks") as sensor_group:
                    for depends_on_dag_id, depends_on_params in pipeline_config.depends_on.items():
                        if AIRFLOW_ENV not in depends_on_params.allowed_envs:
                            continue

                        sensor = DataopsCoreExternalTaskSensor(
                            task_id=depends_on_dag_id,
                            external_dag_id=depends_on_dag_id,
                            mode=depends_on_params.mode,
                            poke_interval=depends_on_params.poke_interval,
                            allowed_states=depends_on_params.allowed_states,
                            external_task_id=depends_on_params.task_id,
                            timeout=depends_on_params.timeout,
                            execution_timeout=depends_on_params.execution_timeout,
                            retries=0,
                        )

                        start >> sensor

                start >> sensor_group >> pipeline_group
            else:
                start >> pipeline_group
            pipeline_group >> end

    return dag
