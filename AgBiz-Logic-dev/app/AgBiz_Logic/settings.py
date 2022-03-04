import json
import os


def get_environment():
    """ Determines the environment that the application is running in. Able to be imported and used by other modules.
    """

    try:
        env = os.environ["AGBIZ_ENV"]
    except IOError:
        env = 'local',
    except KeyError:
        env = 'local'

    return env


# Build paths inside the project like this: os.path.join(BASE_DIR, ...)
BASE_DIR = os.path.dirname(os.path.dirname(__file__))
ENV = get_environment()

if ENV != "local":
    secrets = json.load(open(BASE_DIR + "/AgBiz_Logic/secrets.json"))

    SECRET_KEY = secrets['SECRET_KEY']
    DB_NAME = secrets['DB_NAME']
    DB_USER = secrets['DB_USER']
    DB_PASSWORD = secrets['DB_PASSWORD']
    DB_HOST = secrets['DB_HOST']
    DB_PORT = secrets['DB_PORT']
    DEBUG = False
    TEMPLATE_DEBUG = False
    HOSTNAME = secrets['HOSTNAME']

if ENV == 'prod':
    EMAIL_USER = secrets['EMAIL_USER']
    EMAIL_PASSWORD = secrets['EMAIL_PASSWORD']
    EMAIL_PORT = secrets['EMAIL_PORT']
    GOOGLE_RECAPTCHA_SECRET_KEY = '6LesDJEUAAAAAMBsPFSx8hmwWlHlS6BYujO91zeS'

if ENV == 'local':
    DEBUG = True
    TEMPLATE_DEBUG = True
    SECRET_KEY = 'on*978ry9^f8)4$rt2p5vr*js)3@85m=at#9gr4)#l_#d(o%bx'
    HOSTNAME = "127.0.0.1:8000"

#if ENV == 'dev':
#    DEBUG = True
#    TEMPLATE_DEBUG = True

print ("env = " + ENV)

ALLOWED_HOSTS = ['*']

ADMINS = (
    ('Sean Hammond', 'hammonse@onid.oregonstate.edu'),
)



INSTALLED_APPS = (
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',
    'formtools',
    'django.contrib.humanize',
    'registration',
    'localflavor',
    'bootstrapform',
    'allocate',
    'schedule_f',
    'budget',
    'widget_tweaks',
    'crispy_forms',
    'university_budget',
    'website',
    'climate',
    'common',
    'dashboard',
    'scenario',
    'django_nose',
    'rest_framework',
    'inventory',
)
CRISPY_TEMPLATE_PACK = 'bootstrap3'

REST_FRAMEWORK = {
    'DEFAULT_PERMISSION_CLASSES': [
        'rest_framework.permissions.IsAuthenticated',
    ]
}

# Special test runner
TEST_RUNNER = 'django_nose.NoseTestSuiteRunner'

# django-nose settings
NOSE_ARGS = [
    '--with-coverage',
    '--cover-package=allocate,budget,climate,scenario,common,university_budget',
    '--nologcapture',
    '--verbosity=1',
    '--cover-erase',
]

MIDDLEWARE_CLASSES = (
    'django.contrib.sessions.middleware.SessionMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.auth.middleware.SessionAuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
)

STATICFILES_FINDERS = (
    'django.contrib.staticfiles.finders.FileSystemFinder',
    'django.contrib.staticfiles.finders.AppDirectoriesFinder',
)

TEMPLATE_CONTEXT_PROCESSORS = (
    'django.contrib.auth.context_processors.auth',
    'django.core.context_processors.debug',
    'django.core.context_processors.i18n',
    'django.core.context_processors.media',
    'django.core.context_processors.static',
    'django.core.context_processors.request',
    'django.contrib.messages.context_processors.messages',
)

ROOT_URLCONF = 'AgBiz_Logic.urls'

if "prod" in ENV:
    EMAIL_BACKEND = 'django.core.mail.backends.smtp.EmailBackend'
    EMAIL_USE_TLS = True
    EMAIL_HOST = 'smtp.gmail.com'
    EMAIL_HOST_USER = EMAIL_USER
    DEFAULT_FROM_EMAIL = EMAIL_HOST_USER
    SERVER_EMAIL = EMAIL_USER
    EMAIL_HOST_PASSWORD = EMAIL_PASSWORD
else:
    EMAIL_BACKEND = 'django.core.mail.backends.console.EmailBackend'

WSGI_APPLICATION = 'AgBiz_Logic.wsgi.application'

if "local" in ENV:
    DATABASES = {
        'default': {
            'ENGINE': 'django.db.backends.sqlite3',
            'NAME': os.path.join(BASE_DIR, 'db.sqlite3'),
        }
    }
else:
    DATABASES = {
        'default': {
            'ENGINE': 'django.db.backends.postgresql_psycopg2',
            'NAME': DB_NAME,
            'USER': DB_USER,
            'PASSWORD': DB_PASSWORD,
            'HOST': DB_HOST,
            'PORT': DB_PORT,
        }
    }

LANGUAGE_CODE = 'en-us'
TIME_ZONE = 'UTC'

USE_I18N = True

USE_L10N = True

USE_TZ = True

USE_THOUSAND_SEPARATOR = True

LOGIN_REDIRECT_URL='/dashboard/'

CSRF_FAILURE_VIEW = 'registration.views.csrf403'

handler404 = 'registration.views.page_not_found'

handler500 = 'registration.views.page_not_found'

STATIC_URL = '/static/'

STATIC_ROOT = 'staticfiles/'

STATICFILES_DIRS = [os.path.join(BASE_DIR, 'static'), '/var/www/static/', '../node_modules/']

print (STATICFILES_DIRS)

MIDDLEWARE = [
    'django.middleware.security.SecurityMiddleware',
    'django.contrib.sessions.middleware.SessionMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
]

TEMPLATES = [
    {
        'BACKEND': 'django.template.backends.django.DjangoTemplates',
        'DIRS': [os.path.join(BASE_DIR, 'templates')],
        'APP_DIRS': True,
        'OPTIONS': {
            'context_processors': [
                'django.template.context_processors.debug',
                'django.template.context_processors.request',
                'django.contrib.auth.context_processors.auth',
                'django.contrib.messages.context_processors.messages',
            ],
        },
    },
]

MEDIA_ROOT = os.path.join(BASE_DIR, 'media')
MEDIA_URL = '/media/'

SESSION_EXPIRE_AT_BROWSER_CLOSE = True

SESSION_COOKIE_AGE = 21600

SESSION_SAVE_EVERY_REQUEST = True

DATA_PATH = os.path.join(BASE_DIR, "shortTermData/shortTermData.nc")
