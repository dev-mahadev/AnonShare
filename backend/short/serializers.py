from rest_framework import serializers
from .models import UrlMapping
from django.conf import settings

class BaseUrlSerializer(serializers.ModelSerializer):

    class Meta:
        model = UrlMapping
        fields = [
            'id', 
            'short_url',
            'long_url'
        ]

class UrlDetailSerializer(serializers.ModelSerializer):
    full_length_short_url=serializers.SerializerMethodField()

    class Meta:
        model = UrlMapping
        fields = '__all__'
    
    def get_full_length_short_url(self, instance):
        # Ensure the presence/absence of slash (/) before short/ is based on the domain
        return settings.DOMAIN+f"short/{instance.short_url}/"

