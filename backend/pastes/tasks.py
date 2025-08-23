from celery import shared_task
from .models import Paste
from django.utils import timezone
from datetime import timedelta

import logging

django_logger=logging.getLogger('django')

@shared_task
def permanently_remove_soft_deleted_pastes():
    status=False
    try: 
        django_logger.info("========= Starting permanent removal of soft deleted URLS =============")
        
        Paste.objects.filter(is_active=False).delete()

        django_logger.info("========= COMPLETED permanent removal of soft deleted Paste =============")
        status=True

    except Exception as e:
        django_logger.error("===== Error while permanent deletion task ===============")
    
    return status


@shared_task
def soft_delete_old_pastes():
    status=False
    try: 
        django_logger.info("========= Starting soft deletion of Paste =============")
        
        cutoff_date = timezone.now() - timedelta(days=1)
        Paste.objects.filter(is_active=True, created_at__lt=cutoff_date).update(is_active=False)

        django_logger.info("========= COMPLETED soft deletion Paste =============")
        status=True

    except Exception as e:
        django_logger.error("===== Error while soft deletion task ===============")
    
    return status
