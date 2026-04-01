"""
Velonyx Platform — Upload Handler
Generates presigned S3 URLs for client file uploads
and lists/deletes files by category.
"""
import json
import os
import boto3
from datetime import datetime

s3 = boto3.client("s3")
dynamodb = boto3.resource("dynamodb")

BUCKET = os.environ["S3_BUCKET"]
TABLE = os.environ["DYNAMODB_TABLE"]
ALLOWED_CATEGORIES = ["logos", "photos", "videos", "documents", "inspiration"]

# CORS headers for browser requests
HEADERS = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "Content-Type, Authorization",
    "Access-Control-Allow-Methods": "GET, POST, DELETE, OPTIONS",
    "Content-Type": "application/json",
}


def lambda_handler(event, context):
    """Route requests to the appropriate handler."""
    # Handle CORS preflight
    method = event.get("requestContext", {}).get("http", {}).get("method", "")
    if method == "OPTIONS":
        return {"statusCode": 200, "headers": HEADERS, "body": ""}

    # Get client ID from Cognito token
    client_id = (
        event.get("requestContext", {})
        .get("authorizer", {})
        .get("jwt", {})
        .get("claims", {})
        .get("sub", "")
    )

    if not client_id:
        return {
            "statusCode": 401,
            "headers": HEADERS,
            "body": json.dumps({"error": "Unauthorized"}),
        }

    path = event.get("rawPath", "")

    if method == "POST" and "/upload-url" in path:
        return generate_upload_url(event, client_id)
    elif method == "GET" and "/files" in path:
        return list_files(client_id)
    elif method == "DELETE" and "/files" in path:
        return delete_file(event, client_id)
    else:
        return {
            "statusCode": 404,
            "headers": HEADERS,
            "body": json.dumps({"error": "Not found"}),
        }


def generate_upload_url(event, client_id):
    """Generate a presigned S3 URL for direct browser upload."""
    try:
        body = json.loads(event.get("body", "{}"))
        filename = body.get("filename", "")
        category = body.get("category", "")
        content_type = body.get("contentType", "application/octet-stream")

        if not filename or not category:
            return {
                "statusCode": 400,
                "headers": HEADERS,
                "body": json.dumps({"error": "filename and category required"}),
            }

        if category not in ALLOWED_CATEGORIES:
            return {
                "statusCode": 400,
                "headers": HEADERS,
                "body": json.dumps({
                    "error": f"Invalid category. Must be one of: {', '.join(ALLOWED_CATEGORIES)}"
                }),
            }

        # S3 key: clientId/category/filename
        s3_key = f"{client_id}/{category}/{filename}"

        # Generate presigned PUT URL (expires in 15 minutes)
        presigned_url = s3.generate_presigned_url(
            "put_object",
            Params={
                "Bucket": BUCKET,
                "Key": s3_key,
                "ContentType": content_type,
            },
            ExpiresIn=900,
        )

        # Update checklist in DynamoDB
        update_checklist(client_id, category)

        return {
            "statusCode": 200,
            "headers": HEADERS,
            "body": json.dumps({
                "uploadUrl": presigned_url,
                "key": s3_key,
                "message": "Upload URL generated. PUT your file to the URL.",
            }),
        }

    except Exception as e:
        print(f"Error generating upload URL: {str(e)}")
        return {
            "statusCode": 500,
            "headers": HEADERS,
            "body": json.dumps({"error": "Failed to generate upload URL"}),
        }


def list_files(client_id):
    """List all files uploaded by a client, organized by category."""
    try:
        result = {}
        for category in ALLOWED_CATEGORIES:
            prefix = f"{client_id}/{category}/"
            response = s3.list_objects_v2(Bucket=BUCKET, Prefix=prefix)

            files = []
            for obj in response.get("Contents", []):
                filename = obj["Key"].split("/")[-1]
                if filename:  # Skip empty keys
                    files.append({
                        "filename": filename,
                        "key": obj["Key"],
                        "size": obj["Size"],
                        "lastModified": obj["LastModified"].isoformat(),
                    })

            result[category] = files

        return {
            "statusCode": 200,
            "headers": HEADERS,
            "body": json.dumps({"files": result}),
        }

    except Exception as e:
        print(f"Error listing files: {str(e)}")
        return {
            "statusCode": 500,
            "headers": HEADERS,
            "body": json.dumps({"error": "Failed to list files"}),
        }


def delete_file(event, client_id):
    """Delete a file from S3 (only if it belongs to this client)."""
    try:
        body = json.loads(event.get("body", "{}"))
        key = body.get("key", "")

        # Security: ensure the key belongs to this client
        if not key.startswith(f"{client_id}/"):
            return {
                "statusCode": 403,
                "headers": HEADERS,
                "body": json.dumps({"error": "Access denied"}),
            }

        s3.delete_object(Bucket=BUCKET, Key=key)

        return {
            "statusCode": 200,
            "headers": HEADERS,
            "body": json.dumps({"message": "File deleted"}),
        }

    except Exception as e:
        print(f"Error deleting file: {str(e)}")
        return {
            "statusCode": 500,
            "headers": HEADERS,
            "body": json.dumps({"error": "Failed to delete file"}),
        }


def update_checklist(client_id, category):
    """Update the upload checklist count in DynamoDB."""
    table = dynamodb.Table(TABLE)
    try:
        table.update_item(
            Key={"clientId": client_id},
            UpdateExpression=f"SET checklist.{category} = if_not_exists(checklist.{category}, :zero) + :one, updatedAt = :now",
            ExpressionAttributeValues={
                ":zero": 0,
                ":one": 1,
                ":now": datetime.utcnow().isoformat(),
            },
        )
    except Exception as e:
        print(f"Checklist update failed (non-critical): {str(e)}")
