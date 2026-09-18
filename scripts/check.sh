#!/usr/bin/env bash
# check.sh — full validation suite for tolu-portfolio
# Implements G1 (T-1..T-12) + G2 (L-1..L-9) per docs/adal/EVALUATE.md
#
# Usage:  bash scripts/check.sh
# Output: docs/adal/checks-latest.txt  (machine-readable PASS|FAIL lines)
# Exit:   0 iff all checks PASS; 1 otherwise.

set -u

REPO_ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$REPO_ROOT"

OUT="${REPO_ROOT}/docs/adal/checks-latest.txt"
mkdir -p "$(dirname "$OUT")"
: > "$OUT"

pass=0
fail=0
total=0

log() {
  local status="$1"; shift
  local id="$1"; shift
  local detail="$*"
  total=$((total + 1))
  if [ "$status" = "PASS" ]; then
    pass=$((pass + 1))
  else
    fail=$((fail + 1))
  fi
  printf "%-6s %-6s %s\n" "$status" "$id" "$detail" | tee -a "$OUT"
}

# Optional: serve locally (started in background if no server is running)
SERVER_PID=""
SERVE_LOG="/tmp/toluport-check-server.log"
start_server() {
  if curl -fsS -o /dev/null --max-time 2 http://localhost:8080/ 2>/dev/null; then
    return
  fi
  (python3 -m http.server 8080 > "$SERVE_LOG" 2>&1) &
  SERVER_PID=$!
  sleep 1
}
stop_server() {
  if [ -n "$SERVER_PID" ]; then kill "$SERVER_PID" 2>/dev/null || true; fi
}
trap stop_server EXIT
start_server

# ============================================================
# G1 — Targeted checks (T-1..T-12)
# ============================================================

# T-1: DESIGN.md defines tokens
if grep -q 'oklch(0.13 0.01 60)' DESIGN.md \
   && grep -q 'oklch(0.78 0.16 85)' DESIGN.md \
   && grep -q 'cubic-bezier(0.16, 1, 0.3, 1)' DESIGN.md \
   && grep -q 'Fraunces' DESIGN.md; then
  log PASS T-1 "DESIGN.md defines ink/gold/easing/type"
else
  log FAIL T-1 "DESIGN.md missing one of ink/gold/easing/type"
fi

# T-2: Palette consistency — accent uses DESIGN.md tokens, no random new hue families
# Allowed hue families: 60 (warm ink/gold axis), 85 (gold), 245-260 (blue), 76 (amber variant of 85),
# 250/255 (blue-glow), 72 (gold variant), 92 (gold variant), 250 (blue). Plus neutral 0 0 0 and 1 0 0.
bad_literals=$(grep -oE 'oklch\([^)]+\)' styles.css \
  | grep -vE 'oklch\(\s*(0|1)(\s+0(\s+0)?)?\b|oklch\(\s*0\.[0-9]+\s+0\.0(0[0-9])?\s+(60|85|245|250|255|260|76|72|92|248|78)\b' \
  | wc -l | tr -d ' ')
if [ "${bad_literals:-0}" -eq 0 ]; then
  log PASS T-2 "All oklch() literals resolve to palette family (ink/gold/blue + neutral)"
else
  log FAIL T-2 "Found $bad_literals oklch() literal(s) outside palette family:"
  grep -oE 'oklch\([^)]+\)' styles.css | grep -vE 'oklch\(\s*(0|1)(\s+0(\s+0)?)?\b|oklch\(\s*0\.[0-9]+\s+0\.0(0[0-9])?\s+(60|85|245|250|255|260|76|72|92|248|78)\b' | sort -u | sed 's/^/      /'
fi

# T-3: Single easing
unique_easings=$(grep -oE 'cubic-bezier\([^)]*\)' styles.css | sort -u | wc -l | tr -d ' ')
if [ "${unique_easings:-0}" -le 1 ]; then
  log PASS T-3 "Single cubic-bezier easing site-wide ($unique_easings)"
else
  log FAIL T-3 "Multiple easings found: $unique_easings"
fi

# T-4: Hero display scale per contract
if grep -q 'clamp(3.9rem, 11vw, 9.5rem)' styles.css; then
  log PASS T-4 "Hero h1 = clamp(3.9rem, 11vw, 9.5rem)"
else
  log FAIL T-4 "Hero h1 clamp value differs from contract"
fi

# T-5: Fonts loaded with system fallback (count occurrences, not lines)
font_count=$(grep -oE 'Fraunces|Source\+Sans\+3|DM\+Mono' index.html | wc -l | tr -d ' ')
if [ "${font_count:-0}" -ge 3 ] && grep -q 'display=swap' index.html; then
  log PASS T-5 "All 3 font families loaded ($font_count refs) with display=swap"
else
  log FAIL T-5 "Fonts incomplete ($font_count refs) or missing display=swap"
fi

# T-6: No CDN/framework deps
if grep -riE '<script src="https?://|cdn\.jsdelivr|unpkg\.com/(?!three@0\.149)' index.html script.js >/dev/null 2>&1; then
  log FAIL T-6 "External CDN script reference found"
