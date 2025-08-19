import gzip
import base64
from django.db import models
from django.core import validators
from django.core.exceptions import ValidationError
from io import BytesIO

# Sentinel object to distinguish "not provided" from actual values
_NOT_PROVIDED = object()

class GzippedTextField(models.BinaryField):
    """
    A custom field that stores text as gzipped + base64-encoded data.
    Allows setting max_length (default 1000). Compresses on save, decompresses on read.
    """
    
    # Class attribute for default max_length - can be overridden in subclasses
    DEFAULT_MAX_LENGTH = 1000

    def __init__(self, *args, max_length=_NOT_PROVIDED, **kwargs):
        # Set max_length based on whether it was explicitly provided
        if max_length is _NOT_PROVIDED:
            self.max_length = self.DEFAULT_MAX_LENGTH
            self._explicit_max_length = False
        else:
            # Handle the case where max_length=None or invalid
            if max_length is None:
                raise ValueError("'max_length' cannot be None. Use a positive integer or omit the parameter.")
            if not isinstance(max_length, int) or max_length <= 0:
                raise ValueError("'max_length' must be a positive integer.")
            self.max_length = max_length
            self._explicit_max_length = True
            
        super().__init__(*args, **kwargs)

    def deconstruct(self):
        name, path, args, kwargs = super().deconstruct()
        
        # Include max_length in migration only if:
        # 1. It was explicitly set by user, OR
        # 2. It differs from the current DEFAULT_MAX_LENGTH (future-proofing)
        if self._explicit_max_length or self.max_length != self.DEFAULT_MAX_LENGTH:
            kwargs['max_length'] = self.max_length
            
        # Remove any BinaryField max_length that might have been added
        kwargs.pop('max_length', None)
        return name, path, args, kwargs

    def from_db_value(self, value, expression, connection):
        """Convert stored binary data -> decompressed string"""
        if value is None:
            return value
        try:
            compressed_data = base64.b64decode(value)
            with gzip.GzipFile(mode="rb", fileobj=BytesIO(compressed_data)) as f:
                return f.read().decode('utf-8')
        except Exception as e:
            raise ValidationError(f"Failed to decompress data: {e}")

    def to_python(self, value):
        if isinstance(value, str) or value is None:
            return value
        return self.from_db_value(value, None, None)

    def get_prep_value(self, value):
        """Compress and encode the string before saving"""
        if value is None:
            return None

        if not isinstance(value, str):
            value = str(value)

        # Only enforce max_length if it's actually set (should always be, but safe check)
        if self.max_length is not None and len(value) > self.max_length:
            raise ValidationError(f"Text must be at most {self.max_length} characters.")

        # Compress and encode
        compressed = gzip.compress(value.encode('utf-8'))
        return base64.b64encode(compressed)  # Returns bytes

    def value_to_string(self, obj):
        """For serialization (e.g. fixtures)"""
        value = self.value_from_object(obj)
        prepared_value = self.get_prep_value(value)
        return prepared_value.decode('ascii') if prepared_value is not None else ''

    def formfield(self, **kwargs):
        """Use proper form field with max_length validation"""
        defaults = {
            'max_length': self.max_length,
            'widget': models.Textarea,
            'validators': [validators.MaxLengthValidator(self.max_length)]
        }
        defaults.update(kwargs)
        return super().formfield(**defaults)