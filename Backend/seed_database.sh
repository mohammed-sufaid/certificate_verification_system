#!/bin/bash
echo "Waiting for SQL Server to be ready..."
sleep 15

echo "Running schema creation script via standalone Microsoft Tools container..."

# We map your Database folder into the container and execute it directly against the 'db' service
docker run --rm --network="backend_default" -v "$(cd "$(dirname "$0")/../Database" && pwd):/scripts" mcr.microsoft.com/mssql-tools /opt/mssql-tools/bin/sqlcmd \
  -S db -U sa -P 'VeryStrong!Password123' -i /scripts/database_schema.sql

echo "Database seeded successfully!"
