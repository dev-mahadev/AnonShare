from django.db import models
from django.contrib.auth.models import User
import uuid, time, threading


class BaseModel(models.Model):
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    is_active = models.BooleanField(default=True)

    class Meta:
        abstract=True


class UrlMapping(BaseModel):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False, db_index=True)
    user = models.ForeignKey(User, on_delete=models.CASCADE, db_index=True)
    short_url = models.CharField(max_length=255, unique=True, null=True, blank=True, db_index=True)
    long_url = models.TextField(null=True, blank=True)
    expires_at = models.DateTimeField(null=True, blank=True, db_index=True)
    click_count = models.PositiveIntegerField(default=0)

    class Meta:
        db_table = 'url_mappings'
        ordering = ['-created_at']

    def __str__(self):
        return f"{self.short_url} -> {self.long_url[:50]}..." if self.long_url else str(self.id)
    
    def save(self, *args, **kwargs):
        # remove : for local deve
        # import ipdb;ipdb.set_trace()
        if not self.short_url and self.long_url:
            self.short_url = self.generate_short_url()
        super().save(*args, **kwargs)
    
    def generate_short_url(self):
        # NOTE : Use for now : (issues : too many initial common characters, making it predictable)

        
        # Get high-resolution timestamp in microseconds
        timestamp_us = int(time.time() * 1_000_000)
        
        # Get thread ID for multi-threading safety
        thread_id = threading.get_ident() % 10000
        
        # Get object memory ID

        
        object_id = id(self) % 100000
        
        # Get UUID4 bytes for randomness
        uuid_bytes = uuid.uuid4().bytes
        
        # Combine all unique components into a large number
        combined = (timestamp_us << 32) + (thread_id << 16) + object_id
        combined_bytes = combined.to_bytes(12, 'big') + uuid_bytes[:4]
        
        # Convert to base62 (0-9, a-z, A-Z)
        return self.base62_encode(int.from_bytes(combined_bytes, 'big'))[:10]
    
    def base62_encode(self, number):
        chars = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ'
        if number == 0:
            return chars[0]
        
        result = ''
        while number > 0:
            number, remainder = divmod(number, 62)
            result = chars[remainder] + result
        
        # Ensure minimum length of 10 characters
        return result.zfill(10)
        
        
    
    @property
    def is_expired(self):
        if not self.expires_at:
            return False
        from django.utils import timezone
        return timezone.now() > self.expires_at


def gen_url():
    import hashlib,time, random, string

    timestamp = str(time.time_ns())
    random_seed = ''.join(random.choices(string.ascii_letters + string.digits, k=8))
    hash_input = f"{timestamp}{random_seed}{id(1)}"
    return hashlib.sha256(hash_input.encode()).hexdigest()[:10]


print(gen_url())