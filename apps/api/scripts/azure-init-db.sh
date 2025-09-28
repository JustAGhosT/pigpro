#!/usr/bin/env bash
set -euo pipefail

if ! command -v az >/dev/null 2>&1; then
  echo "Azure CLI not found. Install from https://learn.microsoft.com/cli/azure/install-azure-cli" >&2
  exit 1
fi

RESOURCE_GROUP="${RESOURCE_GROUP:-}"
LOCATION="${LOCATION:-eastus}"
SERVER_NAME="${SERVER_NAME:-}"
ADMIN_USER="${ADMIN_USER:-pgadmin}"
ADMIN_PASSWORD="${ADMIN_PASSWORD:-}"
DATABASE="${PGDATABASE:-livestockdb}"
SUBSCRIPTION_ID="${SUBSCRIPTION_ID:-}"

if [[ -z "$RESOURCE_GROUP" || -z "$SERVER_NAME" || -z "$ADMIN_PASSWORD" ]]; then
  echo "Required env vars: RESOURCE_GROUP, SERVER_NAME, ADMIN_PASSWORD" >&2
  exit 1
fi

# Ensure login and subscription
"$(dirname "$0")/azure-login.sh"

echo "Creating resource group $RESOURCE_GROUP in $LOCATION"
az group create --name "$RESOURCE_GROUP" --location "$LOCATION" >/dev/null

echo "Creating Azure PostgreSQL Flexible Server: $SERVER_NAME"
az postgres flexible-server create \
  --resource-group "$RESOURCE_GROUP" \
  --name "$SERVER_NAME" \
  --location "$LOCATION" \
  --admin-user "$ADMIN_USER" \
  --admin-password "$ADMIN_PASSWORD" \
  --tier Burstable --sku-name Standard_B1ms --storage-size 32 \
  --version 13 --yes >/dev/null

echo "Creating database $DATABASE on $SERVER_NAME"
az postgres flexible-server db create \
  --resource-group "$RESOURCE_GROUP" \
  --server-name "$SERVER_NAME" \
  --database-name "$DATABASE" >/dev/null

# Initialize IP variables with safe defaults
ALLOWED_IP_START="${ALLOWED_IP_START:-}"
ALLOWED_IP_END="${ALLOWED_IP_END:-}"

# Get client IP for secure access
CLIENT_IP="${CLIENT_IP:-$(curl -s https://api.ipify.org || echo '0.0.0.0')}"

# Validate IP configuration
if [[ -n "$ALLOWED_IP_START" && -n "$ALLOWED_IP_END" ]]; then
  echo "Using provided IP range: $ALLOWED_IP_START to $ALLOWED_IP_END"
  START_IP="$ALLOWED_IP_START"
  END_IP="$ALLOWED_IP_END"
elif [[ "$CLIENT_IP" != "0.0.0.0" ]]; then
  echo "Using detected client IP: $CLIENT_IP"
  START_IP="$CLIENT_IP"
  END_IP="$CLIENT_IP"
else
  echo "Warning: Could not determine client IP. Using Azure services only."
  echo "Allowing access from Azure services only"
  START_IP="0.0.0.0"
  END_IP="0.0.0.0"
fi

# Create firewall rule with validated IPs
az postgres flexible-server firewall-rule create \
  --resource-group "$RESOURCE_GROUP" \
  --name "$SERVER_NAME" \
  --rule-name "$SERVER_NAME-allow-ip" \
  --start-ip-address "$START_IP" \
  --end-ip-address "$END_IP" >/dev/null

echo "Done. Set env vars:"
echo "PGHOST=$SERVER_NAME.postgres.database.azure.com"
echo "PGUSER=$ADMIN_USER@$SERVER_NAME"
echo "PGPASSWORD=<your password>"
echo "PGDATABASE=$DATABASE"
echo "PGPORT=5432"
echo "PGSSLMODE=require"
