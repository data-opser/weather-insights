"""Default tasks"""
from airflow.operators.dummy import DummyOperator
from airflow.models import BaseOperator


def start_task() -> BaseOperator:
    return DummyOperator(
        task_id='start'
    )


def end_task() -> BaseOperator:
    return DummyOperator(
        task_id='end'
    )