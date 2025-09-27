#!/usr/bin/env bash
set -euo pipefail

SUBSCRIPTION_ID="${SUBSCRIPTION_ID:-}"

if ! az account show >/dev/null 2>&1; then
  echo "Not logged in to Azure. Launching 'az login'..."
  az login >/dev/null
fi

if [[ -n "$SUBSCRIPTION_ID" ]]; then
  echo "Setting Azure subscription to $SUBSCRIPTION_ID"
  az account set --subscription "$SUBSCRIPTION_ID" >/dev/null
fi

echo "Azure CLI login complete."
