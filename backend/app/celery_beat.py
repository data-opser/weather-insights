from celery import Celery
from celery.schedules import crontab

celery = Celery(
    'tasks',
    broker='redis://localhost:6379/0',
    backend='redis://localhost:6379/0'
)

# Добавляем периодическую задачу в расписание
celery.conf.beat_schedule = {
    'send-notifications-every-minute': {
        'task': 'tasks.send_scheduled_notifications',
        'schedule': crontab(minute='*')  # Каждую минуту
    }
}

celery.conf.timezone = 'UTC'

if __name__ == "__main__":
    # Запуск Celery Beat
    celery.worker_main(['beat', '--loglevel=info'])
