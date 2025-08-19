from django.urls import path, include
from .views import PasteViewSet
from rest_framework.routers import DefaultRouter

router = DefaultRouter()
router.register("", PasteViewSet)

urlpatterns = [
    path("", include(router.urls))
]
