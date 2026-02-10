#!/usr/bin/env python3
"""
SYNTHIA Landing Page - Coolify Cloud Deploy Script
===================================================
Deploys the SYNTHIA lead generator landing page to Coolify Cloud.

Usage:
    python deploy_coolify_cloud.py --deploy    # Deploy to Coolify Cloud
    python deploy_coolify_cloud.py --status     # Check deployment status
"""

import json
import os
import sys
import urllib.request
import urllib.error
import urllib.parse
import time

# Coolify Cloud Config from master.env
COOLIFY_URL = "https://app.coolify.io/api/v1"
COOLIFY_CLOUD_TOKEN = "1653|7feiZePsnfrAAvjdGFtKaEnrEC5A176WAe0kWcEE5cac9ad0"

# Deployment settings
SERVER_UUID = "zks8s40gsko0g0okkw04w4w8"  # healthy-heron
GITHUB_REPO = "https://github.com/executiveusa/synthia-landing"
GIT_BRANCH = "main"
APP_NAME = "synthia-landing"
APP_FQDN = "synthia-landing.31.220.58.212.sslip.io"
EXPOSED_PORT = "8080"
BUILD_PACK = "nixpacks"  # For static HTML


def make_request(endpoint, method="GET", data=None):
    """Make API request to Coolify Cloud."""
    url = f"{COOLIFY_URL}{endpoint}"
    headers = {
        "Authorization": f"Bearer {COOLIFY_CLOUD_TOKEN}",
        "Content-Type": "application/json"
    }

    if data:
        data = json.dumps(data).encode('utf-8')
        headers["Content-Length"] = str(len(data))

    req = urllib.request.Request(url, data=data, headers=headers, method=method)

    try:
        with urllib.request.urlopen(req) as response:
            return json.loads(response.read().decode()), response.status
    except urllib.error.HTTPError as e:
        error_body = e.read().decode() if e.fp else ""
        raise Exception(f"API Error {e.code}: {error_body}")


def get_server_status():
    """Get server status."""
    return make_request(f"/servers/{SERVER_UUID}")


def create_application():
    """Create or update the application in Coolify Cloud."""
    app_config = {
        "name": APP_NAME,
        "fqdn": APP_FQDN,
        "build_pack": BUILD_PACK,
        "github_repo": GITHUB_REPO,
        "branch": GIT_BRANCH,
        "exposed_port": EXPOSED_PORT,
        "environment_variables": {
            "NODE_ENV": "production"
        }
    }

    # Check if app exists, if not create it
    try:
        # List applications
        apps, _ = make_request("/applications")
        existing_app = None

        for app in apps:
            if app.get("name") == APP_NAME:
                existing_app = app
                break

        if existing_app:
            print(f"✅ Application '{APP_NAME}' already exists")
            return existing_app
        else:
            # Create new application
            result, status = make_request("/applications", "POST", {
                "name": APP_NAME,
                "fqdn": APP_FQDN,
                "build_pack": BUILD_PACK,
                "github_repo": GITHUB_REPO,
                "branch": GIT_BRANCH,
                "exposed_port": EXPOSED_PORT,
                "server_id": SERVER_UUID,
                "environment_variables": {
                    "NODE_ENV": "production"
                }
            })
            print(f"✅ Application '{APP_NAME}' created successfully")
            return result

    except Exception as e:
        print(f"❌ Error creating application: {e}")
        return None


def deploy_application(app_uuid):
    """Trigger deployment."""
    print(f"🚀 Deploying {APP_NAME}...")

    try:
        result, status = make_request(
            f"/applications/{app_uuid}/deploy",
            "POST"
        )
        print(f"✅ Deployment triggered successfully")
        return result
    except Exception as e:
        print(f"❌ Deployment failed: {e}")
        return None


def get_deployment_status(app_uuid):
    """Get deployment status."""
    return make_request(f"/applications/{app_uuid}/status")


def main():
    """Main deployment flow."""
    print("=" * 60)
    print("SYNTHIA Landing Page - Coolify Cloud Deployment")
    print("=" * 60)

    if len(sys.argv) > 1 and sys.argv[1] == "--status":
        # Just check status
        try:
            app = create_application()
            if app:
                status = get_deployment_status(app["uuid"])
                print(f"📊 Deployment Status: {json.dumps(status, indent=2)}")
        except Exception as e:
            print(f"❌ Error: {e}")
        return

    # Full deployment
    print("\n📋 Step 1: Verifying Coolify Cloud connection...")
    try:
        servers, _ = make_request("/servers")
        print(f"✅ Connected to Coolify Cloud")
        print(f"   Available servers: {len(servers)}")
    except Exception as e:
        print(f"❌ Failed to connect to Coolify Cloud: {e}")
        print("\n💡 Make sure your Coolify Cloud token is valid.")
        sys.exit(1)

    print("\n📋 Step 2: Creating/Updating application...")
    app = create_application()
    if not app:
        print("❌ Failed to create/update application")
        sys.exit(1)

    print("\n📋 Step 3: Triggering deployment...")
    result = deploy_application(app["uuid"])
    if not result:
        print("❌ Deployment failed")
        sys.exit(1)

    print("\n" + "=" * 60)
    print("🎉 Deployment Initiated Successfully!")
    print("=" * 60)
    print(f"""
📦 Application: {APP_NAME}
🌐 URL: http://{APP_FQDN}
📊 Status: Check Coolify Cloud dashboard for real-time updates

🔗 Coolify Cloud Dashboard:
   https://app.coolify.io

💡 The deployment will:
   1. Clone the repository from GitHub
   2. Build the static site using nixpacks
   3. Deploy to server healthy-heron
   4. Expose on port {EXPOSED_PORT}

⏱️  Initial deployment may take 2-5 minutes.
""")

    # Poll for status
    print("📊 Monitoring deployment status...")
    for i in range(30):
        time.sleep(10)
        try:
            status = get_deployment_status(app["uuid"])
            deploy_status = status.get("status", "unknown")
            print(f"   Status: {deploy_status}")

            if deploy_status in ["running", "deploying"]:
                continue
            elif deploy_status == "healthy":
                print("\n✅ Deployment completed successfully!")
                break
            else:
                print(f"\n⚠️  Deployment status: {deploy_status}")
                break
        except Exception as e:
            print(f"   Status check error: {e}")
            break


if __name__ == "__main__":
    main()
