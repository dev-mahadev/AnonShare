from rest_framework import serializers
from .models import UserFile
from django.conf import settings
from common.utils import remove_protocol_and_www
from shortner.s3_client import S3Client

class BaseUserFileSerializer(serializers.ModelSerializer):
    download_url = serializers.SerializerMethodField()

    class Meta:
        model = UserFile
        fields = ["id", "download_url"]

    def get_download_url(self, instance):
        s3_client = S3Client()
        return s3_client.create_presigned_get_url(instance.file_s3_key)


class UserFileDetailSerializer(serializers.ModelSerializer):
	full_length_short_url = serializers.SerializerMethodField()

	class Meta:
		model = UserFile
		fields = "__all__"

	def get_full_length_short_url(self, instance):
		# Ensure the presence/absence of slash (/) before short/ is based on the domain
		full_length_url = settings.DOMAIN + f"f/{instance.short_url}/"
		return remove_protocol_and_www(full_length_url)

	def validate_file_s3_key(self, value):
		"""
		Checks if the corresponding file's s3_key is uploaded to bucket
		"""
		s3_client=S3Client()
		if not s3_client.object_exists(value):
			raise serializers.ValidationError(f"File not found for s3_key:{value}")

		return value
