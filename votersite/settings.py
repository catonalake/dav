"""
Django settings for votersite project.
"""
import os
"""
when getting ready to deploy - review ALLOWED_HOSTS settings:
 - http://stackoverflow.com/questions/19875789/django-gives-bad-request-400-when-debug-false
"""


DEBUG = True
ALLOWED_HOSTS = ['localhost', '127.0.0.1', 'catonalake.pythonanywhere.com']

ADMINS = (
    ('Cathleen Admin PythonAnywhere', 'detectavoter@gmail.com'),
)

MANAGERS = ADMINS

# todo: find out how to point to files outside of the absolute path.. like ?? why isn't base_dir's defined when i makemigrations??
BASE_DIR = os.path.dirname(os.path.abspath(__file__))

if DEBUG:
    DB_HOST = '127.0.0.1'
    DB_USER = 'root'
    DB_NAME = 'newvoterproject'
    DB_PW_FILE = os.path.join(BASE_DIR, "static_in_pro", 'our_static', 'etc', 'mysqlpw.txt')
    with open(DB_PW_FILE) as f:
        DB_PW = f.read().strip()
else:
    DB_HOST = 'mysql.server'
    DB_USER = 'catonalake'
    DB_NAME = 'catonalake$newvoterproject'
    DB_PW_FILE = os.path.join(BASE_DIR, "static_in_pro", 'our_static', 'etc', 'mysqlpw.txt')
    with open(DB_PW_FILE) as f:
        DB_PW = f.read().strip()

DATABASES = {
    'default': {
        'TEST_NAME': 'catonalake$test_newvoterproject', #added for pythonanywhere on apr 2
        'ENGINE': 'django.db.backends.mysql',
        'NAME': DB_NAME,
        'USER': DB_USER,
        'PASSWORD': DB_PW,
        'HOST': DB_HOST,
        'PORT': '3306',
    }
}

# Local time zone for this installation. Choices can be found here:
# http://en.wikipedia.org/wiki/List_of_tz_zones_by_name
# although not all choices may be available on all operating systems.
# On Unix systems, a value of None will cause Django to use the same
# timezone as the operating system.
# If running in a Windows environment this must be set to the same as your
# system time zone.

TIME_ZONE = 'America/New_York'
# Language code for this installation. All choices can be found here:
# http://www.i18nguy.com/unicode/language-identifiers.html
LANGUAGE_CODE = 'en-us'

SITE_ID = 1

# If you set this to False, Django will make some optimizations so as not
# to load the internationalization machinery.
USE_I18N = True

# If you set this to False, Django will not format dates, numbers and
# calendars according to the current locale.
USE_L10N = True

# If you set this to False, Django will not use timezone-aware datetimes.
USE_TZ = True


TEMPLATES = [
    {
        'BACKEND': 'django.template.backends.django.DjangoTemplates',
        'DIRS': [os.path.join(BASE_DIR, "templates")
            # insert your TEMPLATE_DIRS here
        ],
        'APP_DIRS': True,
        'OPTIONS': {
            'debug': DEBUG,
            'context_processors': [
                # Insert your TEMPLATE_CONTEXT_PROCESSORS here or use this
                # list if you haven't customized them:
                'django.contrib.auth.context_processors.auth', # i think this determines if you are authenticated?
                'django.template.context_processors.debug',
                'django.template.context_processors.i18n',  # this isn't in the list below ;)
                'django.template.context_processors.media',
                'django.template.context_processors.static',
                'django.template.context_processors.tz',
                'django.contrib.messages.context_processors.messages',
                'django.template.context_processors.request', # added cag20160117

            ],
        },
    },
] # end TEMPLATES


# django registration redux settings
ACCOUNT_ACTIVATION_DAYS = 7 # One-week activation window; you may, of course, use a different value.
REGISTRATION_AUTO_LOGIN = True # Automatically log the user in.
LOGIN_REDIRECT_URL = '/elections/home/'
REGISTRATION_DEFAULT_FROM_EMAIL = 'detectavoter@gmail.com'

# django email settings
EMAIL_PW_FILE = os.path.join(BASE_DIR, "static_in_pro", 'our_static', 'etc', 'emailpw.txt')
with open(DB_PW_FILE) as f:
    SECRET_EMAIL_PWD = f.read().strip()

