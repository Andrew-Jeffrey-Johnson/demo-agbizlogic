from rest_framework.test import APIRequestFactory, APITestCase, force_authenticate
from common.views import ContactUsView
from django.contrib.auth.models import User
import mock



class ContactUsViewTestCase(APITestCase):
    """ Test suite for ContactUsView.
    """

    def setUp(self):
        """ Set the request factory, user, and view.
        """

        self.factory = APIRequestFactory()
        self.user = User.objects.create(**USER)
        self.view = ContactUsView.as_view()


    @mock.patch("common.views.contact_us_view.send_mail")
    def test_post_valid(self, mock_send_mail):
        """ Test endpoint accepts valid POST requests and sends email.
        """

        message = {
            "subject": "My Support Request",
            "message": "I really don't like the product",
        }

        request = self.factory.post('', message, format="json")
        force_authenticate(request, user=self.user)
        request.user = self.user
        response = self.view(request)

        self.assertEqual(200, response.status_code)
        self.assertEqual(message["subject"], response.data["subject"])
        self.assertTrue(mock_send_mail.called, "Failed to send email")


    def test_post_invalid(self):
        """ Test responds with HTTP 400 when given an invalid request body.
        """

        request = self.factory.post('', {}, format="json")
        force_authenticate(request, user=self.user)
        request.user = self.user
        response = self.view(request)

        self.assertEqual(400, response.status_code)


    def test_post_requires_authentication(self):
        """ Test this endpoint rejects an anonymous user.
        """

        message = {
            "subject": "My Support Request",
            "message": "I really don't like the product",
        }

        request = self.factory.post('', message, format="json")
        response = self.view(request)

        self.assertEqual(403, response.status_code)



# Dictionaries used to create test objects

USER = {
    'username':'johncleese',
    'first_name': 'John',
    'last_name': 'Cleese',
    'email':'johncleese@holygrail.com'
}
