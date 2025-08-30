from pathlib import Path
import environ
import os

env = environ.Env()

# Build paths inside the project like this: BASE_DIR / 'subdir'.
BASE_DIR = Path(__file__).resolve().parent.parent
environ.Env.read_env(BASE_DIR / ".env")

import boto3
from botocore.client import Config
from botocore.exceptions import ClientError
from common.utils import append_slash


class S3Client:
    def __init__(self, bucket_name=None):
        """
        Initializs with the public client and internal client
        - Public Client: Creation of presigned url
        - Internal Client: For communicating with s3
        """
        self.public_client = boto3.client(
            "s3",
            endpoint_url=os.getenv("AWS_ENDPOINT_URL"),
            aws_access_key_id=os.getenv("AWS_ACCESS_KEY_ID"),
            aws_secret_access_key=os.getenv("AWS_SECRET_ACCESS_KEY"),
            region_name=os.getenv("AWS_REGION"),
            config=Config(signature_version="s3v4"),
        )
        self.internal_client = boto3.client(
            "s3",
            endpoint_url=os.getenv("AWS_INTERNAL_URL"),
            aws_access_key_id=os.getenv("AWS_ACCESS_KEY_ID"),
            aws_secret_access_key=os.getenv("AWS_SECRET_ACCESS_KEY"),
            region_name=os.getenv("AWS_REGION"),
            config=Config(signature_version="s3v4"),
        )
        self.bucket_name = bucket_name or os.getenv("AWS_STORAGE_BUCKET_NAME")

        if not self.bucket_name:
            raise ValueError("AWS_STORAGE_BUCKET_NAME is not set in environment")

    def create_presigned_post_url(
        self, object_key, MAX_SIZE=100 * 1024 * 1024, expires_in=600
    ):
        """
        Generate a pre-signed POST URL for uploading a file.
        Restricts:
            - Max file size: 100 MB
            - Expiry: 600 seconds (10 minutes)

        Returns:
            dict: {
                'url': 'https://your-s3-endpoint/bucket-name',
                'fields': { 'key': 'file.txt', 'policy': '...', 'signature': '...' }
            }
        """
        try:
            conditions = [
                {"key": object_key},
                ["content-length-range", 0, MAX_SIZE],
            ]

            fields = {
                "key": object_key,
            }

            post_data = self.public_client.generate_presigned_post(
                Bucket=self.bucket_name,
                Key=object_key,
                Fields=fields,
                Conditions=conditions,
                ExpiresIn=expires_in,
            )

            # Appends slash
            post_data["url"] = append_slash(post_data["url"])

            return {"url": post_data["url"], "fields": post_data["fields"]}

        except ClientError as e:
            raise Exception(f"Error generating pre-signed POST: {str(e)}")

    def create_presigned_get_url(self, object_key, expires_in=600):
        """
        Generate a pre-signed GET URL for downloading a file.

        Returns:
            str: Pre-signed URL for downloading the object
        """
        try:
            url = self.public_client.generate_presigned_url(
                ClientMethod="get_object",
                Params={"Bucket": self.bucket_name, "Key": object_key},
                ExpiresIn=expires_in,
            )
            return url
        except ClientError as e:
            raise Exception(f"Error generating pre-signed GET: {str(e)}")

    def object_exists(self, object_key):
        """
        Check if a specific object key exists in the bucket.

        :param object_key: The key (path) of the object to check
        :return: True if the object exists, False otherwise
        """
        try:
            self.internal_client.head_object(Bucket=self.bucket_name, Key=object_key)
            return True
        except self.internal_client.exceptions.NoSuchKey:
            return False
        except ClientError as e:
            # Handle other possible errors (e.g., access denied, network issue)
            error_code = e.response["Error"]["Code"]
            if error_code == "404" or error_code == "NoSuchKey":
                return False
            # For other errors (e.g., 403, 500), you may want to re-raise or log
            raise Exception(f"Error checking object existence: {str(e)}")