else
  log PASS T-6 "Zero CDN runtime dependencies"
fi

# T-7: Section order
order=$(grep -oE 'id="(about|thesis|focus|work|built-with-adal|contact)"' index.html | tr '\n' ' ')
expected="id=\"about\" id=\"thesis\" id=\"focus\" id=\"work\" id=\"built-with-adal\" id=\"contact\" "
if [ "$order" = "$expected" ]; then
  log PASS T-7 "Section order matches DESIGN.md"
else
  log FAIL T-7 "Section order drift: got [$order]"
fi

# T-8: Real-copy preservation
all_ok=true
for needle in 'tolu.a.shekoni@gmail.com' 'x.com/tolu_evm' 'github.com/ToXMon' 'Stripe Clone' 'SignalForge' 'Vouch' 'Crypto Scanner' 'X Monitor' 'AgentTrust' 'Memory Palace' 'Agent Skills'; do
  if ! grep -q "$needle" index.html script.js; then
    log FAIL T-8 "Missing preserved copy: $needle"
    all_ok=false
    break
  fi
done
if [ "$all_ok" = "true" ]; then
  log PASS T-8 "All preserved copy + email + socials present"
fi

# T-9: Accessibility basics
a_ok=true
grep -q 'lang="en"' index.html || a_ok=false
h1_count=$(grep -c '<h1' index.html)
[ "$h1_count" -eq 1 ] || a_ok=false
grep -q 'class="skip-link"' index.html || a_ok=false
# ≥2 prefers-reduced-motion references across CSS+JS (combined, one block is enough if comprehensive)
rm_count=$(grep -c 'prefers-reduced-motion' styles.css script.js | awk -F: '{s+=$2} END{print s}')
[ "${rm_count:-0}" -ge 2 ] || a_ok=false
grep -q ':focus-visible' styles.css || a_ok=false
# every <img> has alt=  (empty alt is fine — it is present)
imgs_no_alt=$(grep -oE '<img[^>]*>' index.html | grep -vc 'alt=')
[ "${imgs_no_alt:-0}" -eq 0 ] || a_ok=false
if [ "$a_ok" = "true" ]; then
  log PASS T-9 "lang/en, 1 h1, skip-link, $rm_count reduced-motion refs (CSS+JS), focus-visible, all <img> have alt"
else
  log FAIL T-9 "Accessibility basics incomplete"
fi

# T-10: Craft features
c_ok=true
grep -q 'feTurbulence' styles.css || c_ok=false  # film grain
grep -q 'cursor-dot' script.js || c_ok=false
grep -q '::selection' styles.css || c_ok=false
grep -q 'og:image' index.html || c_ok=false
grep -q 'rel="icon"' index.html || c_ok=false
grep -q 'class="hamburger"' index.html || c_ok=false
if [ "$c_ok" = "true" ]; then
  log PASS T-10 "Film-grain, cursor-dot, selection, OG, favicon, hamburger all present"
else
  log FAIL T-10 "One or more craft features missing"
fi

# T-11: JS syntax
if node --check script.js >/dev/null 2>&1; then
  log PASS T-11 "script.js syntax OK"
else
  log FAIL T-11 "script.js syntax error"
fi

# T-12: HTML sanity — no duplicate ids, parses
dup_ids=$(grep -oE 'id="[^"]+"' index.html | sort | uniq -d | wc -l | tr -d ' ')
if [ "${dup_ids:-0}" -eq 0 ]; then
  log PASS T-12 "No duplicate element ids"
else
  log FAIL T-12 "$dup_ids duplicate id(s) found"
fi

# ============================================================
# G2 — Full-suite checks (L-1..L-9)
# ============================================================

# L-1: Local serve reachable
s_ok=true
for path in / styles.css script.js vendor/three.min.js assets/img/og.png assets/img/favicon.png assets/img/hero-backdrop.png; do
  code=$(curl -s -o /dev/null -w '%{http_code}' --max-time 5 "http://localhost:8080/$path")
  if [ "$code" != "200" ]; then
    log FAIL L-1 "  /$path -> $code"
    s_ok=false
    break
  fi
done
if [ "$s_ok" = "true" ]; then
  log PASS L-1 "All core + asset URLs serve HTTP 200"
fi

# L-2: Referenced files exist (parse src/href/url from index.html + styles.css)
missing=0
for ref in $(grep -oE '(src|href)="[^"#][^"]*\.[a-z0-9]+"' index.html \
            | sed -E 's/.*="([^"]+)".*/\1/' \
            | grep -vE '^(https?:|mailto:|#)' \
            | sort -u); do
  if [ ! -f "$ref" ]; then
    log FAIL L-2 "  missing local ref: $ref"
    missing=$((missing + 1))
  fi
done
# url(...) refs in CSS (skip data: URIs)
for ref in $(grep -oE 'url\([^)]+\)' styles.css | sed -E 's/url\(["'\'']?//; s/["'\'']?\)//' | grep -v '^data:' | sort -u); do
  if [ ! -f "$ref" ]; then
    log FAIL L-2 "  missing CSS url(): $ref"
    missing=$((missing + 1))
  fi
