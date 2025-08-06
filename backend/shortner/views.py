# Contains common view for production

from django.http import HttpResponse

# Simple health check
def health_check(request):
    return HttpResponse("OK", status=200)
