from django.db import models
from common.models import BaseModel


class UserFile(BaseModel):
	file_s3_key=models.TextField(max_length=150)
	# COTODO-8

