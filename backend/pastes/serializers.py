from rest_framework import serializers
from django.conf import settings
from .models import Paste
from common.utils import remove_protocol_and_www


class BasePasteSerializer(serializers.ModelSerializer):
    full_length_short_url = serializers.SerializerMethodField()

    class Meta:
        model = Paste
        fields = ["id", "full_length_short_url"]

    def get_full_length_short_url(self, instance):
        # Ensure the presence/absence of slash (/) before short/ is based on the domain
        full_length_url = settings.DOMAIN + f"p/{instance.short_url}/"
        return remove_protocol_and_www(full_length_url)


class DetailPasteSerializer(serializers.ModelSerializer):
    # Ensures that DRF treats it as text field and not binary(stored in db)
    content = serializers.CharField(read_only=True)

    class Meta:
        model = Paste
        fields = ["heading", "content"]
