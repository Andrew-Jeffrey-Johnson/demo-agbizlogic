#!/bin/sh

cd app

# TODO: Check environment variables to determine which secrets to use
cp ../secrets.json AgBiz_Logic/secrets.json

python3 manage.py migrate auth
python3 manage.py makemigrations
python3 manage.py migrate
python3 manage.py makemigrations common
python3 manage.py migrate common
python3 manage.py makemigrations allocate
python3 manage.py migrate allocate
python3 manage.py makemigrations university_budget
python3 manage.py migrate university_budget
python3 manage.py makemigrations budget
python3 manage.py migrate budget
python3 manage.py makemigrations climate
python3 manage.py migrate climate
python3 manage.py makemigrations dashboard
python3 manage.py migrate dashboard
python3 manage.py makemigrations registration
python3 manage.py migrate registration
python3 manage.py makemigrations scenario
python3 manage.py migrate scenario

# TODO: Run this command when serving static files using Nginx
# python3 manage.py collectstatic --noinput

# Initialize database
../create-superuser.sh
../getShortTermData.sh
python3 manage.py loaddata university_budget/budget_script/University_budget_for_Crops.json
python3 manage.py loaddata university_budget/budget_script/University_budget_for_Livestock.json
python3 manage.py loaddata allocate/fixtures/schedule_f.json climate/fixtures/full_scenario.json
python3 manage.py loaddata university_budget/ers_script/FIPS-codes.json

# Sometimes this budget is put into the budget_script folder
python3 manage.py loaddata university_budget/ers_script/ERS_Budgets.json
# TODO: Use Gunicorn to serve Django application, Nginx within container to proxy and serve static files
# gunicorn AgBiz-Logic.wsgi:application
python3 manage.py runserver --insecure
