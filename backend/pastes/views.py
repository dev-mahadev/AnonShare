from rest_framework import viewsets, status
from .models import Paste
from rest_framework.response import Response
from rest_framework.pagination import PageNumberPagination
from .serializers import BasePasteSerializer
import logging

logger = logging.getLogger("django")

class PasteViewSet(viewsets.ModelViewSet):
	queryset = Paste.objects.all()
	pagination_class = PageNumberPagination  # Default: ?page=2

	def get_serializer(self, *args, **kwargs):
		return BasePasteSerializer

	def create(self, request, *args, **kwargs):
		data = request.data
		if not (data.get('content', None) and data.get('heading', None)):
			return Response({"error":"Invalid data passed!"}, status=status.HTTP_400_BAD_REQUEST)

		try:
			new_paste=Paste.objects.create(**data)
			serializer_data = self.get_serializer()(new_paste)
		except Exception as e:
			logger.error(f"Error while creating a paste, the passed data:{str(data)}. The error:{str(e)}")
			return Response({"errors":"Invalid data passed"}, status=status.HTTP_400_BAD_REQUEST)

		return Response(serializer_data.data, status=status.HTTP_201_CREATED)
