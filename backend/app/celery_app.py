from celery import Celery
from app.config import Config

def make_celery(app_name=__name__):
    celery = Celery(
        app_name,
        backend=Config.CELERY_RESULT_BACKEND,
        broker=Config.CELERY_BROKER_URL
    )
    celery.conf.update(
        timezone='UTC',
        enable_utc=True
    )
    return celery

celery = make_celery()