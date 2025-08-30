#!/bin/sh
set -euo pipefail

# Validate required environment variables
for var in MINIO_ROOT_USER MINIO_ROOT_PASSWORD BUCKET_NAME USER_NAME USER_SECRET; do
  if [ -z "${!var:-}" ]; then
    echo "Error: $var must be set" >&2
    exit 1
  fi
done

MINIO_SERVER="${MINIO_SERVER:-http://minio:9000}"

# Configure mc alias
echo "Configuring mc alias..."
mc alias set local "$MINIO_SERVER" "$MINIO_ROOT_USER" "$MINIO_ROOT_PASSWORD" >/dev/null

# Create bucket if not exists
echo "Creating bucket: $BUCKET_NAME"
if ! mc ls "local/$BUCKET_NAME" >/dev/null 2>&1; then
  mc mb "local/$BUCKET_NAME"
else
  echo "Bucket $BUCKET_NAME already exists"
fi
mc anonymous set private "local/$BUCKET_NAME"

# Define policy name
POLICY_NAME="${USER_NAME}-policy"

# Add policy: read-write on specific bucket
echo "Creating policy: $POLICY_NAME"

# Write policy to a temporary file to avoid stdin/heredoc issues
cat > /tmp/policy.json <<EOF
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": ["s3:PutObject", "s3:GetObject"],
      "Resource": "arn:aws:s3:::$BUCKET_NAME/*"
    },
    {
      "Effect": "Allow",
      "Action": "s3:ListBucket",
      "Resource": "arn:aws:s3:::$BUCKET_NAME"
    }
  ]
}
EOF

# Use the file as input
if mc admin policy create local "$POLICY_NAME" /tmp/policy.json; then
  echo "Policy '$POLICY_NAME' created successfully."
else
  echo "Policy '$POLICY_NAME' may already exist or is invalid."
fi

# Create user if not exists
echo "Creating user: $USER_NAME"
if ! mc admin user info local "$USER_NAME" >/dev/null 2>&1; then
  mc admin user add local "$USER_NAME" "$USER_SECRET"
else
  echo "User $USER_NAME already exists"
fi

# Assign policy
echo "Assigning policy $POLICY_NAME to user $USER_NAME"
mc admin policy attach local "$POLICY_NAME" --user="$USER_NAME" || \
  echo "Policy '$POLICY_NAME' may already be attached to user '$USER_NAME'"

echo "======= MinIO setup complete ======="