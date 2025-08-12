# utils/exception_handler.py
from rest_framework.views import exception_handler
from django.shortcuts import render
from django.http import HttpResponseNotFound, HttpResponseServerError
import logging

logger = logging.getLogger('django')

def html_exception_handler(exc, context):
    # Call DRF's default handler first (to get status code)
    response = exception_handler(exc, context)

    request = context['request']

    # Log the error for internal debugging
    if response is not None:
        logger.error(f"Error in {context['view']}: {exc}")
    else:
        logger.critical(f"Uncaught error in {request.path}: {exc}", exc_info=True)

    # Always return HTML
    if response is not None:
        # 404, 400, etc.
        return HttpResponseNotFound(render(request, '404.html'))
    else:
        # 500 Internal Server Error
        return HttpResponseServerError(render(request, '500.html'))