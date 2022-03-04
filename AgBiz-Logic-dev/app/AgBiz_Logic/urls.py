from django.urls import include, path, re_path
from django.conf import settings
from django.contrib import admin
from django.contrib.auth import views as auth_views
from django.views.generic import TemplateView
from registration.views import AccountWizard, IndexView, EditProfile, ChangePassword, EditBusinessProfile
from registration.forms import InfoForm, UserCreateForm, BusinessForm, AccessCode
from website import views as website_views
from import_csv import views as import_csv_views
from schedule_f import views as schedule_f_views
from django.conf.urls.static import static
from rest_framework import routers
from django.contrib.auth.decorators import user_passes_test, login_required
from django.contrib.auth.decorators import login_required
import common.urls
import allocate.urls
import registration.urls
import dashboard.urls
import budget.urls
import climate.urls
import scenario.urls
import university_budget.urls
import inventory.urls

ACCOUNT_FORMS = [
        ("step1", UserCreateForm),
        ("step2", BusinessForm),
        ("step3", InfoForm)
]



urlpatterns = [
    path('admin/', admin.site.urls),
    path('', IndexView.as_view()),
    #re_path(r'login/', 'django.contrib.auth.views.login', {'template_name': 'login.html'}, name="login"),
    path('login/', auth_views.LoginView.as_view(template_name='login.html'), name="login"),
    path("logout/", auth_views.LogoutView.as_view(template_name='registration/logged_out.html'), name="logout"),
    #path(r'logout/', 'django.contrib.auth.views.logout', {'next_page': '/index/'}),
    path('index/', IndexView.as_view()),
    path('jobs/', TemplateView.as_view(template_name='jobs.html')),
    path('soon/', TemplateView.as_view(template_name='soon.html')),
    path('about/', TemplateView.as_view(template_name='about.html')),
    path('mayberry/', TemplateView.as_view(template_name='mayberry.html')),
    path('user/', TemplateView.as_view(template_name='user.html')),
    path('account/', AccountWizard.as_view(ACCOUNT_FORMS)),
    #path('draggable/', 'import_csv.views.get_user_draggable'),
    path('income/', website_views.choose_income), #page to select form1040, csv or ABL Library
    path('resources/', TemplateView.as_view(template_name='resources.html')),
    path('upload/',  import_csv_views.wrapped_csv_wizard_view),
    path('form1040/', schedule_f_views.wrapped_tax_wizard_view),
    path('forgot_password/', TemplateView.as_view(template_name='forgot_password.html'), name="password_reset"),
    path('profile_setting/', login_required(EditProfile), name="EditProfile"),
    path('changepassword/', login_required(ChangePassword), name="ChangePassword"),
    path('business_profile/', login_required(EditBusinessProfile), name="EditBusinessProfile"),
    path('thankyou/', TemplateView.as_view(template_name='thankyou.html'), name="thankyou"),


    # Common routes
    path('common/', include(common.urls)),

    # Dashboard routes
    path('dashboard/', include(dashboard.urls)),

    # Registration routes
    path('registration/', include(registration.urls)),

    # Allocate routes
    path('allocate/', include(allocate.urls)),

    # Budget routes
    path('budget/', include(budget.urls)),

    # Inventory routes
    path('inventory/', include(inventory.urls)),

    # UniversityBudget routes
    path('university_budget/', include(university_budget.urls)),

    # Climate routes
    path('climate/', include(climate.urls)),

    # Scenario routes
    path('scenario/', include(scenario.urls)),

    # Django Rest Framework browseable API
    path('api-auth/', include('rest_framework.urls', namespace='rest_framework')),

    ] + static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)
