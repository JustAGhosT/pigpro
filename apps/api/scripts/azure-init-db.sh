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
DATABASE="${PGDATABASE:-farmdb}"
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

echo "Allowing public access from all IPs (adjust as needed)"
az postgres flexible-server firewall-rule create \
  --resource-group "$RESOURCE_GROUP" \
  --name "$SERVER_NAME-allow-ip" \
  --server-name "$SERVER_NAME" \
  --start-ip-address 0.0.0.0 \
  --end-ip-address 255.255.255.255 >/dev/null

echo "Done. Set env vars:"
echo "PGHOST=$SERVER_NAME.postgres.database.azure.com"
echo "PGUSER=$ADMIN_USER@$SERVER_NAME"
echo "PGPASSWORD=<your password>"
echo "PGDATABASE=$DATABASE"
echo "PGPORT=5432"
echo "PGSSLMODE=require"
