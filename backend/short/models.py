from django.db import models
from common.models import BaseModel

class UrlMapping(BaseModel):
    long_url = models.TextField(null=True, blank=True)
    # CTODO-8.2

    class Meta:
        db_table = 'url_mappings'
        ordering = ['-created_at']

    def __str__(self):
        return f"{self.short_url} -> {self.long_url[:50]}..." if self.long_url else str(self.id)
    
    def save(self, *args, **kwargs):
        super().save(*args, **kwargs)