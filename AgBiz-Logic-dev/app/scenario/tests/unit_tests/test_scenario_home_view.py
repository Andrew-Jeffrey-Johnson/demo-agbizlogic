from scenario.views import ScenarioHomeView
from scenario.models import *
from django.test import TestCase, RequestFactory
from django.contrib.auth.models import User, AnonymousUser
from django.urls import reverse



class ScenarioHomeViewTestCase(TestCase):
    """ Test suite for ClimateHomeView.
    """

    def setUp(self):
        """ Set up request factory and user.
        """

        self.factory = RequestFactory()
        self.view = ScenarioHomeView.as_view()
        self.user = User.objects.create(**USER_OUTLINE)
        self.url = reverse('scenario_home')


    def test_request_denies_anonymous(self):
        """ Test that users who are not logged in are redirected.
        """

        # GET
        request = self.factory.get(self.url)
        request.user = AnonymousUser()
        response = self.view(request)

        self.assertEquals(302, response.status_code)


    def test_request_accepts_user(self):
        """ Test that logged in users are allowed.
        """

        # GET
        request = self.factory.get(reverse('climate_home'))
        request.user = self.user
        response = self.view(request)

        self.assertEquals(200, response.status_code)



# Dictionaries used to create test objects

USER_OUTLINE = {
    'username':'johncleese',
    'first_name': 'John',
    'last_name': 'Cleese',
    'email':'johncleese@holygrail.com'
}
