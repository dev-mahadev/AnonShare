from rest_framework import serializers
from .models import UrlMapping

class BaseUrlSerializer(serializers.ModelSerializer):

    class Meta:
        model = UrlMapping
        fields = [
            'id', 
            'short_url',
            'long_url'
        ]

class UrlDetailSerializer(serializers.ModelSerializer):

    class Meta:
        model = UrlMapping
        fields = '__all__'


