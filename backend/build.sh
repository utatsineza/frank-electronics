#!/usr/bin/env bash
set -o errexit
pip install -r requirements.txt
python manage.py collectstatic --no-input
python manage.py migrate
python manage.py shell -c "
from users.models import User
# Delete the wrong email if it exists
User.objects.filter(email='ntwarifranklin66@gamil.com').delete()
# Create correct superuser if not exists
if not User.objects.filter(email='ntwarifranklin66@gmail.com').exists():
    User.objects.create_superuser(email='ntwarifranklin66@gmail.com', name='Admin', password='admin2026')
    print('Superuser created')
else:
    print('Superuser already exists')
"