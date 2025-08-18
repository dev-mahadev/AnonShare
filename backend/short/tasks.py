from celery import shared_task
from .models import UrlMapping
from django.utils import timezone
from datetime import timedelta

import logging

django_logger=logging.getLogger('django')

@shared_task
def permanently_remove_soft_deleted_urls():
    status=False
    try: 
        django_logger.info("========= Starting permanent removal of soft deleted URLS =============")
        
        UrlMapping.objects.filter(is_active=False).delete()

        django_logger.info("========= COMPLETED permanent removal of soft deleted URLS =============")
        status=True

    except Exception as e:
        django_logger.error("===== Error while permanent deletion task ===============")
    
    return status


@shared_task
def soft_delete_old_urls():
    status=False
    try: 
        django_logger.info("========= Starting soft deletion of URLS =============")
        
        cutoff_date = timezone.now() - timedelta(days=1)
        UrlMapping.objects.filter(is_active=True, created_at__lt=cutoff_date).update(is_active=False)

        django_logger.info("========= COMPLETED soft deletion URLS =============")
        status=True

    except Exception as e:
        django_logger.error("===== Error while soft deletion task ===============")
    
    return status
