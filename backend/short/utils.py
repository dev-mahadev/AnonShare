import logging


logger = logging.getLogger("django")


# Utils
def get_user_from_request(request):
    """
    Core method to obtain user from request
    """
    from django.contrib.auth.models import User
    user = None
    try:
        # TODO-3 : ref dev_files
        user_id = request.data.get('user_id')
        user = User.objects.get(id=user_id)

    except Exception as e : 
        logger.error(f"Error while obtainin the user from request", e)
    
    return user

