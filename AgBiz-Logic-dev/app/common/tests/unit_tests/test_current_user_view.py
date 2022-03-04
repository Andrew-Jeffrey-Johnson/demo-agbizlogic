from rest_framework.test import APIRequestFactory, APITestCase, force_authenticate
from common.views import CurrentUserView
from django.contrib.auth.models import User



class CurrentUserAPITestCase(APITestCase):
    """ Test suite for CurrentUserView.
    """

    def setUp(self):
        """ Set the request factory, user, and view.
        """

        self.factory = APIRequestFactory()
        self.current_user_view = CurrentUserView.as_view()
        self.user = User.objects.create(**USER)


    def test_retrieve(self):
        """ Test retrieve action.
        """

        request = self.factory.get('')
        force_authenticate(request, user=self.user)
        request.user = self.user
        response = self.current_user_view(request)

        self.assertEquals(USER["username"], response.data["username"])



# Dictionaries used to create test objects

USER = {
    'username':'johncleese',
    'first_name': 'John',
    'last_name': 'Cleese',
    'email':'johncleese@holygrail.com'
}
