#!/usr/bin/env bash
set -euo pipefail

# Interactive Vercel deploy helper for this monorepo
# - Creates a backup branch
# - Pushes main (optionally force)
# - Links & deploys apps/web and apps/dashboard
# - Adds environment variables (prompts interactively; will not echo secrets)

REPO_ROOT="$(cd "$(dirname "$0")/.." && pwd)"
WEB_DIR="$REPO_ROOT/apps/web"
DASH_DIR="$REPO_ROOT/apps/dashboard"

function err() {
  echo "Error: $*" >&2
  exit 1
}

function check_cmd() {
  command -v "$1" >/dev/null 2>&1 || err "Required command not found: $1"
}

check_cmd git
check_cmd npx

# New: CLI flags
DRY_RUN=false
NON_INTERACTIVE=false
ROLLBACK=true
TOKEN=""
AUTO_CONFIRM=false
ROLLBACK_ONLY=false
ROLLBACK_BRANCH=""

# add GH flags
GH_TOKEN=""
GH_REPO=""
GH_COMMIT=""
NO_GH=false

# New: usage/help message
usage() {
  cat <<'USAGE' >&2
Usage: $(basename "$0") [options]

Options:
  --dry-run                Show commands without executing
  --non-interactive        Use env vars and don't prompt
  --confirm                Alias for --non-interactive and auto-accept prompts
  --no-rollback            Disable automatic rollback on failure
  --token <token>          Use Vercel token for non-interactive auth
  --gh-token <token>       GitHub token to post commit comments (optional)
  --gh-repo <owner/repo>   Repo to post to (defaults to detected repo)
  --gh-commit <sha>        Commit SHA to comment on (defaults to origin/main)
  --no-gh                  Disable posting deployment comment to GitHub
  --rollback-only <branch> Force-push <branch> to origin/main and exit
  --help                   Show this message
USAGE
}

while [[ $# -gt 0 ]]; do
  case "$1" in
    --dry-run) DRY_RUN=true; shift ;;
    --non-interactive) NON_INTERACTIVE=true; shift ;;
    --confirm) NON_INTERACTIVE=true; AUTO_CONFIRM=true; shift ;;
    --no-rollback) ROLLBACK=false; shift ;;
    --token) TOKEN="$2"; shift 2 ;;
    --gh-token) GH_TOKEN="$2"; shift 2 ;;
    --gh-repo) GH_REPO="$2"; shift 2 ;;
    --gh-commit) GH_COMMIT="$2"; shift 2 ;;
    --no-gh) NO_GH=true; shift ;;
    --rollback-only) ROLLBACK_ONLY=true; ROLLBACK_BRANCH="$2"; shift 2 ;;
    --help) usage; exit 0 ;;
    *) echo "Unknown option: $1"; echo; usage; exit 2 ;;
  esac
done

# New: run command helper (respects dry-run)
run_cmd() {
  if [[ "$DRY_RUN" == "true" ]]; then
    echo "DRY-RUN: $*"
    return 0
  else
    eval "$*"
  fi
}

# New: run command helper that captures output (respects dry-run)
run_cmd_output() {
  if [[ "$DRY_RUN" == "true" ]]; then
    echo "DRY-RUN: $*"
    return 0
  fi
  local output
  if ! output="$(eval "$*" 2>&1)"; then
    echo "$output"
    return 1
  fi
  echo "$output"
}

# New: GitHub helpers for posting a commit comment (respects NO_GH)
detect_repo() {
  if [[ -n "${GH_REPO:-}" ]]; then
    echo "$GH_REPO"
    return 0
  fi
  if [[ -n "${GITHUB_REPOSITORY:-}" ]]; then
    echo "$GITHUB_REPOSITORY"
    return 0
  fi
  local url
  url="$(git config --get remote.origin.url 2>/dev/null || true)"
  [[ -z "$url" ]] && return 1
  if [[ "$url" =~ ^git@ ]]; then
    echo "$url" | sed -E 's/^git@[^:]+:([^/]+\/[^.]+)(.git)?$/\1/'
  else
    echo "$url" | sed -E 's#https?://[^/]+/([^/]+/[^.]+)(.git)?$#\1#'
  fi
}

