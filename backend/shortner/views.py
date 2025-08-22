# Contains common view for global level
from django.http import HttpResponse
from django.shortcuts import render
from short.models import UrlMapping
from django.http import Http404, HttpResponseRedirect
from django.core.cache import cache


import logging

logger = logging.getLogger("django")


# Simple health check
def health_check(request):
    return HttpResponse("OK", status=200)


# Defined here as it acts as global single point handler,
# and does not lie under any specific application


def redirect_short_url(request, short_url=None):
    cache_key = f"r:{short_url}"

    long_url = cache.get(cache_key)

    if long_url is None:
        try:
            mapped_url = UrlMapping.objects.get(short_url=short_url)
            long_url = mapped_url.long_url

            # Cache only successful lookups, TTL = 2 hours
            cache.set(cache_key, long_url, 60 * 60 * 2)

        except UrlMapping.DoesNotExist:
            logger.error(f"Redirect failed: short_url={short_url} not found")
            raise Http404("Short URL not found")

    return HttpResponseRedirect(long_url)


def custom_404(request, exception=None):
    return render(request, "404.html", status=404)


def custom_500(request):
    return render(request, "500.html", status=500)
