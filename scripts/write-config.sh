#!/usr/bin/env bash
# Writes www/config.js from the Supabase project (used by GitHub Actions).
# Needs: SUPABASE_PROJECT_REF, SUPABASE_ACCESS_TOKEN. Optional: PRIVACY_URL.
set -euo pipefail
REF="${SUPABASE_PROJECT_REF:-}"
if [ -z "$REF" ] || [ -z "${SUPABASE_ACCESS_TOKEN:-}" ]; then
  echo "Supabase secrets not set; keeping www/config.js as is (app runs without accounts)."
  exit 0
fi
source "$(dirname "$0")/clean-ref.sh"
KEYS=$(curl -fsS -H "Authorization: Bearer $SUPABASE_ACCESS_TOKEN" "https://api.supabase.com/v1/projects/$REF/api-keys")
ANON=$(echo "$KEYS" | jq -r '[.[] | select(.name=="anon" or .type=="publishable")][0].api_key // empty')
if [ -z "$ANON" ]; then echo "Could not read the anon key from Supabase"; exit 1; fi
VERSION=$(jq -r .version package.json)
cat > www/config.js <<JS
window.FORMIQ_CONFIG = {
  version: "$VERSION",
  supabaseUrl: "https://$REF.supabase.co",
  supabaseAnonKey: "$ANON",
  privacyUrl: "${PRIVACY_URL:-privacy.html}"
};
JS
echo "config.js written for project $REF"
