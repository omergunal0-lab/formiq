# Cleans up SUPABASE secrets pasted with spaces, quotes or as a full address.
# Expects REF and SUPABASE_ACCESS_TOKEN; rewrites them in place.
SUPABASE_ACCESS_TOKEN=$(printf '%s' "$SUPABASE_ACCESS_TOKEN" | tr -d '[:space:]"'"'")
RAW=$(printf '%s' "$REF" | tr -d '[:space:]"'"'")
CLEAN=$(printf '%s' "$RAW" | grep -oE '[a-z0-9]{20}' | head -1 || true)
[ -n "$CLEAN" ] || CLEAN="$RAW"
echo "::add-mask::$CLEAN"
if ! printf '%s' "$CLEAN" | grep -qE '^[a-z0-9]{15,30}$'; then
  echo "::error::SUPABASE_PROJECT_REF does not look right (length ${#RAW}). It should be the ~20 lowercase letters after /project/ in the Supabase address."
  exit 1
fi
[ "$CLEAN" = "$REF" ] || echo "Note: SUPABASE_PROJECT_REF was cleaned up (it contained extra characters)."
REF="$CLEAN"
SUPABASE_PROJECT_REF="$CLEAN"
