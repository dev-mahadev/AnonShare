from django.db import models
import uuid
from .utils import generate_short_url


# Create your models here.
class BaseModel(models.Model):
	id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False, db_index=True)
	created_at = models.DateTimeField(auto_now_add=True)
	updated_at = models.DateTimeField(auto_now=True)
	is_active = models.BooleanField(default=True)
	short_url = models.CharField(max_length=255, unique=True, null=True, blank=True, db_index=True)
	expires_at = models.DateTimeField(null=True, blank=True)
	view_count = models.PositiveIntegerField(default=0)

	class Meta:
		abstract=True
    
	def save(self, *args, **kwargs):
		if not self.short_url:
			self.short_url = generate_short_url(self)
		super().save(*args, **kwargs) 

	@property
	def is_expired(self):
		if not self.expires_at:
			return False
		from django.utils import timezone
		return timezone.now() > self.expires_at