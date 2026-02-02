#!/bin/bash

# RESTORE PRODUCTION DATABASE SCRIPT
# Use this to restore database after redeployment

echo "=========================================="
echo "RESTORE PRODUCTION DATABASE"
echo "=========================================="
echo ""

if [ -z "$1" ]; then
    echo "❌ ERROR: Backup file not specified!"
    echo ""
    echo "Usage: $0 <backup_file>"
    echo "Example: $0 ./backups/neointegra_backup_20240202_123456.db"
    echo ""
    echo "Available backups:"
    ls -lh ./backups/*.db 2>/dev/null || echo "  No backups found"
    exit 1
fi

BACKUP_FILE=$1

if [ ! -f "$BACKUP_FILE" ]; then
    echo "❌ ERROR: Backup file not found: $BACKUP_FILE"
    exit 1
fi

echo "Backup file: $BACKUP_FILE"
echo "Size: $(ls -lh $BACKUP_FILE | awk '{print $5}')"
echo ""

echo "1. Finding backend container..."
CONTAINER_ID=$(docker ps | grep neointegra-backend | awk '{print $1}')

if [ -z "$CONTAINER_ID" ]; then
    echo "❌ ERROR: Backend container not found!"
    echo "   Make sure the container is running"
    exit 1
fi

echo "✅ Container found: $CONTAINER_ID"
echo ""

echo "2. Checking target location..."
if docker exec $CONTAINER_ID test -d /app/data; then
    TARGET_PATH="/app/data/neointegratech.db"
    echo "   Using persistent volume path: $TARGET_PATH"
else
    TARGET_PATH="/app/neointegratech.db"
    echo "   Using app directory: $TARGET_PATH"
fi
echo ""

echo "3. Backing up current database (if exists)..."
docker exec $CONTAINER_ID test -f $TARGET_PATH && \
    docker cp ${CONTAINER_ID}:${TARGET_PATH} ./backups/pre_restore_backup_$(date +%Y%m%d_%H%M%S).db
echo ""

echo "4. Restoring database..."
docker cp $BACKUP_FILE ${CONTAINER_ID}:${TARGET_PATH}

if [ $? -eq 0 ]; then
    echo "✅ Database restored successfully!"
    echo ""
    
    echo "5. Verifying restore..."
    docker exec $CONTAINER_ID ls -lh $TARGET_PATH
    echo ""
    
    echo "6. Restarting backend..."
    docker restart $CONTAINER_ID
    echo ""
    
    echo "=========================================="
    echo "RESTORE COMPLETED SUCCESSFULLY!"
    echo "=========================================="
    echo ""
    echo "Please verify:"
    echo "  1. Check https://api.neointegratech.com/health"
    echo "  2. Login to dashboard and verify data"
    echo "  3. Check your orders are restored"
else
    echo "❌ ERROR: Restore failed!"
    exit 1
fi
