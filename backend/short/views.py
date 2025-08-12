from django.shortcuts import render

# Create your views here.
from rest_framework import viewsets, status
from .models import UrlMapping
from rest_framework.response import Response
from rest_framework.pagination import PageNumberPagination
from .serializers import BaseUrlSerializer, UrlDetailSerializer
import logging

# Other imports
from .utils import get_user_from_request


# Initialization
logger = logging.getLogger("django")

class UrlViewSet(viewsets.ModelViewSet):
    queryset = UrlMapping.objects.all()
    pagination_class = PageNumberPagination  # Default: ?page=2
    
    def get_serializer(self, *args, **kwargs):
        match self.request.method:
            case "GET":
                return BaseUrlSerializer
            case "POST" | "PUT" | "PATCH" | "DELETE":
                return UrlDetailSerializer
            case _: 
                raise Exception("Invalid request method passed!")

    def create(self, request, *args, **kwargs):
        data = request.data 
        if not data.get('long_url', None):
            return Response({"error":"Long url not passed!"}, status=status.HTTP_400_BAD_REQUEST)
        
        # TODO-3
        # linked_user = get_user_from_request(request)
        # data['user'] = linked_user
        data = {
            **data,
            "is_active": "True",
            "user": 1
        }

        # Serilizer validation, creation and response
        serializer_data = self.get_serializer()(data=data)
        if serializer_data.is_valid():
            serializer_data.save()
        else:
            logger.info("Invalid data was passed for creating short url")
            return Response({"errors":"Invalid data passed"}, status=status.HTTP_400_BAD_REQUEST)



        return Response(serializer_data.data, status=status.HTTP_201_CREATED)
    
    def update(self, request, *args, **kwargs):
        return super().update(request, *args, **kwargs)
    
    def partial_update(self, request, *args, **kwargs):
        return super().partial_update(request, *args, **kwargs)
    
    def destroy(self, request, *args, **kwargs):
        return super().destroy(request, *args, **kwargs)
