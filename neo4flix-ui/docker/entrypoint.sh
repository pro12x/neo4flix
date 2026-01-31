#!/bin/sh
set -e

# Default API base URL (empty -> use root path, nginx will proxy /api to backend)
API_BASE_URL="${API_BASE_URL:-}"

echo "🚀 Generating runtime environment config..."
echo "   API_BASE_URL=${API_BASE_URL}"

# Create assets directory if it doesn't exist
mkdir -p /usr/share/nginx/html/assets

# Generate env.js
cat > /usr/share/nginx/html/assets/env.js <<EOF
// Runtime configuration generated at container startup
(function(window) {
  window.__env = window.__env || {};
  window.__env.apiBaseUrl = '${API_BASE_URL}';
})(this);
EOF

echo "✅ Runtime config generated successfully"
echo "🌐 Starting Nginx..."

# Start nginx in foreground
exec nginx -g 'daemon off;'
