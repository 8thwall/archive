#!/bin/bash
set -e
#npm install sequelize sequelize-cli pg
THINGS_TO_PACKAGE=".sequelizerc storage .env.common config/db.js"
OUTPUT_FILE="migrations.tar.gz"
echo "Packaging MIGRATION for console server"

tar czf $OUTPUT_FILE $THINGS_TO_PACKAGE
echo "Packaged to $OUTPUT_FILE"
