"""
Velonyx Platform — Projects Handler
Get and update client project info, checklist status, and project phases.
"""
import json
import os
import boto3
from datetime import datetime
from decimal import Decimal

dynamodb = boto3.resource("dynamodb")
TABLE = os.environ["DYNAMODB_TABLE"]

HEADERS = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "Content-Type, Authorization",
    "Access-Control-Allow-Methods": "GET, PUT, POST, OPTIONS",
    "Content-Type": "application/json",
}

PROJECT_STATUSES = ["intake", "design", "review", "revision", "launched"]

CHECKLIST_CATEGORIES = [
    {"key": "logos", "label": "Logo & Branding"},
    {"key": "photos", "label": "Photos"},
    {"key": "videos", "label": "Videos"},
    {"key": "documents", "label": "Documents"},
    {"key": "inspiration", "label": "Inspiration / Reference Sites"},
    {"key": "brandColors", "label": "Brand Colors"},
    {"key": "businessInfo", "label": "Business Info & Description"},
    {"key": "socialLinks", "label": "Social Media Links"},
    {"key": "menuPriceList", "label": "Menu / Price List"},
    {"key": "specialRequests", "label": "Special Requests"},
]


class DecimalEncoder(json.JSONEncoder):
    """Handle DynamoDB Decimal types in JSON serialization."""
    def default(self, o):
        if isinstance(o, Decimal):
            return int(o) if o % 1 == 0 else float(o)
        return super().default(o)


def lambda_handler(event, context):
    """Route requests."""
    method = event.get("requestContext", {}).get("http", {}).get("method", "")
    if method == "OPTIONS":
        return {"statusCode": 200, "headers": HEADERS, "body": ""}

    # Get client ID and role from Cognito
    claims = (
        event.get("requestContext", {})
        .get("authorizer", {})
        .get("jwt", {})
        .get("claims", {})
    )
    client_id = claims.get("sub", "")
    groups = claims.get("cognito:groups", "")
    is_admin = "admins" in groups if groups else False

    if not client_id:
        return {
            "statusCode": 401,
            "headers": HEADERS,
            "body": json.dumps({"error": "Unauthorized"}),
        }

    if method == "GET":
        params = event.get("queryStringParameters") or {}

        # Admin requesting all clients
        if is_admin and params.get("all") == "true":
            return get_all_projects()

        # Admin can view any project, client can only view their own
        query_client_id = params.get("clientId", client_id)
        if not is_admin:
            query_client_id = client_id
        return get_project(query_client_id)

    elif method == "PUT":
        return update_project(event, client_id, is_admin)

    elif method == "POST":
        # Create new project (admin only)
        if not is_admin:
            return {
                "statusCode": 403,
                "headers": HEADERS,
                "body": json.dumps({"error": "Admin access required"}),
            }
        return create_project(event)

    return {
        "statusCode": 404,
        "headers": HEADERS,
        "body": json.dumps({"error": "Not found"}),
    }


def get_all_projects():
    """Get all client projects (admin only). Returns list of all clients."""
    table = dynamodb.Table(TABLE)

    try:
        response = table.scan()
        items = response.get("Items", [])

        # Handle pagination if table is large
        while "LastEvaluatedKey" in response:
            response = table.scan(ExclusiveStartKey=response["LastEvaluatedKey"])
            items.extend(response.get("Items", []))

        # Add checklist progress to each client
        for item in items:
            checklist = item.get("checklist", {})
            completed = sum(1 for cat in CHECKLIST_CATEGORIES if checklist.get(cat["key"]))
            total = len(CHECKLIST_CATEGORIES)
            item["checklistProgress"] = {
                "completed": completed,
                "total": total,
                "percentage": round((completed / total) * 100) if total else 0,
            }

        return {
            "statusCode": 200,
            "headers": HEADERS,
            "body": json.dumps({"clients": items}, cls=DecimalEncoder),
        }

    except Exception as e:
        print(f"Error scanning projects: {str(e)}")
        return {
            "statusCode": 500,
            "headers": HEADERS,
            "body": json.dumps({"error": "Failed to load clients"}),
        }