detect_commit() {
  if [[ -n "${GH_COMMIT:-}" ]]; then
    echo "$GH_COMMIT"
    return 0
  fi
  git rev-parse origin/main 2>/dev/null || git rev-parse main 2>/dev/null || git rev-parse HEAD 2>/dev/null
}

json_encode() {
  if command -v python3 >/dev/null 2>&1; then
    python3 -c 'import json,sys; print(json.dumps(sys.stdin.read()))'
  else
    sed -e 's/\\/\\\\/g' -e 's/"/\\"/g' -e ':a;N;$!ba;s/\n/\\n/g' | awk '{printf "\"%s\"",$0}'
  fi
}

github_post_comment() {
  if [[ "$NO_GH" == "true" ]]; then
    echo "GitHub posting disabled (--no-gh); skipping."
    return 0
  fi

  local repo sha body enc_body api_url
  repo="$(detect_repo)" || { echo "Skipping GitHub post: unable to detect repo"; return 1; }
  sha="$(detect_commit)" || { echo "Skipping GitHub post: unable to detect commit sha"; return 1; }
  body="$1"

  GH_TOKEN="${GH_TOKEN:-${GITHUB_TOKEN:-}}"

  if command -v gh >/dev/null 2>&1; then
    echo "Posting deployment comment using 'gh' to $repo@$sha..."
    printf '%s' "$body" | gh api repos/"$repo"/commits/"$sha"/comments -f body="$(cat -)" >/dev/null 2>&1 && return 0 || echo "gh post failed; falling back to API"
  fi

  if [[ -n "$GH_TOKEN" ]]; then
    echo "Posting deployment comment to $repo@$sha via GitHub API..."
    enc_body="$(printf '%s' "$body" | json_encode)"
    api_url="https://api.github.com/repos/$repo/commits/$sha/comments"
    run_cmd "curl -sS -H \"Authorization: token $GH_TOKEN\" -H \"Content-Type: application/json\" -d '{\"body\":${enc_body}}' \"$api_url\"" >/dev/null || echo "GitHub comment failed"
    return 0
  fi

  echo "No GH token or 'gh' CLI found — skipping GitHub comment posting."
  return 1
}

# New: helper to read interactively or use env var in non-interactive mode
read_or_env() {
  local var_name="$1"; local prompt="$2"; local secret="${3:-false}"
  local value
  if [[ "$NON_INTERACTIVE" == "true" ]]; then
    value="${!var_name:-}"
    if [[ -z "$value" ]]; then
      err "Non-interactive mode: required env var $var_name is not set"
    fi
    printf -v "$var_name" '%s' "$value"
    return 0
  fi

  if [[ "$secret" == "true" ]]; then
    read -r -s -p "$prompt" value; echo
  else
    read -r -p "$prompt" value
  fi
  printf -v "$var_name" '%s' "$value"
}

# New: export token if provided (for non-interactive vercel usage)
if [[ -n "$TOKEN" ]]; then
  export VERCEL_TOKEN="$TOKEN"
fi

# New: rollback trap
SUCCESS=0
on_error() {
  if [[ "$SUCCESS" != "1" && "$ROLLBACK" == "true" && -n "${BACKUP_BRANCH:-}" ]]; then
    echo "Error detected — attempting rollback: restoring remote 'main' from $BACKUP_BRANCH..."
    run_cmd "git push origin \"$BACKUP_BRANCH\":main --force" || echo "Rollback attempt failed; please restore manually."
  fi
  exit 1
}
trap on_error ERR

# New: skip vercel whoami in dry-run; otherwise check auth (token may allow non-interactive)
if [[ "$DRY_RUN" == "true" ]]; then
  echo "DRY-RUN: skipping vercel auth check"
elif ! npx vercel whoami >/dev/null 2>&1; then
  echo "Not logged in to Vercel. Run 'npx vercel login' in your terminal to authenticate (or provide --token)."
  read -r -p "Continue anyway? (y/N): " proceed_v
  if [[ "${proceed_v,,}" != "y" ]]; then
    echo "Aborted."; exit 1
  fi
fi

