# myproject/celery.py
import os
from celery import Celery
from django.conf import settings
from celery.schedules import crontab

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'shortner.settings')

app = Celery('shortner')
app.config_from_object('django.conf:settings', namespace='CELERY')

# Load tasks from all registered Django app configs.
app.autodiscover_tasks()

# NOTe: add the periodic tasks in through the admin panel