EMAIL_HOST = 'smtp.gmail.com'
EMAIL_HOST_USER = 'detectavoter@gmail.com'
EMAIL_HOST_PASSWORD = SECRET_EMAIL_PWD
EMAIL_PORT = 587
EMAIL_USE_TLS = True

#crispy form tag settings
CRISPY_TEMPLATE_PACK = 'bootstrap'

# Absolute filesystem path to the directory that will hold user-uploaded files.
# Example: "/home/media/media.lawrence.com/media/"
MEDIA_ROOT = os.path.join(BASE_DIR, "static_in_pro", 'media_root')

# URL that handles the media served from MEDIA_ROOT. Make sure to use a
# trailing slash.
# Examples: "http://media.lawrence.com/media/", "http://example.com/media/"
MEDIA_URL = '/media/'

# Absolute path to the directory static files should be collected to.
# Don't put anything in this directory yourself; store your static files
# in apps' "static/" subdirectories and in STATICFILES_DIRS.
# Example: "/home/media/media.lawrence.com/static/"
# STATIC_ROOT = ''
# added following cag20160112
STATIC_ROOT = os.path.join(BASE_DIR, "static_in_pro", 'static_root')

# URL prefix for static files.
# Example: "http://media.lawrence.com/static/"
STATIC_URL = '/static/'

# Additional locations of static files
'''
STATICFILES_DIRS = (
    # Put strings here, like "/home/html/static" or "C:/www/django/static".
    # Always use forward slashes, even on Windows.
    # Don't forget to use absolute paths, not relative paths.
)
'''



STATICFILES_DIRS = [
    os.path.join(BASE_DIR, "static_in_pro", 'our_static'),
    # os.path.join(BASE_DIR, "static_in_env"),
    #'/var/www/static/',
]



# List of finder classes that know how to find static files in
# various locations.
STATICFILES_FINDERS = (
    'django.contrib.staticfiles.finders.FileSystemFinder',
    'django.contrib.staticfiles.finders.AppDirectoriesFinder',
#    'django.contrib.staticfiles.finders.DefaultStorageFinder',
)

# Make this unique, and don't share it with anybody.
SECRET_FILE = os.path.join(BASE_DIR, "static_in_pro", 'our_static', 'etc', 'sk.txt')
with open(SECRET_FILE) as f:
    SECRET_KEY = f.read().strip()


MIDDLEWARE_CLASSES = (
    'django.middleware.common.CommonMiddleware',
    'django.contrib.sessions.middleware.SessionMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    # Uncomment the next line for simple clickjacking protection:
    # 'django.middleware.clickjacking.XFrameOptionsMiddleware',
)

ROOT_URLCONF = 'votersite.urls'

# Python dotted path to the WSGI application used by Django's runserver.
WSGI_APPLICATION = 'votersite.wsgi.application'


INSTALLED_APPS = (
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.sites', #  this one is not on project below - added for redux
    'django.contrib.messages',
    'django.contrib.staticfiles',
    # Uncomment the next line to enable the admin:
    'django.contrib.admin',
    # did a pip install django-crispy-forms on jan 15th and added below on jan 15th
    # recommend keeping this list in alpha order :)
    'crispy_forms',
    'registration',
    'elections', # cag changed 20160402 from elections
    # Uncomment the next line to enable admin documentation:
    # 'django.contrib.admindocs',  # todo: what does this admin documentation do??
)

# A sample logging configuration. The only tangible logging
# performed by this configuration is to send an email to
# the site admins on every HTTP 500 error when DEBUG=False.
# See http://docs.djangoproject.com/en/dev/topics/logging for
# more details on how to customize your logging configuration.
LOGGING = {
    'version': 1,
    'disable_existing_loggers': False,
    'filters': {
        'require_debug_false': {
            '()': 'django.utils.log.RequireDebugFalse'
        }
    },
    'handlers': {
        'mail_admins': {
            'level': 'ERROR',
            'filters': ['require_debug_false'],
            'class': 'django.utils.log.AdminEmailHandler'
        }
    },
    'loggers': {
        'django.request': {
            'handlers': ['mail_admins'],
            'level': 'ERROR',
            'propagate': True,
        },
    }
}

# Specify the default test runner.

TEST_RUNNER = 'django.test.runner.DiscoverRunner'
