from rest_framework import viewsets, status
from .models import Paste
from rest_framework.response import Response
from rest_framework.pagination import PageNumberPagination
from rest_framework.exceptions import NotFound
from .serializers import BasePasteSerializer, DetailPasteSerializer
from django.http import Http404
from django.core.cache import cache
import logging

logger = logging.getLogger("django")


class PasteViewSet(viewsets.ModelViewSet):
    queryset = Paste.objects.all()
    pagination_class = PageNumberPagination

    def get_queryset(self):
        return super().get_queryset().filter(is_active=True)

    def get_serializer(self, *args, **kwargs):
        match self.request.method:
            case "GET":
                return DetailPasteSerializer
            case "POST" | "PUT" | "PATCH" | "DELETE":
                return BasePasteSerializer
            case _:
                raise Exception("Invalid request method passed!")

    def create(self, request, *args, **kwargs):
        data = request.data
        if not (data.get("content", None) and data.get("heading", None)):
            return Response(
                {"error": "Invalid data passed!"}, status=status.HTTP_400_BAD_REQUEST
            )

        try:
            new_paste = Paste.objects.create(**data)
            serializer_data = self.get_serializer()(new_paste)
        except Exception as e:
            logger.error(
                f"Error while creating a paste, the passed data:{str(data)}. The error:{str(e)}"
            )
            return Response(
                {"errors": "Invalid data passed"}, status=status.HTTP_400_BAD_REQUEST
            )

        return Response(serializer_data.data, status=status.HTTP_201_CREATED)

    def retrieve(self, request, pk=None):
        cache_key = f"p:{pk}"

        # First check in cache
        cached_data = cache.get(cache_key)
        if cached_data is not None:
            return Response(cached_data, status=status.HTTP_200_OK)

        try:
            instance = self.get_queryset().get(short_url=pk)
        except self.get_queryset().model.DoesNotExist:
            logger.info(f"Object not found: short_url={pk}")
            raise Http404("Paste not found")

        try:
            serializer = self.get_serializer()(instance)
            serialized_data = serializer.data
        except Exception as e:
            logger.error(f"Serialization failed for short_url={pk}: {e}", exc_info=True)
            return Response(
                {"error": "An internal error occurred. Please try again later."},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )

        try:
            cache.set(cache_key, serialized_data, timeout=60 * 60 * 2)

        except Exception as e:
            logger.warning(f"Cache set failed for {cache_key}: {e}")

        return Response(serialized_data, status=status.HTTP_200_OK)
