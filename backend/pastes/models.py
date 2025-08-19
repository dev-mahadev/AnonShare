from django.db import models
from common.models import BaseModel
from common.fields import GzippedTextField

class Paste(BaseModel):
	heading=models.TextField(max_length=30)
	content=GzippedTextField(max_length=1000) # Explicit passing

