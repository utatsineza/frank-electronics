#!/usr/bin/env bash
set -o errexit
pip install -r requirements.txt
python manage.py collectstatic --no-input
python manage.py migrate
python manage.py shell -c "
from users.models import User
if not User.objects.filter(email='ntwarifranklin66@gmail.com').exists():
    User.objects.create_superuser(email='ntwarifranklin66@gmil.com', name='Admin', password='admin123')
    print('Superuser created')
else:
    print('Superuser already exists')
"