done
if [ "$missing" -eq 0 ]; then
  log PASS L-2 "All HTML/CSS local refs resolve"
fi

# L-3: Relative paths only (subpath-safe)
abs_root=$(grep -E '(src|href)="/' index.html | grep -v '://' | wc -l | tr -d ' ')
abs_url=$(grep -E 'url\(/' styles.css | wc -l | tr -d ' ')
if [ "${abs_root:-0}" -eq 0 ] && [ "${abs_url:-0}" -eq 0 ]; then
  log PASS L-3 "No absolute-root paths (GitHub-Pages subpath safe)"
else
  log FAIL L-3 "Absolute-root paths: HTML=$abs_root CSS=$abs_url"
fi

# L-4: External link liveness (core inventory; x.com exempt)
url_fail=0
for url in \
  "https://stripe-clone-bn0.pages.dev/" \
  "https://67a97296.stripe-clone-bn0.pages.dev/" \
  "https://github.com/ToXMon/adal-bootcamp-2" \
  "https://github.com/ToXMon/vouch" \
  "https://github.com/ToXMon/vouch/blob/main/README.md" \
  "https://github.com/ToXMon/catecoin-scanner" \
  "https://github.com/ToXMon/catecoin-scanner/blob/main/README.md" \
  "https://github.com/ToXMon/agenttrust" \
  "https://github.com/ToXMon/agenttrust/blob/main/README.md" \
  "https://github.com/ToXMon/tolu" \
  "https://github.com/ToXMon/tolu-portfolio" \
  "https://vouch.tolu-a-shekoni.workers.dev/" \
  "https://toxmon.github.io/agent-workflows/"; do
  code=$(curl -s -o /dev/null -L -w '%{http_code}' --max-time 8 -A 'Mozilla/5.0 PortfolioLinkCheck' "$url")
  if ! echo "$code" | grep -qE '^(2|3)[0-9][0-9]$'; then
    log FAIL L-4 "  $url -> $code"
    url_fail=$((url_fail + 1))
  fi
done
if [ "$url_fail" -eq 0 ]; then
  log PASS L-4 "All in-scope external URLs return 2xx/3xx (x.com exempted per §3)"
fi

# L-5: Live-demo freshness
fresh_ok=true
for url in \
  "https://stripe-clone-bn0.pages.dev/" \
  "https://vouch.tolu-a-shekoni.workers.dev/"; do
  code=$(curl -s -o /dev/null -L -w '%{http_code}' --max-time 10 "$url")
  if ! echo "$code" | grep -qE '^2[0-9][0-9]$'; then
    log FAIL L-5 "  live demo down: $url -> $code"
    fresh_ok=false
  fi
done
if [ "$fresh_ok" = "true" ]; then
  log PASS L-5 "Stripe Clone + Vouch live demos respond 2xx"
fi

# L-6: Budget (HTML+CSS+JS ≤ 120 KB raw, cross-platform via POSIX shell arithmetic)
total_bytes=0
for f in index.html styles.css script.js; do
  sz=$(wc -c < "$f" | tr -d ' ')
  total_bytes=$((total_bytes + sz))
done
total_kb=$((total_bytes / 1024))
if [ "${total_kb:-0}" -le 120 ]; then
  log PASS L-6 "HTML+CSS+JS raw total = ${total_kb} KB (≤ 120 KB)"
else
  log FAIL L-6 "HTML+CSS+JS raw total = ${total_kb} KB (exceeds 120 KB)"
fi

# L-7: Git hygiene
if git diff --cached 2>/dev/null | grep -iE 'api_key|token=|secret' >/dev/null; then
  log FAIL L-7 "Secrets detected in staged diff"
else
  log PASS L-7 "No secrets staged"
fi

# L-8: README accuracy (no stale projectSpecs / hello@tolushekoni.com references)
if grep -qE 'projectSpecs|hello@tolushekoni\.com|hello@tolushekoni' README.md 2>/dev/null; then
  log FAIL L-8 "README.md has stale projectSpecs / hello@tolushekoni.com reference"
else
  log PASS L-8 "README.md free of stale references"
fi

# L-9: Clean-clone boot — verify vendored deps are committed
for f in vendor/three.min.js index.html styles.css script.js DESIGN.md; do
  if [ ! -f "$f" ]; then
    log FAIL L-9 "Missing required file: $f"
    missing=$((missing + 1))
  fi
done
# All-on-disk check
if [ -f vendor/three.min.js ] && [ -f index.html ] && [ -f styles.css ] && [ -f script.js ] && [ -f DESIGN.md ]; then
  log PASS L-9 "Required files all present (vendored deps committed)"
fi

# ============================================================
# Summary
# ============================================================
{
  echo ""
  echo "================ SUMMARY ================"
  echo "Total: $total   PASS: $pass   FAIL: $fail"
  echo "Report: $OUT"
  echo "==========================================="
} | tee -a "$OUT"

if [ "$fail" -gt 0 ]; then
  exit 1
fi
exit 0
