from common.models import User
from rest_framework.test import APITestCase
from django.urls import reverse



class CurrentUserAPIFunctionalTestCase(APITestCase):
    """ Functional test suite for the User model RESTful API using the client to include routes and viewsets.
    """

    def setUp(self):
        """ Set the user.
        """

        self.user = User.objects.create(**USER)
        self.client.force_authenticate(user=self.user)


    def tearDown(self):
        """ Clean up.
        """

        pass


    def test_retrieve_current_user(self):
        """ Test current User object retrieval.
        """

        response = self.client.get(reverse('current_user'), format='json')

        self.assertEquals(200, response.status_code)
        self.assertEquals(self.user.username, response.data['username'])



USER = {
    'username':'johncleese',
    'first_name': 'John',
    'last_name': 'Cleese',
    'email':'johncleese@holygrail.com'
}