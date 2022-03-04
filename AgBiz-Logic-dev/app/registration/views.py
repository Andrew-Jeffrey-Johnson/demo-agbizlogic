from django.shortcuts import render, render_to_response, HttpResponse, HttpResponseRedirect, redirect
from django.contrib.auth import authenticate, login, logout
from django.template import RequestContext
from formtools.wizard.views import SessionWizardView, NamedUrlSessionWizardView
from localflavor.us.us_states import STATE_CHOICES
from registration.models import Business, Access_Code
import json as simplejson
from django.contrib.auth.models import User
from django.contrib.auth.forms import UserChangeForm, PasswordChangeForm
from rest_framework.decorators import api_view
from rest_framework.response import Response
from django.core.mail import send_mail
from django.core.mail import EmailMultiAlternatives

from django.contrib.auth.decorators import login_required
from django.template.context import RequestContext
from django.template.loader import render_to_string
from django.template.loader import get_template
from django.utils.html import strip_tags
from django.contrib.auth import logout, update_session_auth_hash
from django.views.generic import TemplateView
from registration.forms import ContactUs
from django.core.mail import send_mail, BadHeaderError
from django.conf import settings
from registration.serializers import *
from rest_framework.viewsets import ModelViewSet

from registration.forms import EditProfileForm
from registration.models import Business

from django.contrib.staticfiles.templatetags.staticfiles import static

# Create your views here.

ACCOUNT_TEMPLATES = {"step1": "account/step2.html",
             "step2": "account/step3.html",
             "step3": "account/step4.html"}


class IndexView(TemplateView):
    template_name = "index.html"

    def post(self, request, *args, **kwargs):
        context = self.get_context_data()
        if context["form"].is_valid():
            name = context["form"].cleaned_data['name']
            from_email = context["form"].cleaned_data['email']
            message = context["form"].cleaned_data['message']
            subject = "Contact Us message from %s from %s"%(name, from_email)

            try:
                send_mail(subject, message, from_email, ['clark.seavert@oregonstate.edu'])

            except BadHeaderError:
                return HttpResponse('Invalid header found.')



            form = ContactUs()
            context["form"] = form
            context["success"] = True
            return render_to_response('index.html', context,RequestContext(request))


        return super(TemplateView, self).render_to_response(context)

    def get_context_data(self, **kwargs):
        context = super(IndexView, self).get_context_data(**kwargs)

        form = ContactUs(self.request.POST or None)  # instance= None

        context["form"] = form



        return context

def csrf403(request, reason):
        return render(request, '403csrf.html', {'reason': reason})

def page_not_found(request):
        return render(request, '404.html')

def error(request):
        return render(request, '500.html')


class AccountWizard(SessionWizardView):


    def get_context_data(self, form, **kwargs):
        context = super(AccountWizard, self).get_context_data(form=form, **kwargs)

        if self.steps.current == "step3":

            username = self.get_cleaned_data_for_step("step1")['username']
            first_name = self.get_cleaned_data_for_step("step1")['first_name']
            last_name =  self.get_cleaned_data_for_step("step1")['last_name']
            email = self.get_cleaned_data_for_step("step1")['email']
            business_name = self.get_cleaned_data_for_step("step2")['name']
            address1 = self.get_cleaned_data_for_step("step2")['address1']
            address2 = self.get_cleaned_data_for_step("step2")['address2']
            city = self.get_cleaned_data_for_step("step2")['city']
            state = self.get_cleaned_data_for_step("step2")['state']
            zipcode = self.get_cleaned_data_for_step("step2")['zipcode']
            industry = self.get_cleaned_data_for_step("step2")['industry']
            primary_business = self.get_cleaned_data_for_step("step2")['primary_business']
            secondary_business = self.get_cleaned_data_for_step("step2")['secondary_business']
            secondary_business = ", ".join([str(item) for item in secondary_business])

            context.update({'username': username, 'first_name': first_name, 'last_name': last_name, 'email': email, 'business_name': business_name, 'address1': address1, 'address2': address2, 'city': city, 'state': state, 'zipcode': zipcode,
                'industry': industry, 'primary_business': primary_business, 'secondary_business': secondary_business, 'STATE_CHOICES': STATE_CHOICES})

        return context


    def get_template_names(self):
        return [ACCOUNT_TEMPLATES[self.steps.current]]

    def done(self, form_list, **kargs):


        data = {}

        for form in form_list:

            data.update(form.cleaned_data)



        user = User(

            username = data['username'],
            first_name = data['first_name'],
            last_name=data['last_name'],
            email=data['email']

        )
        subject="Registration confirmation"
        from_email=settings.EMAIL_HOST_USER
        to_email=data['email']

        send_mail(
            subject,
            render_to_string('sign_up_email.html'),
            from_email,
            [to_email],
            fail_silently=False,
            html_message=render_to_string('sign_up_email.html'),
        )


        user.set_password(data['password1'])
        user.save()

        business = Business.objects.create(

            user= user,
            name= data['name'],
            address1 = data['address1'],
            address2 = data['address2'],
            city = data['city'],
            state = data['state'],
            zipcode = data['zipcode'],
            industry = data['industry'],
            primary_business = data['primary_business'],
            secondary_business = data['secondary_business'],

        )

        business.save()
        auth = authenticate(username=data['username'], password=data['password1'])
        login(self.request,auth)
        return HttpResponseRedirect('/dashboard/')


class ScheduleFViewSet(ModelViewSet):
    """ API endpoint for ScheduleF model.
    """

    queryset = ScheduleF.objects.filter()
    serializer_class = ScheduleFSerializer


    def get_queryset(self):
        """ Override this method to filter queryset based on URL parameters.

            Default queryset is all ScheduleF objects. Invalid arguments return empty queryset.
        """

        queryset = ScheduleF.objects.all()

        query_params = self.request.query_params

        # Filter by username
        if "username" in query_params:
            user_query = User.objects.filter(username=query_params["username"])

            if user_query:
                queryset = ScheduleF.objects.filter(user=user_query[0])
            else:
                queryset = None


        # If there are query parameters that aren't supported, return empty array
        elif query_params:
            queryset = None

        return queryset

class UserBusinessDataView(ModelViewSet):

    queryset = Business.objects.all()
    serializer_class = UserBusinessSerializer
    lookup_field = 'user'

    def get_queryset(self):
        userdata = self.request.user.id

        return Business.objects.filter(user=userdata)


def EditProfile(request):

    if request.method == "POST":
        form = EditProfileForm(request.POST,instance=request.user)
        if form.is_valid():
            form.save()

            return redirect('/thankyou/')
    else:
        form = EditProfileForm(instance=request.user)

    data={'form':form}

    return render(request,'user.html',data)


def ChangePassword(request):

    if request.method == "POST":
        form = PasswordChangeForm(data=request.POST,user=request.user)
        if form.is_valid():
            form.save()
            update_session_auth_hash(request,form.user)

            return redirect('/thankyou/')

    else:
        form = PasswordChangeForm(user=request.user)
    data={'form':form}

    return render(request,'changepassword.html',data)


def EditBusinessProfile(request):

    return render(request,'businessprofile.html')
