#!/bin/bash
# SYNTHIA Landing Page - Coolify Cloud Deployment
# Usage: ./deploy.sh [--status]

COOLIFY_URL="https://app.coolify.io/api/v1"
COOLIFY_CLOUD_TOKEN="1653|7feiZePsnfrAAvjdGFtKaEnrEC5A176WAe0kWcEE5cac9ad0"
SERVER_UUID="zks8s40gsko0g0okkw04w4w8"
GITHUB_REPO="https://github.com/executiveusa/synthia-landing"
GIT_BRANCH="main"
APP_NAME="synthia-landing"
APP_FQDN="synthia-landing.31.220.58.212.sslip.io"
EXPOSED_PORT="8080"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${GREEN}🚀 SYNTHIA Landing Page - Coolify Cloud Deployment${NC}"
echo "=================================================="

# Function to make API request
coolify_request() {
    local method="${1:-GET}"
    local endpoint="${2:-}"
    local data="${3:-}"

    curl -s -X "$method" \
        -H "Authorization: Bearer $COOLIFY_CLOUD_TOKEN" \
        -H "Content-Type: application/json" \
        -d "$data" \
        "$COOLIFY_URL$endpoint"
}

# Check status only
if [ "$1" == "--status" ]; then
    echo "📊 Checking deployment status..."
    coolify_request "GET" "/applications"
    exit 0
fi

# Step 1: Verify connection
echo ""
echo -e "${YELLOW}📋 Step 1: Verifying Coolify Cloud connection...${NC}"
CONNECTION=$(coolify_request "GET" "/servers" 2>/dev/null)
if [ -n "$CONNECTION" ]; then
    echo -e "${GREEN}✅ Connected to Coolify Cloud${NC}"
else
    echo -e "${RED}❌ Failed to connect to Coolify Cloud${NC}"
    echo "💡 Make sure your Coolify Cloud token is valid."
    exit 1
fi

# Step 2: Check/create application
echo ""
echo -e "${YELLOW}📋 Step 2: Checking application...${NC}"
APPS=$(coolify_request "GET" "/applications")
echo "📦 Application: $APP_NAME"
echo "🌐 GitHub: $GITHUB_REPO"
echo "🌍 Branch: $GIT_BRANCH"
echo "🔗 URL: http://$APP_FQDN"

# Step 3: Trigger deployment
echo ""
echo -e "${YELLOW}📋 Step 3: Triggering deployment...${NC}"
echo -e "${GREEN}🚀 Deploying $APP_NAME...${NC}"

# Note: You'll need to create the application in Coolify Cloud UI first,
# then use this script to trigger deployments

DEPLOY_RESULT=$(coolify_request "POST" "/applications/$APP_UUID/deploy" "{}" 2>/dev/null)

if [ -n "$DEPLOY_RESULT" ]; then
    echo -e "${GREEN}✅ Deployment triggered successfully${NC}"
    echo "$DEPLOY_RESULT" | jq . 2>/dev/null || echo "$DEPLOY_RESULT"
else
    echo -e "${YELLOW}⚠️  Please create the application in Coolify Cloud UI first${NC}"
    echo ""
    echo "To create the application:"
    echo "1. Go to https://app.coolify.io"
    echo "2. Create a new application"
    echo "3. Set build pack to 'nixpacks' or 'static'"
    echo "4. Set GitHub repo: $GITHUB_REPO"
    echo "5. Set branch: $GIT_BRANCH"
    echo "6. Set exposed port: $EXPOSED_PORT"
    echo "7. Set FQDN: $APP_FQDN"
fi

echo ""
echo "=================================================="
echo -e "${GREEN}🎉 Ready for deployment!${NC}"
echo "=================================================="
echo "📦 Application: $APP_NAME"
echo "🌐 URL: http://$APP_FQDN"
echo "📊 Dashboard: https://app.coolify.io"
