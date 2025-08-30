from celery import shared_task
from short.models import UrlMapping
from pastes.models import Paste
from uploads.models import UserFile
from django.utils import timezone
from datetime import timedelta

import logging

django_logger=logging.getLogger('django')

@shared_task
def soft_delete_instances():
	"""
	Soft deletes old instances 
	"""
	models=[UrlMapping,Paste,UserFile]
	cutoff_date = timezone.now() - timedelta(days=1)
	for curr_model in models:
		try:
			curr_model.objects.filter(is_active=True, created_at__lt=cutoff_date).update(is_active=False)
		except Exception as e:
			django_logger.error(f"Error while soft deleting {curr_model._meta.model_name}. Error:{e}")

@shared_task
def hard_delete_instances():
	"""
	Hard deletes old **inactive** instances 
	"""
	models=[UrlMapping,Paste,UserFile]
	cutoff_date = timezone.now() - timedelta(days=1)
	for curr_model in models:
		try:
			curr_model.objects.filter(is_active=True, created_at__lt=cutoff_date).delete()
		except Exception as e:
			django_logger.error(f"Error while hard deleting {curr_model._meta.model_name}. Error:{e}")


