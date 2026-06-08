#!/usr/bin/env bash
set -o errexit
pip install -r requirements.txt
python manage.py collectstatic --no-input
python manage.py migrate
python manage.py shell -c "
from users.models import User
if not User.objects.filter(email='admin@frankelectronics.rw').exists():
    User.objects.create_superuser(email='admin@frankelectronics.rw', name='Admin', password='admin2026')
    print('Superuser created')
else:
    print('Superuser already exists')
"