from rest_framework import viewsets, status
from .models import UserFile
from rest_framework.response import Response
from rest_framework.pagination import PageNumberPagination
from .serializers import BaseUserFileSerializer, UserFileDetailSerializer
from rest_framework.decorators import action
from shortner.s3_client import S3Client
import logging

logger = logging.getLogger("django")

class UserFileViewSet(viewsets.ModelViewSet):
    queryset = UserFile.objects.all()
    pagination_class = PageNumberPagination

    def get_queryset(self):
        return super().get_queryset().filter(is_active=True)
    
    def get_serializer(self, *args, **kwargs):
        match self.request.method:
            case "GET":
                return BaseUserFileSerializer
            case "POST":
                return UserFileDetailSerializer
            case _: 
                raise Exception("Invalid request method passed!")

    def create(self, request, *args, **kwargs):
        """
        Checks for key's existence
        """
        data = request.data 
        if not data.get('file_s3_key', None):
            return Response({"error":"File's s3 key not passed!"}, status=status.HTTP_400_BAD_REQUEST)

        # Serilizer validation, creation and response
        serializer_data = self.get_serializer()(data=data)
        if serializer_data.is_valid():
            serializer_data.save()
        else:
            logger.info("Invalid data was passed for creating UserFile")
            return Response({"errors":"Invalid data passed"}, status=status.HTTP_400_BAD_REQUEST)

        return Response(serializer_data.data, status=status.HTTP_201_CREATED)

    

    @action(detail=False, methods=['get'], url_path='get_presigned_post_url')
    def get_presigned_post_url(self, request):
        """
        Generate a presigned POST URL using the custom implementation.
        
        Query parameters:
        - filename: Name of the file (required)
        - content_type: MIME type of the file (optional, will be guessed if not provided)
        - file_size: Size of the file in bytes (required for validation)
        """
        
        # Extract parameters from query string
        filename = request.query_params.get('filename')
        
        try:
            # Call your custom implementation to generate presigned URL
            # Replace 'generate_presigned_post_url' with your actual function name
            s3_client=S3Client()
            post_data = s3_client.create_presigned_post_url(filename)

            return Response({
                'url': post_data['url'],
                'fields': post_data['fields']
            })
            
        except Exception as e:
            logger.exception("Error in custom presigned URL implementation")
            return Response(
                {'error': 'Failed to generate presigned URL'},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )
    
    

