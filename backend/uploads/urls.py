from django.urls import path, include
from .views import UserFileViewSet
from rest_framework.routers import DefaultRouter

router = DefaultRouter()
router.register("", UserFileViewSet)

urlpatterns = [
    path("", include(router.urls))
]
