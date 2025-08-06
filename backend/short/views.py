from django.shortcuts import render
from django.core.exceptions import ObjectDoesNotExist

# Create your views here.
from rest_framework import viewsets, status
from .models import UrlMapping
from rest_framework.response import Response
from rest_framework.decorators import action
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


    @action(detail=False, methods=['get'], url_path='(?P<short_url>[^/.]+)')
    def redirect_short_url(self, request, short_url=None):
        """
        Core method for redirecting the short url.
        """
        mapped_url = None 
        try: 
            mapped_url = UrlMapping.objects.get(short_url=short_url)

            return Response(
                headers={"Location": mapped_url.long_url},
                status=status.HTTP_302_FOUND
            )

        except ObjectDoesNotExist:
            # TODO-2: ref dev_files
            return Response(
                {"error": "Short URL not found"},
                status=status.HTTP_404_NOT_FOUND
            )
        
        except Exception as e:
            print(f"Redirect failed: {str(e)}", exc_info=True)
            return Response(
                {"error": "Internal server error"},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )


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
