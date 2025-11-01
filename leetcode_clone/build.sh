#!/usr/bin/env bash
set -o errexit

echo "Installing dependencies..."
pip install -r requirements.txt

echo "Checking database connection..."
python -c "
import os
import django
from django.core.management import execute_from_command_line

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'leetcode_clone.settings')
django.setup()

from django.db import connection
try:
    with connection.cursor() as cursor:
        cursor.execute('SELECT 1;')
    print('✅ Database connection successful!')
except Exception as e:
    print(f'❌ Database connection failed: {e}')
    exit(1)
"

echo "Running migrations..."
python manage.py migrate

echo "Collecting static files..."
python manage.py collectstatic --noinput

echo "Build completed successfully!"