# New: rollback-only action (runs before normal flow)
if [[ "$ROLLBACK_ONLY" == "true" ]]; then
  if [[ -z "$ROLLBACK_BRANCH" ]]; then
    err "Usage: --rollback-only <branch>"
  fi
  if ! git rev-parse --verify "$ROLLBACK_BRANCH" >/dev/null 2>&1 && ! git ls-remote --exit-code origin "refs/heads/$ROLLBACK_BRANCH" >/dev/null 2>&1; then
    err "Branch '$ROLLBACK_BRANCH' not found locally or on origin"
  fi
  echo "Rollback-only: will push '$ROLLBACK_BRANCH' -> origin/main (force)"
  run_cmd "git push origin \"$ROLLBACK_BRANCH\":main --force"
  echo "Rollback-only: done"
  exit 0
fi

# New: autodetect CI environments (GITHUB_ACTIONS, CI, etc.) and auto-confirm
if [[ -n "${CI:-}" || -n "${GITHUB_ACTIONS:-}" ]]; then
  NON_INTERACTIVE=true
  AUTO_CONFIRM=true
fi

# New: load .env.ci for CI-friendly env injection (safe-ish parsing)
load_env_file() {
  local file="$1"
  [ -f "$file" ] || return 0
  echo "Loading env vars from $file"
  # Skip comments and empty lines, parse KEY=VALUE (strip surrounding quotes)
  while IFS='=' read -r key val; do
    key="$(echo "$key" | sed 's/^[[:space:]]*//;s/[[:space:]]*$//')"
    [[ -z "$key" || "$key" == \#* ]] && continue
    val="${val%\"}"; val="${val#\"}"
    export "$key"="$val"
  done < <(grep -v '^\s*#' "$file" || true)
}

# Load .env.ci at repo root if present
load_env_file "$REPO_ROOT/.env.ci"

echo "This script will push and deploy both apps (apps/web and apps/dashboard) to Vercel."
if [[ "$NON_INTERACTIVE" == "true" || "${AUTO_CONFIRM:-}" == "true" ]]; then
  proceed="y"
else
  read -r -p "Proceed? (y/N): " proceed
fi
if [[ "${proceed,,}" != "y" ]]; then
  echo "Aborted."; exit 0
fi

# Ensure working tree is clean
if [[ -n "$(git status --porcelain)" ]]; then
  echo "You have uncommitted changes. Please commit or stash them before running this script.";
  git status --porcelain
  exit 1
fi

TIMESTAMP=$(date +%s)
BACKUP_BRANCH="backup-before-deploy-$TIMESTAMP"

echo "Creating backup branch $BACKUP_BRANCH..."
run_cmd "git branch \"$BACKUP_BRANCH\""
run_cmd "git push origin \"$BACKUP_BRANCH\""

# Confirm push method
if [[ "$NON_INTERACTIVE" == "true" ]]; then
  forcepush="n"
else
  read -r -p "Push 'main' to remote. Use force push? (y/N): " forcepush
fi
if [[ "${forcepush,,}" == "y" ]]; then
  echo "Force pushing main to origin..."
  run_cmd "git push -u origin main --force"
else
  echo "Pushing main to origin..."
  run_cmd "git push -u origin main"
fi

# Helper to add env via vercel (tries to pipe secret value, falls back to interactive)
function vercel_env_add() {
  local VAR_NAME="$1"
  local SCOPE="$2"  # production/preview/development
  local SECRET="$3"

  if [[ -z "$SECRET" ]]; then
    echo "Adding $VAR_NAME ($SCOPE) interactively. You will be prompted to paste the value.";
    run_cmd "npx vercel env add \"$VAR_NAME\" \"$SCOPE\"" || true
  else
    # Try to pipe the value to the CLI which usually accepts stdin
    run_cmd "printf '%s\n' \"$SECRET\" | npx vercel env add \"$VAR_NAME\" \"$SCOPE\"" || {
      echo "Automatic add for $VAR_NAME failed; falling back to interactive mode. Please paste the value when prompted.";
      run_cmd "npx vercel env add \"$VAR_NAME\" \"$SCOPE\"" || true
    }
  fi
}

# Deploy web
read -p "
Deploying Public Website (apps/web). Project name suggestion: nextjs-boilerplate-two-pink-80
Press Enter to continue or Ctrl+C to abort..." dummy

cd "$WEB_DIR"

if [[ "$NON_INTERACTIVE" == "true" ]]; then
  WEB_PROJ="${WEB_PROJ:-nextjs-boilerplate-two-pink-80}"
  echo "Using web project: $WEB_PROJ"
else
  read -r -p "Vercel project name for web [nextjs-boilerplate-two-pink-80]: " WEB_PROJ
  WEB_PROJ=${WEB_PROJ:-nextjs-boilerplate-two-pink-80}
fi

run_cmd "npx vercel link --project \"$WEB_PROJ\"" || true

# New: ensure the link created project metadata or re-link (fail in CI/non-interactive)
if [[ ! -f ".vercel/project.json" && ! -f ".vercel/project" ]]; then
  if [[ "$NON_INTERACTIVE" == "true" ]]; then
    err "Vercel project not linked (no .vercel/project.json). In non-interactive mode set VERCEL_PROJECT_ID or run: npx vercel link --project \"$WEB_PROJ\""
  else
    echo "Link did not create .vercel/project.json; attempting interactive link..."
    npx vercel link --project "$WEB_PROJ" || err "vercel link failed; check project name and permissions"
  fi
fi

# Prompt for env values (do not echo secret values); use -r where appropriate
read_or_env NEXT_PUBLIC_SUPABASE_URL "Enter NEXT_PUBLIC_SUPABASE_URL: "
read_or_env NEXT_PUBLIC_SUPABASE_ANON_KEY "Enter NEXT_PUBLIC_SUPABASE_ANON_KEY (input hidden): " true
read_or_env NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY "Enter NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY: "
read_or_env STRIPE_SECRET_KEY "Enter STRIPE_SECRET_KEY (server-only, input hidden): " true

vercel_env_add NEXT_PUBLIC_SUPABASE_URL production "$NEXT_PUBLIC_SUPABASE_URL"
vercel_env_add NEXT_PUBLIC_SUPABASE_ANON_KEY production "$NEXT_PUBLIC_SUPABASE_ANON_KEY"
vercel_env_add NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY production "$NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY"
vercel_env_add STRIPE_SECRET_KEY production "$STRIPE_SECRET_KEY"

# Optional AI gateway key
if [[ "$NON_INTERACTIVE" == "true" ]]; then
  AI_GATEWAY_API_KEY="${AI_GATEWAY_API_KEY:-}"
else
  read -r -s -p "If you use AI_GATEWAY_API_KEY, paste it now (input hidden). Leave empty to skip: " AI_GATEWAY_API_KEY; echo
fi
if [[ -n "$AI_GATEWAY_API_KEY" ]]; then
  vercel_env_add AI_GATEWAY_API_KEY production "$AI_GATEWAY_API_KEY"
fi

# Deploy web (capture URL)
WEB_DEPLOY_OUTPUT="$(run_cmd_output "npx vercel deploy --prod")" || {
  echo "$WEB_DEPLOY_OUTPUT"
  err "Web deploy command failed. Check output above."
}
WEB_URL="$(echo "$WEB_DEPLOY_OUTPUT" | grep -Eo 'https?://[A-Za-z0-9._/-]+' | head -n1 || true)"
if [[ -z "$WEB_URL" ]]; then
  echo "ERROR: no deployment URL found in vercel output. Full output:"
  echo "$WEB_DEPLOY_OUTPUT"
  echo
  echo "Possible causes: project not linked, insufficient VERCEL_TOKEN permissions, or deploy failed."
  echo "Try: cd $WEB_DIR && npx vercel link --project \"$WEB_PROJ\" && npx vercel deploy --prod --token \"\$VERCEL_TOKEN\""
  err "DEPLOYMENT_NOT_FOUND or no URL returned from vercel deploy"
fi
echo "Web deployed to: $WEB_URL"

# Deploy dashboard
read -p "
Deploying Dashboard (apps/dashboard). Press Enter to continue..." dummy
cd "$DASH_DIR"

if [[ "$NON_INTERACTIVE" == "true" ]]; then
  DASH_PROJ="${DASH_PROJ:-ubuntu-dashboard}"
  echo "Using dashboard project: $DASH_PROJ"
else
  read -r -p "Vercel project name for dashboard [ubuntu-dashboard]: " DASH_PROJ
  DASH_PROJ=${DASH_PROJ:-ubuntu-dashboard}
fi

run_cmd "npx vercel link --project \"$DASH_PROJ\"" || true

# New: ensure dashboard link created project metadata
if [[ ! -f ".vercel/project.json" && ! -f ".vercel/project" ]]; then
  if [[ "$NON_INTERACTIVE" == "true" ]]; then
    err "Dashboard project not linked (no .vercel/project.json). Set VERCEL_PROJECT_ID or run: npx vercel link --project \"$DASH_PROJ\""
  else
    echo "Dashboard link did not create .vercel/project.json; attempting interactive link..."
    npx vercel link --project "$DASH_PROJ" || err "vercel link failed; check project name and permissions"
  fi
fi

# Deploy dashboard (capture URL)
DASH_DEPLOY_OUTPUT="$(run_cmd_output "npx vercel deploy --prod")" || {
  echo "$DASH_DEPLOY_OUTPUT"
  err "Dashboard deploy command failed. Check output above."
}
DASH_URL="$(echo "$DASH_DEPLOY_OUTPUT" | grep -Eo 'https?://[A-Za-z0-9._/-]+' | head -n1 || true)"
if [[ -z "$DASH_URL" ]]; then
  echo "ERROR: no dashboard deployment URL found. Full output:"
  echo "$DASH_DEPLOY_OUTPUT"
  echo
  echo "Try: cd $DASH_DIR && npx vercel link --project \"$DASH_PROJ\" && npx vercel deploy --prod --token \"\$VERCEL_TOKEN\""
  err "DEPLOYMENT_NOT_FOUND or no URL returned from vercel deploy"
fi
echo "Dashboard deployed to: $DASH_URL"

# Post-deploy: set NEXT_PUBLIC_DASHBOARD_URL automatically if found from deploy or env
DEPLOYED_DASHBOARD_URL="${DEPLOYED_DASHBOARD_URL:-${DASH_URL:-${NEXT_PUBLIC_DASHBOARD_URL:-}}}"
if [[ -n "$DEPLOYED_DASHBOARD_URL" ]]; then
  cd "$WEB_DIR"
  vercel_env_add NEXT_PUBLIC_DASHBOARD_URL production "$DEPLOYED_DASHBOARD_URL"
  run_cmd "npx vercel deploy --prod" || echo "Warning: redeploy of web failed"
fi

# New: Post final URLs to GitHub commit
# Build a single "web with dashboard accessible" link by encoding DASH_URL as query param
if [[ -n "${WEB_URL:-}" ]]; then
  WEB_LINK="$WEB_URL"
  if [[ -n "${DASH_URL:-}${DEPLOYED_DASHBOARD_URL:-}" ]]; then
    DASH_TO_USE="${DASH_URL:-$DEPLOYED_DASHBOARD_URL}"
    if command -v python3 >/dev/null 2>&1; then
      ENC_DASH="$(printf '%s' "$DASH_TO_USE" | python3 -c 'import urllib.parse,sys; print(urllib.parse.quote(sys.stdin.read().strip(), safe=""))')"
    else
      # fallback encoder
      ENC_DASH="$(printf '%s' "$DASH_TO_USE" | sed -e 's/ /%20/g' -e 's/:/%3A/g' -e 's#/#%2F#g' -e 's/?/%3F/g' -e 's/&/%26/g' -e 's/=/%3D/g')"
    fi
    WEB_WITH_DASH="${WEB_URL}?dashboard=${ENC_DASH}"
  else
    WEB_WITH_DASH="$WEB_URL"
  fi

  BODY="Deployment summary\n\n- Web (with dashboard accessible via web): $WEB_WITH_DASH\n"
  if [[ -n "${DASH_TO_USE:-}" ]]; then
    BODY="$BODY- Dashboard direct: $DASH_TO_USE\n"
  fi
  BODY="$BODY\nBackup branch: $BACKUP_BRANCH\n"

  github_post_comment "$BODY" || echo "Warning: GitHub posting skipped or failed"
fi

# Success: disable rollback trap
SUCCESS=1
trap - ERR

cat <<'EOF'

Done — both projects deployed (or attempted). Summary:
 - Backup branch created: $BACKUP_BRANCH
 - Main branch pushed
 - Web project: $WEB_PROJ
 - Dashboard project: $DASH_PROJ

Important next steps:
 - Verify both sites in the browser
 - Check contact form + dashboard integration
 - Rotate any keys if they were compromised
 - Remove the backup branch from remote only when you're sure

EOF

exit 0
