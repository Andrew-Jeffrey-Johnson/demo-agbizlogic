#!/bin/sh

echo "from django.contrib.auth.models import User; User.objects.create_superuser('admin', '', 'LetsGoBeavs2015')" | python3 manage.py shell
