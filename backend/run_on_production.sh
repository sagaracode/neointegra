#!/bin/bash
# Upload dan jalankan script di production server via SSH
# Ganti dengan kredensial server Coolify Anda

echo "=================================="
echo "UPLOAD & RUN DATABASE UPDATE"
echo "=================================="

# Configuration
SERVER_USER="your_user"
SERVER_HOST="your_server_ip"
SERVER_PATH="/path/to/backend"
SCRIPT_NAME="direct_update_payment.py"

echo ""
echo "📤 Uploading script to production server..."
scp "$SCRIPT_NAME" "${SERVER_USER}@${SERVER_HOST}:${SERVER_PATH}/"

echo ""
echo "🚀 Running script on production server..."
ssh "${SERVER_USER}@${SERVER_HOST}" << 'EOF'
cd /path/to/backend
source venv/bin/activate  # or your venv path
python direct_update_payment.py
EOF

echo ""
echo "✅ Done! Check output above."
