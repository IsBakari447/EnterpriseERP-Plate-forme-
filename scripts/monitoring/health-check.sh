#!/usr/bin/env bash

set -u

# ==========================================================
# EnterpriseERP Cloud
# Production Health Probe
# ==========================================================

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(cd "$SCRIPT_DIR/../.." && pwd)"

ENV_FILE="$SCRIPT_DIR/monitoring.env"

if [ -f "$ENV_FILE" ]; then
  # shellcheck disable=SC1090
  source "$ENV_FILE"
fi

API_URL="${API_URL:-https://enterpriseerp-api.onrender.com}"
HEALTH_ENDPOINT="${HEALTH_ENDPOINT:-/health}"
TIMEOUT="${TIMEOUT:-10}"
FAILURE_THRESHOLD="${FAILURE_THRESHOLD:-3}"
ALERT_WEBHOOK_URL="${ALERT_WEBHOOK_URL:-}"

STATE_DIR="$PROJECT_ROOT/logs/monitoring"
LOG_FILE="$STATE_DIR/health-check.log"
FAILURE_FILE="$STATE_DIR/failure-count"
STATUS_FILE="$STATE_DIR/last-status"

RESPONSE_FILE="$STATE_DIR/last-response.json"
ERROR_FILE="$STATE_DIR/last-error.log"

mkdir -p "$STATE_DIR"

TIMESTAMP="$(date '+%Y-%m-%d %H:%M:%S')"

send_alert() {
  local message="$1"
  local json_message

  echo "[$TIMESTAMP] ALERT - $message" | tee -a "$LOG_FILE"

  if [ -n "$ALERT_WEBHOOK_URL" ]; then
    json_message="$(node -e 'process.stdout.write(JSON.stringify(process.argv[1]))' "$message")"

    curl \
      --silent \
      --show-error \
      --max-time 10 \
      -H "Content-Type: application/json" \
      -d "{\"content\":$json_message}" \
      "$ALERT_WEBHOOK_URL" \
      >/dev/null 2>&1 || true
  fi
}

get_failure_count() {
  if [ -f "$FAILURE_FILE" ]; then
    cat "$FAILURE_FILE"
  else
    echo "0"
  fi
}

get_last_status() {
  if [ -f "$STATUS_FILE" ]; then
    cat "$STATUS_FILE"
  else
    echo "UNKNOWN"
  fi
}

register_failure() {
  local reason="$1"

  local failures
  failures="$(get_failure_count)"
  failures=$((failures + 1))

  echo "$failures" > "$FAILURE_FILE"
  echo "DOWN" > "$STATUS_FILE"

  echo "[$TIMESTAMP] FAILURE $failures/$FAILURE_THRESHOLD - $reason" \
    | tee -a "$LOG_FILE"

  if [ "$failures" -eq "$FAILURE_THRESHOLD" ]; then
    send_alert "[EnterpriseERP Cloud Alert] Status: FAIL. The API is unavailable after $FAILURE_THRESHOLD consecutive failed checks. Reason: $reason"
  fi
}

register_success() {
  local last_status
  last_status="$(get_last_status)"

  local previous_failures
  previous_failures="$(get_failure_count)"

  echo "0" > "$FAILURE_FILE"
  echo "UP" > "$STATUS_FILE"

  echo "[$TIMESTAMP] OK - EnterpriseERP API - HTTP 200" \
    >> "$LOG_FILE"

  if [ "$last_status" = "DOWN" ] && [ "$previous_failures" -ge "$FAILURE_THRESHOLD" ]; then
    send_alert "[EnterpriseERP Cloud Alert] Status: RECOVERED. The API is operational again."
  fi
}

HTTP_CODE="$(
  curl \
    --silent \
    --show-error \
    --output "$RESPONSE_FILE" \
    --write-out "%{http_code}" \
    --max-time "$TIMEOUT" \
    "${API_URL}${HEALTH_ENDPOINT}" \
    2>"$ERROR_FILE"
)"

CURL_EXIT=$?

if [ "$CURL_EXIT" -ne 0 ]; then
  ERROR_MESSAGE="$(cat "$ERROR_FILE" 2>/dev/null)"

  register_failure "API unreachable. $ERROR_MESSAGE"

  exit 2
fi

if [ "$HTTP_CODE" -ge 200 ] && [ "$HTTP_CODE" -lt 300 ]; then
  register_success
  exit 0
fi

RESPONSE="$(cat "$RESPONSE_FILE" 2>/dev/null)"

register_failure "HTTP $HTTP_CODE. Response: $RESPONSE"

exit 1
