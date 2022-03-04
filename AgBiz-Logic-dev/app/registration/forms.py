from django import forms
from django.forms import ModelForm,TextInput
from django.contrib.auth.models import User
from registration.models import Business, Access_Code
from django.contrib.auth.forms import UserCreationForm, UserChangeForm
from django.core.exceptions import ValidationError
from django.utils.translation import ugettext_lazy as _
from localflavor.us.us_states import STATE_CHOICES
from localflavor.us.forms import USZipCodeField
from django.forms.widgets import Select
from django.utils.encoding import force_text
from django.utils.html import escape, conditional_escape
from crispy_forms.helper import FormHelper
from crispy_forms.layout import Submit, Layout, Field, ButtonHolder, Button, Fieldset, HTML, Div
from crispy_forms.bootstrap import TabHolder, Tab, PrependedAppendedText, Accordion, AccordionGroup
from django.utils.safestring import mark_safe


INDUSTRY = (
        ('Agriculture', 'Agriculture'),
        ('Non-Agriculture', 'Non-Agriculture'),
)

TYPE = (

    ('Producer', 'Producer'),
    ('Processor', 'Processor'),
    ('Packer', 'Packer'),
    ('Direct sales', 'Direct sales'),
    ('Manufacturer', 'Manufacturer'),
    ('Wholesale', 'Wholesale'),
    ('Retail', 'Retail'),
    ('Consultant', 'Consultant'),
    ('Research/Education/Extension', 'Research/Education/Extension'),
    ('Government agency', 'Government agency'),
    ('Other', 'Other'),
)



class SelectWithDisabled(Select):

    def render_option(self, selected_choices, option_value, option_label):
        option_value = force_text(option_value)
        if (option_value in selected_choices):
            selected_html = u' selected="selected"'
        else:
            selected_html = ''
        disabled_html = ''
        if isinstance(option_label, dict):
            if dict.get(option_label, 'disabled'):
                disabled_html = u' disabled="disabled"'
            option_label = option_label['label']
        return u'<option value="%s"%s%s>%s</option>' % (
            escape(option_value), selected_html, disabled_html,
            conditional_escape(force_text(option_label)))

class ContactUs(forms.Form):
    name = forms.CharField(label="Your Name", required=True)
    email = forms.EmailField(label="Your Email", required=True)
    message = forms.CharField(label="Your Message",widget=forms.Textarea, required=True)

class AccessCode(forms.Form):


    def __init__(self, *args, **kwargs):
        super(AccessCode, self).__init__(*args, **kwargs)
        self.fields['access_code'] = forms.CharField(label="Access Code", max_length=100, required=True, widget=forms.PasswordInput())

        self.helper = FormHelper(self)
        self.helper.form_tag = False


        self.helper.field_class = "col-lg-4"
        self.helper.label_class = "col-lg-4"
        self.helper.layout = Layout(Fieldset(HTML('<br>'),'access_code',HTML('<br> <br>')))



    def clean(self):
        error = {}
        cleaned_data = super(AccessCode, self).clean()
        try:
            access_code = cleaned_data["access_code"]
        except KeyError:
            access_code = ""



        query = Access_Code.objects.filter(reason='QA').values_list('code', flat=True).distinct()[0]

        if access_code and access_code != query:
            error["access_code"] = mark_safe("Sorry, you have entered an invalid access code!")

        if len(error):
            raise forms.ValidationError(error)





class UserCreateForm(UserCreationForm):


    def __init__(self, *args, **kwargs):
        super(UserCreateForm, self).__init__(*args, **kwargs)


        self.fields['username'].help_text = "Username cannot include a space or exceed 30 characters and may include letters, numbers and the following special characters: @.+-_"

        self.fields['password1'].help_text = "Password must be a minimum of eight characters and must include at least one letter and one number or special character."
        self.fields['password2'].help_text = "Enter the same password as above."

        self.fields['first_name'].required = True
        self.fields['last_name'].required = True
        self.fields['email'].required = True
        self.fields['first_name'].label = "First Name"
        self.fields['last_name'].label = "Last Name"
        self.fields['email'].label = "Email Address"
        self.fields['username'].label = "Username"
        self.fields['password1'].label = "Password"
        self.fields['password2'].label = "Password Confirmation"




    class Meta:
        model = User
        fields = ('username','first_name', 'last_name', 'email', 'password1', 'password2')


    def clean_password1(self):
        password = self.cleaned_data.get('password1')
        MIN_LENGTH = 8
        if len(password) < MIN_LENGTH:
            raise forms.ValidationError('Your password must 8 or more characters.')


        first_isalpha = password[0].isalpha()
        if all(c.isalpha() == first_isalpha for c in password):
            raise forms.ValidationError("Password must contain at least one letter and at least one digit or" \
                                        " punctuation character.")
        return password

    def save(self, commit=True):
        user = super(UserCreateForm,self).save(commit=False)
        user.email = self.cleaned_data["email"]


        if commit:
            user.save()

        return user

class BusinessForm(forms.ModelForm):


    name = forms.CharField(label="Business Name",required=True)
    zipcode = USZipCodeField(label="Zip Code", widget=forms.TextInput(attrs={'placeholder': 'Enter a zip code in the format XXXXX or XXXXX-XXXX'}))
    address1 = forms.CharField(label="Address 1",required=True)
    address2 = forms.CharField(label="Address 2",required=False)

    state = forms.ChoiceField(choices=STATE_CHOICES,label="State", widget=SelectWithDisabled,required=True)
    city = forms.CharField(label="City", required=True)

    industry = forms.ChoiceField(choices=INDUSTRY,label="Select the main industry of your business:", widget=SelectWithDisabled,initial='Select an option',required=True)
    primary_business = forms.ChoiceField(choices=TYPE,label="Select your main business type: ", widget=SelectWithDisabled,initial='Select an option', required=True)
    secondary_business = forms.MultipleChoiceField(widget=forms.CheckboxSelectMultiple(),choices=TYPE,label="Please select your secondary business(es):",required=False)



    class Meta:
        model = Business
        exclude = ('user',)



class InfoForm(forms.Form):

    pass


class EditProfileForm(forms.ModelForm):

    def __init__(self, *args, **kwargs):
        super(EditProfileForm, self).__init__(*args, **kwargs)
        self.fields['first_name'].required = True
        self.fields['last_name'].required = True
        self.fields['email'].required = True

    class Meta:
        model = User
        fields=(
                'username',
                'first_name',
                'last_name',
                'email')

        help_texts = {
            'username': "Username cannot include a space or exceed 30 characters and may include letters, numbers and the following special characters: @.+-_"
        }

        error_messages = {
            'username': {
                'required': _("This is a required field"),
            },
            'first_name': {
                'required': _("This is a required field"),
            },
            'last_name': {
                'required': _("This is a required field"),
            },
            'email': {
                'required': _("This is a required field"),
            },
        }