def get_project(client_id):
    """Get a client's project info and checklist status."""
    table = dynamodb.Table(TABLE)

    try:
        response = table.get_item(Key={"clientId": client_id})
        item = response.get("Item")

        if not item:
            return {
                "statusCode": 404,
                "headers": HEADERS,
                "body": json.dumps({"error": "Project not found"}),
            }

        # Calculate checklist completion
        checklist = item.get("checklist", {})
        completed = sum(1 for cat in CHECKLIST_CATEGORIES if checklist.get(cat["key"]))
        total = len(CHECKLIST_CATEGORIES)

        item["checklistProgress"] = {
            "completed": completed,
            "total": total,
            "percentage": round((completed / total) * 100),
            "categories": [
                {
                    "key": cat["key"],
                    "label": cat["label"],
                    "done": bool(checklist.get(cat["key"])),
                    "count": checklist.get(cat["key"], 0),
                }
                for cat in CHECKLIST_CATEGORIES
            ],
        }

        return {
            "statusCode": 200,
            "headers": HEADERS,
            "body": json.dumps(item, cls=DecimalEncoder),
        }

    except Exception as e:
        print(f"Error: {str(e)}")
        return {
            "statusCode": 500,
            "headers": HEADERS,
            "body": json.dumps({"error": "Server error"}),
        }


def create_project(event):
    """Create a new client project (admin only)."""
    table = dynamodb.Table(TABLE)

    try:
        body = json.loads(event.get("body", "{}"))
        client_id = body.get("clientId", "")
        if not client_id:
            return {
                "statusCode": 400,
                "headers": HEADERS,
                "body": json.dumps({"error": "clientId required"}),
            }

        now = datetime.utcnow().isoformat()

        item = {
            "clientId": client_id,
            "businessName": body.get("businessName", ""),
            "contactEmail": body.get("contactEmail", ""),
            "contactPhone": body.get("contactPhone", ""),
            "packageType": body.get("packageType", "Starter"),
            "amountPaid": Decimal(str(body.get("amountPaid", 0))),
            "paymentStatus": body.get("paymentStatus", "pending"),
            "projectStatus": "intake",
            "checklist": {},
            "brandColors": body.get("brandColors", ""),
            "socialLinks": body.get("socialLinks", ""),
            "businessDescription": body.get("businessDescription", ""),
            "notes": "",
            "createdAt": now,
            "updatedAt": now,
        }

        table.put_item(Item=item)

        return {
            "statusCode": 201,
            "headers": HEADERS,
            "body": json.dumps({"message": "Project created", "clientId": client_id}),
        }

    except Exception as e:
        print(f"Error: {str(e)}")
        return {
            "statusCode": 500,
            "headers": HEADERS,
            "body": json.dumps({"error": "Server error"}),
        }


def update_project(event, client_id, is_admin):
    """Update project fields. Clients can update their info, admin can update everything."""
    table = dynamodb.Table(TABLE)

    try:
        body = json.loads(event.get("body", "{}"))

        # Fields clients can update
        client_fields = [
            "brandColors", "socialLinks", "businessDescription",
            "specialRequests", "menuPriceList",
        ]

        # Additional fields only admin can update
        admin_fields = [
            "projectStatus", "notes", "packageType",
            "amountPaid", "paymentStatus",
        ]

        allowed = client_fields + (admin_fields if is_admin else [])

        # Target client ID (admin can update any client)
        target_id = body.pop("clientId", client_id) if is_admin else client_id

        update_expr_parts = ["updatedAt = :now"]
        expr_values = {":now": datetime.utcnow().isoformat()}

        for field in allowed:
            if field in body:
                update_expr_parts.append(f"{field} = :{field}")
                value = body[field]
                if field == "amountPaid":
                    value = Decimal(str(value))
                expr_values[f":{field}"] = value

                # Update checklist for text-based fields
                if field in ["brandColors", "socialLinks", "businessDescription",
                             "specialRequests", "menuPriceList"]:
                    update_expr_parts.append(f"checklist.{field} = :one")
                    expr_values[":one"] = 1

        table.update_item(
            Key={"clientId": target_id},
            UpdateExpression="SET " + ", ".join(update_expr_parts),
            ExpressionAttributeValues=expr_values,
        )

        return {
            "statusCode": 200,
            "headers": HEADERS,
            "body": json.dumps({"message": "Project updated"}),
        }

    except Exception as e:
        print(f"Error: {str(e)}")
        return {
            "statusCode": 500,
            "headers": HEADERS,
            "body": json.dumps({"error": "Server error"}),
        }
