#!/bin/bash

# BACKUP PRODUCTION DATABASE SCRIPT
# Use this to backup database before redeployment

echo "=========================================="
echo "BACKUP PRODUCTION DATABASE"
echo "=========================================="
echo ""

# Configuration
BACKUP_DIR="./backups"
TIMESTAMP=$(date +%Y%m%d_%H%M%S)
BACKUP_FILE="neointegra_backup_${TIMESTAMP}.db"

# Create backup directory
mkdir -p $BACKUP_DIR

echo "1. Finding backend container..."
CONTAINER_ID=$(docker ps | grep neointegra-backend | awk '{print $1}')

if [ -z "$CONTAINER_ID" ]; then
    echo "❌ ERROR: Backend container not found!"
    echo "   Make sure the container is running"
    exit 1
fi

echo "✅ Container found: $CONTAINER_ID"
echo ""

echo "2. Checking database location..."
docker exec $CONTAINER_ID ls -la /app/*.db 2>/dev/null
docker exec $CONTAINER_ID ls -la /app/data/*.db 2>/dev/null
echo ""

echo "3. Creating backup..."

# Try both possible locations
if docker exec $CONTAINER_ID test -f /app/neointegratech.db; then
    echo "   Found database at /app/neointegratech.db"
    docker cp ${CONTAINER_ID}:/app/neointegratech.db ${BACKUP_DIR}/${BACKUP_FILE}
elif docker exec $CONTAINER_ID test -f /app/data/neointegratech.db; then
    echo "   Found database at /app/data/neointegratech.db"
    docker cp ${CONTAINER_ID}:/app/data/neointegratech.db ${BACKUP_DIR}/${BACKUP_FILE}
else
    echo "❌ ERROR: Database file not found in container!"
    exit 1
fi

if [ -f "${BACKUP_DIR}/${BACKUP_FILE}" ]; then
    echo "✅ Backup successful!"
    echo ""
    echo "Backup saved to: ${BACKUP_DIR}/${BACKUP_FILE}"
    echo "Size: $(ls -lh ${BACKUP_DIR}/${BACKUP_FILE} | awk '{print $5}')"
    echo ""
    
    # Show database stats
    echo "4. Database Statistics:"
    sqlite3 ${BACKUP_DIR}/${BACKUP_FILE} "SELECT 'Users: ' || COUNT(*) FROM users;"
    sqlite3 ${BACKUP_DIR}/${BACKUP_FILE} "SELECT 'Orders: ' || COUNT(*) FROM orders;"
    sqlite3 ${BACKUP_DIR}/${BACKUP_FILE} "SELECT 'Payments: ' || COUNT(*) FROM payments;"
    sqlite3 ${BACKUP_DIR}/${BACKUP_FILE} "SELECT 'Services: ' || COUNT(*) FROM services;"
    echo ""
    
    echo "=========================================="
    echo "BACKUP COMPLETED SUCCESSFULLY!"
    echo "=========================================="
else
    echo "❌ ERROR: Backup failed!"
    exit 1
fi
